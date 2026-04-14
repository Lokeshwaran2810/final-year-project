import React from 'react';
import { motion } from 'framer-motion';

const IVDropAnimation = ({ rate = 60, isRunning = true }) => {
    // rate is in gtt/min (drops per minute)
    // standard drop factor is 20 gtt/mL usually, but we just need visual speed.
    // 60 gtt/min = 1 drop per second.
    // Duration of one drop cycle = 60 / rate seconds.

    const duration = rate > 0 ? 60 / rate : 0;

    return (
        <div className="relative w-24 h-40 mx-auto flex flex-col items-center">
            {/* IV Bag / Chamber Top */}
            <div className="w-16 h-24 bg-slate-50 border-2 border-slate-200 rounded-lg relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-blue-50/50"></div>
                {/* Liquid level */}
                <div className="absolute bottom-0 w-full h-[80%] bg-blue-100 opacity-60"></div>

                {/* Drip nozzle */}
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-3 bg-slate-300 rounded-full"></div>
            </div>

            {/* Drip Chamber */}
            <div className="w-8 h-16 border-2 border-slate-200 border-t-0 rounded-b-xl relative mt-[-2px] bg-white/50 backdrop-blur-sm z-0 flex justify-center overflow-hidden">
                {/* The Droplet */}
                {isRunning && rate > 0 && (
                    <motion.div
                        className="w-3 h-4 bg-medical-blue rounded-full rounded-t-none"
                        initial={{ y: -10, opacity: 0, scale: 0.8 }}
                        animate={{
                            y: [0, 40],
                            opacity: [1, 0],
                            scale: [1, 0.5]
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 0.1
                        }}
                    />
                )}
            </div>

            {/* Tubing */}
            <div className="w-2 h-full bg-slate-100 border-x border-slate-200 opacity-60 flex-1 min-h-[20px]"></div>
        </div>
    );
};

export default IVDropAnimation;
