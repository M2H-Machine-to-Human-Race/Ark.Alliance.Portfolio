/**
 * @fileoverview Technology Entity
 * Represents a technology/framework used in portfolio projects.
 * 
 * @module database/entities/technology.entity
 * @author Armand Richelet-Kleinberg
 * 
 * @description
 * This entity stores master data for technologies, making them
 * extensible via database without code changes. Each technology
 * includes metadata like category, description, icon, and color
 * for rich UI rendering.
 * 
 * @example
 * ```typescript
 * const tech = new Technology();
 * tech.key = 'react';
 * tech.name = 'React';
 * tech.label = 'React.js';
 * tech.category = 'frontend';
 * tech.description = 'A JavaScript library for building user interfaces';
 * tech.icon = 'fab fa-react';
 * tech.color = '#61DAFB';
 * tech.website = 'https://react.dev';
 * ```
 */

import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

/**
 * Technology category enumeration for filtering and grouping.
 */
export enum TechnologyCategory {
    FRONTEND = 'frontend',
    BACKEND = 'backend',
    LANGUAGES = 'languages',
    RUNTIMES = 'runtimes',
    DATABASES = 'databases',
    CLOUD = 'cloud',
    DEVOPS = 'devops',
    MESSAGING = 'messaging',
    AI = 'ai',
    ENTERPRISE = 'enterprise',
    PATTERNS = 'patterns',
    APIS = 'apis',
    TESTING = 'testing',
    MOBILE = 'mobile',
    STYLING = 'styling'
}

/**
 * Technology entity for storing technology/framework master data.
 * 
 * @class Technology
 * @description Stores technologies with rich metadata for display and categorization.
 * Technologies are linked to projects via the ProjectTechnology junction entity.
 */
@Entity('technologies')
export class Technology {
    /**
     * Unique key identifier (kebab-case, e.g., 'react', 'typescript', 'dotnet-8').
     * Used as the primary key for stable references.
     */
    @PrimaryColumn({ length: 50 })
    key!: string;

    /**
     * Display name (e.g., 'React', 'TypeScript', '.NET 8').
     */
    @Column({ length: 100 })
    name!: string;

    /**
     * Extended label for display (e.g., 'React.js', 'Microsoft .NET 8').
     * Falls back to name if not provided.
     */
    @Column({ length: 150, nullable: true })
    label?: string;

    /**
     * Category for grouping (frontend, backend, databases, etc.).
     */
    @Column({ length: 50 })
    category!: string;

    /**
     * Brief description of the technology.
     */
    @Column({ type: 'text', nullable: true })
    description?: string;

    /**
     * Icon class (Font Awesome or Devicon).
     * @example 'fab fa-react', 'devicon-typescript-plain'
     */
    @Column({ length: 100, nullable: true })
    icon?: string;

    /**
     * Brand color in hex format.
     * @example '#61DAFB'
     */
    @Column({ length: 20, nullable: true })
    color?: string;

    /**
     * Official website URL.
     */
    @Column({ nullable: true })
    website?: string;

    /**
     * Supported versions (optional, JSON array).
     * @example ['16', '17', '18', '19']
     */
    @Column({ type: 'simple-array', nullable: true })
    versions?: string[];

    /**
     * Display order within category.
     */
    @Column({ type: 'int', default: 0 })
    order!: number;

    /**
     * Whether this technology is actively used/displayed.
     */
    @Column({ default: true })
    isActive!: boolean;

    /**
     * Creation timestamp.
     */
    @CreateDateColumn()
    createdAt!: Date;

    /**
     * Last update timestamp.
     */
    @UpdateDateColumn()
    updatedAt!: Date;
}
