export default function HomePage({ onNavigate }) {
    return (
        <div className="min-h-screen bg-rainmap-bg flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Hero Section */}
                <div className="bg-rainmap-glass backdrop-blur-[20px] border border-rainmap-glass-border rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    {/* Logo/Title */}
                    <h1 className="text-4xl md:text-6xl font-bold text-rainmap-contrast mb-4">
                        RainMap
                    </h1>
                    <p className="text-rainmap-muted text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                        Plataforma de monitoreo meteorológico en tiempo real. Seguimiento de precipitaciones y tormentas.
                    </p>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                        <button
                            className="flex-1 p-4 rounded-xl bg-[rgba(0,255,200,0.18)] border border-[rgba(0,255,200,0.35)] text-rainmap-contrast shadow-[0_0_15px_rgba(0,255,200,0.18)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(0,255,200,0.25)] active:translate-y-0 w-full"
                            onClick={() => onNavigate("map")}
                        >
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-3 h-3 rounded-full border border-[rgba(0,255,200,0.35)] bg-[rgba(0,255,200,0.2)]" aria-hidden />
                                <span className="font-semibold">Mapa de Lluvia</span>
                            </div>
                        </button>

                        <button
                            className="flex-1 p-4 rounded-xl bg-[rgba(0,255,120,0.18)] border border-[rgba(0,255,120,0.35)] text-rainmap-contrast shadow-[0_0_15px_rgba(0,255,120,0.18)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_0_20px_rgba(0,255,120,0.25)] active:translate-y-0 w-full"
                            onClick={() => onNavigate("dashboard")}
                        >
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-3 h-3 rounded-full border border-[rgba(0,255,120,0.35)] bg-[rgba(0,255,120,0.2)]" aria-hidden />
                                <span className="font-semibold">Tormentas</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
                    <div className="bg-rainmap-surface backdrop-blur-[14px] border border-rainmap-glass-border rounded-2xl p-4 text-rainmap-contrast">
                        <h3 className="font-semibold text-rainmap-accent mb-2">Tiempo Real</h3>
                        <p className="text-sm text-rainmap-muted">Datos meteorológicos actualizados cada 5 minutos</p>
                    </div>

                    <div className="bg-rainmap-surface backdrop-blur-[14px] border border-rainmap-glass-border rounded-2xl p-4 text-rainmap-contrast">
                        <h3 className="font-semibold text-rainmap-accent2 mb-2">Precisión</h3>
                        <p className="text-sm text-rainmap-muted">Información detallada por ubicación</p>
                    </div>

                    <div className="bg-rainmap-surface backdrop-blur-[14px] border border-rainmap-glass-border rounded-2xl p-4 text-rainmap-contrast">
                        <h3 className="font-semibold text-rainmap-mid mb-2">Alertas</h3>
                        <p className="text-sm text-rainmap-muted">Notificaciones inmediatas de tormentas</p>
                    </div>
                </div>
            </div>
        </div>
    );
}