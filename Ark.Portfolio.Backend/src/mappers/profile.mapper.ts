import { Profile } from '../database/entities/profile.entity';
import { AdminProfileDto } from '@ark/portfolio-share';

export function mapProfileToDto(profile: Profile): AdminProfileDto {
    return {
        firstName: profile.firstName,
        lastName: profile.lastName,
        title: profile.title,
        overview: profile.overview,
        email: profile.email,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
        avatarUrl: profile.avatarUrl
    };
}
