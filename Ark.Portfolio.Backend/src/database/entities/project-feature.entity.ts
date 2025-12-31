import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('project_features')
export class ProjectFeature {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column('text')
    description!: string;

    @Column({ nullable: true })
    icon!: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @ManyToOne(() => Project, project => project.features, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project!: Project;
}

