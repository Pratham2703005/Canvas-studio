import React from "react"
import { Paintbrush, Eraser, Square, Circle } from "lucide-react"
import ColorPicker from "./color-picker"


export default function ToolsPanel({ values, setValues, showPicker, setShowPicker }) {
  // Predefined colors palette
  const predefinedColors = [
    "#4F46E5", // indigo
    "#EF4444", // red
    "#10B981", // green
    "#F59E0B", // amber
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#000000", // black
    "#6B7280", // gray
    "#FFFFFF", // white
  ]

  // Brush size presets
  const brushSizes = [2, 5, 10, 15, 25]

  // Set tool and color
  const setTool = (tool) => {
    if (tool === "eraser") {
      setValues((prev) => ({ ...prev, tool, color: "#FFFFFF" }))
    } else {
      setValues((prev) => ({ ...prev, tool }))
    }
  }

  return (
    <div className="lg:w-64 bg-slate-50 rounded-xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
      {/* Brush Tools */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-2">Brush Type</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTool("pencil")}
            className={`p-2 rounded-lg flex items-center justify-center ${
              values.tool === "pencil"
                ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Paintbrush size={18} />
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`p-2 rounded-lg flex items-center justify-center ${
              values.tool === "eraser"
                ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Eraser size={18} />
          </button>
          <button
            onClick={() => setTool("square")}
            className={`p-2 rounded-lg flex items-center justify-center ${
              values.tool === "square"
                ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Square size={18} />
          </button>
          <button
            onClick={() => setTool("circle")}
            className={`p-2 rounded-lg flex items-center justify-center ${
              values.tool === "circle"
                ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Circle size={18} />
          </button>
        </div>
      </div>

      {/* Brush Size */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-2">Brush Size: {values.brush}px</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {brushSizes.map((size) => (
            <button
              key={size}
              onClick={() => setValues((prev) => ({ ...prev, brush: size }))}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                values.brush === size
                  ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                  : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div
                className="rounded-full bg-current"
                style={{
                  width: Math.min(size * 1.3, 22),
                  height: Math.min(size * 1.3, 22),
                }}
              />
            </button>
          ))}
        </div>
        <input
          type="range"
          min={1}
          max={50}
          value={values.brush}
          onChange={(e) => setValues((prev) => ({ ...prev, brush: +e.target.value }))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Opacity */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-2">Opacity: {values.opacity}%</h3>
        <input
          type="range"
          min={1}
          max={100}
          value={values.opacity}
          onChange={(e) => setValues((prev) => ({ ...prev, opacity: +e.target.value }))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Color Palette */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-2">Color Palette</h3>
        <div className="relative mb-3">
          <button
            onClick={() => setShowPicker((prev) => !prev)}
            className="w-full bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: values.color }} />
            {showPicker ? "Hide Color Picker" : "Custom Color"}
          </button>

          {showPicker && (
            <div className="absolute top-12 z-10 left-0 w-full">
              <ColorPicker
                currentColor={values.color}
                onColorChange={(color) => {
                  setValues((prev) => ({
                    ...prev,
                    color,
                    tool: prev.tool === "eraser" ? "pencil" : prev.tool,
                  }))
                  setShowPicker(false)
                }}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-5 gap-2 ">
          {predefinedColors.map((color) => (
            <button
              key={color}
              onClick={() =>
                setValues((prev) => ({ ...prev, color, tool: prev.tool === "eraser" ? "pencil" : prev.tool }))
              }
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${
                values.color === color && values.tool !== "eraser" ? "ring-2 ring-offset-2 ring-indigo-600" : ""
              }`}
              style={{
                backgroundColor: color,
                border: color === "#FFFFFF" ? "1px solid #E5E7EB" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
