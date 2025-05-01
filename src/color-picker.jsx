import React,{ useState } from "react"

export default function ColorPicker({ currentColor, onColorChange }) {
  const [customColor, setCustomColor] = useState(currentColor)

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl border border-slate-200">
      <div className="mb-4">
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className="w-full h-12 cursor-pointer"
        />
      </div>
      <button
        onClick={() => onColorChange(customColor)}
        className="w-full bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Apply Color
      </button>
    </div>
  )
}
