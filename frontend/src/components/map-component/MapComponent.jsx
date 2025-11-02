import React from "react"

export default function MapComponent({ selectedCity }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#012f3a] text-[#B2D8D8]">
      {selectedCity ? (
        <p>Showing map for: {selectedCity.name}</p>
      ) : (
        <p>Select a city to view its rain data ☔</p>
      )}
    </div>
  )
}
