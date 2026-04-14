import React from 'react';
import { cn } from '../lib/utils';

const Card = ({ children, className, title, action }) => {
    return (
        <div className={cn("bg-white rounded-2xl border border-slate-100 shadow-sm p-5", className)}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="font-semibold text-slate-700">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
