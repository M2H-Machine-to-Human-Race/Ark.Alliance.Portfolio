/**
 * @fileoverview Skill Entity
 * Represents a skill in the CV with category support.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SkillCategory } from './skill-category.entity';

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ length: 50, nullable: true })
    level!: string;

    @Column({ nullable: true })
    categoryId!: number;

    @ManyToOne(() => SkillCategory, category => category.skills, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category!: SkillCategory;

    @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
    yearsOfExperience!: number;

    @Column({ default: 0 })
    displayOrder!: number;

    @Column({ default: 1 })
    profileId!: number;
}

