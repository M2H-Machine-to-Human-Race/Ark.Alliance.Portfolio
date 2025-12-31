import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { ProjectEndpoint } from './project-endpoint.entity';

@Entity('project_controllers')
export class ProjectController {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    basePath!: string;

    @Column({ nullable: true })
    description!: string;

    @ManyToOne(() => Project, project => project.controllers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project!: Project;

    @OneToMany(() => ProjectEndpoint, endpoint => endpoint.controller, { cascade: true })
    endpoints!: ProjectEndpoint[];
}

