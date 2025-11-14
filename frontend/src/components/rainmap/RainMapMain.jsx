import { useState } from "react";
import RainmapSidebar from "./RainMapSideBar.jsx";
import RainmapContent from "./RainMapContent.jsx";

export default function Rainmap({
    view,
    setView,
    selectedCity,
    setSelectedCity,
    weatherData,
    setWeatherData,
    onNavigateHome
}) {

    // Estado para abrir/cerrar sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-rainmap-bg text-rainmap-contrast overflow-hidden relative">

            {/* SIDEBAR (CON TRANSICIÓN) */}
            <div
                className={`
                    fixed md:static
                    top-0 left-0 
                    h-full w-72 
                    bg-rainmap-bg z-40
                    border-r border-rainmap-glass-border/30
                    transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <RainmapSidebar
                    view={view}
                    setView={setView}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    weatherData={weatherData}
                    setWeatherData={setWeatherData}
                    onNavigateHome={onNavigateHome}
                        onToggleSidebar={() => setSidebarOpen(false)}
                />
            </div>

            {/* OVERLAY PARA MÓVIL */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                />
            )}

            {/* CONTENIDO */}
            <div className="flex-1">
                <RainmapContent
                    selectedCity={selectedCity}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
            </div>
        </div>
    );
}
