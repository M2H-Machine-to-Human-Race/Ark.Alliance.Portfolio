import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('outbox')
export class Outbox {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    type!: string;

    @Column('simple-json')
    payload!: any;

    @CreateDateColumn()
    elementCreatedAt!: Date;

    @Column({ default: false })
    processed!: boolean;
}
