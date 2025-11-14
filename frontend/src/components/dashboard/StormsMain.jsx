import React, { useState } from "react";
import DashboardSidebar from "./DashboardSidebar.jsx";
import DashboardContent from "./DashboardContent.jsx";

export default function Storms({
    view,
    setView,
    mainStormView,
    setMainStormView,
    activeStorms,
    loading,
    error,
    latestDate,
    onDateChange,
    onNavigateHome
}) {
    //Boton Hambuerguesa//
    const [open, setOpen] = useState(false); 
    return (
        <div className="flex min-h-screen bg-rainmap-bg text-rainmap-contrast overflow-hidden relative">

           
            <button
                onClick={() => setOpen(true)}
                className="absolute top-4 left-4 z-40 p-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg shadow md:hidden"
            >
                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-rainmap-contrast">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            {/* --- SIDEBAR --- */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-80 z-50 transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 md:relative
                    border-r border-rainmap-glass-border/30
                `}
            >
                <DashboardSidebar
                    view={view}
                    setView={setView}
                    mainStormView={mainStormView}
                    activeStorms={activeStorms}
                    activeDate={latestDate}
                    onDateChange={onDateChange}
                    onNavigateHome={onNavigateHome}
                />

                
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 md:hidden p-2 text-white"
                >
                    ✖
                </button>
            </div>

            
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            
            <div className="flex-1 overflow-auto">
                <DashboardContent
                    mainStormView={mainStormView}
                    setMainStormView={setMainStormView}
                    activeStorms={activeStorms}
                    loading={loading}
                    error={error}
                    latestDate={latestDate}
                />
            </div>
        </div>
    );
}
