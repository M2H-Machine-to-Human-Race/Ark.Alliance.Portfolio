/**
 * Data Transfer Object for dashboard statistics.
 * Provides aggregate metrics for the portfolio overview.
 */
export interface DashboardStatsDto {
    /** Total number of projects in portfolio */
    totalProjects: number;
    /** Total number of skills listed */
    totalSkills: number;
    /** Total years of professional experience */
    totalExperienceYears: number;
    /** Number of currently active projects */
    activeProjects: number;
}

/**
 * Data Transfer Object for activity graph data.
 * Provides time-series data for visualizing portfolio activity.
 */
export interface ActivityGraphDto {
    /** X-axis labels (typically months or weeks) */
    labels: string[];
    /** Commit counts corresponding to each label */
    commits: number[];
    /** Complexity scores corresponding to each label */
    complexity: number[];
}

/**
 * Data Transfer Object for complete dashboard data.
 * Combines statistics and activity graph for home page display.
 */
export interface DashboardDataDto {
    /** Aggregate statistics */
    stats: DashboardStatsDto;
    /** Activity graph time-series data */
    activity: ActivityGraphDto;
}
