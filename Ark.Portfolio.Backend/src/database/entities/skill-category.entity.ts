/**
 * @fileoverview Skill Category Entity
 * Organizes skills into named categories with visual customization.
 * 
 * @module entities/skill-category
 * @author Armand Richelet-Kleinberg
 * @since 1.0.0
 * 
 * @example
 * // Creating a skill category
 * const category = new SkillCategory();
 * category.name = 'Frontend';
 * category.description = 'UI development technologies';
 * category.icon = 'Monitor';
 * category.color = '#3B82F6';
 * await repository.save(category);
 */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Skill } from './skill.entity';

/**
 * Skill Category entity for organizing skills.
 * 
 * @class SkillCategory
 * @description Groups related skills together with visual customization options.
 * Used in the CV/Resume section for organized skill presentation.
 * 
 * @remarks
 * - Categories can have custom colors and icons for visual distinction
 * - displayOrder controls the rendering sequence
 * - Skills are linked via foreign key relationship
 * 
 * @see {@link Skill} for the related skill entity
 */
@Entity('skill_categories')
export class SkillCategory {
    /**
     * Unique identifier for the category.
     * @type {number}
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Display name of the category.
     * @type {string}
     * @example 'Frontend', 'Backend', 'DevOps', 'Languages'
     */
    @Column({ length: 100 })
    name!: string;

    /**
     * Optional description of the category.
     * @type {string | null}
     */
    @Column({ length: 255, nullable: true })
    description!: string;

    /**
     * Lucide icon name for visual representation.
     * @type {string | null}
     * @example 'Monitor', 'Server', 'Cloud', 'Code'
     * @see https://lucide.dev/icons for available icons
     */
    @Column({ length: 50, nullable: true })
    icon!: string;

    /**
     * Hex color code for category styling.
     * @type {string | null}
     * @example '#3B82F6', '#10B981', '#8B5CF6'
     */
    @Column({ length: 7, nullable: true })
    color!: string;

    /**
     * Display order for sorting categories.
     * @type {number}
     * @default 0
     * @remarks Lower values appear first
     */
    @Column({ default: 0 })
    displayOrder!: number;

    /**
     * Skills belonging to this category.
     * @type {Skill[]}
     * @remarks One-to-many relationship with Skill entity
     */
    @OneToMany(() => Skill, skill => skill.category)
    skills!: Skill[];

    /**
     * Record creation timestamp.
     * @type {Date}
     */
    @CreateDateColumn()
    createdAt!: Date;

    /**
     * Record last update timestamp.
     * @type {Date}
     */
    @UpdateDateColumn()
    updatedAt!: Date;
}

