/**
 * @fileoverview Carousel Item Entity
 * Represents a slide in the homepage carousel.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('carousel_items')
export class CarouselItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ nullable: true })
    subtitle!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column()
    imageUrl!: string;

    @Column({ nullable: true })
    linkUrl!: string;

    @Column({ nullable: true })
    linkText!: string;

    @Column({ default: 0 })
    order!: number;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ nullable: true })
    projectId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

