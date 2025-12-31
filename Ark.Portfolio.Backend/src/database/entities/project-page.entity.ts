import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';

export enum PageType {
    OVERVIEW = 'OVERVIEW',
    FUNCTIONAL = 'FUNCTIONAL',
    TECHNICAL = 'TECHNICAL',
    ROADMAP = 'ROADMAP',
    TEAM = 'TEAM',
    CONTACT = 'CONTACT'
}

@Entity('project_pages')
export class ProjectPage {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({
        type: 'text',
        default: PageType.OVERVIEW
    })
    type!: PageType;

    @Column({ default: 0 })
    navOrder!: number;

    @Column({ type: 'text', nullable: true })
    content!: string;

    @ManyToOne(() => Project, project => project.pages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project!: Project;
}

