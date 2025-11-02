import React, { useState } from "react"
import { Map as MapIcon, Wind, ChevronLeft, ChevronRight } from "lucide-react"
import { ACTIVE_STORMS } from "./DashboardContent"

/**
 * DashboardSidebar
 * Props:
 * - view, setView
 * - mainStormView
 */
export default function DashboardSidebar({ view, setView, mainStormView }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const severeStorms = ACTIVE_STORMS.filter((s) => s.category >= 3).length
  const warningStorms = ACTIVE_STORMS.filter((s) => s.status === "warning").length

  return (
    <aside className="h-full bg-gradient-to-b from-[#024b58] via-[#013f4e] to-[#002b36] flex flex-col border-l border-white/10 p-4">
      {/* Header */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("map")}
          className={`flex-1 p-2 rounded-xl border ${
            view === "map"
              ? "bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-cyan-300"
              : "bg-[#024b58] text-slate-200 border-white/10"
          }`}
        >
          <MapIcon className="w-4 h-4 inline mr-1" /> Map
        </button>
        <button
          onClick={() => setView("dashboard")}
          className={`flex-1 p-2 rounded-xl border ${
            view === "dashboard"
              ? "bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-cyan-300"
              : "bg-[#024b58] text-slate-200 border-white/10"
          }`}
        >
          <Wind className="w-4 h-4 inline mr-1" /> Storms
        </button>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <Stat label="Active Storms" value={ACTIVE_STORMS.length} />
        <Stat label="Severe Storms (Cat 3+)" value={severeStorms} />
        <Stat label="Warnings" value={warningStorms} />
      </div>

      {/* Storm Details */}
      {mainStormView && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#EAF6F6] mb-3">Selected Storm Details</h3>
          <div className="space-y-2 text-[#EAF6F6] text-xs">
            <p>Category {mainStormView.category}</p>
            <p>Wind Speed: {mainStormView.windSpeed} km/h</p>
            <p>Pressure: {mainStormView.pressure} mb</p>
            <p>
              Movement: {mainStormView.direction} {mainStormView.movementSpeed} km/h
            </p>
            <p>Affected: {mainStormView.affectedAreas.join(", ")}</p>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="mt-auto">
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>
    </aside>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-[#024b58]/60 rounded-xl p-3 border border-white/10 text-[#EAF6F6]">
      <div className="text-xs text-[#B2D8D8]">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

function Calendar({ selectedDate, setSelectedDate }) {
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []

  for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} className="aspect-square" />)

  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = day === selectedDate.getDate()
    days.push(
      <button
        key={day}
        onClick={() => setSelectedDate(new Date(year, month, day))}
        className={`aspect-square flex items-center justify-center text-xs rounded-lg ${
          isSelected
            ? "bg-cyan-500 text-white"
            : "text-[#B2D8D8] hover:bg-cyan-500/20 hover:text-white"
        }`}
      >
        {day}
      </button>
    )
  }

  return (
    <div className="bg-[#024b58]/50 rounded-xl p-3 border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setSelectedDate(new Date(year, month - 1, 1))}>
          <ChevronLeft className="w-4 h-4 text-cyan-400" />
        </button>
        <div className="text-sm font-bold text-[#EAF6F6]">
          {selectedDate.toLocaleString("default", { month: "long" })} {year}
        </div>
        <button onClick={() => setSelectedDate(new Date(year, month + 1, 1))}>
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[#B2D8D8] mb-1 text-[10px]">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  )
}
