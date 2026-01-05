import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../components/generic/AdminLayout';
import { useResumeManagerModel } from './ResumeManager.model';
import {
    AdminExperienceDto, AdminEducationDto, AdminSkillDto, SkillCategoryDto, AiSettingsDto,
    LanguageDto, HobbyDto, BusinessDomainDto, PROFICIENCY_LEVEL_LABELS, SkillLevel,
    ResumeTabEnum, AiProviderEnum, AI_PROVIDER_CONFIG, PROVIDER_MODELS, BUSINESS_DOMAIN_PRESETS
} from '@ark/portfolio-share';
import { Plus, Edit2, Trash2, Sparkles, Settings, Save, Briefcase, GraduationCap, Code, User, Bot, X, Calendar, Building2, Award, Wand2, Languages, Heart, Landmark, Star, Zap, Brain, Cpu } from 'lucide-react';
import './ResumeManager.styles.css';

// ============================================
// Tab Navigation
// ============================================

import { TabItem, TabControl } from '../../../components/generic/TabControl';

const RESUME_TABS: TabItem[] = [
    { id: ResumeTabEnum.PROFILE, label: 'Profile', iconElement: <User size={18} /> },
    { id: ResumeTabEnum.EXPERIENCE, label: 'Experience', iconElement: <Briefcase size={18} /> },
    { id: ResumeTabEnum.EDUCATION, label: 'Education', iconElement: <GraduationCap size={18} /> },
    { id: ResumeTabEnum.SKILLS, label: 'Skills', iconElement: <Code size={18} /> },
    { id: ResumeTabEnum.LANGUAGES, label: 'Languages', iconElement: <Languages size={18} /> },
    { id: ResumeTabEnum.HOBBIES, label: 'Hobbies', iconElement: <Heart size={18} /> },
    { id: ResumeTabEnum.BUSINESS_DOMAINS, label: 'Domains', iconElement: <Landmark size={18} /> },
    { id: ResumeTabEnum.AI_SETTINGS, label: 'AI Settings', iconElement: <Bot size={18} /> }
];

// ============================================
// Main Component
// ============================================

