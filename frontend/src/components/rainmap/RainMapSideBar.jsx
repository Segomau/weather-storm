import React, { useEffect, useRef, useState } from "react"
import { Search, Map as MapIcon, Wind } from "lucide-react"

/**
 * RainmapSidebar
 * Props:
 * - view, setView (string / fn) => controla vista activa
 * - selectedCity, setSelectedCity
 * - weatherData, setWeatherData
 */
export default function RainmapSidebar({
  view,
  setView,
  selectedCity,
  setSelectedCity,
  weatherData,
  setWeatherData,
}) {
  // 🌎 Lista de ciudades incluida (copiada / adaptada de tu Notion)
  const MEXICAN_CITIES = [
    { name: "Ciudad de Mexico", lat: 19.4326, lng: -99.1332, state: "CDMX" },
    { name: "Guadalajara", lat: 20.6597, lng: -103.3496, state: "Jalisco" },
    { name: "Monterrey", lat: 25.6866, lng: -100.3161, state: "Nuevo León" },
    { name: "Puebla", lat: 19.0414, lng: -98.2063, state: "Puebla" },
    { name: "Tijuana", lat: 32.5149, lng: -117.0382, state: "Baja California" },
    { name: "León", lat: 21.1236, lng: -101.676, state: "Guanajuato" },
    { name: "Juárez", lat: 31.6904, lng: -106.4245, state: "Chihuahua" },
    { name: "Zapopan", lat: 20.7214, lng: -103.3918, state: "Jalisco" },
    { name: "Mérida", lat: 20.9674, lng: -89.5926, state: "Yucatán" },
    { name: "San Luis Potosí", lat: 22.1565, lng: -100.9855, state: "San Luis Potosí" },
    { name: "Aguascalientes", lat: 21.8853, lng: -102.2916, state: "Aguascalientes" },
    { name: "Hermosillo", lat: 29.0729, lat: -110.9559, state: "Sonora" },
    { name: "Saltillo", lat: 25.4232, lng: -100.9737, state: "Coahuila" },
    { name: "Mexicali", lat: 32.6245, lng: -115.4523, state: "Baja California" },
    { name: "Culiacán", lat: 24.8091, lng: -107.394, state: "Sinaloa" },
    { name: "Querétaro", lat: 20.5888, lng: -100.3899, state: "Querétaro" },
    { name: "Chihuahua", lat: 28.6353, lng: -106.0889, state: "Chihuahua" },
    { name: "Morelia", lat: 19.706, lng: -101.1949, state: "Michoacán" },
    { name: "Toluca", lat: 19.2827, lng: -99.6557, state: "Estado de México" },
    { name: "Cancún", lat: 21.1619, lng: -86.8515, state: "Quintana Roo" },
    { name: "Acapulco", lat: 16.8531, lng: -99.8237, state: "Guerrero" },
    { name: "Torreón", lat: 25.5428, lng: -103.4068, state: "Coahuila" },
    { name: "Reynosa", lat: 26.0922, lng: -98.2777, state: "Tamaulipas" },
    { name: "Tuxtla Gutiérrez", lat: 16.7516, lng: -93.1029, state: "Chiapas" },
    { name: "Veracruz", lat: 19.1738, lng: -96.1342, state: "Veracruz" },
    { name: "Mazatlán", lat: 23.2494, lng: -106.4111, state: "Sinaloa" },
    { name: "Durango", lat: 24.0277, lng: -104.6532, state: "Durango" },
    { name: "Oaxaca", lat: 17.0732, lng: -96.7266, state: "Oaxaca" },
    { name: "Tampico", lat: 22.2331, lng: -97.8611, state: "Tamaulipas" },
    { name: "Irapuato", lat: 20.6767, lng: -101.3542, state: "Guanajuato" },
    { name: "Celaya", lat: 20.5289, lng: -100.8157, state: "Guanajuato" },
    { name: "Cuernavaca", lat: 18.9211, lng: -99.2378, state: "Morelos" },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCities, setFilteredCities] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = MEXICAN_CITIES.filter(
        (city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.state?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
      setFilteredCities(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredCities([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setSearchQuery(city.name)
    setShowSuggestions(false)

    // Mock weather data (puedes reemplazar por fetch a tu API)
    const mockWeather = {
      city: city.name,
      state: city.state,
      rainIntensity: Math.random() * 100,
      temperature: 15 + Math.random() * 20,
      condition: ["rain", "cloudy", "sunny"][Math.floor(Math.random() * 3)],
      lastUpdate: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setWeatherData && setWeatherData(mockWeather)
  }

  const getWeatherGlow = (condition) => {
    switch (condition) {
      case "sunny":
        return "border-amber-400/60"
      case "rain":
        return "border-cyan-400/60"
      case "cloudy":
        return "border-slate-400/60"
      default:
        return "border-cyan-400/60"
    }
  }

  const weatherGlow = weatherData ? getWeatherGlow(weatherData.condition) : "border-cyan-400/60"

  return (
    <aside className="h-full bg-gradient-to-b from-[#013f4e] via-[#024b58] to-[#013440] flex flex-col border-l border-white/10">
      {/* Header Switch */}
      <div className="sticky top-0 p-3 border-b border-white/10 flex gap-2 backdrop-blur-xl bg-[#024b58]/70 z-10">
        <button
          onClick={() => setView("map")}
          className={`flex-1 p-2 rounded-xl border ${
            view === "map"
              ? "bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-cyan-300"
              : "bg-[#024b58] text-slate-200 border-white/10"
          }`}
        >
          <MapIcon className="w-4 h-4 inline mr-1" /> Mapa
        </button>
        <button
          onClick={() => setView("storms")}
          className={`flex-1 p-2 rounded-xl border ${
            view === "storms"
              ? "bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-cyan-300"
              : "bg-[#024b58] text-slate-200 border-white/10"
          }`}
        >
          <Wind className="w-4 h-4 inline mr-1" /> Tormentas
        </button>
      </div>

      {/* Weather / Search */}
      <div className="p-5 overflow-y-auto flex-1" ref={searchRef}>
        {weatherData && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#EAF6F6]">{weatherData.city}</h2>
            <p className="text-xs text-[#B2D8D8] mb-3">{weatherData.state}</p>
            <div className={`p-4 rounded-xl border ${weatherGlow} bg-[#024b58]/60`}>
              <div className="text-2xl">
                {weatherData.condition === "rain"
                  ? "🌧️"
                  : weatherData.condition === "cloudy"
                  ? "☁️"
                  : "☀️"}
              </div>
              <p className="text-[#EAF6F6] mt-2 text-lg font-bold">
                {weatherData.temperature.toFixed(1)}°C
              </p>
              <p className="text-sm text-[#B2D8D8] mt-1">
                Rain: {weatherData.rainIntensity.toFixed(0)}%
              </p>
            </div>
          </div>
        )}

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-cyan-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            type="text"
            placeholder="Search cities..."
            className="pl-10 p-2 w-full rounded bg-[#024b58]/90 border-0 text-[#EAF6F6] focus:outline-none"
          />
          {showSuggestions && filteredCities.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-[#024b58]/95 border border-white/10 rounded-md z-50">
              {filteredCities.map((city, i) => (
                <button
                  key={i}
                  onClick={() => handleCitySelect(city)}
                  className="block w-full px-3 py-2 text-left text-[#EAF6F6] hover:bg-cyan-500/20"
                >
                  {city.name} <span className="text-[#B2D8D8] text-xs">({city.state})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick list */}
        <div className="flex flex-col gap-2">
          {MEXICAN_CITIES.slice(0, 8).map((c) => (
            <button
              key={c.name}
              onClick={() => handleCitySelect(c)}
              className="p-2 rounded-xl text-left bg-[#013f4e]/60 hover:bg-[#026877]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-[#EAF6F6]">{c.name}</div>
                  <div className="text-xs text-[#B2D8D8]">{c.state}</div>
                </div>
                <div className="text-xs text-[#B2D8D8]">➡</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}