/**
 * @fileoverview Business Domain Entity
 * Represents business domain knowledge and expertise.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Preset list of valid business domains.
 * Backend validation should enforce values from this list.
 */
export const BUSINESS_DOMAIN_PRESETS = [
    'Logistics',
    'Finance',
    'Trading',
    'Insurance',
    'Steel Manufacturing',
    'Theatre',
    'Entertainment',
    'Music Playing',
    'Music Composing',
    'Movie Making',
    'Retail',
    'Banking',
    'Asset Management',
    'Supply Chain',
    'Healthcare',
    'E-Commerce',
    'Telecommunications',
    'Real Estate',
    'Energy',
    'Automotive'
] as const;

export type BusinessDomainType = typeof BUSINESS_DOMAIN_PRESETS[number];

@Entity('business_domains')
export class BusinessDomain {
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Domain name - must be from preset list.
     */
    @Column({ length: 100 })
    domain!: string;

    /**
     * Proficiency level in this domain.
     * @example 'Expert', 'Advanced', 'Intermediate', 'Beginner'
     */
    @Column({ length: 50, nullable: true })
    level!: string;

    @Column('text', { nullable: true })
    description!: string;

    /**
     * Years of experience in this domain.
     */
    @Column({ type: 'int', nullable: true })
    yearsOfExperience!: number;

    /**
     * Lucide icon name for visual representation.
     */
    @Column({ length: 50, nullable: true })
    icon!: string;

    @Column({ default: 0 })
    displayOrder!: number;

    @Column({ default: 1 })
    profileId!: number;
}
