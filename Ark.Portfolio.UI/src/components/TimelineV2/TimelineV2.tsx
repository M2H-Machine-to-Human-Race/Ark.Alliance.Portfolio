/**
 * @fileoverview TimelineV2 View Component
 * Chronological timeline with filtering and search.
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import { Search, Calendar, Building2, MapPin, Edit2, Inbox } from 'lucide-react';
import { useTimelineV2Model, TimelineItem, TimelineCategory } from './TimelineV2.model';
import './TimelineV2.styles.css';

/**
 * TimelineV2 Props
 */
export interface TimelineV2Props {
    /** Timeline items to display */
    items: TimelineItem[];
    /** Initial category filter */
    initialCategory?: TimelineCategory;
    /** Show admin edit controls */
    showAdmin?: boolean;
    /** Callback when edit is clicked */
    onEdit?: (item: TimelineItem) => void;
    /** Optional class name */
    className?: string;
}

/**
 * Format date range for display
 */
const formatDateRange = (startDate: string, endDate?: string, isCurrent?: boolean): string => {
    const start = new Date(startDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (isCurrent) {
        return `${startStr} - Present`;
    }

    if (endDate) {
        const end = new Date(endDate);
        const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        return `${startStr} - ${endStr}`;
    }

    return startStr;
};

/**
 * TimelineV2 Component
 * 
 * Features:
 * - Chronological display with alternating layout (desktop)
 * - Category filtering (Experience, Education, Achievements)
 * - Text search across title, org, description, skills
 * - Admin edit controls
 * - Staggered animations
 */
export const TimelineV2: React.FC<TimelineV2Props> = ({
    items,
    initialCategory = 'all',
    showAdmin = false,
    onEdit,
    className = '',
}) => {
    const vm = useTimelineV2Model({
        items,
        initialCategory,
        showAdmin,
        onEdit,
    });

    return (
        <div className={`timeline ${className}`}>
            {/* Controls */}
            <div className="timeline-controls">
                {/* Category Filters */}
                <div className="timeline-filters" role="tablist" aria-label="Filter by category">
                    {vm.categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`timeline-filter-btn ${vm.category === cat.id ? 'active' : ''}`}
                            onClick={() => vm.setCategory(cat.id)}
                            role="tab"
                            aria-selected={vm.category === cat.id}
                        >
                            {cat.label}
                            <span className="timeline-filter-count">{cat.count}</span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="timeline-search">
                    <Search size={16} className="timeline-search-icon" aria-hidden="true" />
                    <input
                        type="search"
                        className="timeline-search-input"
                        placeholder="Search timeline..."
                        value={vm.searchQuery}
                        onChange={(e) => vm.setSearchQuery(e.target.value)}
                        aria-label="Search timeline"
                    />
                </div>
            </div>

            {/* Timeline Track */}
            {vm.filteredItems.length > 0 ? (
                <div className="timeline-track" role="list">
                    {vm.filteredItems.map((item, index) => (
                        <article
                            key={item.id}
                            className="timeline-item"
                            data-type={item.type}
                            role="listitem"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="timeline-dot" aria-hidden="true" />

                            <div className="timeline-card">
                                <header className="timeline-card-header">
                                    <div className="timeline-card-date" data-current={item.isCurrent}>
                                        <Calendar size={12} aria-hidden="true" />
                                        {formatDateRange(item.startDate, item.endDate, item.isCurrent)}
                                    </div>
                                    <span
                                        className="timeline-type-badge"
                                        data-type={item.type}
                                    >
                                        {item.type}
                                    </span>
                                </header>

                                <h3 className="timeline-card-title">{item.title}</h3>

                                <p className="timeline-card-org">
                                    <Building2 size={14} aria-hidden="true" />
                                    {item.organization}
                                    {item.location && (
                                        <>
                                            <span style={{ margin: '0 8px' }}>•</span>
                                            <MapPin size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '4px' }} />
                                            {item.location}
                                        </>
                                    )}
                                </p>

                                <p className="timeline-card-desc">{item.description}</p>

                                {item.highlights && item.highlights.length > 0 && (
                                    <ul className="timeline-card-highlights">
                                        {item.highlights.map((highlight, i) => (
                                            <li key={i}>{highlight}</li>
                                        ))}
                                    </ul>
                                )}

                                {item.skills && item.skills.length > 0 && (
                                    <div className="timeline-card-skills">
                                        {item.skills.map((skill, i) => (
                                            <span key={i} className="timeline-skill-tag">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {showAdmin && (
                                    <div className="timeline-card-admin">
                                        <button
                                            className="timeline-edit-btn"
                                            onClick={() => vm.handleEdit(item)}
                                            aria-label={`Edit ${item.title}`}
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="timeline-empty">
                    <Inbox size={64} className="timeline-empty-icon" />
                    <h3 className="timeline-empty-title">No items found</h3>
                    <p className="timeline-empty-text">
                        {vm.searchQuery
                            ? `No results for "${vm.searchQuery}"`
                            : 'No timeline items in this category'}
                    </p>
                    {(vm.category !== 'all' || vm.searchQuery) && (
                        <button
                            className="timeline-clear-btn"
                            onClick={vm.clearFilters}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimelineV2;
