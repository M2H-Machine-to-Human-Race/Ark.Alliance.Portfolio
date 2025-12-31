import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, ArchitecturalHomePage } from './pages/Home';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails/ProjectDetails';
import { CVPage } from './pages/CV';  // Component name kept for now
import { ArchitecturePage } from './pages/Architecture';
import { LoginPage } from './pages/Login';
import { ThemeProvider, useTheme } from './components/generic/ThemeContext';
import { AuthProvider } from './components/generic/AuthContext';
import { ProtectedRoute } from './components/generic/ProtectedRoute';
import './styles/architectural-theme.css';
import { DashboardPage } from './pages/Admin/Dashboard';
import { ProjectManager } from './pages/Admin/Projects';
import { CvManager } from './pages/Admin/CV';  // Component name kept for now
import { WidgetManager } from './pages/Admin/Widgets';
import { MenuManager } from './pages/Admin/Menu';
import { StyleManager } from './pages/Admin/Styles';
import { MediaManager } from './pages/Admin/Media';
import { CarouselManager } from './pages/Admin/Carousel';
import { AiSettingsPage } from './pages/Admin/AiSettings';

/**
 * Theme-aware home page component.
 * Renders ArchitecturalHomePage for 'architectural' theme, HomePage for 'default'.
 */
const ThemedHomePage = () => {
    const { theme } = useTheme();
    return theme === 'architectural' ? <ArchitecturalHomePage /> : <HomePage />;
};

/**
 * Main application routes.
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ThemedHomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            {/* Resume (Primary) */}
            <Route path="/resume" element={<CVPage />} />
            {/* CV (Legacy redirect) */}
            <Route path="/cv" element={<Navigate to="/resume" replace />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/login" element={<LoginPage />} />



            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
                <ProtectedRoute>
                    <Routes>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="projects" element={<ProjectManager />} />
                        {/* Resume (Primary) */}
                        <Route path="resume" element={<CvManager />} />
                        {/* CV (Legacy redirect) */}
                        <Route path="cv" element={<Navigate to="/admin/resume" replace />} />
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
 */
function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;


