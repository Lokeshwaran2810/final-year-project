import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMonitoring } from '../context/MonitoringContext';
import { ArrowLeft, Thermometer, Activity, Droplet, Ruler } from 'lucide-react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const SensorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getPatient } = useMonitoring();

    // Local state to ensure we have data immediately or gracefully handle loading
    const patient = getPatient(id);

    const [isAlert, setIsAlert] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {
        if (patient) {
            // Logic from user snippet: body.className=(d.flow==0||d.dist>25)?"alert":"normal";
            // We'll use this for a visual alert effect instead of changing body class directly
            const shouldAlert = patient.flowRate === 0 || patient.distance > 25;
            setIsAlert(shouldAlert);
        }
    }, [patient]);

    // Timeout for loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!patient) {
                setError("Could not load patient data. Please ensure you are logged in and the server is running.");
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [patient]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <div className="text-red-500 font-bold text-xl">{error}</div>
                <p className="text-slate-500">Patient ID: {id}</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-slate-500 gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p>Loading patient data...</p>
            </div>
        );
    }

    const MetricCard = ({ title, value, unit, icon: Icon, colorClass, alertCondition }) => (
        <Card className={`relative overflow-hidden transition-all duration-300 ${alertCondition ? 'ring-4 ring-red-500 ring-opacity-50 animate-pulse bg-red-50' : ''}`}>
            <div className={`p-4 rounded-full w-fit mb-4 ${colorClass} bg-opacity-20`}>
                <Icon size={32} className={colorClass.replace('bg-', 'text-')} />
            </div>
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <div className="flex items-baseline mt-2">
                <span className="text-4xl font-bold text-slate-800">{value}</span>
                {unit && <span className="ml-2 text-slate-400 font-medium">{unit}</span>}
            </div>
        </Card>
    );

    return (
        <div className={`min-h-screen p-6 transition-colors duration-500 ${isAlert ? 'bg-red-50' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-3 bg-white hover:bg-slate-100 text-slate-600 rounded-full shadow-sm transition-all hover:shadow-md"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Live Sensor Monitor</h1>
                            <p className="text-slate-500">Real-time telemetry for {patient.name}</p>
                        </div>
                    </div>
                    <StatusBadge status={patient.status} />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Temperature"
                        value={patient.temperature || 0}
                        unit="°C"
                        icon={Thermometer}
                        colorClass="bg-orange-500 text-orange-600"
                    />

                    <MetricCard
                        title="Distance / Level"
                        value={patient.distance || 0}
                        unit="cm"
                        icon={Ruler}
                        colorClass="bg-blue-500 text-blue-600"
                        alertCondition={patient.distance > 25}
                    />

                    <MetricCard
                        title="Drop Count"
                        value={patient.dropCount || 0}
                        unit="drops"
                        icon={Droplet}
                        colorClass="bg-cyan-500 text-cyan-600"
                    />

                    <MetricCard
                        title="Flow Rate"
                        value={patient.flowRate || 0}
                        unit="ml/min" // Changed to ml/min to match user snippet, though app usually uses ml/hr. Keeping consistent with user request.
                        icon={Activity}
                        colorClass="bg-emerald-500 text-emerald-600"
                        alertCondition={patient.flowRate === 0}
                    />
                </div>

                {/* Detailed View / Chart Area Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="System Status" className="h-full">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                            <div className={`w-3 h-3 rounded-full ${isAlert ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
                            <span className="font-mono text-slate-600">
                                {isAlert ? 'ALERT: CHECK IV STATUS' : 'SYSTEM NOMINAL'}
                            </span>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-slate-500">
                            <div className="flex justify-between border-b border-slate-100 py-2">
                                <span>Last Update</span>
                                <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 py-2">
                                <span>Device ID</span>
                                <span>ESP32-001</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 py-2">
                                <span>Connection</span>
                                <span className="text-green-600 font-medium">Active</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Threshold Settings" className="h-full">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Max Distance (Empty)</span>
                                    <span className="font-bold text-slate-800">25 cm</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-300 w-[80%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Min Flow Rate</span>
                                    <span className="font-bold text-slate-800">5 ml/min</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-300 w-[10%]" />
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-xs text-slate-400">
                            * Thresholds are currently hardcoded for demonstration.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SensorPage;
