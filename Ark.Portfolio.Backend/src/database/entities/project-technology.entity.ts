import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('project_technologies')
export class ProjectTechnology {
    @PrimaryColumn('uuid')
    projectId!: string;

    @PrimaryColumn({ length: 50 })
    technology!: string;

    @ManyToOne(() => Project, project => project.technologies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project!: Project;
}

