import React,{ useState, useEffect } from "react"
import ToolsPanel from "./tools-panel"
import CanvasArea from "./canvas-area"
import PagesPanel from "./pages-panel"
import Header from "./header"

const App= ()=> {
  const [values, setValues] = useState({
    brush: 5,
    color: "#4F46E5",
    tool: "pencil",
    opacity: 100,
  })
  const [showPicker, setShowPicker] = useState(false)
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(-1)
  const [history, setHistory] = useState([])

  // Initialize first page
  useEffect(() => {
    if (pages.length === 0) {
      handleAddNewPage()
    }
  }, [])

  const handleAddNewPage = () => {
    setPages((prev) => {
      const updated = [...prev]
      if (currentPage >= 0) {
        updated[currentPage] = document.getElementById("drawing-canvas")?.toDataURL() || ""
      }
      updated.push("")
      return updated
    })

    setCurrentPage(pages.length)
    setHistory([])
  }

  const handlePageChosen = (index) => {
    setPages((prev) => {
      const updated = [...prev]
      if (currentPage >= 0) {
        updated[currentPage] = document.getElementById("drawing-canvas")?.toDataURL() || ""
      }
      return updated
    })

    setCurrentPage(index)
    setHistory([])
  }

  const handleSaveDrawing = () => {
    const canvas = document.getElementById("drawing-canvas")
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `drawing-${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleUndo = () => {
    const newHistory = [...history]
    newHistory.pop()
    setHistory(newHistory)
  }

  const handleClear = () => {
    setHistory([])
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 flex justify-center items-center p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl p-3 sm:p-4 md:p-6 flex flex-col items-center gap-3 sm:gap-4">
        <Header handleSaveDrawing={handleSaveDrawing} handleUndo={handleUndo} handleClear={handleClear} />

        <div className="w-full flex flex-col lg:flex-row gap-3 sm:gap-4">
          <ToolsPanel values={values} setValues={setValues} showPicker={showPicker} setShowPicker={setShowPicker} />

          <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <CanvasArea
              values={values}
              currentPage={currentPage}
              pages={pages}
              history={history}
              setHistory={setHistory}
            />

            <PagesPanel
              pages={pages}
              currentPage={currentPage}
              handleAddNewPage={handleAddNewPage}
              handlePageChosen={handlePageChosen}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;