/**
 * @fileoverview Theme Entity
 * Represents a visual theme stored in the database with full CSS content.
 * 
 * @module database/entities/theme.entity
 * @author Armand Richelet-Kleinberg
 * 
 * @description
 * This entity stores complete theme CSS content in the database,
 * enabling dynamic theme loading and switching without redeployment.
 * Each theme contains pre-compiled CSS that is injected at runtime.
 * 
 * @example
 * ```typescript
 * const theme = new Theme();
 * theme.name = 'Default Cyber';
 * theme.slug = 'default-cyber';
 * theme.cssContent = ':root { --neon-primary: #00d4ff; ... }';
 * theme.isDefault = true;
 * ```
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Theme entity for storing visual themes with full CSS content.
 * 
 * @class Theme
 * @description Stores themes with complete CSS for dynamic runtime injection.
 * Themes are loaded via API and injected into the document head.
 */
@Entity('themes')
export class Theme {
    /**
     * Auto-generated primary key.
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Human-readable theme name.
     * @example 'Default Cyber', 'Neon Cyber', 'Minimal'
     */
    @Column({ length: 100 })
    name!: string;

    /**
     * URL-safe unique identifier (kebab-case).
     * @example 'default-cyber', 'neon-cyber', 'minimal'
     */
    @Column({ length: 100, unique: true })
    slug!: string;

    /**
     * Brief description of the theme style.
     */
    @Column({ type: 'text', nullable: true })
    description?: string;

    /**
     * Full CSS content for this theme.
     * Contains CSS variables, utility classes, and component styles.
     */
    @Column({ type: 'text' })
    cssContent!: string;

    /**
     * Preview color for theme selector (hex).
     * @example '#00d4ff'
     */
    @Column({ length: 20, nullable: true })
    previewColor?: string;

    /**
     * Icon or emoji for theme selector.
     * @example '⚡', '✨', '○', '◇'
     */
    @Column({ length: 10, nullable: true })
    icon?: string;

    /**
     * Whether this is the default theme.
     * Only one theme should have this set to true.
     */
    @Column({ default: false })
    isDefault!: boolean;

    /**
     * Display order in theme selector.
     */
    @Column({ type: 'int', default: 0 })
    order!: number;

    /**
     * Whether this theme is active/visible.
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
