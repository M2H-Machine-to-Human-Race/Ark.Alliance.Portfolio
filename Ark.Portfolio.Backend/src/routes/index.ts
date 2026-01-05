/**
 * @fileoverview API Routes
 * Defines all REST API endpoints for Ark.Portfolio Backend.
 * 
 * @author Armand Richelet-Kleinberg
 */

import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { ProjectController as LegacyProjectController } from '../controllers/project.controller'; // Keep legacy for admin/CMS if needed
import { ProjectPresentationController } from '../controllers/project-presentation.controller';
import { ResumeController } from '../controllers/resume.controller';
import { DashboardController } from '../controllers/dashboard.controller';
import { WidgetController } from '../controllers/widget.controller';
import { CarouselController } from '../controllers/carousel.controller';
import { ThemeController } from '../controllers/theme.controller';
import { getAllTechnologies, getTechnologyByKey } from '../controllers/technology.controller';
import { asyncHandler } from '../middleware/error-handler.middleware';
import { mediaUpload } from '../middleware/upload.middleware';

import { AdminController } from '../controllers/admin.controller';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

const profileController = new ProfileController();
const legacyProjectController = new LegacyProjectController();
const presentationController = new ProjectPresentationController();
const resumeController = new ResumeController();
const dashboardController = new DashboardController();
const widgetController = new WidgetController();
const carouselController = new CarouselController();
const themeController = new ThemeController();
const adminController = new AdminController();
const authController = new AuthController();

// ============================================
// PUBLIC ENDPOINTS
// ============================================

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get portfolio owner profile
 *     tags: [Public - Profile]
 *     responses:
 *       200:
 *         description: Profile information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 */
router.get('/profile', asyncHandler(profileController.getProfile.bind(profileController)));

/**
 * @swagger
 * /carousel:
 *   get:
 *     summary: Get homepage carousel items
 *     tags: [Public - Carousel]
 *     responses:
 *       200:
 *         description: List of carousel items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarouselItem'
 */
router.get('/carousel', asyncHandler(carouselController.getCarousel.bind(carouselController)));

/**
 * @swagger
 * /technologies:
 *   get:
 *     summary: Get all technologies
 *     tags: [Public - Technologies]
 *     responses:
 *       200:
 *         description: List of all technologies with categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Technology'
 */
router.get('/technologies', asyncHandler(getAllTechnologies));

/**
 * @swagger
 * /technologies/{key}:
 *   get:
 *     summary: Get technology by key
 *     tags: [Public - Technologies]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Technology key (e.g., 'react', 'typescript')
 *     responses:
 *       200:
 *         description: Technology details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technology'
 *       404:
 *         description: Technology not found
 */
router.get('/technologies/:key', asyncHandler(getTechnologyByKey));

// ============================================
// THEME ENDPOINTS
// ============================================

/**
 * @swagger
 * /themes:
 *   get:
 *     summary: Get all active themes
 *     tags: [Public - Themes]
 *     responses:
 *       200:
 *         description: List of active themes (without CSS content)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ThemeListItem'
 */
router.get('/themes', asyncHandler(themeController.listThemes.bind(themeController)));

/**
 * @swagger
 * /themes/default:
 *   get:
 *     summary: Get default theme with CSS content
 *     tags: [Public - Themes]
 *     responses:
 *       200:
 *         description: Default theme with full CSS content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThemeDetail'
 *       404:
 *         description: No default theme configured
 */
router.get('/themes/default', asyncHandler(themeController.getDefaultTheme.bind(themeController)));

/**
 * @swagger
 * /themes/{slug}:
 *   get:
 *     summary: Get theme by slug with CSS content
 *     tags: [Public - Themes]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Theme slug (e.g., 'default-cyber', 'neon-cyber')
 *     responses:
 *       200:
 *         description: Theme with full CSS content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThemeDetail'
 *       404:
 *         description: Theme not found
 */
router.get('/themes/:slug', asyncHandler(themeController.getThemeBySlug.bind(themeController)));

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Public - Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/projects', asyncHandler(presentationController.getAllProjects.bind(presentationController)));

