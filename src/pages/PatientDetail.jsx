import React from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import IVDropAnimation from '../components/IVDropAnimation';
import { ArrowLeft, Play, Pause, AlertTriangle, Droplet, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PatientDetail = () => {
    const { selectedPatientId, setSelectedPatientId, getPatient } = useMonitoring();
    const { user } = useAuth();
    const patient = getPatient(selectedPatientId);

    if (!patient) return <div>Patient not found</div>;

    const percentage = Math.min((patient.volumeInfused / patient.totalVolume) * 100, 100);

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={() => setSelectedPatientId(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
                    <p className="text-slate-500">ID: {patient.id} • {patient.gender}, {patient.age}yrs • {patient.diagnosis}</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={() => window.open(`/patient/${patient.id}/sensors`, '_blank')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm flex items-center gap-2"
                        title="Open Live Sensor Monitor in new tab"
                    >
                        <Activity size={18} /> Live Sensors
                    </button>
                    <span className="text-lg font-bold text-slate-600">{patient.bedNumber}</span>
                    <StatusBadge status={patient.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visual Monitor Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-slate-50 border-medical-blue/10">
                        <div className="mb-6 relative">
                            <IVDropAnimation rate={patient.dripRate} isRunning={patient.status === 'Normal' || patient.status === 'Warning'} />
                            {patient.status === 'Critical' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                                    <div className="flex flex-col items-center gap-2 text-red-500 animate-bounce">
                                        <AlertTriangle size={32} />
                                        <span className="font-bold">OCCLUSION</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="text-center p-3 bg-blue-50 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Flow Rate</p>
                                <p className="text-2xl font-bold text-slate-800">{patient.flowRate}</p>
                                <p className="text-xs text-slate-400">mL/hr</p>
                            </div>
                            <div className="text-center p-3 bg-indigo-50 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Drip Rate</p>
                                <p className="text-2xl font-bold text-slate-800">{patient.dripRate}</p>
                                <p className="text-xs text-slate-400">gtt/min</p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Infusion Control">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-md shadow-sm text-medical-blue">
                                        <Droplet size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-700">{patient.ivType}</p>
                                        <p className="text-xs text-slate-500">Target: {patient.totalVolume}mL</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    disabled={user?.role !== 'Doctor'}
                                    className="flex items-center justify-center gap-2 py-3 bg-medical-red/10 text-medical-red font-bold rounded-lg hover:bg-medical-red/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={user?.role !== 'Doctor' ? "Only Doctors can stop infusion" : "Stop Infusion"}
                                >
                                    <Pause size={18} /> Stop
                                </button>
                                <button
                                    disabled={user?.role !== 'Doctor'}
                                    className="flex items-center justify-center gap-2 py-3 bg-medical-green text-white font-bold rounded-lg hover:bg-medical-green/90 transition-colors shadow-lg shadow-medical-green/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                    title={user?.role !== 'Doctor' ? "Only Doctors can adjust rate" : "Adjust Rate"}
                                >
                                    <Play size={18} /> Rate
                                </button>
                            </div>
                            {user?.role !== 'Doctor' && (
                                <p className="text-xs text-center text-slate-400">Controls restricted to Physicians</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Data & History Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Volume Progress">
                        <div className="mb-2 flex justify-between text-sm font-medium">
                            <span className="text-slate-600">{Math.round(patient.volumeInfused)} mL infused</span>
                            <span className="text-slate-400">{patient.totalVolume} mL total</span>
                        </div>
                        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-medical-blue to-cyan-400 transition-all duration-1000 ease-linear"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <p className="text-right text-xs text-slate-400 mt-2">Est. completion: {Math.round((patient.totalVolume - patient.volumeInfused) / (patient.flowRate || 1))} hours</p>
                    </Card>

                    <Card title="Flow Rate History">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={patient.history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={[0, 200]} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#0CA678"
                                        strokeWidth={3}
                                        dot={false}
                                        animationDuration={300}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card title="Recent Alerts">
                        {patient.status === 'Normal' ? (
                            <div className="text-center py-6 text-slate-400 text-sm">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 text-green-500">
                                    <StatusBadge status="Normal" className="w-full h-full p-0 flex justify-center bg-transparent border-none" />
                                </div>
                                System running normally
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                                    <AlertTriangle className="text-red-500 shrink-0" size={20} />
                                    <div>
                                        <p className="font-bold text-red-700">Occlusion Detected</p>
                                        <p className="text-sm text-red-600/80">Check IV line for blockage or kinks. Infusion stopped automatically.</p>
                                        <p className="text-xs text-slate-400 mt-2">Today, 10:42 AM</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientDetail;
