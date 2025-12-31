/**
 * @fileoverview Menu Item Entity
 * Represents a navigation menu item in the database.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { MenuPositionEnum } from '@ark/portfolio-share';

@Entity('menu_items')
export class MenuItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    label!: string;

    @Column({ nullable: true })
    icon!: string;

    @Column()
    route!: string;

    @Column({
        type: 'simple-enum',
        enum: MenuPositionEnum,
        default: MenuPositionEnum.HEADER
    })
    position!: MenuPositionEnum;

    @Column({ default: 0 })
    order!: number;

    @Column({ default: true })
    isVisible!: boolean;

    @Column({ default: false })
    openInNewTab!: boolean;

    @ManyToOne(() => MenuItem, item => item.children, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentId' })
    parent!: MenuItem;

    @Column({ nullable: true })
    parentId!: number;

    @OneToMany(() => MenuItem, item => item.parent)
    children!: MenuItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

