import React from "react"
import { Wind, Map as MapIcon, AlertTriangle } from "lucide-react"

/**
 * DashboardContent
 * Props:
 * - mainStormView, setMainStormView
 *
 * Aquí incluimos los datos de ejemplo (ACTIVE_STORMS) que tenías.
 */
export const ACTIVE_STORMS = [
  {
    id: "1",
    name: "Hurricane Patricia",
    category: 4,
    windSpeed: 215,
    pressure: 932,
    location: "Pacific Coast",
    lat: 19.5,
    lng: -105.2,
    direction: "NNW",
    movementSpeed: 18,
    affectedAreas: ["Jalisco", "Colima", "Nayarit"],
    status: "active",
  },
  {
    id: "2",
    name: "Hurricane Otis",
    category: 5,
    windSpeed: 270,
    pressure: 923,
    location: "Guerrero Coast",
    lat: 16.8,
    lng: -99.9,
    direction: "N",
    movementSpeed: 12,
    affectedAreas: ["Guerrero", "Oaxaca"],
    status: "warning",
  },
  {
    id: "3",
    name: "Tropical Storm Lidia",
    category: 1,
    windSpeed: 120,
    pressure: 985,
    location: "Baja California Sur",
    lat: 24.1,
    lng: -110.3,
    direction: "NE",
    movementSpeed: 22,
    affectedAreas: ["Baja California Sur", "Sinaloa"],
    status: "watch",
  },
  {
    id: "4",
    name: "Hurricane Norma",
    category: 3,
    windSpeed: 185,
    pressure: 955,
    location: "Gulf of Mexico",
    lat: 21.5,
    lng: -97.4,
    direction: "W",
    movementSpeed: 15,
    affectedAreas: ["Veracruz", "Tamaulipas"],
    status: "active",
  },
]

export default function DashboardContent({ mainStormView, setMainStormView }) {
  const getDangerLevelColor = (category) => {
    if (category >= 4) return "bg-red-500"
    if (category >= 2) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <section className="flex-1 overflow-y-auto hide-scrollbar p-6 md:p-8 bg-[#013f4e]">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#EAF6F6] mb-2 drop-shadow-lg">
          {mainStormView ? mainStormView.name : "Global Storm Overview"}
        </h1>
        <p className="text-[#B2D8D8] text-sm">
          {mainStormView ? mainStormView.location : "Real-time monitoring of tropical storms worldwide"}
        </p>
      </div>

      {/* Storm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setMainStormView(null)}
          className={`bg-[#024b58]/80 backdrop-blur-xl rounded-[14px] border transition-all duration-300 overflow-hidden text-left group hover:scale-[1.02] ${
            !mainStormView
              ? "border-cyan-400/40 shadow-lg shadow-cyan-400/25"
              : "border-white/10 hover:border-cyan-400/30 shadow-lg hover:shadow-cyan-400/15"
          }`}
        >
          <div className="h-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50" />
          <div className="relative aspect-[4/3] flex items-center justify-center">
            <MapIcon className="w-12 h-12 text-cyan-400 opacity-50" />
          </div>
          <div className="p-3">
            <h3 className="text-sm font-bold text-[#EAF6F6] group-hover:text-cyan-300 transition-colors">
              Global Overview
            </h3>
          </div>
        </button>

        {ACTIVE_STORMS.map((storm) => {
          const isSelected = mainStormView?.id === storm.id
          const dangerColor = getDangerLevelColor(storm.category)

          return (
            <button
              key={storm.id}
              onClick={() => setMainStormView(storm)}
              className={`bg-[#024b58]/80 rounded-[14px] border transition-all duration-300 overflow-hidden text-left group hover:scale-[1.02] ${
                isSelected
                  ? "border-cyan-400/40 shadow-lg shadow-cyan-400/25"
                  : "border-white/10 hover:border-cyan-400/30 shadow-lg hover:shadow-cyan-400/15"
              }`}
            >
              <div className={`h-1 ${dangerColor}`} />
              <div className="relative aspect-[4/3] flex items-center justify-center">
                <Wind className="w-12 h-12 text-cyan-400 opacity-40" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-[#EAF6F6] group-hover:text-cyan-300 transition-colors">
                  {storm.name}
                </h3>
              </div>
            </button>
          )
        })}
      </div>

      {ACTIVE_STORMS.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-[#B2D8D8]">No storms found.</p>
        </div>
      )}
    </section>
  )
}
