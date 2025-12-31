import React from 'react';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useDashboardPageModel } from './DashboardPage.model';
import './DashboardPage.styles.css';

export const DashboardPage: React.FC = () => {
    const { stats } = useDashboardPageModel();

    return (
        <AdminLayout title="Dashboard">
            <div className="dashboard-container">
                <div className="dashboard-stats-grid">
                    <div className="stat-card">
                        <h3 className="stat-label">Total Projects</h3>
                        <p className="stat-value">{stats.totalProjects}</p>
                    </div>

                    <div className="stat-card">
                        <h3 className="stat-label">Active Widgets</h3>
                        <p className="stat-value">{stats.activeWidgets}</p>
                    </div>

                    <div className="stat-card">
                        <h3 className="stat-label">CV Views</h3>
                        <p className="stat-value">{stats.cvViews}</p>
                    </div>
                </div>

                <div className="recent-activity-section">
                    <h2 className="section-title">Recent Activity</h2>
                    <p className="empty-state-text">No recent activity to show.</p>
                </div>
            </div>
        </AdminLayout>
    );
};

