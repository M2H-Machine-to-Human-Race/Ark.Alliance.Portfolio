import React from 'react';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useStyleManagerModel } from './StyleManager.model';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';
import './StyleManager.styles.css';

export const StyleManager: React.FC = () => {
    const {
        styles,
        isLoading,
        error,
        isEditing,
        handleActivate,
        handleDelete,
        setIsEditing,
        setCurrentStyle,
        currentStyle,
        handleSave
    } = useStyleManagerModel();

    return (
        <AdminLayout title="Style Manager">
            <div className="style-manager">
                <div className="sm-header">
                    <h2 className="sm-title">Theme Configurations</h2>
                    <button
                        className="sm-add-btn"
                        onClick={() => {
                            setCurrentStyle({});
                            setIsEditing(true);
                        }}
                    >
                        <Plus size={16} />
                        <span>Add Style</span>
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div>Loading styles...</div>
                ) : (
                    <div className="sm-grid">
                        {styles.map(style => (
                            <div key={style.id} className={`sm-card ${style.isActive ? 'active' : ''}`}>
                                <div className="sm-card-header">
                                    <span className="sm-card-title">{style.name}</span>
                                    {style.isActive && <span className="sm-card-badge">Active</span>}
                                </div>
                                <div className="sm-card-content">
                                    <p className="sm-config-info">
                                        Font: {style.headingFont?.family || 'Default'}
                                    </p>
                                    <div className="sm-color-preview">
                                        <div
                                            className="sm-color-swatch"
                                            style={{ backgroundColor: style.primaryColor }}
                                            title="Primary"
                                        />
                                        <div
                                            className="sm-color-swatch"
                                            style={{ backgroundColor: style.secondaryColor }}
                                            title="Secondary"
                                        />
                                        <div
                                            className="sm-color-swatch"
                                            style={{ backgroundColor: style.backgroundColor }}
                                            title="Background"
                                        />
                                    </div>
                                </div>
                                <div className="sm-card-actions">
                                    {!style.isActive && (
                                        <button
                                            className="pm-action-btn"
                                            onClick={() => handleActivate(style.id!)}
                                            title="Activate"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                    <button
                                        className="pm-action-btn"
                                        onClick={() => {
                                            setCurrentStyle(style);
                                            setIsEditing(true);
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="pm-action-btn delete"
                                        onClick={() => handleDelete(style.id!)}
                                        disabled={style.isActive}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {isEditing && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ maxWidth: '800px' }}>
                            <h3 className="text-xl font-bold mb-4">
                                {currentStyle.id ? 'Edit Style' : 'Create Style'}
                            </h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    // Ensure required fields are present
                                    if (!currentStyle.name) return;
                                    handleSave(currentStyle);
                                }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="form-group">
                                            <label className="form-label">Style Name</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={currentStyle.name || ''}
                                                onChange={(e) => setCurrentStyle({ ...currentStyle, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Primary Color</label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="color"
                                                    value={currentStyle.primaryColor || '#000000'}
                                                    onChange={(e) => setCurrentStyle({ ...currentStyle, primaryColor: e.target.value })}
                                                    className="h-10 w-20 p-1 rounded border"
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentStyle.primaryColor || ''}
                                                    onChange={(e) => setCurrentStyle({ ...currentStyle, primaryColor: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Secondary Color</label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="color"
                                                    value={currentStyle.secondaryColor || '#000000'}
                                                    onChange={(e) => setCurrentStyle({ ...currentStyle, secondaryColor: e.target.value })}
                                                    className="h-10 w-20 p-1 rounded border"
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentStyle.secondaryColor || ''}
                                                    onChange={(e) => setCurrentStyle({ ...currentStyle, secondaryColor: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Background Color</label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="color"
                                                    value={currentStyle.backgroundColor || '#ffffff'}
                                                    onChange={(e) => setCurrentStyle({ ...currentStyle, backgroundColor: e.target.value })}
                                                    className="h-10 w-20 p-1 rounded border"
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentStyle.backgroundColor || ''}
                                                    onChange={(e) => setCurrentStyle({ ...currentStyle, backgroundColor: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Text Color</label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="color"
                                                    value={currentStyle.textColor || '#000000'}
                                                    onChange={(e) => setCurrentStyle({ ...currentStyle, textColor: e.target.value })}
                                                    className="h-10 w-20 p-1 rounded border"
                                                />
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={currentStyle.textColor || ''}
                                                    onChange={(e) => setCurrentStyle({ ...currentStyle, textColor: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Live Preview */}
                                    <div className="bg-gray-50 p-4 rounded-lg border">
                                        <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Live Preview</h4>
                                        <div
                                            className="p-6 rounded-lg shadow-lg transition-colors duration-300"
                                            style={{
                                                backgroundColor: currentStyle.backgroundColor || '#ffffff',
                                                color: currentStyle.textColor || '#000000'
                                            }}
                                        >
                                            <h1
                                                className="text-2xl font-bold mb-2"
                                                style={{ color: currentStyle.primaryColor || '#000000' }}
                                            >
                                                Heading Text
                                            </h1>
                                            <p className="mb-4">
                                                This is how your body text will look. It should be readable against the background.
                                            </p>
                                            <button
                                                className="px-4 py-2 rounded font-medium"
                                                style={{
                                                    backgroundColor: currentStyle.secondaryColor || '#000000',
                                                    color: '#ffffff'
                                                }}
                                            >
                                                Button Example
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-save">
                                        Save Style
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout >
    );
};

