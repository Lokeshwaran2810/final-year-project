import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MonitoringProvider, useMonitoring } from './context/MonitoringContext';
import { ToastProvider } from './context/ToastContext';
import Toaster from './components/Toaster';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import SensorPage from './pages/SensorPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AuthenticatedApp = () => {
  const { selectedPatientId, setSelectedPatientId } = useMonitoring();


  return (
    <Layout onDashboardClick={() => setSelectedPatientId(null)}>
      {selectedPatientId ? <PatientDetail /> : <Dashboard />}
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MonitoringProvider>
                  <AuthenticatedApp />
                </MonitoringProvider>
              </ProtectedRoute>
            } />
            <Route path="/patient/:id/sensors" element={
              <ProtectedRoute>
                <MonitoringProvider>
                  <SensorPage />
                </MonitoringProvider>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
