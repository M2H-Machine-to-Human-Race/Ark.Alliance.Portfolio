import React, { useState } from 'react';
import { Navigation } from '../generic/Navigation';
import { SkipLink } from '../accessibility';
import { Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Skip Link for Accessibility */}
            <SkipLink targetId="main-content" />

            <div className="fixed inset-0 bg-[url('/assets/grid.svg')] opacity-[0.02] pointer-events-none" aria-hidden="true" />
            <div className="fixed inset-0 bg-gradient-to-br from-blue-500/[0.02] to-emerald-500/[0.02] pointer-events-none" aria-hidden="true" />

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4">
                <span className="text-xl font-bold text-white">Ark.Portfolio</span>
                <button
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={mobileNavOpen}
                    aria-controls="mobile-navigation"
                >
                    {mobileNavOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                </button>
            </header>

            {/* Overlay for Mobile Nav */}
            {mobileNavOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileNavOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Navigation Sidebar */}
            <nav
                id="mobile-navigation"
                className={cn(
                    "fixed top-0 left-0 h-full z-50 transition-transform duration-300",
                    "lg:translate-x-0",
                    mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
                aria-label="Main navigation"
            >
                <Navigation onNavigate={() => setMobileNavOpen(false)} />
            </nav>

            {/* Main Content */}
            <main
                id="main-content"
                className="lg:ml-72 min-h-screen relative pt-16 lg:pt-0"
                tabIndex={-1}
            >
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

