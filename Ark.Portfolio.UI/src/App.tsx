/**
 * @fileoverview Main Application Component
 * Root component with routing, theme provider, and toast notifications.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePageV2 } from './pages/HomeV2';
import { ResumePageV2 } from './pages/ResumeV2';
import { ProjectsPageV2 } from './pages/ProjectsV2';
import { ProjectPresentation } from './pages/ProjectDetails/v2/ProjectPresentation';
import { ArchitecturePage } from './pages/Architecture';
import { LoginPage } from './pages/Login';
import { LoadingPage } from './pages/Loading';
import { ThemeProvider } from './components/generic/ThemeContext';
import { AuthProvider } from './components/generic/AuthContext';
import { TechnologyProvider } from './contexts/TechnologyContext';
import { ProtectedRoute } from './components/generic/ProtectedRoute';
import './styles/architectural-theme.css';
import './styles/design-system.css';
import './styles/aloevera-theme.css';
import { DashboardPage } from './pages/Admin/Dashboard';
import { ProjectManager } from './pages/Admin/Projects';
import { ProjectEditPage } from './pages/Admin/Projects/ProjectEditPage';
import { ResumeManager } from './pages/Admin/Resume';
import { WidgetManager } from './pages/Admin/Widgets';
import { MenuManager } from './pages/Admin/Menu';
import { StyleManager } from './pages/Admin/Styles';
import { MediaManager } from './pages/Admin/Media';
import { CarouselManager } from './pages/Admin/Carousel';
import { AiSettingsPage } from './pages/Admin/AiSettings';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/generic/Toast';

/**
 * Main application routes.
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePageV2 />} />
            <Route path="/projects" element={<ProjectsPageV2 />} />
            <Route path="/projects/:id" element={<ProjectPresentation />} />
            <Route path="/resume" element={<ResumePageV2 />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
                <ProtectedRoute>
                    <Routes>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="projects" element={<ProjectManager />} />
                        <Route path="projects/new" element={<ProjectEditPage />} />
                        <Route path="projects/edit/:id" element={<ProjectEditPage />} />
                        <Route path="resume" element={<ResumeManager />} />
                        <Route path="widgets" element={<WidgetManager />} />
                        <Route path="menu" element={<MenuManager />} />
                        <Route path="styles" element={<StyleManager />} />
                        <Route path="media" element={<MediaManager />} />
                        <Route path="carousel" element={<CarouselManager />} />
                        <Route path="ai-settings" element={<AiSettingsPage />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

/**
 * Main App component with theme provider.
 * Shows loading page at startup until all data is loaded.
 */
function App() {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    // Show loading page during startup
    if (isLoading) {
        return <LoadingPage onComplete={handleLoadingComplete} />;
    }

    return (
        <AuthProvider>
            <ThemeProvider>
                <TechnologyProvider>
                    <ToastProvider>
                        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                            <AppRoutes />
                            <ToastContainer />
                        </BrowserRouter>
                    </ToastProvider>
                </TechnologyProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