export const ResumeManager: React.FC = () => {
    const vm = useResumeManagerModel();

    if (vm.isLoading) {
        return (
            <AdminLayout title="Resume Manager">
                <div className="cv-loading">Loading resume data...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Resume Manager">
            <div className="cv-manager">
                {/* Status Messages */}
                {vm.error && <div className="cv-error">{vm.error}</div>}
                {vm.successMessage && <div className="cv-success">{vm.successMessage}</div>}

                {/* Tab Navigation */}
                <div className="cv-tabs-container">
                    <TabControl
                        tabs={RESUME_TABS}
                        activeTab={vm.activeTab}
                        onTabChange={(id) => vm.setActiveTab(id as ResumeTabEnum)}
                        variant="pills"
                        ariaLabel="Resume sections"
                    />
                </div>

                {/* Tab Content */}
                <div className="cv-content">
                    {vm.activeTab === ResumeTabEnum.PROFILE && <ProfileTab vm={vm} />}
                    {vm.activeTab === ResumeTabEnum.EXPERIENCE && <ExperienceTab vm={vm} />}
                    {vm.activeTab === ResumeTabEnum.EDUCATION && <EducationTab vm={vm} />}
                    {vm.activeTab === ResumeTabEnum.SKILLS && <SkillsTab vm={vm} />}
                    {vm.activeTab === ResumeTabEnum.LANGUAGES && <LanguagesTab vm={vm} />}
                    {vm.activeTab === ResumeTabEnum.HOBBIES && <HobbiesTab vm={vm} />}
                    {vm.activeTab === ResumeTabEnum.BUSINESS_DOMAINS && <BusinessDomainsTab vm={vm} />}
                    {vm.activeTab === ResumeTabEnum.AI_SETTINGS && <AiSettingsTab vm={vm} />}
                </div>
            </div>
        </AdminLayout>
    );
};

// ============================================
// Profile Tab
// ============================================

const ProfileTab: React.FC<{ vm: ReturnType<typeof useResumeManagerModel> }> = ({ vm }) => {
    const [formData, setFormData] = useState({
        firstName: vm.resumeData?.profile?.firstName || '',
        lastName: vm.resumeData?.profile?.lastName || '',
        title: vm.resumeData?.profile?.title || '',
        overview: vm.resumeData?.profile?.overview || '',
        email: vm.resumeData?.profile?.email || '',
        linkedinUrl: vm.resumeData?.profile?.linkedinUrl || '',
        githubUrl: vm.resumeData?.profile?.githubUrl || ''
    });

    useEffect(() => {
        if (vm.resumeData?.profile) {
            setFormData({
                firstName: vm.resumeData.profile.firstName || '',
                lastName: vm.resumeData.profile.lastName || '',
                title: vm.resumeData.profile.title || '',
                overview: vm.resumeData.profile.overview || '',
                email: vm.resumeData.profile.email || '',
                linkedinUrl: vm.resumeData.profile.linkedinUrl || '',
                githubUrl: vm.resumeData.profile.githubUrl || ''
            });
        }
    }, [vm.resumeData?.profile]);

    const handleSave = () => vm.updateProfile(formData);

    const handleAiImprove = async () => {
        const improved = await vm.improveTextWithAi(formData.overview, 'professional summary');
        setFormData({ ...formData, overview: improved });
    };

    return (
        <div className="cv-section">
            <div className="cv-section-header">
                <h3><User size={20} /> Profile Information</h3>
            </div>

            <div className="cv-form-grid">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
                <div className="form-group full-width">
                    <label>Professional Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Senior Software Architect"
                    />
                </div>
                <div className="form-group full-width">
                    <div className="label-with-action">
                        <label>Professional Overview</label>
                        <button className="ai-btn" onClick={handleAiImprove} disabled={vm.isSaving}>
                            <Wand2 size={14} /> Improve with AI
                        </button>
                    </div>
                    <textarea
                        value={formData.overview}
                        onChange={e => setFormData({ ...formData, overview: e.target.value })}
                        rows={4}
                        placeholder="A brief professional summary..."
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    />
                </div>
                <div className="form-group full-width">
                    <label>GitHub URL</label>
                    <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                    />
                </div>
            </div>

            <div className="cv-actions">
                <button className="btn-primary" onClick={handleSave} disabled={vm.isSaving}>
                    <Save size={16} /> {vm.isSaving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </div>
    );
};

// ============================================
// Experience Tab
// ============================================

const ExperienceTab: React.FC<{ vm: ReturnType<typeof useResumeManagerModel> }> = ({ vm }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editItem, setEditItem] = useState<AdminExperienceDto | null>(null);

    const handleAdd = () => {
        setEditItem({ company: '', position: '', description: '', startDate: '', technologies: [] });
        setIsEditing(true);
    };

    const handleEdit = (exp: AdminExperienceDto) => {
        setEditItem({ ...exp });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!editItem) return;
        if (editItem.id) {
            await vm.updateExperience(editItem.id, editItem);
        } else {
            await vm.createExperience(editItem);
        }
        setIsEditing(false);
        setEditItem(null);
    };

    const handleImproveDescription = async () => {
        if (!editItem) return;
        const improved = await vm.improveTextWithAi(editItem.description || '', 'work experience description');
        setEditItem({ ...editItem, description: improved });
    };

    return (
        <div className="cv-section">
            <div className="cv-section-header">
                <h3><Briefcase size={20} /> Work Experience</h3>
                <button className="btn-add" onClick={handleAdd}>
                    <Plus size={16} /> Add Experience
                </button>
            </div>

            {/* Experience List */}
            <div className="cv-list">
                {vm.resumeData?.experiences?.map(exp => (
                    <div key={exp.id} className="cv-card">
                        <div className="cv-card-header">
                            <div className="cv-card-title">
                                <Building2 size={18} />
                                <div>
                                    <h4>{exp.position}</h4>
                                    <span className="cv-card-subtitle">{exp.company}</span>
                                </div>
                            </div>
                            <div className="cv-card-actions">
                                <button onClick={() => handleEdit(exp)}><Edit2 size={16} /></button>
                                <button className="danger" onClick={() => vm.deleteExperience(exp.id!)}><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="cv-card-meta">
                            <Calendar size={14} />
                            {exp.startDate?.slice(0, 10)} — {exp.endDate?.slice(0, 10) || 'Present'}
                        </div>
                        <p className="cv-card-description">{exp.description}</p>
                        {exp.technologies?.length > 0 && (
                            <div className="cv-card-tags">
                                {exp.technologies.map((t, i) => <span key={i} className="tag">{t}</span>)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isEditing && editItem && (
                <Modal title={editItem.id ? 'Edit Experience' : 'Add Experience'} onClose={() => setIsEditing(false)}>
                    <div className="cv-form-grid">
                        <div className="form-group">
                            <label>Company</label>
                            <input value={editItem.company} onChange={e => setEditItem({ ...editItem, company: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Position</label>
                            <input value={editItem.position} onChange={e => setEditItem({ ...editItem, position: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" value={editItem.startDate?.slice(0, 10)} onChange={e => setEditItem({ ...editItem, startDate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>End Date (leave empty for current)</label>
                            <input type="date" value={editItem.endDate?.slice(0, 10) || ''} onChange={e => setEditItem({ ...editItem, endDate: e.target.value || undefined })} />
                        </div>
                        <div className="form-group full-width">
                            <div className="label-with-action">
                                <label>Description</label>
                                <button className="ai-btn" onClick={handleImproveDescription}><Wand2 size={14} /> Improve</button>
                            </div>
                            <textarea rows={4} value={editItem.description} onChange={e => setEditItem({ ...editItem, description: e.target.value })} />
                        </div>
                        <div className="form-group full-width">
                            <label>Technologies (comma-separated)</label>
                            <input
                                value={editItem.technologies?.join(', ') || ''}
                                onChange={e => setEditItem({ ...editItem, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                            />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave} disabled={vm.isSaving}>
                            <Save size={16} /> Save
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// ============================================
// Education Tab
// ============================================

const EducationTab: React.FC<{ vm: ReturnType<typeof useResumeManagerModel> }> = ({ vm }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editItem, setEditItem] = useState<AdminEducationDto | null>(null);

    const handleAdd = () => {
        setEditItem({ institution: '', degree: '', fieldOfStudy: '', startDate: '' });
        setIsEditing(true);
    };

    const handleEdit = (edu: AdminEducationDto) => {
        setEditItem({ ...edu });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!editItem) return;
        if (editItem.id) {
            await vm.updateEducation(editItem.id, editItem);
        } else {
            await vm.createEducation(editItem);
        }
        setIsEditing(false);
        setEditItem(null);
    };

    return (
        <div className="cv-section">
            <div className="cv-section-header">
                <h3><GraduationCap size={20} /> Education</h3>
                <button className="btn-add" onClick={handleAdd}>
                    <Plus size={16} /> Add Education
                </button>
            </div>

            <div className="cv-list">
                {vm.resumeData?.education?.map(edu => (
                    <div key={edu.id} className="cv-card">
                        <div className="cv-card-header">
                            <div className="cv-card-title">
                                <Award size={18} />
                                <div>
                                    <h4>{edu.degree}</h4>
                                    <span className="cv-card-subtitle">{edu.institution}</span>
                                </div>
                            </div>
                            <div className="cv-card-actions">
                                <button onClick={() => handleEdit(edu)}><Edit2 size={16} /></button>
                                <button className="danger" onClick={() => vm.deleteEducation(edu.id!)}><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="cv-card-meta">
                            <Calendar size={14} />
                            {edu.startDate?.slice(0, 10)} — {edu.endDate?.slice(0, 10) || 'Present'}
                        </div>
                        {edu.fieldOfStudy && <p className="cv-card-description">{edu.fieldOfStudy}</p>}
                    </div>
                ))}
            </div>

            {isEditing && editItem && (
                <Modal title={editItem.id ? 'Edit Education' : 'Add Education'} onClose={() => setIsEditing(false)}>
                    <div className="cv-form-grid">
                        <div className="form-group full-width">
                            <label>Institution</label>
                            <input value={editItem.institution} onChange={e => setEditItem({ ...editItem, institution: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Degree</label>
                            <input value={editItem.degree} onChange={e => setEditItem({ ...editItem, degree: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Field of Study</label>
                            <input value={editItem.fieldOfStudy} onChange={e => setEditItem({ ...editItem, fieldOfStudy: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" value={editItem.startDate?.slice(0, 10)} onChange={e => setEditItem({ ...editItem, startDate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input type="date" value={editItem.endDate?.slice(0, 10) || ''} onChange={e => setEditItem({ ...editItem, endDate: e.target.value || undefined })} />
                        </div>
                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea rows={3} value={editItem.description} onChange={e => setEditItem({ ...editItem, description: e.target.value })} />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave} disabled={vm.isSaving}><Save size={16} /> Save</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// ============================================
// Skills Tab
// ============================================

const SkillsTab: React.FC<{ vm: ReturnType<typeof useResumeManagerModel> }> = ({ vm }) => {
    const [isEditingSkill, setIsEditingSkill] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editSkill, setEditSkill] = useState<AdminSkillDto | null>(null);
    const [editCategory, setEditCategory] = useState<SkillCategoryDto | null>(null);

    // Use shared Enum values
    const skillLevels = Object.values(SkillLevel);

    const handleAddSkill = () => {
        setEditSkill({ name: '', level: SkillLevel.INTERMEDIATE, category: '' });
        setIsEditingSkill(true);
    };

    const handleEditSkill = (skill: AdminSkillDto) => {
        setEditSkill({ ...skill });
        setIsEditingSkill(true);
    };

    const handleSaveSkill = async () => {
        if (!editSkill) return;
        if (editSkill.id) {
            await vm.updateSkill(editSkill.id, editSkill);
        } else {
            await vm.createSkill(editSkill);
        }
        setIsEditingSkill(false);
        setEditSkill(null);
    };

    const handleAddCategory = () => {
        setEditCategory({ name: '', color: '#3b82f6' });
        setIsEditingCategory(true);
    };

    const handleSaveCategory = async () => {
        if (!editCategory) return;
        if (editCategory.id) {
            await vm.updateCategory(editCategory.id, editCategory);
        } else {
            await vm.createCategory(editCategory);
        }
        setIsEditingCategory(false);
        setEditCategory(null);
    };

    // Group skills by category
    const skillsByCategory = (vm.resumeData?.skills || []).reduce((acc, skill) => {
        const cat = skill.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {} as Record<string, AdminSkillDto[]>);

    return (
        <div className="cv-section">
            <div className="cv-section-header">
                <h3><Code size={20} /> Skills & Categories</h3>
                <div className="cv-section-actions">
                    <button className="btn-secondary" onClick={() => vm.organizeSkillsWithAi()}>
                        <Sparkles size={16} /> AI Organize
                    </button>
                    <button className="btn-secondary" onClick={handleAddCategory}>
                        <Plus size={16} /> Add Category
                    </button>
                    <button className="btn-add" onClick={handleAddSkill}>
                        <Plus size={16} /> Add Skill
                    </button>
                </div>
            </div>

            {/* Category Management */}
            <div className="cv-categories">
                {vm.categories.map(cat => (
                    <div key={cat.id} className="category-badge" style={{ borderColor: cat.color }}>
                        <span style={{ color: cat.color }}>{cat.name}</span>
                        <button onClick={() => { setEditCategory(cat); setIsEditingCategory(true); }}><Edit2 size={12} /></button>
                        <button className="danger" onClick={() => vm.deleteCategory(cat.id!)}><Trash2 size={12} /></button>
                    </div>
                ))}
            </div>

            {/* Skills Grid by Category */}
            <div className="cv-skills-grid">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                    <div key={category} className="cv-skill-category">
                        <h4>{category}</h4>
                        <div className="cv-skill-list">
                            {skills.map(skill => (
                                <div key={skill.id} className="cv-skill-item">
                                    <span className="skill-name">{skill.name}</span>
                                    <span className={`skill - level level - ${skill.level?.toLowerCase()} `}>{skill.level}</span>
                                    <div className="skill-actions">
                                        <button onClick={() => handleEditSkill(skill)}><Edit2 size={14} /></button>
                                        <button className="danger" onClick={() => vm.deleteSkill(skill.id!)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Skill Edit Modal */}
            {isEditingSkill && editSkill && (
                <Modal title={editSkill.id ? 'Edit Skill' : 'Add Skill'} onClose={() => setIsEditingSkill(false)}>
                    <div className="cv-form-grid">
                        <div className="form-group">
                            <label>Skill Name</label>
                            <input value={editSkill.name} onChange={e => setEditSkill({ ...editSkill, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Level</label>
                            <select value={editSkill.level} onChange={e => setEditSkill({ ...editSkill, level: e.target.value as any })}>
                                {skillLevels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={editSkill.category} onChange={e => setEditSkill({ ...editSkill, category: e.target.value })}>
                                <option value="">Uncategorized</option>
                                {vm.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Years of Experience</label>
                            <input type="number" step="0.5" value={editSkill.yearsOfExperience || ''} onChange={e => setEditSkill({ ...editSkill, yearsOfExperience: parseFloat(e.target.value) || undefined })} />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-secondary" onClick={() => setIsEditingSkill(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleSaveSkill} disabled={vm.isSaving}><Save size={16} /> Save</button>
                    </div>
                </Modal>
            )}

            {/* Category Edit Modal */}
            {isEditingCategory && editCategory && (
                <Modal title={editCategory.id ? 'Edit Category' : 'Add Category'} onClose={() => setIsEditingCategory(false)}>
                    <div className="cv-form-grid">
                        <div className="form-group">
                            <label>Category Name</label>
                            <input value={editCategory.name} onChange={e => setEditCategory({ ...editCategory, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <input type="color" value={editCategory.color || '#3b82f6'} onChange={e => setEditCategory({ ...editCategory, color: e.target.value })} />
                        </div>
                        <div className="form-group full-width">
                            <label>Description (optional)</label>
                            <input value={editCategory.description || ''} onChange={e => setEditCategory({ ...editCategory, description: e.target.value })} />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-secondary" onClick={() => setIsEditingCategory(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleSaveCategory} disabled={vm.isSaving}><Save size={16} /> Save</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// ============================================
// AI Settings Tab
// ============================================

const AiSettingsTab: React.FC<{ vm: ReturnType<typeof useResumeManagerModel> }> = ({ vm }) => {
    const [settings, setSettings] = useState<AiSettingsDto>({
        provider: AiProviderEnum.OPENAI,
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2048,
        isActive: true
    });
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        if (vm.aiSettings) {
            setSettings(vm.aiSettings);
        }
    }, [vm.aiSettings]);

    // UI Helper for Icons - Mapping Enum to Icons
    const PROVIDER_ICONS: Record<AiProviderEnum, React.ReactNode> = {
        [AiProviderEnum.OPENAI]: <Brain size={24} />,
        [AiProviderEnum.ANTHROPIC]: <Cpu size={24} />,
        [AiProviderEnum.GOOGLE]: <Sparkles size={24} />,
        [AiProviderEnum.CUSTOM]: <Settings size={24} />
    };

    const handleSave = () => vm.updateAiSettings(settings);

    const handleTest = async () => {
        setTestResult(null);
        const result = await vm.testAiConnection();
        setTestResult(result);
    };

    return (
        <div className="cv-section">
            <div className="cv-section-header">
                <h3><Bot size={20} /> AI Configuration</h3>
                <div className="toggle-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={settings.isActive}
                            onChange={e => setSettings({ ...settings, isActive: e.target.checked })}
                        />
                        AI Enabled
                    </label>
                </div>
            </div>

            <div className="ai-settings-form">
                <div className="cv-form-grid">
                    <div className="form-group">
                        <label>Provider</label>
                        <select
                            value={settings.provider}
                            onChange={e => {
                                const newProvider = e.target.value as AiProviderEnum;
                                setSettings({
                                    ...settings,
                                    provider: newProvider,
                                    model: PROVIDER_MODELS[newProvider]?.[0] || ''
                                });
                            }}
                        >
                            {AI_PROVIDER_CONFIG.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Model</label>
                        {settings.provider === AiProviderEnum.CUSTOM ? (
                            <input
                                value={settings.model}
                                onChange={e => setSettings({ ...settings, model: e.target.value })}
                                placeholder="Enter model name"
                            />
                        ) : (
                            <select value={settings.model} onChange={e => setSettings({ ...settings, model: e.target.value })}>
                                {PROVIDER_MODELS[settings.provider]?.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        )}
                    </div>

                    {settings.provider === AiProviderEnum.CUSTOM && (
                        <div className="form-group full-width">
                            <label>API URL</label>
                            <input
                                value={settings.apiUrl || ''}
                                onChange={e => setSettings({ ...settings, apiUrl: e.target.value })}
                                placeholder="https://api.example.com/v1/chat/completions"
                            />
                        </div>
                    )}

                    <div className="form-group full-width">
                        <label>API Key {settings.apiKeyMasked && `(Current: ${settings.apiKeyMasked})`}</label>
                        <input
                            type="password"
                            value={settings.apiKey || ''}
                            onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                            placeholder="Enter new API key to update"
                        />
                    </div>

                    <div className="form-group">
                        <label>Temperature ({settings.temperature})</label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={settings.temperature}
                            onChange={e => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                        />
                        <div className="range-labels">
                            <span>Precise</span>
                            <span>Creative</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Max Tokens</label>
                        <input
                            type="number"
                            value={settings.maxTokens}
                            onChange={e => setSettings({ ...settings, maxTokens: parseInt(e.target.value) || 2048 })}
                        />
                    </div>
                </div>

                {testResult && (
                    <div className={`test - result ${testResult.success ? 'success' : 'error'} `}>
                        {testResult.success ? '✓' : '✗'} {testResult.message}
                    </div>
                )}

                <div className="cv-actions">
                    <button className="btn-secondary" onClick={handleTest} disabled={vm.isSaving}>
                        <Sparkles size={16} /> Test Connection
                    </button>
                    <button className="btn-primary" onClick={handleSave} disabled={vm.isSaving}>
                        <Save size={16} /> Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================
// Languages Tab
// ============================================

const LanguagesTab: React.FC<{ vm: ReturnType<typeof useResumeManagerModel> }> = ({ vm }) => {
    const [formData, setFormData] = useState<LanguageDto>({
        language: '',
        speaking: 3,
        writing: 3,
        presenting: 3
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const resetForm = () => {
        setFormData({ language: '', speaking: 3, writing: 3, presenting: 3 });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (lang: LanguageDto) => {
        setFormData(lang);
        setEditId(lang.id || null);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editId) {
            await vm.updateLanguage(editId, formData);
        } else {
            await vm.createLanguage(formData);
        }
        resetForm();
    };

    const renderStars = (value: number, onChange: (val: number) => void) => (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    className={`star ${n <= value ? 'active' : ''} `}
                    onClick={() => onChange(n)}
                >
                    <Star size={16} fill={n <= value ? 'currentColor' : 'none'} />
                </button>
            ))}
            <span className="star-label">{PROFICIENCY_LEVEL_LABELS[value] || ''}</span>
        </div>
    );

    return (
        <div className="cv-section">
            <div className="section-header">
                <h2>Languages</h2>
            </div>

            {/* Form */}
            <div className="cv-form compact-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Language Name</label>
                        <input
                            type="text"
                            value={formData.language}
                            onChange={e => setFormData({ ...formData, language: e.target.value })}
                            placeholder="e.g., English, French"
                        />
                    </div>
                </div>
                <div className="form-row three-col">
                    <div className="form-group">
                        <label>Speaking</label>
                        {renderStars(formData.speaking, val => setFormData({ ...formData, speaking: val }))}
                    </div>
                    <div className="form-group">
                        <label>Writing</label>
                        {renderStars(formData.writing, val => setFormData({ ...formData, writing: val }))}
                    </div>
                    <div className="form-group">
                        <label>Presenting</label>
                        {renderStars(formData.presenting, val => setFormData({ ...formData, presenting: val }))}
                    </div>
                </div>
                <div className="cv-actions">
                    {isEditing && <button className="btn-secondary" onClick={resetForm}>Cancel</button>}
                    <button className="btn-primary" onClick={handleSave} disabled={!formData.language.trim() || vm.isSaving}>
                        <Save size={16} /> {isEditing ? 'Update' : 'Add'} Language
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="cv-list">
                {vm.resumeData?.languages?.map(lang => (
                    <div key={lang.id} className="cv-item">
                        <div className="item-content">
                            <h4>{lang.language}</h4>
                            <div className="language-levels">
                                <span>Speaking: {PROFICIENCY_LEVEL_LABELS[lang.speaking]}</span>
                                <span>Writing: {PROFICIENCY_LEVEL_LABELS[lang.writing]}</span>
                                <span>Presenting: {PROFICIENCY_LEVEL_LABELS[lang.presenting]}</span>
                            </div>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => handleEdit(lang)}><Edit2 size={16} /></button>
                            <button onClick={() => vm.deleteLanguage(lang.id!)}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {(!vm.resumeData?.languages || vm.resumeData.languages.length === 0) && (
                    <div className="empty-state">No languages added yet</div>
                )}
            </div>
        </div>
    );
};

// ============================================
// Hobbies Tab
// ============================================

const HobbiesTab: React.FC<{ vm: ReturnType<typeof useResumeManagerModel> }> = ({ vm }) => {
    const [formData, setFormData] = useState<HobbyDto>({
        name: '',
        description: '',
        icon: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const resetForm = () => {
        setFormData({ name: '', description: '', icon: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (hobby: HobbyDto) => {
        setFormData(hobby);
        setEditId(hobby.id || null);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editId) {
            await vm.updateHobby(editId, formData);
        } else {
            await vm.createHobby(formData);
        }
        resetForm();
    };

    return (
        <div className="cv-section">
            <div className="section-header">
                <h2>Hobbies & Interests</h2>
            </div>

            {/* Form */}
            <div className="cv-form compact-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Hobby Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Music, Photography"
                        />
                    </div>
                    <div className="form-group">
                        <label>Icon (Lucide name)</label>
                        <input
                            type="text"
                            value={formData.icon || ''}
                            onChange={e => setFormData({ ...formData, icon: e.target.value })}
                            placeholder="e.g., Music, Camera"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Description (optional)</label>
                    <textarea
                        value={formData.description || ''}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description of your hobby..."
                        rows={2}
                    />
                </div>
                <div className="cv-actions">
                    {isEditing && <button className="btn-secondary" onClick={resetForm}>Cancel</button>}
                    <button className="btn-primary" onClick={handleSave} disabled={!formData.name.trim() || vm.isSaving}>
                        <Save size={16} /> {isEditing ? 'Update' : 'Add'} Hobby
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="cv-list hobbies-grid">
                {vm.resumeData?.hobbies?.map(hobby => (
                    <div key={hobby.id} className="cv-item hobby-card">
                        <div className="item-content">
                            <h4>{hobby.icon && <span className="hobby-icon">{hobby.icon}</span>} {hobby.name}</h4>
                            {hobby.description && <p>{hobby.description}</p>}
                        </div>
                        <div className="item-actions">
                            <button onClick={() => handleEdit(hobby)}><Edit2 size={16} /></button>
                            <button onClick={() => vm.deleteHobby(hobby.id!)}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {(!vm.resumeData?.hobbies || vm.resumeData.hobbies.length === 0) && (
                    <div className="empty-state">No hobbies added yet</div>
                )}
            </div>
        </div>
    );
};

// ============================================
// Business Domains Tab
// ============================================

const BusinessDomainsTab: React.FC<{ vm: ReturnType<typeof useResumeManagerModel> }> = ({ vm }) => {
    const [formData, setFormData] = useState<BusinessDomainDto>({
        domain: '',
        level: SkillLevel.INTERMEDIATE,
        yearsOfExperience: 1,
        description: '',
        icon: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const resetForm = () => {
        setFormData({ domain: '', level: SkillLevel.INTERMEDIATE, yearsOfExperience: 1, description: '', icon: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (domain: BusinessDomainDto) => {
        setFormData(domain);
        setEditId(domain.id || null);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editId) {
            await vm.updateBusinessDomain(editId, formData);
        } else {
            await vm.createBusinessDomain(formData);
        }
        resetForm();
    };

    const skillLevelLabels: Record<string, string> = {
        [SkillLevel.BEGINNER]: 'Beginner',
        [SkillLevel.INTERMEDIATE]: 'Intermediate',
        [SkillLevel.ADVANCED]: 'Advanced',
        [SkillLevel.EXPERT]: 'Expert',
        [SkillLevel.MASTER]: 'Master'
    };

    return (
        <div className="cv-section">
            <div className="section-header">
                <h2>Business Domains</h2>
            </div>

            {/* Form */}
            <div className="cv-form compact-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Domain</label>
                        <select
                            value={formData.domain}
                            onChange={e => setFormData({ ...formData, domain: e.target.value })}
                        >
                            <option value="">Select a domain...</option>
                            {BUSINESS_DOMAIN_PRESETS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Proficiency Level</label>
                        <select
                            value={formData.level || SkillLevel.INTERMEDIATE}
                            onChange={e => setFormData({ ...formData, level: e.target.value as SkillLevel })}
                        >
                            {Object.entries(skillLevelLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Years of Experience</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.yearsOfExperience || 0}
                            onChange={e => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Description (optional)</label>
                    <textarea
                        value={formData.description || ''}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your experience in this domain..."
                        rows={2}
                    />
                </div>
                <div className="cv-actions">
                    {isEditing && <button className="btn-secondary" onClick={resetForm}>Cancel</button>}
                    <button className="btn-primary" onClick={handleSave} disabled={!formData.domain || vm.isSaving}>
                        <Save size={16} /> {isEditing ? 'Update' : 'Add'} Domain
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="cv-list">
                {vm.resumeData?.businessDomains?.map(domain => (
                    <div key={domain.id} className="cv-item">
                        <div className="item-content">
                            <h4>{domain.domain}</h4>
                            <div className="domain-meta">
                                <span className="domain-level">{skillLevelLabels[domain.level || ''] || domain.level}</span>
                                {domain.yearsOfExperience && <span className="domain-years">{domain.yearsOfExperience} years</span>}
                            </div>
                            {domain.description && <p className="domain-desc">{domain.description}</p>}
                        </div>
                        <div className="item-actions">
                            <button onClick={() => handleEdit(domain)}><Edit2 size={16} /></button>
                            <button onClick={() => vm.deleteBusinessDomain(domain.id!)}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {(!vm.resumeData?.businessDomains || vm.resumeData.businessDomains.length === 0) && (
                    <div className="empty-state">No business domains added yet</div>
                )}
            </div>
        </div>
    );
};

// ============================================
// Modal Component
// ============================================

const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>{title}</h3>
                <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            <div className="modal-body">
                {children}
            </div>
        </div>
    </div>
);

