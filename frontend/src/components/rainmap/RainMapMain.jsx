import RainmapSidebar from "./RainMapSideBar.jsx"
import RainmapContent from "./RainMapContent.jsx"

export default function Rainmap({
    view,
    setView,
    selectedCity,
    setSelectedCity,
    weatherData,
    setWeatherData,
    onNavigateHome
}) {
    return (
        <div className="flex min-h-screen bg-rainmap-bg text-rainmap-contrast overflow-hidden">
            <div className="w-80 border-r border-rainmap-glass-border/30">
                <RainmapSidebar
                    view={view}
                    setView={setView}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    weatherData={weatherData}
                    setWeatherData={setWeatherData}
                    onNavigateHome={onNavigateHome}
                />
            </div>

            <div className="flex-1">
                <RainmapContent selectedCity={selectedCity} />
            </div>
        </div>
    )
}