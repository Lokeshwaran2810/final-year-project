import React from 'react';

const SettingsPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Settings</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
                <div className="border-b border-slate-100 pb-6">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">Profile Settings</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                            <img src="images/693a8747104ce_download.jpg" alt="Profile" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Lokesh</p>
                            <p className="text-slate-500 text-sm">lokeshwaran@gmail.com</p>
                            <button className="text-medical-blue text-sm font-medium hover:underline mt-1">Change Profile Photo</button>
                        </div>
                    </div>
                </div>

                <div className="border-b border-slate-100 pb-6">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">Notification Preferences</h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-medical-green rounded focus:ring-medical-green border-gray-300" defaultChecked />
                            <span className="text-slate-600">Email Alerts for Critical Output</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-medical-green rounded focus:ring-medical-green border-gray-300" defaultChecked />
                            <span className="text-slate-600">Sound Notifications</span>
                        </label>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">System</h2>
                    <div className="flex items-center justify-between py-3">
                        <span className="text-slate-600">App Version</span>
                        <span className="text-slate-500 font-mono">v2.0.1 (DripSense)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
