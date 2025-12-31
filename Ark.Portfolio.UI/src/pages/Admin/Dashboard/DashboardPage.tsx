import React, { useState } from 'react';
import { Download, Package, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useDashboardPageModel } from './DashboardPage.model';
import { API_CONFIG } from '../../../config/api.constants';
import { authService } from '../../../services/auth.service';
import './DashboardPage.styles.css';

export const DashboardPage: React.FC = () => {
    const { stats } = useDashboardPageModel();
    const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [exportMessage, setExportMessage] = useState('');

    const handleExportStatic = async () => {
        try {
            setExportStatus('loading');
            setExportMessage('Generating static website package...');

            const token = authService.getToken();
            const response = await fetch(`${API_CONFIG.ADMIN_BASE_URL}/export-static`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Get the blob and create download
            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
            const filename = filenameMatch ? filenameMatch[1] : 'Portfolio_Static.zip';

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setExportStatus('success');
            setExportMessage('Static website exported successfully!');

            // Reset after 5 seconds
            setTimeout(() => {
                setExportStatus('idle');
                setExportMessage('');
            }, 5000);
        } catch (error) {
            console.error('Export error:', error);
            setExportStatus('error');
            setExportMessage('Failed to export. Please try again.');

            setTimeout(() => {
                setExportStatus('idle');
                setExportMessage('');
            }, 5000);
        }
    };

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

                {/* Static Export Section */}
                <div className="export-section">
                    <div className="export-header">
                        <Package size={24} />
                        <div>
                            <h2 className="section-title">Export Static Website</h2>
                            <p className="export-description">
                                Generate a deployable static website with all your portfolio data embedded.
                                No backend required - deploy anywhere!
                            </p>
                        </div>
                    </div>

                    <div className="export-actions">
                        <button
                            className={`export-btn ${exportStatus}`}
                            onClick={handleExportStatic}
                            disabled={exportStatus === 'loading'}
                        >
                            {exportStatus === 'idle' && (
                                <>
                                    <Download size={18} />
                                    Download Static Site (ZIP)
                                </>
                            )}
                            {exportStatus === 'loading' && (
                                <>
                                    <Loader size={18} className="spin" />
                                    Generating...
                                </>
                            )}
                            {exportStatus === 'success' && (
                                <>
                                    <CheckCircle size={18} />
                                    Downloaded!
                                </>
                            )}
                            {exportStatus === 'error' && (
                                <>
                                    <AlertCircle size={18} />
                                    Failed - Retry
                                </>
                            )}
                        </button>

                        {exportMessage && (
                            <p className={`export-message ${exportStatus}`}>{exportMessage}</p>
                        )}
                    </div>

                    <div className="export-info">
                        <h4>What's included:</h4>
                        <ul>
                            <li>✓ Home page with carousel</li>
                            <li>✓ Resume/CV with experience timeline</li>
                            <li>✓ All projects ({stats.totalProjects})</li>
                            <li>✓ Current theme &amp; styles</li>
                            <li>✓ All uploaded media/images</li>
                            <li>✓ README with deployment instructions</li>
                        </ul>
                        <p className="export-note">
                            <strong>Note:</strong> Admin features and login are excluded from the export.
                        </p>
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

