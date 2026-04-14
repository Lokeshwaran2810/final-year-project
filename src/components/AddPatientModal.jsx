import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createPatient } from '../lib/api';

const AddPatientModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        id: '', name: '', age: '', gender: 'Male', bedNumber: '', diagnosis: '', ivType: '', flowRate: '', totalVolume: '', phoneNumber: '', photo: null
    });
    const [loading, setLoading] = useState(false);

    const [photoPreview, setPhotoPreview] = useState(null);

    const handleChange = (e) => {
        if (e.target.name === 'photo') {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            if (file) {
                setPhotoPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            await createPatient(data); // api.js needs to handle FormData automatically if passed raw? Axios usually does.
            onClose();
        } catch (err) {
            alert("Failed to add patient: " + (err.response?.data?.error || err.message));
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">Admit New Patient</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Photo Upload Section */}
                    <div className="md:col-span-2 flex items-center gap-6 mb-4">
                        <div className={`w - 24 h - 24 rounded - full bg - slate - 100 flex items - center justify - center overflow - hidden border - 2 ${photoPreview ? 'border-medical-green' : 'border-dashed border-slate-300'} `}>
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-slate-400 text-center px-2">No Photo</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Patient Photo</label>
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={handleChange}
                                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-medical-blue/10 file:text-medical-blue
                                    hover:file:bg-medical-blue/20
                                "
                            />
                            <p className="text-xs text-slate-400 mt-1">JPEG/PNG, Max 2MB.</p>
                        </div>
                    </div>

                    <Input label="Patient ID" name="id" value={formData.id} onChange={handleChange} required placeholder="e.g. P-123" />
                    <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="Age" type="number" name="age" value={formData.age} onChange={handleChange} required />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="p-3 border rounded-xl bg-slate-50">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="Contact Number" />
                    <Input label="Bed / Ward No." name="bedNumber" value={formData.bedNumber} onChange={handleChange} required />

                    <div className="md:col-span-2">
                        <Input label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} required />
                    </div>

                    <div className="md:col-span-2 border-t pt-4 mt-2">
                        <h3 className="font-semibold text-slate-700 mb-3">Infusion Details</h3>
                    </div>

                    <Input label="IV Fluid Type" name="ivType" value={formData.ivType} onChange={handleChange} required placeholder="e.g. 0.9% NaCl" />
                    <Input label="Total Volume (mL)" type="number" name="totalVolume" value={formData.totalVolume} onChange={handleChange} required />
                    <Input label="Flow Rate (mL/hr)" type="number" name="flowRate" value={formData.flowRate} onChange={handleChange} required />

                    <div className="md:col-span-2 pt-4 flex gap-3 justify-end">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-medical-green text-white font-bold hover:shadow-lg hover:shadow-medical-green/20 transition-all">
                            {loading ? 'Saving...' : 'Admit Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <input className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-green/20 outline-none transition-all" {...props} />
    </div>
);

export default AddPatientModal;
