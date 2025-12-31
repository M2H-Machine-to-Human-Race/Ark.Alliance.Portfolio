/**
 * @fileoverview Widget Entity
 * Database entity for dynamic widgets on portfolio pages.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WidgetTypeEnum } from '@ark/portfolio-share';

@Entity('widgets')
export class Widget {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'text', // using text for sqlite compatibility
        default: WidgetTypeEnum.TEXT
    })
    type!: WidgetTypeEnum;

    @Column()
    title!: string;

    @Column({ default: 0 })
    order!: number;

    @Column('simple-json', { nullable: true })
    config!: Record<string, unknown>; // Flexible JSON storage for specific widget settings

    @Column({ nullable: true })
    context!: string; // e.g., 'HOME', 'PROJECT_123'

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}


