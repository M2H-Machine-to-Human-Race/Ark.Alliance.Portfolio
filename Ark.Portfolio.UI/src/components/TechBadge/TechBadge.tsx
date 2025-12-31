import React from 'react';
import { cn } from '../../utils/cn';

interface TechBadgeProps {
    name: string;
    size?: 'sm' | 'md';
    active?: boolean;
}

export const TechBadge: React.FC<TechBadgeProps & { className?: string }> = ({ name, size = 'md', active = false, className }) => {
    return (
        <span className={cn(
            "font-mono font-bold rounded-lg border transition-all duration-300",
            size === 'sm' ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1",
            active
                ? "bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                : "bg-slate-800/50 text-slate-500 border-slate-700 hover:text-slate-300 hover:border-slate-600",
            className
        )}>
            {name}
        </span>
    );
};

