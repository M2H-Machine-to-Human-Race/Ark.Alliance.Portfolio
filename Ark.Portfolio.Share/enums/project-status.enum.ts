/**
 * Project status enumeration.
 * Represents the current lifecycle state of a portfolio project.
 */
export enum ProjectStatus {
    /** Project is actively being developed */
    IN_PROGRESS = 'In Progress',
    /** Project development is finished */
    COMPLETED = 'Completed',
    /** Project is in maintenance mode (bug fixes, updates) */
    MAINTENANCE = 'Maintenance',
    /** Project is no longer actively maintained */
    ARCHIVED = 'Archived'
}
