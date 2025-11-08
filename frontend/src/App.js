import React, { useState, useEffect } from "react"
import RainmapSidebar from "./components/rainmap/RainMapSideBar"
import RainmapContent from "./components/rainmap/RainMapContent"
import DashboardSidebar from "./components/dashboard/DashboardSidebar"
import DashboardContent from "./components/dashboard/DashboardContent"

const API_BASE_URL = "http://localhost:8000"

// --- Ponemos las funciones helper aquí arriba ---

// Función para procesar los datos de tormentas
const processStormData = (data, imageDate) => {
  let storms = []
  
  Object.keys(data).forEach(key => {
    const storm = data[key];
    if (typeof storm === 'object' && storm.id) {
      
      let categoria = 1
      if (storm.storm_type && Array.isArray(storm.storm_type)) {
        const lastType = storm.storm_type[storm.storm_type.length - 1]
        if (lastType === "HU") categoria = 3
        else if (lastType === "TS") categoria = 2
        else if (lastType === "TD") categoria = 1
      }
      
      storms.push({
        id: storm.id,
        nombre: storm.name,
        name: storm.name,
        categoria: categoria,
        category: categoria,
        velocidad_viento: storm.max_wind || 0,
        windSpeed: storm.max_wind || 0,
        presion: storm.min_pressure || 0,
        pressure: storm.min_pressure || 0,
        ubicacion: storm.basin === "north_atlantic" ? "Atlántico Norte" : 
                   storm.basin === "east_pacific" ? "Pacífico Este" : 
                   storm.basin,
        location: storm.basin === "north_atlantic" ? "North Atlantic" : 
                  storm.basin === "east_pacific" ? "East Pacific" : 
                  storm.basin,
        year: storm.year,
        season: storm.season,
        ace: storm.ace,
        invest: storm.invest, // ¡Importante para tu lógica de "97L"!
        storm_type: storm.storm_type,
        estado: storm.invest ? "watch" : "active",
        status: storm.invest ? "watch" : "active",
        imageUrl: `${API_BASE_URL}/api/maps/${storm.id}?v=${imageDate || Date.now()}`
      })
    }
  })
  
  console.log("Tormentas procesadas:", storms)
  console.log(`Total de tormentas: ${storms.length}`)
  return storms;
}

// --- Componente principal de la App ---

function App() {
  const [view, setView] = useState("map")
  const [selectedCity, setSelectedCity] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [mainStormView, setMainStormView] = useState(null)
  const [activeStorms, setActiveStorms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  
  const [latestDate, setLatestDate] = useState(null)

  // ESTE ES EL *ÚNICO* useEffect QUE CARGA DATOS
  // Solo se dispara si 'latestDate' TIENE un valor.
  useEffect(() => {
    // Si la vista es dashboard Y HAY una fecha seleccionada, busca los datos.
    if (view === "dashboard" && latestDate) {
      fetchStormsByDate(latestDate);
    }
  }, [latestDate, view]) 

  // Esta es la ÚNICA función que busca tormentas
  const fetchStormsByDate = async (dateString) => {
    try {
      setLoading(true)
      setError(null)
      setMainStormView(null) 
      
      const response = await fetch(`${API_BASE_URL}/api/date/${dateString}/storms`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No se encontraron datos de tormentas para la fecha ${dateString}.`);
        }
        throw new Error('Error al conectar con el servidor.')
      }
      
      const data = await response.json()
      console.log(`Datos (${dateString}) recibidos:`, data)

      if (!data.data || Object.keys(data.data).length === 0) {
        setActiveStorms([])
        throw new Error(`No hay tormentas activas registradas para la fecha ${dateString}.`);
      }

      const storms = processStormData(data.data, dateString);
      setActiveStorms(storms)
      
    } catch (err) {
      console.error(`Error fetching storms for date ${dateString}:`, err)
      setError(err.message) 
      setActiveStorms([]) 
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#013f4e] text-white overflow-hidden">
      <div className="w-80 border-r border-white/10">
        {view === "map" ? (
          <RainmapSidebar
            view={view}
            setView={setView}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            weatherData={weatherData}
            setWeatherData={setWeatherData}
          />
        ) : (
          <DashboardSidebar 
            view={view} 
            setView={setView} 
            mainStormView={mainStormView}
            activeStorms={activeStorms}
            // Pasamos la fecha activa (que es null al inicio)
            activeDate={latestDate}
            onDateChange={setLatestDate}
          />
        )}
      </div>

      <div className="flex-1">
        {view === "map" ? (
          <RainmapContent selectedCity={selectedCity} />
        ) : (
          <DashboardContent 
            mainStormView={mainStormView} 
            setMainStormView={setMainStormView}
            activeStorms={activeStorms}
            loading={loading}
            error={error}
            latestDate={latestDate} // Pasa 'null' al inicio , se va a cambiar cuando se implemente lo de ultima carga
          />
        )}
      </div>
    </div>
  )
}

export default App