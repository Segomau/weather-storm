import MapComponent from "../map-component/MapComponent"

export default function RainmapContent() {
  return (
    <main className="flex-1 w-full h-screen bg-[#013f4e] overflow-hidden">
      <div className="h-full p-4">
        <div className="h-full rounded-lg border border-white/10 overflow-hidden">
          <MapComponent />
        </div>
      </div>
    </main>
  );
}

