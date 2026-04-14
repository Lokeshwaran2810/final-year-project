import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, User, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(username, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-medical-green/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-medical-blue/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 z-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-medical-white to-teal-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-medical-green/20">
                        <img src="images/neww loggoo.jpeg" alt="Logo" className="w-14 h-14 rounded-2xl brightness-1" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">DripSense</h1>
                    <p className="text-slate-500 mt-2">Smart Infusion Monitoring System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green outline-none transition-all"
                                placeholder="Enter username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-green/20 focus:border-medical-green outline-none transition-all"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center justify-center font-medium animate-in fade-in">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-medical-green hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-medical-green/25 flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Logging in...' : 'Access Dashboard'}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-slate-500">
                        New staff member? <Link to="/register" className="text-medical-green font-bold hover:underline">Register here</Link>
                    </p>
                    <p className="text-xs text-slate-400">
                        Authorized Personnel Only • Secure System <br />
                        Demo users: <b>doc1</b> / <b>nurse1</b> (pw: password123)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
