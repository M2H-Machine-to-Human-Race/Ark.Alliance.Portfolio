import { AppDataSource } from '../../config/database';
import { Profile } from '../entities/profile.entity';

export const ProfileRepository = AppDataSource.getRepository(Profile);

