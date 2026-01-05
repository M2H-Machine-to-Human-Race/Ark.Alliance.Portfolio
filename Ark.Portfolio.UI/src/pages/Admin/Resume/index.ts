/**
 * Resume Manager Module
 * 
 * Admin interface for managing Resume data (profile, experience, education, skills).
 * 
 * @author Armand Richelet-Kleinberg
 */

export { ResumeManager } from './ResumeManager';
export { useResumeManagerModel } from './ResumeManager.model';
export { ResumeTabEnum as ResumeTab } from '@ark/portfolio-share';

// Legacy exports for backward compatibility
export { ResumeManager as CvManager } from './ResumeManager';
export { useResumeManagerModel as useCvManagerModel } from './ResumeManager.model';
export { ResumeTabEnum as CvTab } from '@ark/portfolio-share';
