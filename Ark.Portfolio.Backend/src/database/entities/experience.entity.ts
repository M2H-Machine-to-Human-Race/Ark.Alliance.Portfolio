/**
 * @fileoverview Experience Entity
 * Updated with all required fields for CV management.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('experience')
export class Experience {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 200 })
    company!: string;

    @Column({ length: 100 })
    position!: string;

    @Column({ length: 200, nullable: true })
    project!: string;

    @Column({ type: 'date', nullable: true })
    startDate!: Date;

    @Column({ type: 'date', nullable: true })
    endDate!: Date | null;

    @Column('text', { nullable: true })
    description!: string;

    @Column('simple-array', { nullable: true })
    technologies!: string[];

    @Column({ default: false })
    isHighlighted!: boolean;

    @Column({ default: 0 })
    displayOrder!: number;

    @Column({ default: 1 })
    profileId!: number;
}

