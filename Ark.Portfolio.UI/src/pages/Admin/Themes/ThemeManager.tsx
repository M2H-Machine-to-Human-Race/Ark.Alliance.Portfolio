/**
 * @fileoverview Theme Manager Page
 * MVVM-compliant admin page for managing visual themes.
 * Uses existing AdminLayout and shared-panel-styles for consistency.
 * 
 * @module pages/Admin/Themes
 * @author Armand Richelet-Kleinberg
 */

import React, { useState } from 'react';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useThemeManagerModel, AdminTheme, ThemeFormData } from './ThemeManager.model';
import { Plus, Edit2, Trash2, Check, Star, Palette, AlertCircle, X } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import '../shared-panel-styles.css';
import './ThemeManager.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface ThemeCardProps {
    theme: AdminTheme;
    onEdit: (theme: AdminTheme) => void;
    onDelete: (id: number) => void;
    onSetDefault: (id: number) => void;
}

/**
 * Theme Card - Displays a single theme with actions
 */
const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onEdit, onDelete, onSetDefault }) => (
    <div className={`tm-card ${theme.isDefault ? 'default' : ''}`}>
        <div
            className="tm-card-preview"
            style={{ backgroundColor: theme.previewColor || '#00d4ff' }}
        >
            <span className="tm-card-icon">{theme.icon || '◆'}</span>
        </div>
        <div className="tm-card-content">
            <div className="tm-card-header">
                <h3 className="tm-card-title">{theme.name}</h3>
                {theme.isDefault && (
                    <span className="tm-badge default">
                        <Star size={12} /> Default
                    </span>
                )}
            </div>
            <p className="tm-card-desc">{theme.description || 'No description'}</p>
            <p className="tm-card-slug">Slug: {theme.slug}</p>
        </div>
        <div className="tm-card-actions">
            {!theme.isDefault && (
                <button
                    className="tm-btn secondary"
                    onClick={() => onSetDefault(theme.id)}
                    title="Set as default"
                >
                    <Star size={14} />
                </button>
            )}
            <button
                className="tm-btn primary"
                onClick={() => onEdit(theme)}
                title="Edit theme"
            >
                <Edit2 size={14} />
            </button>
            <button
                className="tm-btn danger"
                onClick={() => onDelete(theme.id)}
                disabled={theme.isDefault}
                title={theme.isDefault ? 'Cannot delete default theme' : 'Delete theme'}
            >
                <Trash2 size={14} />
            </button>
        </div>
    </div>
);

interface ThemeEditorModalProps {
    theme: AdminTheme | null;
    isOpen: boolean;
    isSaving: boolean;
    onSave: (data: ThemeFormData) => void;
    onClose: () => void;
}

/**
 * Theme Editor Modal - Add/Edit theme form
 */
