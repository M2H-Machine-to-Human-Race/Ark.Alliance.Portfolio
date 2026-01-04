/**
 * @fileoverview Page Definition Entity
 * Represents configurable page definitions for static export.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { StaticPageType } from '@ark/portfolio-share';

@Entity('page_definition')
export class PageDefinition {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'simple-enum',
        enum: StaticPageType
    })
    pageType!: StaticPageType;

    @Column()
    title!: string;

    @Column()
    route!: string;

    @Column('simple-json', { nullable: true })
    sections!: string[] | null;

    @Column({ default: true })
    isEnabled!: boolean;

    @Column({ default: 0 })
    displayOrder!: number;

    @Column('simple-json', { nullable: true })
    metadata!: Record<string, any> | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
