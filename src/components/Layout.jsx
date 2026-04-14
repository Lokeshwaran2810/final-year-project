import React from 'react';
import { Activity, LayoutDashboard, Users, Bell, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMonitoring } from '../context/MonitoringContext'; // Import this if you want to clear selection

const Sidebar = ({ onDashboardClick }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

 

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-3 px-2 mb-8 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-medical-green rounded-lg flex items-center justify-center text-white shadow-lg shadow-medical-green/20">
                        <img src="images/neww loggoo.jpeg" className="w-10 h-10 rounded-lg brightness-1" alt="Logo" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">DripSense</h1>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <NavItem
                    to="/dashboard"
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    active={isActive('/dashboard')}
                    onClick={onDashboardClick} // Trigger reset when clicked
                />
                <NavItem
                    to="/dashboard"
                    icon={<Users size={20} />}
                    label="Patients"
                    onClick={onDashboardClick}
                />
                <NavItem to="#" icon={<Bell size={20} />} label="Alerts" badge="3" />
                <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" active={isActive('/settings')} />
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-slate-500 hover:bg-slate-50 hover:text-red-600 rounded-lg transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, badge, to, onClick }) => {
    const Component = to ? Link : 'button';
    return (
        <Component
            to={to}
            onClick={onClick}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${active
                ? 'bg-medical-green/10 text-medical-green font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
            </div>
            {badge && (
                <span className="bg-medical-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </Component>
    );
};

const Layout = ({ children, onDashboardClick }) => {
    return (
        <div className="min-h-screen bg-slate-50 pl-64">
            <Sidebar onDashboardClick={onDashboardClick} />
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                <h2 className="text-lg font-semibold text-slate-700">ICU Ward Monitor - Station A</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-medical-green animate-pulse"></span>
                        <span className="text-sm font-medium text-slate-600">System Online</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                        <img src="public/images/693a8747104ce_download.jpg" alt="Profile" />
                    </div>
                </div>
            </header>
            <main className="p-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
