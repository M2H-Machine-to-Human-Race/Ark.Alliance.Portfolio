/**
 * @fileoverview Language Entity
 * Represents language proficiency with three dimensions.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('languages')
export class Language {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    language!: string;

    /**
     * Speaking proficiency (1-5 scale)
     * 1 = Basic, 5 = Native/Fluent
     */
    @Column({ type: 'int', default: 1 })
    speaking!: number;

    /**
     * Writing proficiency (1-5 scale)
     * 1 = Basic, 5 = Native/Fluent
     */
    @Column({ type: 'int', default: 1 })
    writing!: number;

    /**
     * Presenting proficiency (1-5 scale)
     * 1 = Basic, 5 = Native/Fluent
     */
    @Column({ type: 'int', default: 1 })
    presenting!: number;

    @Column({ default: 0 })
    displayOrder!: number;

    @Column({ default: 1 })
    profileId!: number;
}