/**
 * @swagger
 * /projects/featured:
 *   get:
 *     summary: Get featured projects
 *     tags: [Public - Projects]
 *     responses:
 *       200:
 *         description: List of featured projects for homepage
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/projects/featured', asyncHandler(legacyProjectController.getFeaturedProjects.bind(legacyProjectController)));

/**
 * @swagger
 * /projects/{id}/presentation:
 *   get:
 *     summary: Get full project presentation
 *     tags: [Public - Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID or slug
 *     responses:
 *       200:
 *         description: Full project with pages, features, and technologies
 *       404:
 *         description: Project not found
 */
router.get('/projects/:id/presentation', asyncHandler(presentationController.getFullProject.bind(presentationController)));

// CV (Legacy redirect)
router.get('/cv', (req, res) => res.redirect(301, '/api/resume'));

/**
 * @swagger
 * /resume:
 *   get:
 *     summary: Get resume/CV data
 *     tags: [Public - Resume]
 *     responses:
 *       200:
 *         description: Complete resume with profile, experiences, skills, education
 */
router.get('/resume', asyncHandler(resumeController.getResume.bind(resumeController)));

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard data
 *     tags: [Public - Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics and overview
 */
router.get('/dashboard', asyncHandler(dashboardController.getDashboardData.bind(dashboardController)));

/**
 * @swagger
 * /widgets/home:
 *   get:
 *     summary: Get home page widgets
 *     tags: [Public - Dashboard]
 *     responses:
 *       200:
 *         description: List of widgets for home page
 */
router.get('/widgets/home', asyncHandler(widgetController.getHomeWidgets.bind(widgetController)));

/**
 * @swagger
 * /widgets/project/{projectId}:
 *   get:
 *     summary: Get project-specific widgets
 *     tags: [Public - Dashboard]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of widgets for specific project
 */
router.get('/widgets/project/:projectId', asyncHandler(widgetController.getProjectWidgets.bind(widgetController)));

// ============================================
// AUTH ENDPOINTS
// ============================================

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/auth/login', asyncHandler(authController.login.bind(authController)));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Not authenticated
 */
router.get('/auth/me', authMiddleware, asyncHandler(authController.getMe.bind(authController)));

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Current password incorrect
 */
router.post('/auth/change-password', authMiddleware, asyncHandler(authController.changePassword.bind(authController)));

// ============================================
// ADMIN - PROJECTS
// ============================================

/**
 * @swagger
 * /admin/projects:
 *   get:
 *     summary: Get all projects (admin)
 *     tags: [Admin - Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all projects
 *   post:
 *     summary: Create new project
 *     tags: [Admin - Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created
 */
router.get('/admin/projects', authMiddleware, asyncHandler(adminController.getProjects.bind(adminController)));
router.post('/admin/projects', authMiddleware, asyncHandler(adminController.createProject.bind(adminController)));

/**
 * @swagger
 * /admin/projects/{id}:
 *   get:
 *     summary: Get project by ID (admin)
 *     tags: [Admin - Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 *   put:
 *     summary: Update project
 *     tags: [Admin - Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated
 *   delete:
 *     summary: Delete project
 *     tags: [Admin - Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 */
router.get('/admin/projects/:id', authMiddleware, asyncHandler(adminController.getProject.bind(adminController)));
router.put('/admin/projects/:id', authMiddleware, asyncHandler(adminController.updateProject.bind(adminController)));
router.delete('/admin/projects/:id', authMiddleware, asyncHandler(adminController.deleteProject.bind(adminController)));

// ============================================
// ADMIN - RESUME
// ============================================

/**
 * @swagger
 * /admin/resume:
 *   get:
 *     summary: Get admin resume data
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete resume for editing
 */
router.get('/admin/resume', authMiddleware, asyncHandler(adminController.getResume.bind(adminController)));

/**
 * @swagger
 * /admin/resume/profile:
 *   put:
 *     summary: Update profile
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/admin/resume/profile', authMiddleware, asyncHandler(adminController.updateProfile.bind(adminController)));

/**
 * @swagger
 * /admin/resume/experience:
 *   post:
 *     summary: Create experience
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Experience'
 *     responses:
 *       201:
 *         description: Experience created
 */
router.post('/admin/resume/experience', authMiddleware, asyncHandler(adminController.createExperience.bind(adminController)));

/**
 * @swagger
 * /admin/resume/experience/reorder:
 *   put:
 *     summary: Reorder experiences
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               experienceIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Experiences reordered
 */
router.put('/admin/resume/experience/reorder', authMiddleware, asyncHandler(adminController.reorderExperiences.bind(adminController)));

/**
 * @swagger
 * /admin/resume/experience/{id}:
 *   put:
 *     summary: Update experience
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Experience updated
 *   delete:
 *     summary: Delete experience
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Experience deleted
 */
router.put('/admin/resume/experience/:id', authMiddleware, asyncHandler(adminController.updateExperience.bind(adminController)));
router.delete('/admin/resume/experience/:id', authMiddleware, asyncHandler(adminController.deleteExperience.bind(adminController)));

/**
 * @swagger
 * /admin/resume/education:
 *   post:
 *     summary: Create education entry
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Education created
 */
router.post('/admin/resume/education', authMiddleware, asyncHandler(adminController.createEducation.bind(adminController)));

/**
 * @swagger
 * /admin/resume/education/reorder:
 *   put:
 *     summary: Reorder education entries
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Education entries reordered
 */
router.put('/admin/resume/education/reorder', authMiddleware, asyncHandler(adminController.reorderEducation.bind(adminController)));

/**
 * @swagger
 * /admin/resume/education/{id}:
 *   put:
 *     summary: Update education
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Education updated
 *   delete:
 *     summary: Delete education
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Education deleted
 */
router.put('/admin/resume/education/:id', authMiddleware, asyncHandler(adminController.updateEducation.bind(adminController)));
router.delete('/admin/resume/education/:id', authMiddleware, asyncHandler(adminController.deleteEducation.bind(adminController)));

/**
 * @swagger
 * /admin/resume/skill:
 *   post:
 *     summary: Create skill
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Skill created
 */
router.post('/admin/resume/skill', authMiddleware, asyncHandler(adminController.createSkill.bind(adminController)));

/**
 * @swagger
 * /admin/resume/skill/reorder:
 *   put:
 *     summary: Reorder skills
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Skills reordered
 */
router.put('/admin/resume/skill/reorder', authMiddleware, asyncHandler(adminController.reorderSkills.bind(adminController)));

/**
 * @swagger
 * /admin/resume/skill/{id}:
 *   put:
 *     summary: Update skill
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skill updated
 *   delete:
 *     summary: Delete skill
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Skill deleted
 */
router.put('/admin/resume/skill/:id', authMiddleware, asyncHandler(adminController.updateSkill.bind(adminController)));
router.delete('/admin/resume/skill/:id', authMiddleware, asyncHandler(adminController.deleteSkill.bind(adminController)));

/**
 * @swagger
 * /admin/resume/categories:
 *   get:
 *     summary: Get skill categories
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of skill categories
 */
router.get('/admin/resume/categories', authMiddleware, asyncHandler(adminController.getSkillCategories.bind(adminController)));

/**
 * @swagger
 * /admin/resume/category:
 *   post:
 *     summary: Create skill category
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/admin/resume/category', authMiddleware, asyncHandler(adminController.createSkillCategory.bind(adminController)));

/**
 * @swagger
 * /admin/resume/category/{id}:
 *   put:
 *     summary: Update skill category
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category updated
 *   delete:
 *     summary: Delete skill category
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.put('/admin/resume/category/:id', authMiddleware, asyncHandler(adminController.updateSkillCategory.bind(adminController)));
router.delete('/admin/resume/category/:id', authMiddleware, asyncHandler(adminController.deleteSkillCategory.bind(adminController)));

/**
 * @swagger
 * /admin/resume/language:
 *   post:
 *     summary: Create language entry
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               speaking:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               writing:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               presenting:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Language created
 */
router.post('/admin/resume/language', authMiddleware, asyncHandler(adminController.createLanguage.bind(adminController)));

/**
 * @swagger
 * /admin/resume/language/reorder:
 *   put:
 *     summary: Reorder languages
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               languageIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Languages reordered
 */
router.put('/admin/resume/language/reorder', authMiddleware, asyncHandler(adminController.reorderLanguages.bind(adminController)));

/**
 * @swagger
 * /admin/resume/language/{id}:
 *   put:
 *     summary: Update language
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Language updated
 *   delete:
 *     summary: Delete language
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Language deleted
 */
router.put('/admin/resume/language/:id', authMiddleware, asyncHandler(adminController.updateLanguage.bind(adminController)));
router.delete('/admin/resume/language/:id', authMiddleware, asyncHandler(adminController.deleteLanguage.bind(adminController)));

/**
 * @swagger
 * /admin/resume/hobby:
 *   post:
 *     summary: Create hobby entry
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hobby created
 */
router.post('/admin/resume/hobby', authMiddleware, asyncHandler(adminController.createHobby.bind(adminController)));

/**
 * @swagger
 * /admin/resume/hobby/reorder:
 *   put:
 *     summary: Reorder hobbies
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hobbyIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Hobbies reordered
 */
router.put('/admin/resume/hobby/reorder', authMiddleware, asyncHandler(adminController.reorderHobbies.bind(adminController)));

/**
 * @swagger
 * /admin/resume/hobby/{id}:
 *   put:
 *     summary: Update hobby
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hobby updated
 *   delete:
 *     summary: Delete hobby
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hobby deleted
 */
router.put('/admin/resume/hobby/:id', authMiddleware, asyncHandler(adminController.updateHobby.bind(adminController)));
router.delete('/admin/resume/hobby/:id', authMiddleware, asyncHandler(adminController.deleteHobby.bind(adminController)));

/**
 * @swagger
 * /admin/resume/business-domain:
 *   post:
 *     summary: Create business domain entry
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced, Expert, Master]
 *               yearsOfExperience:
 *                 type: number
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Business domain created
 */
router.post('/admin/resume/business-domain', authMiddleware, asyncHandler(adminController.createBusinessDomain.bind(adminController)));

/**
 * @swagger
 * /admin/resume/business-domain/reorder:
 *   put:
 *     summary: Reorder business domains
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domainIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Business domains reordered
 */
router.put('/admin/resume/business-domain/reorder', authMiddleware, asyncHandler(adminController.reorderBusinessDomains.bind(adminController)));

/**
 * @swagger
 * /admin/resume/business-domain/{id}:
 *   put:
 *     summary: Update business domain
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Business domain updated
 *   delete:
 *     summary: Delete business domain
 *     tags: [Admin - Resume]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Business domain deleted
 */
router.put('/admin/resume/business-domain/:id', authMiddleware, asyncHandler(adminController.updateBusinessDomain.bind(adminController)));
router.delete('/admin/resume/business-domain/:id', authMiddleware, asyncHandler(adminController.deleteBusinessDomain.bind(adminController)));

// ============================================
// ADMIN - AI
// ============================================

/**
 * @swagger
 * /admin/ai/settings:
 *   get:
 *     summary: Get AI settings
 *     tags: [Admin - AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI configuration settings
 *   put:
 *     summary: Update AI settings
 *     tags: [Admin - AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI settings updated
 */
router.get('/admin/ai/settings', authMiddleware, asyncHandler(adminController.getAiSettings.bind(adminController)));
router.put('/admin/ai/settings', authMiddleware, asyncHandler(adminController.updateAiSettings.bind(adminController)));

/**
 * @swagger
 * /admin/ai/test:
 *   post:
 *     summary: Test AI connection
 *     tags: [Admin - AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI connection test result
 */
router.post('/admin/ai/test', authMiddleware, asyncHandler(adminController.testAiConnection.bind(adminController)));

/**
 * @swagger
 * /admin/ai/models/{provider}:
 *   get:
 *     summary: Get available models for AI provider
 *     tags: [Admin - AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [openai, anthropic, gemini]
 *     responses:
 *       200:
 *         description: List of available models
 */
router.get('/admin/ai/models/:provider', authMiddleware, asyncHandler(adminController.getAiProviderModels.bind(adminController)));

/**
 * @swagger
 * /admin/ai/organize-skills:
 *   post:
 *     summary: Organize skills with AI
 *     tags: [Admin - AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Skills organized by AI
 */
router.post('/admin/ai/organize-skills', authMiddleware, asyncHandler(adminController.organizeSkillsWithAi.bind(adminController)));

/**
 * @swagger
 * /admin/ai/improve-text:
 *   post:
 *     summary: Improve text with AI
 *     tags: [Admin - AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               context:
 *                 type: string
 *     responses:
 *       200:
 *         description: Improved text
 */
router.post('/admin/ai/improve-text', authMiddleware, asyncHandler(adminController.improveTextWithAi.bind(adminController)));

// ============================================
// ADMIN - WIDGETS
// ============================================

/**
 * @swagger
 * /admin/widgets:
 *   get:
 *     summary: Get all widgets
 *     tags: [Admin - Widgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of widgets
 *   post:
 *     summary: Create widget
 *     tags: [Admin - Widgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Widget created
 */
router.get('/admin/widgets', authMiddleware, asyncHandler(adminController.getWidgets.bind(adminController)));
router.post('/admin/widgets', authMiddleware, asyncHandler(adminController.createWidget.bind(adminController)));

/**
 * @swagger
 * /admin/widgets/reorder:
 *   put:
 *     summary: Reorder widgets
 *     tags: [Admin - Widgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Widgets reordered
 */
router.put('/admin/widgets/reorder', authMiddleware, asyncHandler(adminController.reorderWidgets.bind(adminController)));

/**
 * @swagger
 * /admin/widgets/{id}:
 *   put:
 *     summary: Update widget
 *     tags: [Admin - Widgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Widget updated
 *   delete:
 *     summary: Delete widget
 *     tags: [Admin - Widgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Widget deleted
 */
router.put('/admin/widgets/:id', authMiddleware, asyncHandler(adminController.updateWidget.bind(adminController)));
router.delete('/admin/widgets/:id', authMiddleware, asyncHandler(adminController.deleteWidget.bind(adminController)));

// ============================================
// ADMIN - MENU
// ============================================

/**
 * @swagger
 * /admin/menu:
 *   get:
 *     summary: Get navigation menu
 *     tags: [Admin - Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menu items
 *   post:
 *     summary: Create menu item
 *     tags: [Admin - Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Menu item created
 */
router.get('/admin/menu', authMiddleware, asyncHandler(adminController.getMenu.bind(adminController)));
router.post('/admin/menu', authMiddleware, asyncHandler(adminController.createMenuItem.bind(adminController)));

/**
 * @swagger
 * /admin/menu/reorder:
 *   put:
 *     summary: Reorder menu items
 *     tags: [Admin - Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menu reordered
 */
router.put('/admin/menu/reorder', authMiddleware, asyncHandler(adminController.reorderMenu.bind(adminController)));

/**
 * @swagger
 * /admin/menu/{id}:
 *   put:
 *     summary: Update menu item
 *     tags: [Admin - Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item updated
 *   delete:
 *     summary: Delete menu item
 *     tags: [Admin - Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item deleted
 */
router.put('/admin/menu/:id', authMiddleware, asyncHandler(adminController.updateMenuItem.bind(adminController)));
router.delete('/admin/menu/:id', authMiddleware, asyncHandler(adminController.deleteMenuItem.bind(adminController)));

// ============================================
// ADMIN - STYLES
// ============================================

/**
 * @swagger
 * /admin/styles:
 *   get:
 *     summary: Get all style configurations
 *     tags: [Admin - Styles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of styles
 *   post:
 *     summary: Create style configuration
 *     tags: [Admin - Styles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Style created
 */
router.get('/admin/styles', authMiddleware, asyncHandler(adminController.getStyles.bind(adminController)));
router.post('/admin/styles', authMiddleware, asyncHandler(adminController.createStyle.bind(adminController)));

/**
 * @swagger
 * /admin/styles/active:
 *   get:
 *     summary: Get active style
 *     tags: [Admin - Styles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Currently active style
 */
router.get('/admin/styles/active', authMiddleware, asyncHandler(adminController.getActiveStyle.bind(adminController)));

/**
 * @swagger
 * /admin/styles/{id}/activate:
 *   put:
 *     summary: Activate style
 *     tags: [Admin - Styles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Style activated
 */
router.put('/admin/styles/:id/activate', authMiddleware, asyncHandler(adminController.activateStyle.bind(adminController)));

/**
 * @swagger
 * /admin/styles/{id}:
 *   put:
 *     summary: Update style
 *     tags: [Admin - Styles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Style updated
 *   delete:
 *     summary: Delete style
 *     tags: [Admin - Styles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Style deleted
 */
router.put('/admin/styles/:id', authMiddleware, asyncHandler(adminController.updateStyle.bind(adminController)));
router.delete('/admin/styles/:id', authMiddleware, asyncHandler(adminController.deleteStyle.bind(adminController)));

// ============================================
// ADMIN - MEDIA
// ============================================

/**
 * @swagger
 * /admin/media:
 *   get:
 *     summary: Get all media assets
 *     tags: [Admin - Media]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of media assets
 */
router.get('/admin/media', authMiddleware, asyncHandler(adminController.getMedia.bind(adminController)));

/**
 * @swagger
 * /admin/media/tags:
 *   get:
 *     summary: Get all media tags
 *     tags: [Admin - Media]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of media tags
 */
router.get('/admin/media/tags', authMiddleware, asyncHandler(adminController.getMediaTags.bind(adminController)));

/**
 * @swagger
 * /admin/media/key/{key}:
 *   get:
 *     summary: Get media by key
 *     tags: [Admin - Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media asset
 */
router.get('/admin/media/key/:key', authMiddleware, asyncHandler(adminController.getMediaByKey.bind(adminController)));

/**
 * @swagger
 * /admin/media/upload:
 *   post:
 *     summary: Upload media file
 *     tags: [Admin - Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Media uploaded
 */
router.post('/admin/media/upload', authMiddleware, mediaUpload.single('file'), asyncHandler(adminController.uploadMedia.bind(adminController)));

/**
 * @swagger
 * /admin/media/url:
 *   post:
 *     summary: Create media from URL
 *     tags: [Admin - Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Media created
 */
router.post('/admin/media/url', authMiddleware, asyncHandler(adminController.createMediaFromUrl.bind(adminController)));

/**
 * @swagger
 * /admin/media/{id}:
 *   put:
 *     summary: Update media
 *     tags: [Admin - Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Media updated
 *   delete:
 *     summary: Delete media
 *     tags: [Admin - Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Media deleted
 */
router.put('/admin/media/:id', authMiddleware, asyncHandler(adminController.updateMedia.bind(adminController)));
router.delete('/admin/media/:id', authMiddleware, asyncHandler(adminController.deleteMedia.bind(adminController)));

// ============================================
// ADMIN - CAROUSEL
// ============================================

/**
 * @swagger
 * /admin/carousel:
 *   get:
 *     summary: Get all carousel items (admin)
 *     tags: [Admin - Carousel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of carousel items
 *   post:
 *     summary: Create carousel item
 *     tags: [Admin - Carousel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarouselItem'
 *     responses:
 *       201:
 *         description: Carousel item created
 */
router.get('/admin/carousel', authMiddleware, asyncHandler(adminController.getCarousel.bind(adminController)));
router.post('/admin/carousel', authMiddleware, asyncHandler(adminController.createCarouselItem.bind(adminController)));

/**
 * @swagger
 * /admin/carousel/reorder:
 *   put:
 *     summary: Reorder carousel items
 *     tags: [Admin - Carousel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carousel items reordered
 */
router.put('/admin/carousel/reorder', authMiddleware, asyncHandler(adminController.reorderCarousel.bind(adminController)));

/**
 * @swagger
 * /admin/carousel/{id}:
 *   put:
 *     summary: Update carousel item
 *     tags: [Admin - Carousel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carousel item updated
 *   delete:
 *     summary: Delete carousel item
 *     tags: [Admin - Carousel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carousel item deleted
 */
router.put('/admin/carousel/:id', authMiddleware, asyncHandler(adminController.updateCarouselItem.bind(adminController)));
router.delete('/admin/carousel/:id', authMiddleware, asyncHandler(adminController.deleteCarouselItem.bind(adminController)));

// ============================================
// Admin Theme Management Routes (Protected)
// ============================================

/**
 * @swagger
 * /admin/themes:
 *   get:
 *     summary: Get all themes
 *     tags: [Admin - Themes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all themes with full data
 *   post:
 *     summary: Create a new theme
 *     tags: [Admin - Themes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminTheme'
 *     responses:
 *       201:
 *         description: Theme created
 */
router.get('/admin/themes', authMiddleware, asyncHandler(adminController.getThemes.bind(adminController)));
router.post('/admin/themes', authMiddleware, asyncHandler(adminController.createTheme.bind(adminController)));

/**
 * @swagger
 * /admin/themes/reorder:
 *   put:
 *     summary: Reorder themes
 *     tags: [Admin - Themes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               themeIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Themes reordered
 */
router.put('/admin/themes/reorder', authMiddleware, asyncHandler(adminController.reorderThemes.bind(adminController)));

/**
 * @swagger
 * /admin/themes/{id}:
 *   get:
 *     summary: Get theme by ID
 *     tags: [Admin - Themes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theme details
 *       404:
 *         description: Theme not found
 *   put:
 *     summary: Update theme
 *     tags: [Admin - Themes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theme updated
 *   delete:
 *     summary: Delete theme
 *     tags: [Admin - Themes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theme deleted
 *       400:
 *         description: Cannot delete default theme
 */
router.get('/admin/themes/:id', authMiddleware, asyncHandler(adminController.getTheme.bind(adminController)));
router.put('/admin/themes/:id', authMiddleware, asyncHandler(adminController.updateTheme.bind(adminController)));
router.delete('/admin/themes/:id', authMiddleware, asyncHandler(adminController.deleteTheme.bind(adminController)));

/**
 * @swagger
 * /admin/themes/{id}/set-default:
 *   put:
 *     summary: Set theme as default
 *     tags: [Admin - Themes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theme set as default
 */
router.put('/admin/themes/:id/set-default', authMiddleware, asyncHandler(adminController.setDefaultTheme.bind(adminController)));

// ============================================
// Admin Theme AI Routes (Protected)
// ============================================

/**
 * @swagger
 * /admin/themes/ai/chat:
 *   post:
 *     summary: Chat with AI for theme design assistance
 *     tags: [Admin - Theme AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               currentCss:
 *                 type: string
 *               themeName:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI response with suggested changes
 */
router.post('/admin/themes/ai/chat', authMiddleware, asyncHandler(adminController.themeAiChat.bind(adminController)));

/**
 * @swagger
 * /admin/themes/ai/generate:
 *   post:
 *     summary: Generate a complete theme from description
 *     tags: [Admin - Theme AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Generated theme CSS
 */
router.post('/admin/themes/ai/generate', authMiddleware, asyncHandler(adminController.themeAiGenerate.bind(adminController)));

/**
 * @swagger
 * /admin/themes/ai/suggest:
 *   post:
 *     summary: Get AI suggestions for theme improvements
 *     tags: [Admin - Theme AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               css:
 *                 type: string
 *               goal:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI suggestions for improvements
 */
router.post('/admin/themes/ai/suggest', authMiddleware, asyncHandler(adminController.themeAiSuggest.bind(adminController)));

// ============================================
// Static Export Routes (Protected)
// ============================================
import staticExportRoutes from './static-export.routes';
router.use('/admin', authMiddleware, staticExportRoutes);

export default router;
