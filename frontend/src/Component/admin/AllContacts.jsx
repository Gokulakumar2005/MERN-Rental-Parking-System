import React, { useEffect, useState, useCallback } from "react";
import axios from "../../config/axiosInstance";
import Pagination from "../../config/pagination";
import SearchBar from "../SearchBar";
import { Mail, Inbox, User, HelpCircle, MessageSquare, Check, X, RefreshCcw, AlertTriangle } from "lucide-react";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";

export default function AllContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const fetchContacts = async (page = 1, limit = 12, searchQuery = search, statusFilter = status) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`/admin/contacts`, {
                params: { page, limit, search: searchQuery, status: statusFilter },
                headers: { Authorization: token }
            });
            setContacts(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch contact forms.");
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useCallback(
        debounce((searchQuery, statusFilter) => {
            fetchContacts(1, 12, searchQuery, statusFilter);
        }, 500),
        []
    );

    useEffect(() => {
        fetchContacts(1, 12, search, status);
    }, []);

    const handleSearchChange = (value) => {
        setSearch(value);
        debouncedFetch(value, status);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        fetchContacts(1, 12, search, value);
    };

    const handlePageChange = (page) => {
        fetchContacts(page, 12, search, status);
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`/admin/contacts/${id}/read`, {}, {
                headers: { Authorization: token }
            });
            toast.success("Marked as read");
            setContacts(contacts.map(c => c._id === id ? { ...c, status: "read" } : c));
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update status");
        }
    };

    const filters = [
        { label: "All Forms", value: "all" },
        { label: "Unread", value: "unread" },
        { label: "Read", value: "read" }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Contact Inbox</h1>
                        <p className="text-gray-500 mt-2 font-medium">Manage inquiries from users and guests</p>
                    </div>
                    <div className="bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-100 flex items-center gap-3 w-fit">
                        <Inbox className="text-indigo-500" size={20} />
                        <span className="font-bold text-gray-700">{pagination.totalItems} Total Messages</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Connection Error</h3>
                                <p className="text-sm text-rose-600 font-bold">{error}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => fetchContacts(1, 12, search, status)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-200"
                        >
                            <RefreshCcw size={16} />
                            <span className="hidden sm:inline">Retry</span>
                        </button>
                    </div>
                )}

                <div className="max-w-xl">
                    <SearchBar 
                        placeholder="Search by name, email, or subject..."
                        value={search}
                        onChange={handleSearchChange}
                        filters={filters}
                        activeFilter={status}
                        onFilterChange={handleStatusChange}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : contacts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {contacts.map((contact) => (
                            <div
                                key={contact._id}
                                className={`group bg-white rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative ${
                                    contact.status === "unread" ? "border-indigo-100 ring-4 ring-indigo-50" : "border-gray-100"
                                }`}
                            >
                                {contact.status === "unread" && (
                                    <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse"></div>
                                )}
                                
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className={`p-4 rounded-2xl flex-shrink-0 ${contact.status === "unread" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-500"}`}>
                                            <Mail size={24} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="text-xl font-bold text-gray-900 truncate" title={contact.subject}>{contact.subject}</h3>
                                            <p className="text-sm font-medium text-gray-500 mt-1">{new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User size={14} className="text-slate-400" />
                                            <span className="text-sm font-bold text-slate-700">{contact.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-slate-400" />
                                            <a href={`mailto:${contact.email}`} className="text-sm font-bold text-indigo-600 hover:underline truncate">{contact.email}</a>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute top-1 left-0 text-slate-300">
                                            <MessageSquare size={16} />
                                        </div>
                                        <p className="pl-6 text-sm text-slate-600 leading-relaxed italic line-clamp-4">
                                            "{contact.message}"
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 flex items-center justify-end">
                                        {contact.status === "unread" ? (
                                            <button 
                                                onClick={() => markAsRead(contact._id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors"
                                            >
                                                <Check size={16} />
                                                Mark as Read
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest rounded-lg border border-slate-100">
                                                <Check size={14} /> Read
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-sm">
                        <Inbox className="mx-auto text-gray-200 mb-4" size={64} />
                        <h3 className="text-2xl font-bold text-gray-900">No messages found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">You don't have any contact form submissions matching this criteria.</p>
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-8 w-fit mx-auto">
                        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>
        </div>
    );
}
