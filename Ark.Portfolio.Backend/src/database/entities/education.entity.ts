import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('education')
export class Education {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 200 })
    institution!: string;

    @Column({ length: 100, nullable: true })
    degree!: string;

    @Column({ length: 100, nullable: true })
    fieldOfStudy!: string;

    @Column({ type: 'date', nullable: true })
    startDate!: Date;

    @Column({ type: 'date', nullable: true })
    endDate!: Date;

    @Column('text', { nullable: true })
    description!: string;

    @Column({ default: 1 })
    profileId!: number;

    @Column({ default: 0 })
    displayOrder!: number;
}

