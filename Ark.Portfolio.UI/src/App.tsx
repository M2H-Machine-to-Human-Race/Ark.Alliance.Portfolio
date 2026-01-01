import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { HomePage, ArchitecturalHomePage } from './pages/Home'; // Legacy removed
import { HomePageV2 } from './pages/HomeV2';
import { ResumePageV2 } from './pages/ResumeV2';
// import { ProjectsPage } from './pages/Projects'; // Legacy removed
import { ProjectsPageV2 } from './pages/ProjectsV2';
// import { ProjectDetails } from './pages/ProjectDetails/ProjectDetails'; // Legacy removed
import { ProjectPresentation } from './pages/ProjectDetails/v2/ProjectPresentation';
// import { CVPage } from './pages/CV'; // Legacy removed
import { ArchitecturePage } from './pages/Architecture';
import { LoginPage } from './pages/Login';
import { ThemeProvider, useTheme } from './components/generic/ThemeContext';
import { AuthProvider } from './components/generic/AuthContext';
import { ProtectedRoute } from './components/generic/ProtectedRoute';
import './styles/architectural-theme.css';
import './styles/design-system.css';
import './styles/aloevera-theme.css';
import { DashboardPage } from './pages/Admin/Dashboard';
import { ProjectManager } from './pages/Admin/Projects';
import { ResumeManager } from './pages/Admin/Resume';
import { WidgetManager } from './pages/Admin/Widgets';
import { MenuManager } from './pages/Admin/Menu';
import { StyleManager } from './pages/Admin/Styles';
import { MediaManager } from './pages/Admin/Media';
import { CarouselManager } from './pages/Admin/Carousel';
import { AiSettingsPage } from './pages/Admin/AiSettings';

/**
 * Theme-aware home page component.
 * Renders HomePageV2 (polished) for 'architectural' theme, HomePage for 'default'.
 */
/**
 * Theme-aware home page component.
 * Renders HomePageV2 (polished) for all themes.
 */
const ThemedHomePage = () => {
    return <HomePageV2 />;
};

/**
 * Theme-aware resume page component.
 * Renders ResumePageV2 (polished) for 'architectural' theme, CVPage for 'default'.
 */
/**
 * Theme-aware resume page component.
 * Renders ResumePageV2 (polished) for all themes.
 */
const ThemedResumePage = () => {
    return <ResumePageV2 />;
};

/**
 * Theme-aware projects page component.
 * Renders ProjectsPageV2 (polished) for 'architectural' theme, ProjectsPage for 'default'.
 */
/**
 * Theme-aware projects page component.
 * Renders ProjectsPageV2 (polished) for all themes.
 */
const ThemedProjectsPage = () => {
    return <ProjectsPageV2 />;
};

/**
 * Theme-aware project details page component.
 * Renders ProjectPresentation (polished) for 'architectural' or 'aloevera' theme, ProjectDetails for 'default'.
 */
const ThemedProjectDetails = () => {
    return <ProjectPresentation />;
};

/**
 * Main application routes.
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ThemedHomePage />} />
            <Route path="/projects" element={<ThemedProjectsPage />} />
            <Route path="/projects/:id" element={<ThemedProjectDetails />} />
            {/* Resume (Primary) - uses polished ResumePageV2 for architectural theme */}
            <Route path="/resume" element={<ThemedResumePage />} />
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
                        <Route path="resume" element={<ResumeManager />} />
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


