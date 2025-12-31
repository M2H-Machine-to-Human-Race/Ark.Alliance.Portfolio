import React from 'react';
import { WidgetTypeEnum } from '@ark/portfolio-share';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useWidgetManagerModel } from './WidgetManager.model';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './WidgetManager.styles.css';

export const WidgetManager: React.FC = () => {
    const {
        widgets,
        isLoading,
        error,
        isEditing,
        currentWidget,
        handleDelete,
        handleSave,
        setIsEditing,
        setCurrentWidget
    } = useWidgetManagerModel();

    return (
        <AdminLayout title="Widgets">
            <div className="widget-manager">
                <div className="wm-header">
                    <h2 className="wm-title">Homepage Widgets</h2>
                    <button
                        className="wm-add-btn"
                        onClick={() => {
                            setCurrentWidget({});
                            setIsEditing(true);
                        }}
                    >
                        <Plus size={16} />
                        <span>Add Widget</span>
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div>Loading widgets...</div>
                ) : (
                    <div className="wm-list">
                        {widgets.map(widget => (
                            <div key={widget.id} className="wm-item">
                                <div className="wm-item-info">
                                    <span className="wm-item-title">{widget.title}</span>
                                    <span className="wm-item-type">{widget.type}</span>
                                </div>
                                <div className="wm-item-actions">
                                    <button
                                        className="pm-action-btn"
                                        onClick={() => {
                                            setCurrentWidget(widget);
                                            setIsEditing(true);
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="pm-action-btn delete"
                                        onClick={() => handleDelete(widget.id!)}
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
                        <div className="modal-content">
                            <h3 className="text-xl font-bold mb-4">
                                {currentWidget.id ? 'Edit Widget' : 'Add Widget'}
                            </h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSave(currentWidget);
                                }}
                            >
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={currentWidget.title || ''}
                                        onChange={(e) => setCurrentWidget({ ...currentWidget, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select
                                        className="form-input"
                                        value={currentWidget.type || WidgetTypeEnum.TEXT}
                                        onChange={(e) => setCurrentWidget({ ...currentWidget, type: e.target.value as WidgetTypeEnum })}
                                    >
                                        {Object.values(WidgetTypeEnum).map((type) => (
                                            <option key={type} value={type}>
                                                {type.charAt(0) + type.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Content (JSON/Text)</label>
                                    <textarea
                                        className="form-textarea"
                                        rows={5}
                                        value={typeof currentWidget.content === 'string' ? currentWidget.content : JSON.stringify(currentWidget.content, null, 2)}
                                        onChange={(e) => setCurrentWidget({ ...currentWidget, content: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        For complex widgets, enter valid JSON configuration.
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <input
                                            type="checkbox"
                                            checked={currentWidget.isActive ?? true}
                                            onChange={(e) => setCurrentWidget({ ...currentWidget, isActive: e.target.checked })}
                                            className="mr-2"
                                        />
                                        Active
                                    </label>
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
                                        Save Widget
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

