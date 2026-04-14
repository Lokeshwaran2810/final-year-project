import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, User, Lock, ArrowRight, Shield } from 'lucide-react';
import { register } from '../lib/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', role: 'Nurse'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
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

            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 z-10 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-medical-white to-cyan-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-medical-blue/20">
                        <img src="images/neww loggoo.jpeg" alt="Logo" className="w-10 h-10 object-contain brightness-1" onError={(e) => e.target.style.display = 'none'} />
                        <Activity size={32} className="absolute" style={{ opacity: 0 }} />
                        {/* Fallback if no logo image */}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Join DripSense</h1>
                    <p className="text-slate-500 mt-2">Create your professional account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue outline-none transition-all"
                                placeholder="Dr. John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue outline-none transition-all"
                                placeholder="jdoe"
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue outline-none transition-all"
                        >
                            <option value="Nurse">Nurse</option>
                            <option value="Doctor">Doctor</option>
                        </select>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center justify-center font-medium animate-in fade-in">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-medical-blue hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-medical-blue/25 flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-medical-blue font-bold hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
