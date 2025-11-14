import MapComponent from "../map-component/MapComponent";

export default function RainmapContent({ selectedCity }) {
  return (
    <main
      className="
        flex-1 w-full h-screen 
        bg-rainmap.bg 
        overflow-hidden 
        text-rainmap.contrast
      "
      aria-label="Mapa de precipitación"
    >
      <div className="h-full p-4 md:p-6">
        <div
          className="
            h-full w-full
            bg-rainmap.surface
            backdrop-blur-[16px]
            border border-rainmap['glass-border']
            rounded-2xl
            shadow-[0_8px_30px_rgba(0,0,0,0.35)]
            relative
            overflow-hidden
            transition
            duration-300
          "
        >
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
