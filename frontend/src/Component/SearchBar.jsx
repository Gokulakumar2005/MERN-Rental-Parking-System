import { useState, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

export default function SearchBar({ placeholder = "Search...", value, onChange, filters, activeFilter, onFilterChange }) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="w-full space-y-3">
            <div
                className={`flex items-center gap-3 bg-white border rounded-2xl px-4 py-3 transition-all duration-300 shadow-sm ${
                    isFocused
                        ? "border-indigo-400 ring-4 ring-indigo-500/10 shadow-md"
                        : "border-slate-200 hover:border-slate-300"
                }`}
            >
                <Search
                    size={20}
                    className={`shrink-0 transition-colors duration-200 ${
                        isFocused ? "text-indigo-500" : "text-slate-400"
                    }`}
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-slate-800 font-medium text-sm placeholder-slate-400 focus:outline-none"
                />
                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                )}
                {/* <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                    <span>Ctrl</span>
                    <span>+</span>
                    <span>K</span>
                </div> */}
            </div>

            {filters && filters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => onFilterChange(filter.value)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                                activeFilter === filter.value
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                        >
                            {filter.label}
                            {filter.count !== undefined && (
                                <span className={`ml-1.5 ${activeFilter === filter.value ? "text-indigo-200" : "text-slate-400"}`}>
                                    {filter.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
