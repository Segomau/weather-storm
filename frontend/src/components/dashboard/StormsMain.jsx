import DashboardSidebar from "./DashboardSidebar.jsx"
import DashboardContent from "./DashboardContent.jsx"

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
    return (
        <div className="flex min-h-screen bg-rainmap-bg text-rainmap-contrast overflow-hidden">
            <div className="w-80 border-r border-rainmap-glass-border/30">
                <DashboardSidebar
                    view={view}
                    setView={setView}
                    mainStormView={mainStormView}
                    activeStorms={activeStorms}
                    activeDate={latestDate}
                    onDateChange={onDateChange}
                    onNavigateHome={onNavigateHome}
                />
            </div>

            <div className="flex-1">
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
    )
}