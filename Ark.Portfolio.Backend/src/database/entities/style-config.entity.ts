/**
 * @fileoverview Style Config Entity
 * Represents theme configuration settings in the database.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ThemeColorSchemeEnum } from '@ark/portfolio-share';

@Entity('style_config')
export class StyleConfig {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({
        type: 'simple-enum',
        enum: ThemeColorSchemeEnum,
        default: ThemeColorSchemeEnum.LIGHT
    })
    colorScheme!: ThemeColorSchemeEnum;

    @Column({ default: '#ffffff' })
    primaryColor!: string;

    @Column({ default: '#000000' })
    secondaryColor!: string;

    @Column({ default: '#3b82f6' })
    accentColor!: string;

    @Column({ default: '#ffffff' })
    backgroundColor!: string;

    @Column({ default: '#1f2937' })
    textColor!: string;

    @Column('simple-json', { nullable: true })
    colorPalette!: { name: string; value: string; description?: string }[];

    @Column('simple-json', { nullable: true })
    headingFont!: { family: string; fallback: string; weights: string[]; googleFontUrl?: string };

    @Column('simple-json', { nullable: true })
    bodyFont!: { family: string; fallback: string; weights: string[]; googleFontUrl?: string };

    @Column({ default: 16 })
    baseFontSize!: number;

    @Column({ default: 4 })
    borderRadius!: number;

    @Column({ default: false })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

