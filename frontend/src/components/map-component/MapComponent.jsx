import React from "react"

export default function MapComponent({ selectedCity }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#012f3a] text-[#B2D8D8]">
      {selectedCity ? (
        <p>Mostrando clima de: {selectedCity.name}</p>
      ) : (
        <p>Selecciona una ciudad para ver el clima ☔</p>
      )}
    </div>
  )
}
