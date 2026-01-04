/**
 * @fileoverview AI Settings Admin Page
 * Standalone page for AI configuration management.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { Bot, Save, Sparkles, RefreshCw, AlertCircle, CheckCircle2, Settings, Zap, Brain, Cpu } from 'lucide-react';
import { AiSettingsDto, AiProviderEnum, AI_PROVIDER_CONFIG, PROVIDER_MODELS } from '@ark/portfolio-share';
import axios from 'axios';
import { authService } from '../../../services/auth.service';
import { API_CONFIG } from '../../../config/api.constants';
import './AiSettingsPage.styles.css';

const API_URL = API_CONFIG.ADMIN_BASE_URL;

// UI Helper for Icons - Mapping Enum to Icons
const PROVIDER_ICONS: Record<AiProviderEnum, React.ReactNode> = {
    [AiProviderEnum.OPENAI]: <Brain size={24} />,
    [AiProviderEnum.ANTHROPIC]: <Cpu size={24} />,
    [AiProviderEnum.GOOGLE]: <Sparkles size={24} />,
    [AiProviderEnum.CUSTOM]: <Settings size={24} />
};

export const AiSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<AiSettingsDto>({
        provider: AiProviderEnum.OPENAI,
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2048,
        isActive: true
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${authService.getToken()}` }
    });

    const fetchSettings = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/ai/settings`, getAuthHeaders());
            setSettings(response.data);
        } catch (err) {
            setError('Failed to load AI settings');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        try {
            await axios.put(`${API_URL}/ai/settings`, settings, getAuthHeaders());
            setSuccessMessage('AI settings saved successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError('Failed to save AI settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleTest = async () => {
        setTestResult(null);
        setIsSaving(true);
        try {
            const response = await axios.post(`${API_URL}/ai/test`, {}, getAuthHeaders());
            setTestResult(response.data);
        } catch (err) {
            setTestResult({ success: false, message: 'Connection test failed' });
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return (
            <AdminLayout title="AI Settings">
                <div className="ai-settings-loading">
                    <RefreshCw className="spin" size={24} />
                    <span>Loading AI configuration...</span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="AI Settings">
            <div className="ai-settings-page">
                {/* Status Messages */}
                {error && (
                    <div className="ai-alert ai-alert-error">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}
                {successMessage && (
                    <div className="ai-alert ai-alert-success">
                        <CheckCircle2 size={18} /> {successMessage}
                    </div>
                )}

                {/* Header with Toggle */}
                <div className="ai-settings-header">
                    <div className="ai-settings-title">
                        <Bot size={28} />
                        <div>
                            <h2>AI Configuration</h2>
                            <p>Configure AI providers for text improvement and skill organization</p>
                        </div>
                    </div>
                    <label className="ai-toggle">
                        <input
                            type="checkbox"
                            checked={settings.isActive}
                            onChange={e => setSettings({ ...settings, isActive: e.target.checked })}
                        />
                        <span className="ai-toggle-slider"></span>
                        <span className="ai-toggle-label">{settings.isActive ? 'AI Enabled' : 'AI Disabled'}</span>
                    </label>
                </div>

                {/* Provider Selection */}
                <section className="ai-section">
                    <h3><Zap size={18} /> Select Provider</h3>
                    <div className="ai-provider-grid">
                        {AI_PROVIDER_CONFIG.map(provider => (
                            <button
                                key={provider.id}
                                className={`ai-provider-card ${settings.provider === provider.id ? 'selected' : ''}`}
                                onClick={() => setSettings({
                                    ...settings,
                                    provider: provider.id,
                                    model: PROVIDER_MODELS[provider.id]?.[0] || ''
                                })}
                            >
                                <div className="ai-provider-icon">{PROVIDER_ICONS[provider.id]}</div>
                                <div className="ai-provider-info">
                                    <h4>{provider.name}</h4>
                                    <p>{provider.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Model & API Configuration */}
                <section className="ai-section">
                    <h3><Settings size={18} /> Configuration</h3>
                    <div className="ai-form-grid">
                        <div className="ai-form-group">
                            <label>Model</label>
                            {settings.provider === AiProviderEnum.CUSTOM ? (
                                <input
                                    type="text"
                                    value={settings.model}
                                    onChange={e => setSettings({ ...settings, model: e.target.value })}
                                    placeholder="Enter model name (e.g., llama-3.1-70b)"
                                />
                            ) : (
                                <select
                                    value={settings.model}
                                    onChange={e => setSettings({ ...settings, model: e.target.value })}
                                >
                                    {PROVIDER_MODELS[settings.provider]?.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {settings.provider === AiProviderEnum.CUSTOM && (
                            <div className="ai-form-group full-width">
                                <label>API URL</label>
                                <input
                                    type="url"
                                    value={settings.apiUrl || ''}
                                    onChange={e => setSettings({ ...settings, apiUrl: e.target.value })}
                                    placeholder="https://api.example.com/v1/chat/completions"
                                />
                            </div>
                        )}

                        <div className="ai-form-group full-width">
                            <label>
                                API Key
                                {settings.apiKeyMasked && (
                                    <span className="ai-key-hint">Current: {settings.apiKeyMasked}</span>
                                )}
                            </label>
                            <input
                                type="password"
                                value={settings.apiKey || ''}
                                onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                                placeholder="Enter new API key to update"
                            />
                        </div>

                        <div className="ai-form-group">
                            <label>Temperature: {settings.temperature}</label>
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={settings.temperature}
                                onChange={e => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                            />
                            <div className="ai-range-labels">
                                <span>Precise (0)</span>
                                <span>Creative (2)</span>
                            </div>
                        </div>

                        <div className="ai-form-group">
                            <label>Max Tokens</label>
                            <input
                                type="number"
                                min="256"
                                max="32768"
                                value={settings.maxTokens}
                                onChange={e => setSettings({ ...settings, maxTokens: parseInt(e.target.value) || 2048 })}
                            />
                        </div>
                    </div>
                </section>

                {/* Test Result */}
                {testResult && (
                    <div className={`ai-test-result ${testResult.success ? 'success' : 'error'}`}>
                        {testResult.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span>{testResult.message}</span>
                    </div>
                )}

                {/* Actions */}
                <div className="ai-settings-actions">
                    <button
                        className="ai-btn ai-btn-secondary"
                        onClick={handleTest}
                        disabled={isSaving}
                    >
                        <Sparkles size={16} />
                        {isSaving ? 'Testing...' : 'Test Connection'}
                    </button>
                    <button
                        className="ai-btn ai-btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>

                {/* Feature Info */}
                <section className="ai-features">
                    <h3>AI Features</h3>
                    <div className="ai-feature-grid">
                        <div className="ai-feature">
                            <Sparkles size={20} />
                            <div>
                                <h4>Text Improvement</h4>
                                <p>Enhance descriptions in Profile, Experience, and Education sections</p>
                            </div>
                        </div>
                        <div className="ai-feature">
                            <Brain size={20} />
                            <div>
                                <h4>Skill Organization</h4>
                                <p>Automatically categorize and group skills intelligently</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
};

export default AiSettingsPage;
