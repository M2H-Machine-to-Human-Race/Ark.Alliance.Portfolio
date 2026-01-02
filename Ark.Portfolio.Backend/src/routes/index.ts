import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { ProjectController as LegacyProjectController } from '../controllers/project.controller'; // Keep legacy for admin/CMS if needed
import { ProjectPresentationController } from '../controllers/project-presentation.controller';
import { CvController } from '../controllers/cv.controller';
import { DashboardController } from '../controllers/dashboard.controller';
import { WidgetController } from '../controllers/widget.controller';
import { CarouselController } from '../controllers/carousel.controller';
import { asyncHandler } from '../middleware/error-handler.middleware';
import { mediaUpload } from '../middleware/upload.middleware';

import { AdminController } from '../controllers/admin.controller';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

const profileController = new ProfileController();
const legacyProjectController = new LegacyProjectController();
const presentationController = new ProjectPresentationController();
const cvController = new CvController();
const dashboardController = new DashboardController();
const widgetController = new WidgetController();
const carouselController = new CarouselController();
const adminController = new AdminController();
const authController = new AuthController();

// Profile
router.get('/profile', asyncHandler(profileController.getProfile.bind(profileController)));

// Carousel (Public - for homepage)
router.get('/carousel', asyncHandler(carouselController.getCarousel.bind(carouselController)));

// Projects (Legacy & Presentation)
router.get('/projects', asyncHandler(presentationController.getAllProjects.bind(presentationController)));
router.get('/projects/featured', asyncHandler(legacyProjectController.getFeaturedProjects.bind(legacyProjectController)));
router.get('/projects/:id/presentation', asyncHandler(presentationController.getFullProject.bind(presentationController)));

// CV (Legacy redirect)
router.get('/cv', (req, res) => res.redirect(301, '/api/resume'));

// Resume (Primary)
router.get('/resume', asyncHandler(cvController.getCv.bind(cvController)));

// Dashboard
router.get('/dashboard', asyncHandler(dashboardController.getDashboardData.bind(dashboardController)));

// Widgets
router.get('/widgets/home', asyncHandler(widgetController.getHomeWidgets.bind(widgetController)));
router.get('/widgets/project/:projectId', asyncHandler(widgetController.getProjectWidgets.bind(widgetController)));

// ============================================
// Auth Routes
// ============================================
router.post('/auth/login', asyncHandler(authController.login.bind(authController)));
router.get('/auth/me', authMiddleware, asyncHandler(authController.getMe.bind(authController)));
router.post('/auth/change-password', authMiddleware, asyncHandler(authController.changePassword.bind(authController)));

// ============================================
// Admin Routes (Protected)
// ============================================

// Admin Projects
router.get('/admin/projects', authMiddleware, asyncHandler(adminController.getProjects.bind(adminController)));
router.get('/admin/projects/:id', authMiddleware, asyncHandler(adminController.getProject.bind(adminController)));
router.post('/admin/projects', authMiddleware, asyncHandler(adminController.createProject.bind(adminController)));
router.put('/admin/projects/:id', authMiddleware, asyncHandler(adminController.updateProject.bind(adminController)));
router.delete('/admin/projects/:id', authMiddleware, asyncHandler(adminController.deleteProject.bind(adminController)));

// Admin Resume (Primary - replaces deprecated CV endpoints)
router.get('/admin/resume', authMiddleware, asyncHandler(adminController.getCv.bind(adminController)));
router.put('/admin/resume/profile', authMiddleware, asyncHandler(adminController.updateProfile.bind(adminController)));

// Admin Resume - Experience
router.post('/admin/resume/experience', authMiddleware, asyncHandler(adminController.createExperience.bind(adminController)));
router.put('/admin/resume/experience/reorder', authMiddleware, asyncHandler(adminController.reorderExperiences.bind(adminController)));
router.put('/admin/resume/experience/:id', authMiddleware, asyncHandler(adminController.updateExperience.bind(adminController)));
router.delete('/admin/resume/experience/:id', authMiddleware, asyncHandler(adminController.deleteExperience.bind(adminController)));

// Admin Resume - Education
router.post('/admin/resume/education', authMiddleware, asyncHandler(adminController.createEducation.bind(adminController)));
router.put('/admin/resume/education/reorder', authMiddleware, asyncHandler(adminController.reorderEducation.bind(adminController)));
router.put('/admin/resume/education/:id', authMiddleware, asyncHandler(adminController.updateEducation.bind(adminController)));
router.delete('/admin/resume/education/:id', authMiddleware, asyncHandler(adminController.deleteEducation.bind(adminController)));

// Admin Resume - Skills
router.post('/admin/resume/skill', authMiddleware, asyncHandler(adminController.createSkill.bind(adminController)));
router.put('/admin/resume/skill/reorder', authMiddleware, asyncHandler(adminController.reorderSkills.bind(adminController)));
router.put('/admin/resume/skill/:id', authMiddleware, asyncHandler(adminController.updateSkill.bind(adminController)));
router.delete('/admin/resume/skill/:id', authMiddleware, asyncHandler(adminController.deleteSkill.bind(adminController)));

