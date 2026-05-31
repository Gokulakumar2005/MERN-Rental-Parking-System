import React from 'react';
import { Target, Users, Map, Globe } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">About ParkFlow</h1>
                    <p className="text-lg font-medium text-slate-500 mt-4 max-w-2xl mx-auto">
                        We are revolutionizing urban mobility by connecting drivers with secure, accessible, and affordable parking spaces across the globe.
                    </p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-black text-slate-800">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Urban areas are becoming increasingly congested, and finding parking has become a daily struggle for millions. Our mission is to alleviate traffic congestion, reduce emissions, and save time by making parking spaces highly discoverable and easily bookable.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            We empower property owners to monetize their unused parking real estate while offering drivers the convenience of guaranteed parking.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="aspect-square bg-indigo-50 rounded-[2rem] flex items-center justify-center p-8 relative overflow-hidden">
                            <Map size={120} className="text-indigo-200" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Our Vision</h3>
                        <p className="text-slate-500 text-sm">A world where parking is never a pain point. Seamless urban transit.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Community First</h3>
                        <p className="text-slate-500 text-sm">Built by drivers, for drivers. We prioritize our user community.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Sustainability</h3>
                        <p className="text-slate-500 text-sm">Reducing carbon emissions by eliminating cruising for parking.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
