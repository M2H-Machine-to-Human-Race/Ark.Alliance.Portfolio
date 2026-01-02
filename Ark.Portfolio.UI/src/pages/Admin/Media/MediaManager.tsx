/**
 * @fileoverview Media Manager Page
 * Comprehensive media library with upload, search, filtering, and previews.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React, { useState } from 'react';
import { MediaTypeEnum } from '@ark/portfolio-share';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { TabControl, TabItem } from '../../../components/generic/TabControl';
import { useMediaManagerModel, MediaTab, UploadFormData } from './MediaManager.model';
import {
    Upload, Trash2, Copy, Check, Search, Grid, List, X,
    Image as ImageIcon, Video, Music, FileText, FileJson,
    FileSpreadsheet, FileType, File, Edit, ExternalLink, Tag, Save
} from 'lucide-react';
import './MediaManager.styles.css';

// Type icons mapping
const TYPE_ICONS: Record<string, React.ReactNode> = {
    image: <ImageIcon size={20} />,
    video: <Video size={20} />,
    audio: <Music size={20} />,
    pdf: <FileText size={20} />,
    word: <FileType size={20} />,
    excel: <FileSpreadsheet size={20} />,
    markdown: <FileText size={20} />,
    json: <FileJson size={20} />,
    other: <File size={20} />
};

// Tab configuration with icons
const MEDIA_TABS: TabItem[] = [
    { id: 'all', label: 'All', icon: 'Grid3X3' },
    { id: 'image', label: 'Images', icon: 'Image' },
    { id: 'video', label: 'Videos', icon: 'Video' },
    { id: 'audio', label: 'Audio', icon: 'Music' },
    { id: 'pdf', label: 'PDF', icon: 'FileText' },
    { id: 'word', label: 'Word', icon: 'FileType' },
    { id: 'excel', label: 'Excel', icon: 'Table' },
    { id: 'markdown', label: 'Markdown', icon: 'FileCode' },
    { id: 'json', label: 'JSON', icon: 'Braces' }
];

export const MediaManager: React.FC = () => {
    const vm = useMediaManagerModel();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopyUrl = (id: string, url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCopyKey = (key: string) => {
        navigator.clipboard.writeText(key);
    };

    return (
        <AdminLayout title="Media Manager">
            <div className="media-manager">
                {/* Messages */}
                {vm.error && <div className="mm-error">{vm.error}</div>}
                {vm.success && <div className="mm-success">{vm.success}</div>}

                {/* Header */}
                <div className="mm-header">
                    <div className="mm-header-left">
                        <h2>Media Library</h2>
                        <span className="mm-count">{vm.totalCount} files</span>
                    </div>
                    <div className="mm-header-right">
                        <div className="mm-view-toggle">
                            <button
                                className={vm.viewMode === 'grid' ? 'active' : ''}
                                onClick={() => vm.setViewMode('grid')}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                className={vm.viewMode === 'list' ? 'active' : ''}
                                onClick={() => vm.setViewMode('list')}
                            >
                                <List size={18} />
                            </button>
                        </div>
                        <button className="mm-upload-btn" onClick={vm.openUploadModal}>
                            <Upload size={16} /> Upload Media
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mm-filters">
                    <TabControl
                        tabs={MEDIA_TABS}
                        activeTab={vm.activeTab}
                        onTabChange={(tabId) => vm.setActiveTab(tabId as MediaTab)}
                        variant="default"
                        ariaLabel="Filter by media type"
                    />
                    <div className="mm-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, key, or description..."
                            value={vm.searchQuery}
                            onChange={e => vm.setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content */}
                {vm.isLoading ? (
                    <div className="mm-loading">Loading media...</div>
                ) : vm.media.length === 0 ? (
                    <div className="mm-empty">
                        <ImageIcon size={48} />
                        <p>No media found</p>
                        <button onClick={vm.openUploadModal}>Upload your first file</button>
                    </div>
                ) : (
                    <div className={`mm-content ${vm.viewMode}`}>
                        {vm.media.map(item => (
                            <MediaCard
                                key={item.id}
                                item={item}
                                viewMode={vm.viewMode}
                                onEdit={() => vm.openEditModal(item)}
                                onDelete={() => vm.deleteMedia(item.id!)}
                                onCopyUrl={() => handleCopyUrl(item.id!, item.url || '')}
                                onCopyKey={() => item.key && handleCopyKey(item.key)}
                                isCopied={copiedId === item.id}
                            />
                        ))}
                    </div>
                )}

                {/* Upload Modal */}
                {vm.isUploadModalOpen && (
                    <UploadModal
                        onClose={vm.closeUploadModal}
                        onUpload={vm.uploadFile}
                        onCreateFromUrl={vm.createFromUrl}
                        uploading={vm.uploading}
                        availableTags={vm.availableTags}
                    />
                )}

                {/* Edit Modal */}
                {vm.isEditModalOpen && vm.editingItem && (
                    <EditModal
                        item={vm.editingItem}
                        onClose={vm.closeEditModal}
                        onSave={(data) => vm.updateMedia(vm.editingItem!.id!, data)}
                        availableTags={vm.availableTags}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

// ============================================
// Media Card Component
// ============================================

interface MediaCardProps {
    item: any;
    viewMode: 'grid' | 'list';
    onEdit: () => void;
    onDelete: () => void;
    onCopyUrl: () => void;
    onCopyKey: () => void;
    isCopied: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({
    item, viewMode, onEdit, onDelete, onCopyUrl, onCopyKey, isCopied
}) => {
    const isImage = item.type === 'image';
    const isVideo = item.type === 'video';
    const isAudio = item.type === 'audio';

    const renderPreview = () => {
        if (isImage) {
            return <img src={item.url} alt={item.altText || item.name} />;
        }
        if (isVideo) {
            return <video src={item.url} />;
        }
        return (
            <div className="mm-file-icon">
                {TYPE_ICONS[item.type] || TYPE_ICONS.other}
            </div>
        );
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (viewMode === 'list') {
        return (
            <div className="mm-list-item">
                <div className="mm-list-preview">{renderPreview()}</div>
                <div className="mm-list-info">
                    <div className="mm-list-name">{item.name}</div>
                    {item.key && <div className="mm-list-key"><Tag size={12} /> {item.key}</div>}
                </div>
                <div className="mm-list-type">{item.type}</div>
                <div className="mm-list-size">{formatSize(item.fileSize)}</div>
                <div className="mm-list-actions">
                    <button onClick={onCopyUrl} title="Copy URL">
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    {item.key && <button onClick={onCopyKey} title="Copy Key"><Tag size={16} /></button>}
                    <button onClick={onEdit} title="Edit"><Edit size={16} /></button>
                    <button onClick={onDelete} title="Delete" className="danger"><Trash2 size={16} /></button>
                </div>
            </div>
        );
    }

    return (
        <div className="mm-card">
            <div className="mm-card-preview">{renderPreview()}</div>
            <div className="mm-card-info">
                <div className="mm-card-name">{item.name}</div>
                {item.key && <div className="mm-card-key"><Tag size={12} /> {item.key}</div>}
                <div className="mm-card-meta">
                    <span>{item.type}</span>
                    <span>{formatSize(item.fileSize)}</span>
                </div>
            </div>
            <div className="mm-card-overlay">
                <button onClick={onCopyUrl} title={isCopied ? 'Copied!' : 'Copy URL'}>
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <button onClick={onEdit} title="Edit"><Edit size={18} /></button>
                <button onClick={onDelete} title="Delete" className="danger"><Trash2 size={18} /></button>
            </div>
        </div>
    );
};

// ============================================
// Upload Modal
// ============================================

interface UploadModalProps {
    onClose: () => void;
    onUpload: (file: File, data: UploadFormData) => Promise<void>;
    onCreateFromUrl: (url: string, type: MediaTypeEnum, data: UploadFormData) => Promise<void>;
    uploading: boolean;
    availableTags: string[];
}

const UploadModal: React.FC<UploadModalProps> = ({
    onClose, onUpload, onCreateFromUrl, uploading, availableTags
}) => {
    const [mode, setMode] = useState<'file' | 'url'>('file');
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState('');
    const [urlType, setUrlType] = useState<MediaTypeEnum>(MediaTypeEnum.IMAGE);
    const [formData, setFormData] = useState<UploadFormData>({
        name: '',
        key: '',
        altText: '',
        description: '',
        tags: [],
        isPublic: true
    });
    const [tagInput, setTagInput] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            if (!formData.name) {
                setFormData({ ...formData, name: f.name });
            }
        }
    };

    const handleAddTag = () => {
        if (tagInput && !formData.tags.includes(tagInput)) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };

    const handleSubmit = async () => {
        if (mode === 'file' && file) {
            await onUpload(file, formData);
        } else if (mode === 'url' && url) {
            await onCreateFromUrl(url, urlType, formData);
        }
    };

    return (
        <div className="mm-modal-overlay" onClick={onClose}>
            <div className="mm-modal" onClick={e => e.stopPropagation()}>
                <div className="mm-modal-header">
                    <h3>Upload Media</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <div className="mm-modal-tabs">
                    <button
                        className={mode === 'file' ? 'active' : ''}
                        onClick={() => setMode('file')}
                    >
                        <Upload size={16} /> Upload File
                    </button>
                    <button
                        className={mode === 'url' ? 'active' : ''}
                        onClick={() => setMode('url')}
                    >
                        <ExternalLink size={16} /> From URL
                    </button>
                </div>

                <div className="mm-modal-body">
                    {mode === 'file' ? (
                        <div className="mm-dropzone">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.md,.json"
                            />
                            {file ? (
                                <div className="mm-file-selected">
                                    <File size={24} />
                                    <span>{file.name}</span>
                                </div>
                            ) : (
                                <div className="mm-dropzone-text">
                                    <Upload size={32} />
                                    <p>Click to select a file</p>
                                    <span>Images, Videos, Audio, PDF, Word, Excel, Markdown, JSON</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mm-url-input">
                            <div className="form-group">
                                <label>External URL</label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={urlType}
                                    onChange={e => setUrlType(e.target.value as MediaTypeEnum)}
                                >
                                    {Object.values(MediaTypeEnum).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="mm-form-fields">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Display name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Key (unique identifier)</label>
                                <input
                                    value={formData.key}
                                    onChange={e => setFormData({ ...formData, key: e.target.value })}
                                    placeholder="e.g., hero-banner"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Alt Text</label>
                            <input
                                value={formData.altText}
                                onChange={e => setFormData({ ...formData, altText: e.target.value })}
                                placeholder="Accessibility description"
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                                placeholder="Optional description"
                            />
                        </div>
                        <div className="form-group">
                            <label>Tags</label>
                            <div className="mm-tag-input">
                                <input
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    placeholder="Add tag"
                                    list="available-tags"
                                />
                                <datalist id="available-tags">
                                    {availableTags.map(t => <option key={t} value={t} />)}
                                </datalist>
                                <button type="button" onClick={handleAddTag}>Add</button>
                            </div>
                            <div className="mm-tags">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="mm-tag">
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)}><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mm-modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={uploading || (mode === 'file' ? !file : !url) || !formData.name}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================
// Edit Modal
// ============================================

interface EditModalProps {
    item: any;
    onClose: () => void;
    onSave: (data: Partial<UploadFormData>) => Promise<void>;
    availableTags: string[];
}

const EditModal: React.FC<EditModalProps> = ({ item, onClose, onSave, availableTags }) => {
    const [formData, setFormData] = useState({
        name: item.name || '',
        key: item.key || '',
        altText: item.altText || '',
        description: item.description || '',
        tags: item.tags || [],
        isPublic: item.isPublic ?? true
    });
    const [tagInput, setTagInput] = useState('');
    const [saving, setSaving] = useState(false);

    const handleAddTag = () => {
        if (tagInput && !formData.tags.includes(tagInput)) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tag) });
    };

    const handleSubmit = async () => {
        setSaving(true);
        await onSave(formData);
        setSaving(false);
    };

    return (
        <div className="mm-modal-overlay" onClick={onClose}>
            <div className="mm-modal" onClick={e => e.stopPropagation()}>
                <div className="mm-modal-header">
                    <h3>Edit Media</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <div className="mm-modal-body">
                    <div className="mm-edit-preview">
                        {item.type === 'image' && <img src={item.url} alt={item.name} />}
                        <div className="mm-edit-url">
                            <span>{item.url}</span>
                            <button onClick={() => navigator.clipboard.writeText(item.url)}>
                                <Copy size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="mm-form-fields">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Key</label>
                                <input
                                    value={formData.key}
                                    onChange={e => setFormData({ ...formData, key: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Alt Text</label>
                            <input
                                value={formData.altText}
                                onChange={e => setFormData({ ...formData, altText: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tags</label>
                            <div className="mm-tag-input">
                                <input
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    list="edit-tags"
                                />
                                <datalist id="edit-tags">
                                    {availableTags.map(t => <option key={t} value={t} />)}
                                </datalist>
                                <button type="button" onClick={handleAddTag}>Add</button>
                            </div>
                            <div className="mm-tags">
                                {formData.tags.map((tag: string) => (
                                    <span key={tag} className="mm-tag">
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)}><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mm-modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                        <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

