import MapComponent from "../map-component/MapComponent";
import { Menu } from "lucide-react";

export default function RainmapContent({ selectedCity, onToggleSidebar }) {
  return (
    <main
      className="
        flex-1 w-full h-screen 
        bg-rainmap-bg 
        overflow-hidden 
        text-rainmap-contrast
        relative
      "
      aria-label="Mapa de precipitación"
    >
      {/* Botón de hamburguesa (solo móvil) */}
      <button
  onClick={onToggleSidebar}
  className="
    absolute top-4 left-4 z-50 
    p-2 rounded-lg 
    bg-rainmap-bg text-rainmap-contrast
    border border-rainmap-glass-border/30
    shadow-lg 
    hover:bg-rainmap-bg/80 transition
    md:hidden
  "
>

        <Menu size={26} />
      </button>

      <div className="h-full p-4 md:p-6">
        <div
          className="
            h-full w-full
            bg-rainmap-surface
            backdrop-blur-[16px]
            border border-rainmap-glass-border
            rounded-2xl
            shadow-[0_8px_30px_rgba(0,0,0,0.35)]
            relative
            overflow-hidden
            transition
            duration-300
          "
        >
          {/* Glow interno */}
          <div
            className="
              pointer-events-none 
              absolute inset-0 
              rounded-2xl
              shadow-[inset_0_0_25px_rgba(0,255,200,0.15)]
            "
          />

          <MapComponent selectedCity={selectedCity} />
        </div>
      </div>
    </main>
  );
}

