/**
 * Data Transfer Object for profile information.
 * Represents the portfolio owner's basic profile and contact details.
 * 
 * @example
 * ```typescript
 * const profile: ProfileDto = {
 *   firstName: 'Armand',
 *   lastName: 'Richelet-Kleinberg',
 *   title: 'Senior Software Engineer',
 *   overview: 'Full-stack developer with 15+ years experience',
 *   email: 'contact@example.com'
 * };
 * ```
 */
export interface ProfileDto {
    /** First name of the profile owner */
    firstName: string;
    /** Last name of the profile owner */
    lastName: string;
    /** Professional title (e.g., 'Senior Software Engineer') */
    title: string;
    /** Brief professional overview/bio */
    overview: string;
    /** Short bio description */
    bio?: string;
    /** Contact email address */
    email: string;
    /** LinkedIn profile URL */
    linkedinUrl?: string;
    /** GitHub profile URL */
    githubUrl?: string;
    /** Profile avatar/photo URL */
    avatarUrl?: string;
}
