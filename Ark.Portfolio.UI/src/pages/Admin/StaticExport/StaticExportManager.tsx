/**
 * @fileoverview Static Export Manager Component
 * Admin page for managing static site generation and downloads.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { useState, useEffect } from 'react';
import { Download, Package, FileText, Briefcase, Users, Code2, Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Panel } from '../../../components/generic/Panel';
import { API_CONFIG } from '../../../config/api.constants';
import axios from 'axios';
import '../shared-panel-styles.css';
import './StaticExportManager.styles.css';

interface ExportPreview {
    profileName: string;
    projectCount: number;
    experienceCount: number;
    skillCount: number;
    languageCount: number;
    hobbyCount: number;
    domainCount: number;
    theme: string;
    estimatedSize: string;
}

type ExportStatus = 'idle' | 'loading' | 'generating' | 'success' | 'error';

/**
 * Static Export Manager Component
 */
export const StaticExportManager: React.FC = () => {
    const [preview, setPreview] = useState<ExportPreview | null>(null);
    const [status, setStatus] = useState<ExportStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [lastExportTime, setLastExportTime] = useState<string | null>(null);

    useEffect(() => {
        fetchPreview();
    }, []);

    const fetchPreview = async () => {
        setStatus('loading');
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/export-static/preview`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPreview(response.data.data);
            setStatus('idle');
        } catch (err) {
            setError('Failed to load export preview');
            setStatus('error');
        }
    };

    const handleExport = async () => {
        setStatus('generating');
        setError(null);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/admin/export-static`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            // Create download link
            const blob = new Blob([response.data], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Get filename from header or use default
            const disposition = response.headers['content-disposition'];
            const filename = disposition
                ? disposition.split('filename="')[1]?.replace('"', '') || 'Portfolio_Static.zip'
                : `${preview?.profileName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Portfolio'}_Static.zip`;

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setStatus('success');
            setLastExportTime(new Date().toLocaleString());

            // Reset to idle after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error('Export failed:', err);
            setError('Failed to generate static export. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="static-export-manager">
            <header className="panel-header">
                <div className="panel-header-content">
                    <Package size={24} />
                    <div>
                        <h1>Static Site Export</h1>
                        <p>Generate a complete, standalone React portfolio website</p>
                    </div>
                </div>
            </header>

            <div className="static-export-content">
                {/* Preview Card */}
                <Panel variant="glass" className="export-preview-panel">
                    <h2>Export Preview</h2>
                    {status === 'loading' ? (
                        <div className="loading-state">
                            <Loader2 className="spin" size={24} />
                            <span>Loading preview...</span>
                        </div>
                    ) : preview ? (
                        <div className="preview-stats">
                            <div className="stat-item">
                                <Users size={20} />
                                <div>
                                    <span className="stat-value">{preview.profileName}</span>
                                    <span className="stat-label">Profile</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <Briefcase size={20} />
                                <div>
                                    <span className="stat-value">{preview.projectCount}</span>
                                    <span className="stat-label">Projects</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <FileText size={20} />
                                <div>
                                    <span className="stat-value">{preview.experienceCount}</span>
                                    <span className="stat-label">Experiences</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <Code2 size={20} />
                                <div>
                                    <span className="stat-value">{preview.skillCount}</span>
                                    <span className="stat-label">Skills</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <Globe size={20} />
                                <div>
                                    <span className="stat-value">{preview.languageCount}</span>
                                    <span className="stat-label">Languages</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="no-data">No preview data available</p>
                    )}
                </Panel>

                {/* Export Info */}
                <Panel variant="glass" className="export-info-panel">
                    <h2>What's Included</h2>
                    <ul className="feature-list">
                        <li>✅ Complete React + TypeScript project</li>
                        <li>✅ Vite build system</li>
                        <li>✅ All public pages (Home, Resume, Projects)</li>
                        <li>✅ Project detail pages</li>
                        <li>✅ Embedded portfolio data</li>
                        <li>✅ Responsive design styles</li>
                        <li>✅ Comprehensive README with deployment guide</li>
                        <li>❌ No admin functionality</li>
                        <li>❌ No login/authentication</li>
                    </ul>
                    <p className="info-note">
                        <strong>Estimated size:</strong> {preview?.estimatedSize || '~1-3MB'}
                    </p>
                </Panel>

                {/* Export Actions */}
                <Panel variant="glass" className="export-actions-panel">
                    <h2>Generate Export</h2>
                    <p>Click the button below to generate and download your static portfolio.</p>

                    {error && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="success-message">
                            <CheckCircle size={16} />
                            <span>Export downloaded successfully!</span>
                        </div>
                    )}

                    <button
                        className="export-button"
                        onClick={handleExport}
                        disabled={status === 'generating' || status === 'loading'}
                    >
                        {status === 'generating' ? (
                            <>
                                <Loader2 className="spin" size={20} />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download size={20} />
                                Download Static Site
                            </>
                        )}
                    </button>

                    {lastExportTime && (
                        <p className="last-export">Last export: {lastExportTime}</p>
                    )}
                </Panel>

                {/* Deployment Guide */}
                <Panel variant="glass" className="deployment-guide-panel">
                    <h2>Quick Deployment</h2>
                    <div className="deployment-options">
                        <div className="deployment-option">
                            <h4>🚀 Netlify</h4>
                            <p>Drag & drop to netlify.com/drop</p>
                        </div>
                        <div className="deployment-option">
                            <h4>▲ Vercel</h4>
                            <code>npx vercel deploy --prod</code>
                        </div>
                        <div className="deployment-option">
                            <h4>📦 GitHub Pages</h4>
                            <p>Push to repo → Enable Pages</p>
                        </div>
                        <div className="deployment-option">
                            <h4>☁️ Cloudflare</h4>
                            <p>Connect repo → Auto deploy</p>
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default StaticExportManager;
