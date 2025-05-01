import React from "react"
export default function PagesPanel({ pages, currentPage, handleAddNewPage, handlePageChosen }) {
  return (
    <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center gap-2 sm:w-16 md:w-20">
      <h3 className="text-xs sm:text-sm font-medium text-slate-500">Pages</h3>

      <div
        className="flex-1 w-full flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden sm:max-h-[30rem] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
        style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
      >
        <button
          onClick={handleAddNewPage}
          className="bg-indigo-600 text-white m:min-w-0 sm:w-full h-8 sm:h-10 px-2 sm:px-0 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center text-lg"
        >
          +
        </button>
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChosen(index)}
            className={`min-w-8 sm:min-w-0 sm:w-full h-8 sm:h-10 px-2 sm:px-0 rounded-lg transition flex items-center justify-center ${
              currentPage === index
                ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
