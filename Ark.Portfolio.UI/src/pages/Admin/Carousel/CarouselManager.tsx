import React from 'react';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useCarouselManagerModel } from './CarouselManager.model';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '../../../config/defaults';
import './CarouselManager.styles.css';

export const CarouselManager: React.FC = () => {
    const {
        items,
        isLoading,
        error,
        isEditing,
        setIsEditing,
        currentItem,
        setCurrentItem,
        handleDelete,
        handleSave,
        handleReorder
    } = useCarouselManagerModel();

    return (
        <AdminLayout title="Carousel Manager">
            <div className="carousel-manager">
                <div className="cm-header">
                    <h2 className="cm-title">Hero Carousel</h2>
                    <button
                        className="cm-add-btn"
                        onClick={() => {
                            setCurrentItem({});
                            setIsEditing(true);
                        }}
                    >
                        <Plus size={16} />
                        <span>Add Slide</span>
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div>Loading slides...</div>
                ) : (
                    <div className="cm-list">
                        {items.map((item, index) => (
                            <div key={item.id} className="cm-item">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="cm-item-preview"
                                    onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGES.noImage)}
                                />
                                <div className="cm-item-content">
                                    <div className="cm-item-title">{item.title}</div>
                                    <div className="cm-item-subtitle">{item.subtitle || 'No subtitle'}</div>
                                </div>
                                <div className="cm-item-actions">
                                    <button
                                        className="cm-action-btn"
                                        onClick={() => handleReorder('up', index)}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button
                                        className="cm-action-btn"
                                        onClick={() => handleReorder('down', index)}
                                        disabled={index === items.length - 1}
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <button
                                        className="cm-action-btn"
                                        onClick={() => {
                                            setCurrentItem(item);
                                            setIsEditing(true);
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="cm-action-btn delete"
                                        onClick={() => handleDelete(item.id!)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {items.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No slides found. Add one to get started.
                            </div>
                        )}
                    </div>
                )}

                {isEditing && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3 className="text-xl font-bold mb-4">
                                {currentItem.id ? 'Edit Slide' : 'Add Slide'}
                            </h3>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSave(currentItem);
                                }}
                            >
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={currentItem.title || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subtitle</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={currentItem.subtitle || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, subtitle: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={currentItem.imageUrl || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        rows={3}
                                        value={currentItem.description || ''}
                                        onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                    />
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

