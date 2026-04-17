export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex justify-center items-center gap-6 mt-12">

                            <button
                                disabled={currentPage === 1}
                                onClick={() => onPageChange(currentPage - 1)}
                                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 
               shadow-sm hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ← Prev
                            </button>

                            <div className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-900 text-white shadow-md">
                                <span className="text-sm text-gray-300">Page</span>
                                <span className="text-lg font-bold">{currentPage}</span>
                                <span className="text-sm text-gray-400">/ {totalPages || 1}</span>
                            </div>

                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => onPageChange(currentPage + 1)}
                                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 
               shadow-sm hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>

                        </div>
    )
}