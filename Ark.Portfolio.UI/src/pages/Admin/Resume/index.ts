/**
 * Resume Manager Module
 * 
 * Admin interface for managing Resume data (profile, experience, education, skills).
 * 
 * @author Armand Richelet-Kleinberg
 */

export { ResumeManager } from './ResumeManager';
export { useResumeManagerModel, type ResumeTab } from './ResumeManager.model';

// Legacy exports for backward compatibility
export { ResumeManager as CvManager } from './ResumeManager';
export { useResumeManagerModel as useCvManagerModel, type ResumeTab as CvTab } from './ResumeManager.model';
