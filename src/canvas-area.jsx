import React from "react"
import { useRef, useState, useEffect } from "react"

export default function CanvasArea({ values, currentPage, pages, history, setHistory }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState([])

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      // Set up the canvas
      const canvas = canvasRef.current
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      // Listen for window resize
      const handleResize = () => {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          canvas.width = canvas.clientWidth
          canvas.height = canvas.clientHeight
          ctx.putImageData(imageData, 0, 0)
        }
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Load page data when current page changes
  useEffect(() => {
    if (currentPage >= 0 && pages[currentPage] && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Load page data
        if (pages[currentPage]) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
          }
          img.src = pages[currentPage]
        }
      }
    }
  }, [currentPage, pages])

  // Redraw canvas when history changes
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Redraw all paths from history
        history.forEach((path) => drawPath(ctx, path))
      }
    }
  }, [history])

  // Get coordinates for both mouse and touch events
  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    let x, y
    
    // Check if it's a touch event
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      // Mouse event
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }
    
    return { x, y }
  }

  // Start drawing - works for both mouse and touch
  const startDrawing = (e) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Prevent scrolling when drawing on mobile
        e.preventDefault()
        
        const coords = getCoordinates(e, canvas)
        const { x, y } = coords

        setIsDrawing(true)

        // Start a new path
        const newPath = {
          tool: values.tool,
          color: values.color,
          brush: values.brush,
          opacity: values.opacity / 100,
          points: [{ x, y }],
        }

        setCurrentPath(newPath)

        // Draw initial point
        ctx.globalAlpha = values.opacity / 100
        ctx.fillStyle = values.color
        ctx.beginPath()
        ctx.arc(x, y, values.brush / 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // Draw - works for both mouse and touch
  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (ctx) {
      // Prevent scrolling when drawing on mobile
      e.preventDefault()
      
      const coords = getCoordinates(e, canvas)
      const { x, y } = coords

      // Add point to current path
      setCurrentPath((prev) => ({
        ...prev,
        points: [...prev.points, { x, y }],
      }))

      // Draw line
      if (values.tool === "pencil" || values.tool === "eraser") {
        const lastPoint = currentPath.points[currentPath.points.length - 1]

        ctx.globalAlpha = values.opacity / 100
        ctx.lineWidth = values.brush
        ctx.lineCap = "round"
        ctx.strokeStyle = values.color

        ctx.beginPath()
        ctx.moveTo(lastPoint.x, lastPoint.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      } else if (values.tool === "square" || values.tool === "circle") {
        // For shapes, we'll draw it on mouse up
        const startPoint = currentPath.points[0]
        drawPreview(startPoint, { x, y })
      }
    }
  }

  // Stop drawing - works for both mouse and touch
  const stopDrawing = (e) => {
    if (isDrawing && canvasRef.current) {
      // Prevent default behavior on mobile
      if (e && e.preventDefault) {
        e.preventDefault()
      }
      
      setIsDrawing(false)

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // If shape tool, draw the final shape
        if ((values.tool === "square" || values.tool === "circle") && currentPath.points.length >= 2) {
          const startPoint = currentPath.points[0]
          const endPoint = currentPath.points[currentPath.points.length - 1]

          // Clear the preview
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Redraw history
          history.forEach((path) => drawPath(ctx, path))

          // Draw the final shape
          drawShape(ctx, startPoint, endPoint)
        }

        // Add current path to history
        setHistory((prev) => [...prev, currentPath])
        setCurrentPath([])
      }
    }
  }

  const drawPreview = (start, end) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Clear canvas and redraw all previous paths
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      history.forEach((path) => drawPath(ctx, path))

      // Draw shape preview
      drawShape(ctx, start, end)
    }
  }

  const drawShape = (ctx, start, end) => {
    ctx.globalAlpha = values.opacity / 100
    ctx.lineWidth = values.brush
    ctx.strokeStyle = values.color

    if (values.tool === "square") {
      ctx.beginPath()
      ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y)
      ctx.stroke()
    } else if (values.tool === "circle") {
      const radiusX = Math.abs(end.x - start.x) / 2
      const radiusY = Math.abs(end.y - start.y) / 2
      const centerX = Math.min(start.x, end.x) + radiusX
      const centerY = Math.min(start.y, end.y) + radiusY

      ctx.beginPath()
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  const drawPath = (ctx, path) => {
    if (!path || !path.points || path.points.length === 0) return

    ctx.globalAlpha = path.opacity
    ctx.lineWidth = path.brush
    ctx.lineCap = "round"
    ctx.strokeStyle = path.color

    if (path.tool === "pencil" || path.tool === "eraser") {
      ctx.beginPath()
      ctx.moveTo(path.points[0].x, path.points[0].y)

      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y)
      }

      ctx.stroke()
    } else if (path.tool === "square" && path.points.length >= 2) {
      const start = path.points[0]
      const end = path.points[path.points.length - 1]

      ctx.beginPath()
      ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y)
      ctx.stroke()
    } else if (path.tool === "circle" && path.points.length >= 2) {
      const start = path.points[0]
      const end = path.points[path.points.length - 1]

      const radiusX = Math.abs(end.x - start.x) / 2
      const radiusY = Math.abs(end.y - start.y) / 2
      const centerX = Math.min(start.x, end.x) + radiusX
      const centerY = Math.min(start.y, end.y) + radiusY

      ctx.beginPath()
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  return (
    <div className="bg-slate-50 rounded-xl p-2 shadow-inner border border-slate-200 flex-1">
      <canvas
        id="drawing-canvas"
        ref={canvasRef}
        width={800}
        height={500}
        // Mouse events
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        // Touch events
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
        className="w-full h-auto bg-white border border-slate-200 rounded shadow-sm"
        style={{ maxWidth: "100%", touchAction: "none" }}
      />
    </div>
  )
}