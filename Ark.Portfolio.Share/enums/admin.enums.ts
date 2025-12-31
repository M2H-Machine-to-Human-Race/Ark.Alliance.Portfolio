/**
 * @fileoverview Admin Enums
 * Enumerations for the administration system.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * Widget display types for front page components.
 */
export enum WidgetTypeEnum {
    HERO = 'hero',
    STATS = 'stats',
    CAROUSEL = 'carousel',
    TIMELINE = 'timeline',
    GRID = 'grid',
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video',
    SKILLS = 'skills',
    CONTACT = 'contact'
}

/**
 * Menu item positioning options.
 */
export enum MenuPositionEnum {
    HEADER = 'header',
    FOOTER = 'footer',
    RADIAL = 'radial',
    SIDEBAR = 'sidebar',
    MOBILE = 'mobile'
}

/**
 * Media asset types supported by the system.
 * @remarks Used for filtering and rendering appropriate previews.
 */
export enum MediaTypeEnum {
    /** Image files (JPEG, PNG, GIF, WebP, SVG) */
    IMAGE = 'image',
    /** Video files (MP4, WebM, MOV) */
    VIDEO = 'video',
    /** Audio files (MP3, WAV, OGG) */
    AUDIO = 'audio',
    /** PDF documents */
    PDF = 'pdf',
    /** Word documents (DOC, DOCX) */
    WORD = 'word',
    /** Excel spreadsheets (XLS, XLSX) */
    EXCEL = 'excel',
    /** Markdown files */
    MARKDOWN = 'markdown',
    /** JSON files */
    JSON = 'json',
    /** Icon files */
    ICON = 'icon',
    /** Other file types */
    OTHER = 'other'
}

/**
 * Media source types.
 * @remarks Indicates where the media is stored.
 */
export enum MediaSourceEnum {
    /** External URL */
    URL = 'url',
    /** Local file upload */
    UPLOAD = 'upload',
    /** AWS S3 or compatible storage */
    S3 = 's3'
}

/**
 * Theme color scheme options.
 */
export enum ThemeColorSchemeEnum {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto'
}

/**
 * Font weight options.
 */
export enum FontWeightEnum {
    THIN = '100',
    LIGHT = '300',
    REGULAR = '400',
    MEDIUM = '500',
    SEMIBOLD = '600',
    BOLD = '700',
    EXTRABOLD = '800',
    BLACK = '900'
}

/**
 * Admin operation types for audit logs.
 */
export enum AdminOperationEnum {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    REORDER = 'reorder',
    TOGGLE = 'toggle',
    UPLOAD = 'upload'
}

/**
 * Content entity types for admin operations.
 */
export enum AdminEntityTypeEnum {
    PROJECT = 'project',
    EXPERIENCE = 'experience',
    SKILL = 'skill',
    EDUCATION = 'education',
    WIDGET = 'widget',
    MENU_ITEM = 'menu_item',
    STYLE = 'style',
    MEDIA = 'media',
    PROFILE = 'profile'
}
