import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// http://localhost:8000/rainmap/realtime?grid_size=25&density=1000
const API_BASE_URL = "http://localhost:8000";

export default function MapComponent() {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true); // 👈 estado para mostrar mensaje de carga
  const [rainData, setRainData] = useState(null);

  // 1️⃣ Fetch data del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🌧️ Cargando datos del mapa de lluvia...");
        const res = await fetch(`${API_BASE_URL}/rainmap/realtime?grid_size=15&density=50`);
        if (!res.ok) throw new Error("Error al obtener datos del servidor");
        const data = await res.json();
        console.log("✅ Datos recibidos:", data);
        setRainData(data);
      } catch (err) {
        console.error("❌ Error cargando datos:", err);
      } finally {
        setLoading(false); // 👈 indicamos que ya terminó el fetch
      }
    };
    fetchData();
  }, []);

  // 2️⃣ Inicializar mapa solo una vez
  useEffect(() => {
    if (mapRef.current) return; // evita reinicializar

    const map = new maplibregl.Map({
      container: "mexico-map",
      style: "https://api.maptiler.com/maps/01993703-c461-7fcb-9563-ed497090c6bc/style.json?key=mUwxoW7vdNmBrfqeJhw1",
      center: [-102.5528, 24.0],
      zoom: 4.5,
    });

    const mexicoBounds = [
      [-118, 14.5],
      [-86.5, 32.75],
    ];
    map.setMaxBounds(mexicoBounds);
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current = map;
  }, []);

  // 3️⃣ Una vez cargado el mapa + datos → agregar capas
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !rainData) return; // espera a ambos

    const handleLoad = () => {
      console.log("🗺️ Mapa cargado. Agregando puntos de lluvia...");

      const geoJsonData = {
        type: "FeatureCollection",
        features: rainData.data.map((p, i) => ({
          type: "Feature",
          properties: {
            intensity: calculateIntensity(p.rain),
            rain: p.rain,
            id: i,
          },
          geometry: { type: "Point", coordinates: [p.lon, p.lat] },
        })),
      };

      if (!map.getSource("intensity-data")) {
        map.addSource("intensity-data", { type: "geojson", data: geoJsonData });

        map.addLayer({
          id: "intensity-blur",
          type: "circle",
          source: "intensity-data",
          paint: {
            // 🔵 Tamaño de los puntos: escala ajustada 0–2
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "intensity"],
              0, 5,   // Tamaño mínimo (sin lluvia)
              1, 10,   // Tamaño medio
              2, 15    // Tamaño máximo (lluvia extrema)
            ],

            // 🌈 Escala de color: 0 (verde) → 2 (rojo)
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "intensity"],
              0, "rgba(0, 200, 0, 0.8)",   // Verde: sin lluvia
              1, "rgba(255, 255, 0, 0.9)", // Amarillo: lluvia moderada
              2, "rgba(200, 0, 0, 0.9)"    // Rojo: lluvia intensa
            ],

            // 🔘 Opacidad y difuminado
            "circle-opacity": 0.3,
            "circle-blur": 0.2,
          },
        });
      } else {
        map.getSource("intensity-data").setData(geoJsonData);
      }

    };

    if (map.loaded()) handleLoad();
    else map.on("load", handleLoad);
  }, [rainData]);

  // 4️⃣ Helper para convertir intensidad
  const calculateIntensity = (rain) => {
    if (rain === 0) return 0;
    if (rain <= 1) return 0.5;
    if (rain <= 2) return 1;
  };

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#013f4e] text-white z-10">
          <div className="animate-pulse">🌧️ Cargando mapa de lluvia...</div>
        </div>
      )}
      <div id="mexico-map" className="w-full h-full" />
    </div>
  );
}