// Admin Resume - Skill Categories
router.get('/admin/resume/categories', authMiddleware, asyncHandler(adminController.getSkillCategories.bind(adminController)));
router.post('/admin/resume/category', authMiddleware, asyncHandler(adminController.createSkillCategory.bind(adminController)));
router.put('/admin/resume/category/:id', authMiddleware, asyncHandler(adminController.updateSkillCategory.bind(adminController)));
router.delete('/admin/resume/category/:id', authMiddleware, asyncHandler(adminController.deleteSkillCategory.bind(adminController)));

// Admin AI Settings
router.get('/admin/ai/settings', authMiddleware, asyncHandler(adminController.getAiSettings.bind(adminController)));
router.put('/admin/ai/settings', authMiddleware, asyncHandler(adminController.updateAiSettings.bind(adminController)));
router.post('/admin/ai/test', authMiddleware, asyncHandler(adminController.testAiConnection.bind(adminController)));
router.get('/admin/ai/models/:provider', authMiddleware, asyncHandler(adminController.getAiProviderModels.bind(adminController)));
router.post('/admin/ai/organize-skills', authMiddleware, asyncHandler(adminController.organizeSkillsWithAi.bind(adminController)));
router.post('/admin/ai/improve-text', authMiddleware, asyncHandler(adminController.improveTextWithAi.bind(adminController)));

// Admin Widgets
router.get('/admin/widgets', authMiddleware, asyncHandler(adminController.getWidgets.bind(adminController)));
router.post('/admin/widgets', authMiddleware, asyncHandler(adminController.createWidget.bind(adminController)));
router.put('/admin/widgets/reorder', authMiddleware, asyncHandler(adminController.reorderWidgets.bind(adminController)));
router.put('/admin/widgets/:id', authMiddleware, asyncHandler(adminController.updateWidget.bind(adminController)));
router.delete('/admin/widgets/:id', authMiddleware, asyncHandler(adminController.deleteWidget.bind(adminController)));

// Admin Menu
router.get('/admin/menu', authMiddleware, asyncHandler(adminController.getMenu.bind(adminController)));
router.post('/admin/menu', authMiddleware, asyncHandler(adminController.createMenuItem.bind(adminController)));
router.put('/admin/menu/reorder', authMiddleware, asyncHandler(adminController.reorderMenu.bind(adminController)));
router.put('/admin/menu/:id', authMiddleware, asyncHandler(adminController.updateMenuItem.bind(adminController)));
router.delete('/admin/menu/:id', authMiddleware, asyncHandler(adminController.deleteMenuItem.bind(adminController)));

// Admin Styles
router.get('/admin/styles', authMiddleware, asyncHandler(adminController.getStyles.bind(adminController)));
router.get('/admin/styles/active', authMiddleware, asyncHandler(adminController.getActiveStyle.bind(adminController)));
router.post('/admin/styles', authMiddleware, asyncHandler(adminController.createStyle.bind(adminController)));
router.put('/admin/styles/:id/activate', authMiddleware, asyncHandler(adminController.activateStyle.bind(adminController)));
router.put('/admin/styles/:id', authMiddleware, asyncHandler(adminController.updateStyle.bind(adminController)));
router.delete('/admin/styles/:id', authMiddleware, asyncHandler(adminController.deleteStyle.bind(adminController)));

// Admin Media
router.get('/admin/media', authMiddleware, asyncHandler(adminController.getMedia.bind(adminController)));
router.get('/admin/media/tags', authMiddleware, asyncHandler(adminController.getMediaTags.bind(adminController)));
router.get('/admin/media/key/:key', authMiddleware, asyncHandler(adminController.getMediaByKey.bind(adminController)));
router.post('/admin/media/upload', authMiddleware, mediaUpload.single('file'), asyncHandler(adminController.uploadMedia.bind(adminController)));
router.post('/admin/media/url', authMiddleware, asyncHandler(adminController.createMediaFromUrl.bind(adminController)));
router.put('/admin/media/:id', authMiddleware, asyncHandler(adminController.updateMedia.bind(adminController)));
router.delete('/admin/media/:id', authMiddleware, asyncHandler(adminController.deleteMedia.bind(adminController)));

// Admin Carousel
router.get('/admin/carousel', authMiddleware, asyncHandler(adminController.getCarousel.bind(adminController)));
router.post('/admin/carousel', authMiddleware, asyncHandler(adminController.createCarouselItem.bind(adminController)));
router.put('/admin/carousel/reorder', authMiddleware, asyncHandler(adminController.reorderCarousel.bind(adminController)));
router.put('/admin/carousel/:id', authMiddleware, asyncHandler(adminController.updateCarouselItem.bind(adminController)));
router.delete('/admin/carousel/:id', authMiddleware, asyncHandler(adminController.deleteCarouselItem.bind(adminController)));

// ============================================
// Static Export Routes (Protected)
// ============================================
import staticExportRoutes from './static-export.routes';
router.use('/admin', authMiddleware, staticExportRoutes);

export default router;

