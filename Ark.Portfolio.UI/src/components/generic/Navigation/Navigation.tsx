import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';
import { NavigationProps } from './Navigation.types';
import { NavigationViewModel } from './Navigation.model';
import { cn } from '../../../utils/cn';
{/* No separate CSS file needed for this one as we use Tailwind classes mostly, but following pattern */ }
import './Navigation.styles.css';

export const Navigation: React.FC<NavigationProps> = ({ className, onNavigate }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // In a real MVVM with React, we might use a useViewModel hook that abstracts this instantiation
    const vm = new NavigationViewModel(location.pathname, navigate);

    return (
        <aside className={cn("navigation", className)}>
            {/* Brand / Profile */}
            <div className="navigation__brand mb-10">
                {vm.profile ? (
                    <div className="flex items-center gap-3 mb-2 animate-in fade-in">
                        {vm.profile.avatarUrl ? (
                            <img src={vm.profile.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-xl object-cover shadow-lg shadow-blue-900/20 border border-slate-800" />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-900/20">
                                {vm.profile.firstName[0]}{vm.profile.lastName[0]}
                            </div>
                        )}

                        <div className="overflow-hidden">
                            <h1 className="text-base font-bold text-slate-100 truncate">
                                {vm.profile.firstName} {vm.profile.lastName}
                            </h1>
                            <p className="text-[10px] text-blue-400 font-medium tracking-wide truncate uppercase">
                                {vm.profile.title.split('-')[0].trim()}
                            </p>
                        </div>
                    </div>
                ) : (
                    // Skeleton / Fallback
                    <div className="flex items-center gap-3 mb-2 animate-pulse">
                        <div className="w-12 h-12 rounded-xl bg-slate-800" />
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-slate-800 rounded" />
                            <div className="h-3 w-16 bg-slate-800 rounded" />
                        </div>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 space-y-2">
                {vm.items.map((item) => {
                    const active = vm.isActive(item.path);
                    return (
                        <button
                            key={item.path}
                            onClick={() => { vm.navigateTo(item.path); onNavigate?.(); }}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                active
                                    ? "text-white bg-slate-900"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                            )}
                        >
                            {active && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
                            )}
                            <item.icon size={18} className={cn(
                                "transition-colors",
                                active ? "text-blue-400" : "text-slate-600 group-hover:text-slate-400"
                            )} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Connection */}
            <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-900 mt-auto">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Connect</h3>
                <div className="flex gap-2">
                    <a href="https://github.com" target="_blank" className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"><Github size={16} /></a>
                    <a href="https://linkedin.com" target="_blank" className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"><Linkedin size={16} /></a>
                    <a href="mailto:contact@ark.com" className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"><Mail size={16} /></a>
                </div>
            </div>
        </aside>
    );
};

