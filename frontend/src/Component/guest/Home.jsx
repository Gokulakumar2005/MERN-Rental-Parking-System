import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, MapPin, ShieldCheck, Clock } from 'lucide-react';
import About from './About';
import Contact from './Contact';

export default function Home() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.slice(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location]);
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center">
            {/* Hero Section */}
            <div className="w-full bg-indigo-600 py-20 px-6 text-center rounded-b-[4rem] shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pattern-dots"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 animate-in slide-in-from-bottom-8 duration-700">
                        Smart Parking <br />
                        <span className="text-indigo-200">Made Simple.</span>
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-indigo-100 mb-10 max-w-2xl mx-auto animate-in slide-in-from-bottom-10 duration-1000 delay-150">
                        Find, reserve, and manage parking slots anywhere. Join the modern network of drivers and slot owners using ParkFlow.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in duration-1000 delay-300">
                        <Link to="/register" className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all">
                            Get Started Now
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-400 transition-colors">
                            Sign In to Account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto w-full px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-800">Why choose ParkFlow?</h2>
                    <p className="text-slate-500 mt-2 font-medium">Everything you need to modernize your parking experience.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow text-center">
                        <div className="w-16 h-16 mx-auto bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Instant Booking</h3>
                        <p className="text-slate-500">Find and reserve parking spots instantly. No more driving around in circles looking for a space.</p>
                    </div>
                    
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow text-center">
                        <div className="w-16 h-16 mx-auto bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Secure Facilities</h3>
                        <p className="text-slate-500">All registered parking slots are verified and closely monitored for your vehicle's safety.</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow text-center">
                        <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                            <Clock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Flexible Pricing</h3>
                        <p className="text-slate-500">Hourly, daily, or monthly plans. Pay only for the time you need with our dynamic pricing.</p>
                    </div>
                </div>
            </div>
            
            {/* About Section */}
            <div id="about" className="w-full">
                <About />
            </div>

            {/* Contact Section */}
            <div id="contact" className="w-full">
                <Contact />
            </div>

            {/* CTA Section */}
            <div className="w-full bg-slate-900 py-16 text-center">
                <Car className="mx-auto text-indigo-500 mb-6" size={48} />
                <h2 className="text-3xl font-black text-white mb-4">Ready to start parking smarter?</h2>
                <Link to="/register" className="inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors">
                    Create your free account
                </Link>
            </div>
        </div>
    );
}
