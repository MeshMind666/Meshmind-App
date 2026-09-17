"use client";

import React from "react";

interface VoiceWaveformProps {
  isListening: boolean;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isListening }) => {
  return (
    <div className="flex items-center justify-center space-x-1.5 h-12">
      {[40, 70, 25, 90, 50, 80, 30, 60, 100, 45, 75, 35].map((height, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${
            isListening
              ? "bg-gradient-to-t from-emerald-500 to-teal-300 animate-pulse"
              : "bg-slate-700 h-2"
          }`}
          style={{
            height: isListening ? `${height}%` : "8px",
            animationDelay: `${(i * 0.1).toFixed(1)}s`,
          }}
        />
      ))}
    </div>
  );
};
