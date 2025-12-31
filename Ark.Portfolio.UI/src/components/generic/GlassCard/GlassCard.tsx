import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "onDrag"> {
    children: React.ReactNode;
    variant?: 'default' | 'scanner' | 'hologram';
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, variant = 'default', ...props }, ref) => {
        const MotionDiv = motion.div as any;

        return (
            <MotionDiv
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "backdrop-blur-md border rounded-2xl p-6 transition-all duration-300",
                    "bg-slate-900/50 border-slate-800",
                    variant === 'default' && "hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-blue-900/10",
                    variant === 'scanner' && "border-blue-500/30 bg-blue-900/10 hover:border-blue-400/50",
                    variant === 'hologram' && "border-emerald-500/30 bg-emerald-900/10 hover:border-emerald-400/50",
                    className
                )}
                {...props}
            >
                {children}
            </MotionDiv>
        );
    }
);

GlassCard.displayName = "GlassCard";