const ThemeEditorModal: React.FC<ThemeEditorModalProps> = ({
    theme,
    isOpen,
    isSaving,
    onSave,
    onClose
}) => {
    const [formData, setFormData] = useState<ThemeFormData>({
        name: theme?.name || '',
        slug: theme?.slug || '',
        description: theme?.description || '',
        cssContent: theme?.cssContent || '',
        previewColor: theme?.previewColor || '#00d4ff',
        icon: theme?.icon || '◆',
        isActive: theme?.isActive ?? true
    });

    React.useEffect(() => {
        if (theme) {
            setFormData({
                name: theme.name,
                slug: theme.slug,
                description: theme.description || '',
                cssContent: theme.cssContent,
                previewColor: theme.previewColor || '#00d4ff',
                icon: theme.icon || '◆',
                isActive: theme.isActive
            });
        } else {
            setFormData({
                name: '',
                slug: '',
                description: '',
                cssContent: '',
                previewColor: '#00d4ff',
                icon: '◆',
                isActive: true
            });
        }
    }, [theme]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    if (!isOpen) return null;

    return (
        <div className="tm-modal-overlay" onClick={onClose}>
            <div className="tm-modal" onClick={e => e.stopPropagation()}>
                <div className="tm-modal-header">
                    <h2>{theme ? 'Edit Theme' : 'Create New Theme'}</h2>
                    <button className="tm-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="tm-modal-form">
                    <div className="tm-form-row">
                        <div className="tm-form-group">
                            <label className="tm-form-label">Name *</label>
                            <input
                                type="text"
                                className="tm-form-input"
                                value={formData.name}
                                onChange={e => {
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                        slug: formData.slug || generateSlug(e.target.value)
                                    });
                                }}
                                required
                            />
                        </div>
                        <div className="tm-form-group">
                            <label className="tm-form-label">Slug *</label>
                            <input
                                type="text"
                                className="tm-form-input"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                pattern="[a-z0-9-]+"
                                required
                            />
                        </div>
                    </div>
                    <div className="tm-form-group">
                        <label className="tm-form-label">Description</label>
                        <input
                            type="text"
                            className="tm-form-input"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="tm-form-row">
                        <div className="tm-form-group">
                            <label className="tm-form-label">Preview Color</label>
                            <div className="tm-color-input">
                                <input
                                    type="color"
                                    value={formData.previewColor}
                                    onChange={e => setFormData({ ...formData, previewColor: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="tm-form-input"
                                    value={formData.previewColor}
                                    onChange={e => setFormData({ ...formData, previewColor: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="tm-form-group">
                            <label className="tm-form-label">Icon</label>
                            <input
                                type="text"
                                className="tm-form-input"
                                value={formData.icon}
                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                maxLength={10}
                            />
                        </div>
                    </div>
                    <div className="tm-form-group">
                        <label className="tm-form-label">CSS Content *</label>
                        <textarea
                            className="tm-form-textarea"
                            value={formData.cssContent}
                            onChange={e => setFormData({ ...formData, cssContent: e.target.value })}
                            rows={10}
                            required
                            placeholder=":root { --neon-primary: #00d4ff; ... }"
                        />
                    </div>
                    <div className="tm-modal-actions">
                        <button type="button" className="tm-btn secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="tm-btn primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : (theme ? 'Update Theme' : 'Create Theme')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme Manager Page
 * Admin interface for managing visual themes.
 */
export const ThemeManager: React.FC = () => {
    const vm = useThemeManagerModel();
    const { showToast } = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const handleEdit = (theme: AdminTheme) => {
        vm.setSelectedTheme(theme);
        vm.setIsEditing(true);
    };

    const handleCreate = () => {
        vm.setSelectedTheme(null);
        vm.setIsEditing(true);
    };

    const handleSave = async (data: ThemeFormData) => {
        const success = vm.selectedTheme
            ? await vm.updateTheme(vm.selectedTheme.id, data)
            : await vm.createTheme(data);

        if (success) {
            showToast(vm.selectedTheme ? 'Theme updated successfully' : 'Theme created successfully', 'success');
        } else {
            showToast(vm.error || 'Failed to save theme', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (deleteConfirm !== id) {
            setDeleteConfirm(id);
            return;
        }

        const success = await vm.deleteTheme(id);
        if (success) {
            showToast('Theme deleted successfully', 'success');
        } else {
            showToast(vm.error || 'Cannot delete default theme', 'error');
        }
        setDeleteConfirm(null);
    };

    const handleSetDefault = async (id: number) => {
        const success = await vm.setDefaultTheme(id);
        if (success) {
            showToast('Default theme updated', 'success');
        } else {
            showToast(vm.error || 'Failed to set default theme', 'error');
        }
    };

    return (
        <AdminLayout title="Theme Management">
            <div className="theme-manager">
                {/* Header Section */}
                <div className="tm-header">
                    <div className="tm-header-info">
                        <Palette size={24} />
                        <div>
                            <h2 className="tm-title">Visual Themes</h2>
                            <p className="tm-subtitle">Manage color schemes and visual styles</p>
                        </div>
                    </div>
                    <button className="tm-btn primary" onClick={handleCreate}>
                        <Plus size={16} />
                        <span>Add Theme</span>
                    </button>
                </div>

                {/* Error Display */}
                {vm.error && (
                    <div className="tm-error">
                        <AlertCircle size={16} />
                        <span>{vm.error}</span>
                        <button onClick={vm.clearError}><X size={14} /></button>
                    </div>
                )}

                {/* Loading State */}
                {vm.isLoading ? (
                    <div className="tm-loading">Loading themes...</div>
                ) : (
                    /* Theme Grid */
                    <div className="tm-grid">
                        {vm.themes.length === 0 ? (
                            <div className="tm-empty">
                                <Palette size={48} />
                                <p>No themes found. Create your first theme!</p>
                            </div>
                        ) : (
                            vm.themes.map(theme => (
                                <ThemeCard
                                    key={theme.id}
                                    theme={theme}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onSetDefault={handleSetDefault}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Delete Confirmation */}
                {deleteConfirm !== null && (
                    <div className="tm-confirm-toast">
                        Click delete again to confirm
                        <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
                    </div>
                )}

                {/* Editor Modal */}
                <ThemeEditorModal
                    theme={vm.selectedTheme}
                    isOpen={vm.isEditing}
                    isSaving={vm.isSaving}
                    onSave={handleSave}
                    onClose={() => {
                        vm.setIsEditing(false);
                        vm.setSelectedTheme(null);
                    }}
                />
            </div>
        </AdminLayout>
    );
};

export default ThemeManager;
