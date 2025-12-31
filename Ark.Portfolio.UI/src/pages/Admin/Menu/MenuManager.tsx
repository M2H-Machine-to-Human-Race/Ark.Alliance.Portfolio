import React from 'react';
import { MenuPositionEnum } from '@ark/portfolio-share';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useMenuManagerModel } from './MenuManager.model';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import './MenuManager.styles.css';

export const MenuManager: React.FC = () => {
    const {
        menuItems,
        isLoading,
        error,
        isEditing,
        currentItem,
        handleDelete,
        handleSave,
        setIsEditing,
        setCurrentItem
    } = useMenuManagerModel();

    return (
        <AdminLayout title="Menu Manager">
            <div className="menu-manager">
                <div className="mm-header">
                    <h2 className="mm-title">Navigation Menu</h2>
                    <button
                        className="mm-add-btn"
                        onClick={() => {
                            setCurrentItem({});
                            setIsEditing(true);
                        }}
                    >
                        <Plus size={16} />
                        <span>Add Item</span>
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div>Loading menu items...</div>
                ) : (
                    <div className="mm-list">
                        {menuItems.map(item => (
                            <div key={item.id} className="mm-item">
                                <div className="mm-item-content">
                                    <GripVertical size={20} color="#9ca3af" className="mm-drag-handle" />
                                    <div>
                                        <div className="mm-item-label">{item.label}</div>
                                        <div className="mm-item-path">{item.route}</div>
                                    </div>
                                    <span className="mm-item-position">{item.position}</span>
                                </div>
                                <div className="mm-item-actions">
                                    <button
                                        className="pm-action-btn"
                                        onClick={() => {
                                            setCurrentItem(item);
                                            setIsEditing(true);
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="pm-action-btn delete"
                                        onClick={() => handleDelete(item.id!)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {menuItems.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No menu items found. Add one to get started.
                            </div>
                        )}
                    </div>
                )}

                {isEditing && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3 className="text-xl font-bold mb-4">
                                {currentItem.id ? 'Edit Menu Item' : 'Add Menu Item'}
                            </h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSave(currentItem);
                                }}
                            >
                                <div className="form-group">
                                    <label className="form-label">Label</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={currentItem.label || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, label: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Route</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={currentItem.route || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, route: e.target.value })}
                                        placeholder="/example-page"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Icon Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={currentItem.icon || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, icon: e.target.value })}
                                        placeholder="home, settings, etc."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Position</label>
                                    <select
                                        className="form-input"
                                        value={currentItem.position || MenuPositionEnum.HEADER}
                                        onChange={(e) => setCurrentItem({ ...currentItem, position: e.target.value as MenuPositionEnum })}
                                    >
                                        {Object.values(MenuPositionEnum).map((pos) => (
                                            <option key={pos} value={pos}>
                                                {pos.charAt(0) + pos.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <input
                                            type="checkbox"
                                            checked={currentItem.isVisible ?? true}
                                            onChange={(e) => setCurrentItem({ ...currentItem, isVisible: e.target.checked })}
                                            className="mr-2"
                                        />
                                        Visible
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
                                        Save
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


