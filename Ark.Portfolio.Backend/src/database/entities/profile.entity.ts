import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    firstName!: string;

    @Column({ length: 100 })
    lastName!: string;

    @Column({ length: 200, nullable: true })
    title!: string;

    @Column('text', { nullable: true })
    overview!: string;

    @Column({ length: 200 })
    email!: string;

    @Column({ length: 255, nullable: true })
    linkedinUrl!: string;

    @Column({ length: 255, nullable: true })
    githubUrl!: string;

    @Column({ length: 255, nullable: true })
    avatarUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

