from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import numpy as np, requests, concurrent.futures, time

router = APIRouter()

# --- CACHE SIMPLE ---
# Guardará el último resultado del mapa de lluvia por 10 minutos (600 segundos)
RAIN_CACHE = {"data": None, "timestamp": 0, "key": ""}
RAIN_CACHE_TTL = 600  # 10 minutos


# --- 1. Generate grid points ---
def generate_grid(grid_size=15):
    min_lon, max_lon, min_lat, max_lat = -118, -86.5, 14.5, 32.75
    lon = np.linspace(min_lon, max_lon, grid_size)
    lat = np.linspace(min_lat, max_lat, grid_size)
    return [{"lat": float(a), "lon": float(b)} for a in lat for b in lon]


# --- 2. Fetch single weather point ---
def fetch_point(p):
    try:
        r = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={"latitude": p["lat"], "longitude": p["lon"], "current": "rain"},
            timeout=15,
        )
        r.raise_for_status()
        d = r.json().get("current", {})
        return {"lat": p["lat"], "lon": p["lon"], "rain": d.get("rain", 0)}
    except Exception:
        time.sleep(1)
        return {"lat": p["lat"], "lon": p["lon"], "rain": 0}


# --- 3. Parallel fetch all data ---
def get_weather(grid_size=15):
    pts = generate_grid(grid_size)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        data = list(ex.map(fetch_point, pts))
    return data


# --- 4. Haversine distance ---
def haversine(lat1, lon1, lats2, lons2):
    lat1, lon1, lats2, lons2 = map(np.radians, [lat1, lon1, lats2, lons2])
    a = (
        np.sin((lats2 - lat1) / 2) ** 2
        + np.cos(lat1) * np.cos(lats2) * np.sin((lons2 - lon1) / 2) ** 2
    )
    return 6371 * 2 * np.arcsin(np.sqrt(a))


# --- 5. IDW interpolation ---
def idw(lat, lon, known_lats, known_lons, known_vals, power=2):
    d = haversine(lat, lon, known_lats, known_lons)
    d[d == 0] = 1e-6
    w = 1 / d**power
    return np.sum(w * known_vals) / np.sum(w)


# --- 6. Interpolate grid ---
def interpolate(data, density=100):
    lats = np.array([p["lat"] for p in data])
    lons = np.array([p["lon"] for p in data])
    vals = np.array([p["rain"] for p in data])
    latg = np.linspace(lats.min(), lats.max(), density)
    long = np.linspace(lons.min(), lons.max(), density)
    lat_grid, lon_grid = np.meshgrid(latg, long)
    interp_vals = np.zeros_like(lat_grid)
    for i in range(lat_grid.shape[0]):
        for j in range(lat_grid.shape[1]):
            interp_vals[i, j] = idw(lat_grid[i, j], lon_grid[i, j], lats, lons, vals)
    return [
        {
            "lat": float(lat_grid[i, j]),
            "lon": float(lon_grid[i, j]),
            "rain": float(interp_vals[i, j]),
        }
        for i in range(lat_grid.shape[0])
        for j in range(lat_grid.shape[1])
    ]


# --- 7. Real-time generator ---
def generate_real_time_json(grid_size=15, density=100):
    data = get_weather(grid_size)
    interp = interpolate(data, density)
    return {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "original_points": len(data),
        "interpolated_points": len(interp),
        "data": interp,
    }


# --- 8. FastAPI route (CON CACHE) ---
@router.get("/realtime")
async def get_real_time_rainmap(grid_size: int = 15, density: int = 50):
    """
    Devuelve datos de lluvia interpolados en tiempo real.
    Ahora usa un cache de 10 minutos para evitar recalcular.
    """
    current_time = time.time()
    cache_key = f"{grid_size}:{density}"

    # 1. Verificar si hay un cache válido
    if (
        RAIN_CACHE["key"] == cache_key
        and (current_time - RAIN_CACHE["timestamp"] < RAIN_CACHE_TTL)
        and RAIN_CACHE["data"]
    ):
        return JSONResponse(content=RAIN_CACHE["data"])

    # 2. Si no hay cache, calcular
    try:
        result = generate_real_time_json(grid_size, density)
        # 3. Guardar en cache
        RAIN_CACHE["data"] = result
        RAIN_CACHE["timestamp"] = current_time
        RAIN_CACHE["key"] = cache_key
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))