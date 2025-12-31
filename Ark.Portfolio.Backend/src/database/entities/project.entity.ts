import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ProjectTechnology } from './project-technology.entity';
import { ProjectPage } from './project-page.entity';
import { ProjectFeature } from './project-feature.entity';
import { ProjectController } from './project-controller.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column('text')
    description!: string;

    @Column()
    status!: string;

    @Column({ default: false })
    isFeatured!: boolean;

    @Column({ nullable: true })
    imageUrl!: string;

    @Column({ nullable: true })
    repoUrl!: string;

    @Column({ nullable: true })
    demoUrl!: string;

    @Column({ type: 'date', nullable: true })
    startDate!: Date;

    @Column({ type: 'date', nullable: true })
    endDate!: Date;

    @OneToMany(() => ProjectTechnology, pt => pt.project)
    technologies!: ProjectTechnology[];

    @OneToMany(() => ProjectPage, page => page.project, { cascade: true })
    pages!: ProjectPage[];

    @OneToMany(() => ProjectFeature, feature => feature.project, { cascade: true })
    features!: ProjectFeature[];

    @OneToMany(() => ProjectController, controller => controller.project, { cascade: true })
    controllers!: ProjectController[];
}

