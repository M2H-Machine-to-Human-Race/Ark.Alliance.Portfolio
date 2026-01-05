/**
 * @fileoverview Database Configuration
 * TypeORM DataSource configuration with support for SQLite and PostgreSQL.
 * @author Armand Richelet-Kleinberg
 */

import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Profile } from '../database/entities/profile.entity';
import { Project } from '../database/entities/project.entity';
import { ProjectTechnology } from '../database/entities/project-technology.entity';
import { Education } from '../database/entities/education.entity';
import { Experience } from '../database/entities/experience.entity';
import { Skill } from '../database/entities/skill.entity';
import { SkillCategory } from '../database/entities/skill-category.entity';
import { Widget } from '../database/entities/widget.entity';
import { Media } from '../database/entities/media.entity';
import { ProjectPage } from '../database/entities/project-page.entity';
import { ProjectFeature } from '../database/entities/project-feature.entity';
import { ProjectController } from '../database/entities/project-controller.entity';
import { ProjectEndpoint } from '../database/entities/project-endpoint.entity';
import { TeamMember } from '../database/entities/team-member.entity';
import { MenuItem } from '../database/entities/menu-item.entity';
import { StyleConfig } from '../database/entities/style-config.entity';
import { CarouselItem } from '../database/entities/carousel-item.entity';
import { User } from '../database/entities/user.entity';
import { AiSettings } from '../database/entities/ai-settings.entity';
import { Outbox } from '../database/entities/outbox.entity';
import { Technology } from '../database/entities/technology.entity';
import { Language } from '../database/entities/language.entity';
import { Hobby } from '../database/entities/hobby.entity';
import { BusinessDomain } from '../database/entities/business-domain.entity';
import { PageDefinition } from '../database/entities/page-definition.entity';
import { Theme } from '../database/entities/theme.entity';

dotenv.config();

/** Database type from environment, defaults to SQLite */
const dbType = (process.env.DB_TYPE || 'sqlite') as 'sqlite' | 'postgres';

/**
 * Base TypeORM configuration shared across database types.
 */
const baseConfig = {
    synchronize: true,
    logging: false,
    entities: [
        Profile, Project, ProjectTechnology, Technology, Education, Experience, Skill,
        SkillCategory, Widget, Media, ProjectPage, ProjectFeature, ProjectController,
        ProjectEndpoint, TeamMember, MenuItem, StyleConfig, CarouselItem,
        User, AiSettings, Outbox, Language, Hobby, BusinessDomain, PageDefinition, Theme
    ],
    subscribers: [],
    migrations: [],
};

/**
 * PostgreSQL-specific configuration.
 */
const postgresConfig = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ark_portfolio',
};

/**
 * SQLite-specific configuration.
 */
const sqliteConfig = {
    type: 'sqlite' as const,
    database: process.env.DB_KEY || './data/ark_portfolio.sqlite',
};

/**
 * Application DataSource for TypeORM.
 * @remarks Automatically selects SQLite or PostgreSQL based on DB_TYPE env variable.
 */
export const AppDataSource = new DataSource({
    ...baseConfig,
    ...(dbType === 'postgres' ? postgresConfig : sqliteConfig),
});

