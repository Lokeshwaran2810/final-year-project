import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-medical-white rounded-xl flex items-center justify-center text-white shadow-lg shadow-medical-green/20">
                            <img src="images/neww loggoo.jpeg" className="w-10 h-10 rounded-xl brightness-4 " alt="Logo" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">DripSense</h1>
                    </div>
                    <div>
                        <Link to="/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors">
                            Login Portal
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-green-50/50 to-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-medical-blue/10 text-medical-blue rounded-full text-sm font-semibold">
                            <span className="w-2 h-2 rounded-full bg-medical-blue animate-pulse"></span>
                            New Standard in Patient Care
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1]">
                            Smart IV <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-green to-teal-500">
                                Monitoring
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
                            Replace manual checks with our automated IoT-enabled dashboard. Real-time insights, instant alerts, and enhanced patient safety.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="px-8 py-4 bg-medical-green text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-medical-green/20 hover:-translate-y-1 transition-all flex items-center gap-2">
                                Get Started <ArrowRight size={20} />
                            </Link>
                            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                                View Demo
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-medical-green/20 to-transparent rounded-full blur-3xl -z-10 transform scale-75"></div>
                        <img
                            src="public/dripsense-logo.png"
                            alt="Hospital Dashboard Mockup"
                            className="rounded-3xl shadow-2xl shadow-slate-200/50 border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Why Choose DripSense?</h2>
                        <p className="text-slate-500 mt-4">Built for nurses, trusted by doctors.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<ShieldCheck size={32} />}
                            title="Patient Safety First"
                            desc="Instant occlusion detection and battery warnings prevent critical errors before they happen."
                        />
                        <FeatureCard
                            icon={<Clock size={32} />}
                            title="Real-Time Data"
                            desc="Live streaming of flow rates (mL/hr) and volume infused directly from the bedside."
                        />
                        <FeatureCard
                            icon={<Users size={32} />}
                            title="Role-Based Access"
                            desc="Custom interfaces for Doctors and Nurses to streamline workflow and improve efficiency."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
        <div className="w-14 h-14 bg-blue-50 text-medical-blue rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
