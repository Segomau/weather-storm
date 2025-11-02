import React, { useState } from "react"
import RainmapSidebar from "./components/rainmap/RainMapSideBar"
import RainmapContent from "./components/rainmap/RainMapContent"
import DashboardSidebar from "./components/dashboard/DashboardSidebar"
import DashboardContent from "./components/dashboard/DashboardContent"


function App() {
  // 'map' (rainmap) o 'dashboard' (storms)
  const [view, setView] = useState("map")

  // Rainmap states
  const [selectedCity, setSelectedCity] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  // Dashboard states
  const [mainStormView, setMainStormView] = useState(null)

  return (
    <div className="flex h-screen bg-[#013f4e] text-white">
      {/* Sidebar */}
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
          <DashboardSidebar view={view} setView={setView} mainStormView={mainStormView} />
        )}
      </div>

      {/* Main content */}
      <div className="flex-1">
        {view === "map" ? (
          <RainmapContent selectedCity={selectedCity} />
        ) : (
          <DashboardContent mainStormView={mainStormView} setMainStormView={setMainStormView} />
        )}
      </div>
    </div>
  )
}

export default App
