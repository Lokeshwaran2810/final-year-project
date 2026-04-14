import React from 'react';
import { cn } from '../lib/utils';
import { CheckCircle2, AlertTriangle, AlertOctagon, BatteryWarning } from 'lucide-react';

const icons = {
    Normal: CheckCircle2,
    Warning: BatteryWarning, // Using battery warning as generic warning for now
    Critical: AlertOctagon,
    Completed: CheckCircle2,
};

const styles = {
    Normal: "bg-medical-green/10 text-medical-green border-medical-green/20",
    Warning: "bg-medical-yellow/10 text-medical-yellow border-medical-yellow/20",
    Critical: "bg-medical-red/10 text-medical-red border-medical-red/20 animate-pulse",
    Completed: "bg-slate-100 text-slate-500 border-slate-200",
};

const StatusBadge = ({ status, className }) => {
    const Icon = icons[status] || icons.Normal;

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium w-fit",
            styles[status] || styles.Normal,
            className
        )}>
            <Icon size={14} />
            <span>{status === 'Critical' ? 'Attention Needed' : status}</span>
        </div>
    );
};

export default StatusBadge;
