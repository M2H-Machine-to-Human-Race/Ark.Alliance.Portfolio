import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectController } from './project-controller.entity';

@Entity('project_endpoints')
export class ProjectEndpoint {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    method!: string;

    @Column()
    path!: string;

    @Column({ nullable: true })
    description!: string;

    @ManyToOne(() => ProjectController, controller => controller.endpoints, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'controller_id' })
    controller!: ProjectController;
}

