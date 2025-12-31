import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('team_members')
export class TeamMember {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    role!: string;

    @Column({ nullable: true })
    avatarUrl!: string;

    @Column({ nullable: true })
    bio!: string;

    @Column({ nullable: true })
    githubUrl!: string;

    @Column({ nullable: true })
    linkedinUrl!: string;
}

