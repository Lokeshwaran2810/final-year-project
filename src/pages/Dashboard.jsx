import React, { useState } from 'react';
import { useMonitoring } from '../context/MonitoringContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import AddPatientModal from '../components/AddPatientModal';
import { Droplets, Clock, Battery, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { deletePatient } from '../lib/api';

const Dashboard = () => {
    const { patients, setSelectedPatientId } = useMonitoring();
    const { user } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);

    // Quick stats
    const activePatients = patients.filter(p => p.status !== 'Completed').length;
    const criticalPatients = patients.filter(p => p.status === 'Critical').length;
    const warningPatients = patients.filter(p => p.status === 'Warning').length;

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to discharge this patient?")) {
            await deletePatient(id);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-blue-50 border-blue-100 flex items-center justify-between col-span-1">
                    <div>
                        <p className="text-sm font-medium text-blue-600 mb-1">Active Infusions</p>
                        <p className="text-3xl font-bold text-slate-800">{activePatients}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Droplets size={24} />
                    </div>
                </Card>

                <Card className="bg-red-50 border-red-100 flex items-center justify-between col-span-1">
                    <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Critical Alerts</p>
                        <p className="text-3xl font-bold text-slate-800">{criticalPatients}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-pulse">
                        <StatusBadge status="Critical" className="p-0 w-12 h-12 rounded-full border-none bg-transparent animate-none flex justify-center" />
                    </div>
                </Card>

                <Card className="bg-amber-50 border-amber-100 flex items-center justify-between col-span-1">
                    <div>
                        <p className="text-sm font-medium text-amber-600 mb-1">Warnings</p>
                        <p className="text-3xl font-bold text-slate-800">{warningPatients}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <StatusBadge status="Warning" className="p-0 w-12 h-12 rounded-full border-none bg-transparent flex justify-center" />
                    </div>
                </Card>

                {/* Add Patient Button - Visible for Everyone per user request */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-medical-green/40 hover:border-medical-green hover:bg-medical-green/5 rounded-2xl transition-all group col-span-1 h-full min-h-[100px]"
                >
                    <div className="w-10 h-10 bg-medical-green/10 text-medical-green rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold text-medical-green">Admit Patient</span>
                </button>

                {/* Global ESP32 Sensor Button */}
                <button
                    onClick={() => {
                        window.open(`http://192.168.32.136`, '_blank');
                    }}
                    className="flex flex-col items-center justify-center bg-indigo-50 border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-100 rounded-2xl transition-all group col-span-1 h-full min-h-[100px]"
                >
                    <div className="w-10 h-10 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Droplets size={24} />
                    </div>
                    <span className="font-bold text-indigo-700">ESP32 Sensor Data</span>
                </button>
            </div>

            <div className="flex items-center justify-between mt-8 mb-4">
                <h3 className="text-lg font-bold text-slate-700">Patient Queue ({user?.role} View)</h3>
            </div>

            {/* Patient Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {patients.map(patient => (
                    <Card
                        key={patient.id}
                        className={`cursor-pointer transition-all hover:shadow-lg hover:border-medical-blue/30 group relative overflow-hidden ${patient.status === 'Critical' ? 'border-red-200 ring-2 ring-red-100' : ''
                            }`}
                    >
                        <div onClick={() => setSelectedPatientId(patient.id)}>
                            {/* Header Section with Photo */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`relative w-16 h-16 rounded-full border-[3px] p-0.5 shrink-0 ${patient.status === 'Normal' ? 'border-medical-green' :
                                        patient.status === 'Completed' ? 'border-slate-300' :
                                            'border-red-500 animate-pulse'
                                    }`}>
                                    <img
                                        src={patient.photo ? `http://localhost:3001${patient.photo}` : `https://ui-avatars.com/api/?name=${patient.name}&background=random`}
                                        alt={patient.name}
                                        className="w-full h-full rounded-full object-cover"
                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${patient.name}&background=random` }}
                                    />
                                    {/* Status Dot Indicator for "Green/Red" requirement */}
                                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${patient.status === 'Normal' ? 'bg-medical-green' :
                                            patient.status === 'Completed' ? 'bg-slate-400' :
                                                'bg-red-500'
                                        }`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-lg font-bold text-slate-800 truncate">{patient.name}</h4>
                                        {/* Delete Action */}
                                        <button
                                            onClick={(e) => handleDelete(e, patient.id)}
                                            className="text-slate-300 hover:text-red-500 p-1 rounded hover:bg-red-50"
                                            title="Discharge Patient"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{patient.id} • {patient.gender.charAt(0)}/{patient.age}</p>
                                    <p className="text-sm font-medium text-medical-blue mt-0.5">{patient.bedNumber}</p>
                                </div>
                            </div>

                            {/* IV Status Bar */}
                            <div className={`w-full h-1.5 rounded-full mb-4 ${patient.status === 'Normal' ? 'bg-green-100' : patient.status === 'Critical' ? 'bg-red-100' : 'bg-amber-100'
                                }`}>
                                <div className={`h-full rounded-full transition-all duration-1000 ${patient.status === 'Normal' ? 'bg-medical-green' : patient.status === 'Critical' ? 'bg-red-500' : 'bg-amber-500'
                                    }`} style={{ width: '100%' }}></div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Flow Rate</p>
                                    <p className="font-bold text-slate-700 text-lg leading-none">{patient.flowRate} <span className="text-[10px] font-normal text-slate-400">mL/hr</span></p>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl text-center border border-slate-100">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Vol. Infused</p>
                                    <p className="font-bold text-slate-700 text-lg leading-none">{Math.round(patient.volumeInfused)} <span className="text-[10px] font-normal text-slate-400">mL</span></p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`/patient/${patient.id}/sensors`, '_blank');
                                    }}
                                    className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors shadow-sm"
                                    title="View Live Hardware Sensors"
                                >
                                    Sensor Data
                                </button>
                                <button className="text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm">
                                    Dashboard <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {showAddModal && <AddPatientModal onClose={() => setShowAddModal(false)} />}
        </div>
    );
};

export default Dashboard;
