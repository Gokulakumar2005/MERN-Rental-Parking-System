import React, { useState } from 'react';
import axios from '../../config/axiosInstance';
import { Mail, MessageSquare, User, HelpCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/contact', formData);
            setSubmitted(true);
            toast.success("Message sent successfully!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center">
            <div className="max-w-xl w-full bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
                
                {submitted ? (
                    <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-4">Message Sent!</h2>
                        <p className="text-slate-500 mb-8">Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
                        <button 
                            onClick={() => { setSubmitted(false); setFormData({name:'',email:'',subject:'',message:''}); }}
                            className="px-6 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                        >
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contact Us</h1>
                            <p className="text-slate-500 mt-2 font-medium">We'd love to hear from you. Please fill out the form below.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <HelpCircle size={18} />
                                    </div>
                                    <input 
                                        type="text" 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                                <div className="relative">
                                    <div className="absolute top-4 left-4 pointer-events-none text-slate-400">
                                        <MessageSquare size={18} />
                                    </div>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium resize-none"
                                        placeholder="Write your message here..."
                                    ></textarea>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all ${
                                    loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/50 hover:-translate-y-0.5'
                                }`}
                            >
                                {loading ? 'Sending Message...' : 'Send Message'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
