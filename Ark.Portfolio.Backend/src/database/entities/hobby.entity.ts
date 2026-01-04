/**
 * @fileoverview Hobby Entity
 * Represents personal hobbies and interests.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('hobbies')
export class Hobby {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column('text', { nullable: true })
    description!: string;

    /**
     * Lucide icon name for visual representation.
     * @example 'Music', 'Camera', 'Gamepad2'
     */
    @Column({ length: 50, nullable: true })
    icon!: string;

    @Column({ default: 0 })
    displayOrder!: number;

    @Column({ default: 1 })
    profileId!: number;
}
