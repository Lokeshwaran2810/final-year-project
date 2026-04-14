import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { fetchPatients } from '../lib/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const MonitoringContext = createContext();

export const MonitoringProvider = ({ children }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const { isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const { addToast } = useToast();
    const patientsRef = React.useRef(patients);

    useEffect(() => {
        patientsRef.current = patients;
    }, [patients]);

    // Initial Fetch
    useEffect(() => {
        if (isAuthenticated) {
            loadPatients();

            // Connect Socket
            const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const newSocket = io(socketUrl, {
                transports: ['websocket'],
                upgrade: false,
            });
            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [isAuthenticated]);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('patient_update', (updatedPatient) => {
            setPatients(prev => {
                const exists = prev.find(p => p.id === updatedPatient.id);
                if (exists) {
                    return prev.map(p => p.id === updatedPatient.id ? { ...p, ...updatedPatient } : p);
                }
                return [...prev, updatedPatient];
            });
        });

        socket.on('patient_delete', (id) => {
            setPatients(prev => prev.filter(p => p.id !== id));
            if (selectedPatientId === id) setSelectedPatientId(null);
        });

        socket.on('live_data', (data) => {
            // Check for alerts based on current state
            const currentPatient = patientsRef.current.find(p => p.id === data.id);

            if (currentPatient && currentPatient.status !== data.status) {
                if (data.status === 'Warning') {
                    addToast(`Patient ${currentPatient.name}: IV Drip Threshold Reached`, 'warning');
                    // Play sound or other alert if needed
                } else if (data.status === 'Completed') {
                    addToast(`Patient ${currentPatient.name}: IV Drip Empty`, 'info');
                } else if (data.status === 'Critical') {
                    addToast(`Patient ${currentPatient.name}: Critical Alert!`, 'error');
                }
            }

            setPatients(prev => prev.map(p => {
                if (p.id === data.id) {
                    const newHistory = [...(p.history || []), { time: new Date().toLocaleTimeString(), value: data.flowRate }].slice(-20);
                    return { ...p, ...data, history: newHistory };
                }
                return p;
            }));
        });

        return () => {
            socket.off('patient_update');
            socket.off('patient_delete');
            socket.off('live_data');
        };
    }, [socket, selectedPatientId, addToast]);

    const loadPatients = async () => {
        try {
            const data = await fetchPatients();
            // Initialize history for charts if empty
            const withHistory = data.map(p => ({ ...p, history: [] }));
            setPatients(withHistory);
        } catch (err) {
            console.error("Failed to load patients", err);
        }
    };

    const getPatient = (id) => patients.find(p => p.id === id);

    return (
        <MonitoringContext.Provider value={{ patients, selectedPatientId, setSelectedPatientId, getPatient, refreshPatients: loadPatients }}>
            {children}
        </MonitoringContext.Provider>
    );
};

export const useMonitoring = () => useContext(MonitoringContext);
