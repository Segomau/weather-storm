from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import json, glob, os
from datetime import datetime

router = APIRouter()
DATA_DIR = Path(
    r"C:\Users\lmdg3\OneDrive\Documents\LUIS\COSAS DE LA UNI\MARINA\weather-prediction-app\Data\Data"
)


def parse_dirname_timestamp(dir_path):
    """Extrae timestamp del nombre: 20251103_114143 -> 20251103114143"""
    try:
        name = dir_path.name
        if "_" not in name or len(name) < 15:
            return 0
        timestamp_str = name.replace("_", "")
        return int(timestamp_str)
    except:
        return 0


# Al iniciar, mostrar info
@router.on_event("startup")
async def startup_event():
    print("=" * 60)
    print(f"DATA_DIR: {DATA_DIR.absolute()}")
    print(f"DATA_DIR existe: {DATA_DIR.exists()}")

    if DATA_DIR.exists():
        dirs = [d for d in DATA_DIR.glob("*") if d.is_dir()]
        print(f"\nDirectorios encontrados ({len(dirs)}):")

        # Mostrar solo los últimos 10
        for d in sorted(dirs)[-10:]:
            mtime = datetime.fromtimestamp(os.path.getmtime(d))
            print(f" {d.name} - modificado: {mtime}")

        if dirs:
            # USAR LA MISMA LÓGICA QUE get_latest_directory()
            latest = max(dirs, key=parse_dirname_timestamp)
            print(f"\n Directorio elegido como más reciente: {latest.name}")
            print(f"   Timestamp parseado: {parse_dirname_timestamp(latest)}")
    print("=" * 60)


def get_latest_directory():
    """Devuelve el directorio más reciente parseando el timestamp del nombre"""
    if not DATA_DIR.exists():
        return None

    dirs = [d for d in DATA_DIR.glob("*") if d.is_dir()]
    if not dirs:
        return None

    return max(dirs, key=parse_dirname_timestamp)


def get_directory_by_date(target_date: str):
    """Encuentra el directorio más reciente que contenga la fecha especificada"""
    if not DATA_DIR.exists():
        return None

    matching_dirs = []
    for dir_path in DATA_DIR.glob("*"):
        if dir_path.is_dir() and target_date in dir_path.name:
            matching_dirs.append(dir_path)

    if not matching_dirs:
        return None

    # Usar la misma lógica de timestamp para elegir el más reciente
    return max(matching_dirs, key=parse_dirname_timestamp)


@router.get("/")
def root():
    return {"message": "API del Sistema de Monitoreo de Tormentas Tropicales"}


# RUTAS JSON =========================


@router.get("/storms")
def get_all_storms():
    """Devuelve el JSON general más reciente (todas las tormentas)."""
    latest_dir = get_latest_directory()
    if not latest_dir:
        raise HTTPException(status_code=404, detail="No hay datos generados aún.")

    json_dir = latest_dir / "JSON"
    json_files = sorted(json_dir.glob("tormentas*.json"))
    if not json_files:
        raise HTTPException(status_code=404, detail="No se encontró el JSON general.")

    latest_json = json_files[-1]
    with open(latest_json, "r", encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(content=data)


@router.get("/storms/{storm_id}")
def get_single_storm(storm_id: str):
    """Devuelve el JSON individual de una tormenta específica."""
    latest_dir = get_latest_directory()
    if not latest_dir:
        raise HTTPException(status_code=404, detail="No hay datos generados aún.")

    json_path = latest_dir / "JSON" / f"tormenta_{storm_id}.json"
    if not json_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"No se encontró el archivo JSON de la tormenta {storm_id}.",
        )

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(content=data)


@router.get("/date/{date}/storms")
def get_storms_by_date(date: str):
    """Devuelve todos los JSON de una fecha específica."""
    target_dir = get_directory_by_date(date)
    if not target_dir:
        raise HTTPException(
            status_code=404, detail=f"No se encontraron datos para la fecha: {date}"
        )

    json_dir = target_dir / "JSON"
    if not json_dir.exists():
        raise HTTPException(
            status_code=404, detail="No se encontró la carpeta JSON para esta fecha."
        )

    json_files = list(json_dir.glob("*.json"))
    if not json_files:
        raise HTTPException(
            status_code=404, detail="No se encontraron archivos JSON para esta fecha."
        )

    all_data = {}
    for json_file in json_files:
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                all_data[json_file.stem] = json.load(f)
        except Exception as e:
            all_data[json_file.stem] = {
                "error": f"No se pudo cargar el archivo: {str(e)}"
            }

    return JSONResponse(
        content={
            "date": date,
            "directory": target_dir.name,
            "total_files": len(json_files),
            "data": all_data,
        }
    )


