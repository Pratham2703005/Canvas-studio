import React from "react"
import { Download, Undo, Trash } from "lucide-react"

export default function Header({ handleSaveDrawing, handleUndo, handleClear }) {
  return (
    <div className="w-full flex flex-wrap justify-between items-center gap-2 sm:gap-4 border-b pb-3 sm:pb-4">
      <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
        Canvas Studio
      </h1>

      <div className="flex gap-1 sm:gap-2">
        <button
          onClick={handleSaveDrawing}
          className="bg-indigo-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 text-xs sm:text-sm"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={handleUndo}
          className="bg-slate-200 text-slate-700 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-slate-300 transition flex items-center gap-1 text-xs sm:text-sm"
        >
          <Undo size={16} />
          <span className="hidden sm:inline">Undo</span>
        </button>
        <button
          onClick={handleClear}
          className="bg-red-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-1 text-xs sm:text-sm"
        >
          <Trash size={16} />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </div>
  )
}
