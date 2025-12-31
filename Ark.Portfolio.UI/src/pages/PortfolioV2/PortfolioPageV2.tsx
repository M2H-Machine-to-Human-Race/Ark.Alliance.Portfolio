/**
 * @fileoverview PortfolioPageV2 View Component
 * Polished portfolio page with project grid and detail modal.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeaderV2 } from '../../components/HeaderV2';
import { ProjectGrid } from '../../components/ProjectGrid';
import { ProjectDetailModal } from '../../components/ProjectDetailModal';
import { usePortfolioPageV2Model } from './PortfolioPageV2.model';
import '../../styles/design-system.css';
import './PortfolioPageV2.styles.css';

/**
 * PortfolioPageV2 Component
 * 
 * Polished portfolio page with:
 * - Header with navigation
 * - Page title and stats
 * - ProjectGrid with filtering
 * - ProjectDetailModal for details
 * - Admin controls
 * - Responsive layout
 */
export const PortfolioPageV2: React.FC = () => {
    const vm = usePortfolioPageV2Model();

    // Calculate stats
    const completedCount = vm.projects.filter(p => p.status === 'completed').length;
    const inProgressCount = vm.projects.filter(p => p.status === 'in_progress').length;
    const techCount = new Set(vm.projects.flatMap(p => p.technologies)).size;

    // Loading state
    if (vm.isLoading) {
        return (
            <div className="portfolio-page">
                <HeaderV2 />
                <div className="portfolio-loading">
                    <div className="portfolio-loading-spinner" />
                    <p className="portfolio-loading-text">Loading projects...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (vm.error) {
        return (
            <div className="portfolio-page">
                <HeaderV2 />
                <div className="portfolio-error">
                    <AlertCircle size={64} className="portfolio-error-icon" />
                    <h2 className="portfolio-error-title">Unable to Load Projects</h2>
                    <p className="portfolio-error-text">{vm.error}</p>
                    <button className="btn btn-primary" onClick={vm.refetch}>
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="portfolio-page">
            {/* Header */}
            <HeaderV2 />

            <div className="portfolio-container">
                {/* Page Header */}
                <header className="portfolio-header portfolio-animate-in">
                    <h1 className="portfolio-title">
                        My <span>Portfolio</span>
                    </h1>
                    <p className="portfolio-subtitle">
                        A collection of projects showcasing my skills in software development,
                        from web applications to complex systems
                    </p>

                    {/* Stats */}
                    <div className="portfolio-stats">
                        <div className="portfolio-stat">
                            <div className="portfolio-stat-value">{vm.projects.length}</div>
                            <div className="portfolio-stat-label">Total Projects</div>
                        </div>
                        <div className="portfolio-stat">
                            <div className="portfolio-stat-value">{completedCount}</div>
                            <div className="portfolio-stat-label">Completed</div>
                        </div>
                        <div className="portfolio-stat">
                            <div className="portfolio-stat-value">{inProgressCount}</div>
                            <div className="portfolio-stat-label">In Progress</div>
                        </div>
                        <div className="portfolio-stat">
                            <div className="portfolio-stat-value">{techCount}</div>
                            <div className="portfolio-stat-label">Technologies</div>
                        </div>
                    </div>
                </header>

                {/* Admin Bar */}
                {vm.isAdmin && (
                    <div className="portfolio-admin-bar portfolio-animate-in delay-1">
                        <Link to="/admin/projects" className="btn btn-primary">
                            <Plus size={16} />
                            Add Project
                        </Link>
                    </div>
                )}

                {/* Project Grid */}
                <div className="portfolio-animate-in delay-2">
                    <ProjectGrid
                        projects={vm.projects}
                        showAdmin={vm.isAdmin}
                        onProjectClick={vm.selectProject}
                        onEdit={vm.handleEdit}
                        onDelete={vm.handleDelete}
                    />
                </div>
            </div>

            {/* Project Detail Modal */}
            <ProjectDetailModal
                project={vm.selectedProject}
                isOpen={vm.isModalOpen}
                onClose={vm.closeModal}
                onEdit={vm.handleEdit}
                showAdmin={vm.isAdmin}
            />
        </div>
    );
};

export default PortfolioPageV2;