@router.get("/date/{date}/storms/{storm_id}")
def get_storm_by_date_and_id(date: str, storm_id: str):
    """Devuelve el archivo JSON de una tormenta específica en una fecha específica."""
    target_dir = get_directory_by_date(date)
    if not target_dir:
        raise HTTPException(
            status_code=404, detail=f"No se encontraron datos para la fecha: {date}"
        )

    json_dir = target_dir / "JSON"
    if not json_dir.exists():
        raise HTTPException(
            status_code=404, detail="No se encontró la carpeta JSON para esta fecha."
        )

    json_path = json_dir / f"tormenta_{storm_id}.json"
    if not json_path.exists():
        json_files = list(json_dir.glob(f"*{storm_id}*.json"))
        if not json_files:
            raise HTTPException(
                status_code=404,
                detail=f"No se encontró el archivo JSON de la tormenta {storm_id} para la fecha {date}.",
            )
        json_path = json_files[0]

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return JSONResponse(
        content={
            "date": date,
            "storm_id": storm_id,
            "file": json_path.name,
            "data": data,
        }
    )


# RUTAS MAPAS =========================


@router.get("/maps")
def get_general_map():
    """Devuelve el mapa general más reciente con todas las tormentas."""
    latest_dir = get_latest_directory()
    if not latest_dir:
        raise HTTPException(status_code=404, detail="No hay mapas generados aún.")

    map_dir = latest_dir / "Mapas"
    map_files = sorted(map_dir.glob("mapa_*.png"))
    if not map_files:
        raise HTTPException(status_code=404, detail="No se encontró el mapa general.")

    latest_map = map_files[-1]
    return FileResponse(latest_map, media_type="image/png")


@router.get("/maps/{storm_id}")
def get_storm_map(storm_id: str):
    """Devuelve el mapa individual de una tormenta específica mas reciente."""
    latest_dir = get_latest_directory()
    if not latest_dir:
        raise HTTPException(status_code=404, detail="No hay mapas generados aún.")

    map_path = latest_dir / "Mapas" / f"{storm_id}.png"
    if not map_path.exists():
        raise HTTPException(
            status_code=404, detail=f"No se encontró el mapa de la tormenta {storm_id}."
        )

    return FileResponse(map_path, media_type="image/png")


# NUEVAS RUTAS PARA OBTENER METADATA DE IMÁGENES
@router.get("/date/{date}/maps/general/list")
def get_all_general_maps_metadata_by_date(date: str):
    """
    Devuelve una lista con índices de todas las imágenes PNG (mapa_*.png)
    para poder accederlas individualmente.
    """
    base_path = str(DATA_DIR.resolve())
    search_pattern = os.path.join(base_path, f"**/*{date}*/Mapas/mapa_*.png")
    image_paths = glob.glob(search_pattern, recursive=True)

    if not image_paths:
        raise HTTPException(
            status_code=404, detail=f"No se encontraron mapas para la fecha {date}."
        )

    image_paths = sorted([os.path.normpath(path) for path in image_paths])

    return {
        "date": date,
        "total_images": len(image_paths),
        "images": [
            {"index": i, "filename": os.path.basename(path)}
            for i, path in enumerate(image_paths)
        ],
    }


@router.get("/date/{date}/maps/general/{index}")
def get_general_map_by_date_and_index(date: str, index: int):
    """
    Devuelve la imagen PNG del mapa general en la posición 'index' para la fecha dada.
    """
    base_path = str(DATA_DIR.resolve())
    search_pattern = os.path.join(base_path, f"**/*{date}*/Mapas/mapa_*.png")
    image_paths = sorted(glob.glob(search_pattern, recursive=True))

    if not image_paths:
        raise HTTPException(
            status_code=404, detail=f"No se encontraron mapas para la fecha {date}."
        )

    if index < 0 or index >= len(image_paths):
        raise HTTPException(
            status_code=404,
            detail=f"Índice {index} fuera de rango. Total de imágenes: {len(image_paths)}",
        )

    return FileResponse(image_paths[index], media_type="image/png")


@router.get("/date/{date}/maps/{storm_id}/list")
def get_storm_maps_metadata_by_date(date: str, storm_id: str):
    """
    Devuelve una lista con índices de todas las imágenes PNG del storm_id
    para poder accederlas individualmente.
    """
    base_path = str(DATA_DIR.resolve())
    search_pattern = os.path.join(base_path, f"**/*{date}*/Mapas/*{storm_id}*.png")
    map_files = glob.glob(search_pattern, recursive=True)

    if not map_files:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontraron mapas del storm_id '{storm_id}' para la fecha {date}.",
        )

    map_files = sorted([os.path.normpath(path) for path in map_files])

    return {
        "date": date,
        "storm_id": storm_id,
        "total_images": len(map_files),
        "images": [
            {"index": i, "filename": os.path.basename(path)}
            for i, path in enumerate(map_files)
        ],
    }


@router.get("/date/{date}/maps/{storm_id}/{index}")
def get_storm_map_by_date_and_index(date: str, storm_id: str, index: int):
    """
    Devuelve la imagen PNG del storm_id en la posición 'index' para la fecha dada.
    """
    base_path = str(DATA_DIR.resolve())
    search_pattern = os.path.join(base_path, f"**/*{date}*/Mapas/*{storm_id}*.png")
    map_files = sorted(glob.glob(search_pattern, recursive=True))

    if not map_files:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontraron mapas del storm_id '{storm_id}' para la fecha {date}.",
        )

    if index < 0 or index >= len(map_files):
        raise HTTPException(
            status_code=404,
            detail=f"Índice {index} fuera de rango. Total de imágenes: {len(map_files)}",
        )

    return FileResponse(map_files[index], media_type="image/png")
