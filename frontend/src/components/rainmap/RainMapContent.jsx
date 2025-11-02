import React from "react"
import MapComponent from "../map-component/MapComponent"

/**
 * RainmapContent
 * recibe: selectedCity
 */
export default function RainmapContent({ selectedCity }) {
  return (
    <main className="flex-1 w-full h-full bg-[#013f4e]">
      <div className="h-full p-4">
        <div className="h-full rounded-lg overflow-hidden border border-white/10">
          <MapComponent selectedCity={selectedCity} />
        </div>
      </div>
    </main>
  )
}
