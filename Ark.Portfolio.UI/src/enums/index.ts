/**
 * @fileoverview UI Enums Barrel Export
 * Central export for all UI-specific enumerations.
 * 
 * @remarks
 * For shared enums (used by both frontend and backend),
 * import directly from '@ark/portfolio-share'.
 * 
 * @module enums
 * @author Armand Richelet-Kleinberg
 * @license MIT
 */

export {
    TimelineCategoryEnum,
    ViewModeEnum,
    ToastTypeEnum,
    TabVariantEnum
} from './ui.enums';

// Re-export commonly used shared enums for convenience
export {
    MediaTypeEnum,
    MediaSourceEnum,
    WidgetTypeEnum,
    MenuPositionEnum,
    ThemeColorSchemeEnum,
    AdminOperationEnum,
    AdminEntityTypeEnum,
    ProjectStatus,
    SkillLevel,
    ProficiencyLevel
} from '@ark/portfolio-share';
