import { AppDataSource } from '../../config/database';
import { Education } from '../entities/education.entity';
import { Experience } from '../entities/experience.entity';
import { Skill } from '../entities/skill.entity';

export const EducationRepository = AppDataSource.getRepository(Education);
export const ExperienceRepository = AppDataSource.getRepository(Experience);
export const SkillRepository = AppDataSource.getRepository(Skill);

