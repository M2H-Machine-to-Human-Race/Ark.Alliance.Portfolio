/**
 * @fileoverview Technology API Controller
 * Provides endpoints for retrieving technology master data
 * 
 * @module controllers/technology.controller
 * @author Armand Richelet-Kleinberg
 */

import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { TechnologiesResponseDto, TechnologyDto, TechnologyCategoryDto } from '@ark/portfolio-share';

/**
 * In-memory cache for technologies data
 * Loaded once on first request to avoid repeated file reads
 */
let technologiesCache: TechnologiesResponseDto | null = null;

/**
 * Load technologies from JSON file
 * Caches result for subsequent requests
 */
function loadTechnologies(): TechnologiesResponseDto {
    if (technologiesCache) {
        return technologiesCache;
    }

    const dataPath = path.join(__dirname, '../database/InitDbAsset/JsonDatas/technologies.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Build response with categories and flat technology list
    const categories: TechnologyCategoryDto[] = data.categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        order: cat.order,
        technologies: data.technologies
            .filter((tech: any) => tech.category === cat.id)
            .map((tech: any) => ({
                key: tech.key,
                name: tech.name,
                label: tech.label,
                category: tech.category,
                description: tech.description,
                icon: tech.icon,
                color: tech.color,
                website: tech.website,
                versions: tech.versions
            } as TechnologyDto))
    }));

    const allTechnologies: TechnologyDto[] = data.technologies.map((tech: any) => ({
        key: tech.key,
        name: tech.name,
        label: tech.label,
        category: tech.category,
        description: tech.description,
        icon: tech.icon,
        color: tech.color,
        website: tech.website,
        versions: tech.versions
    }));

    technologiesCache = {
        categories,
        technologies: allTechnologies
    };

    return technologiesCache;
}

/**
 * GET /api/technologies
 * Returns all technologies grouped by categories
 * 
 * @param req - Express request
 * @param res - Express response
 * 
 * @swagger
 * /api/technologies:
 *   get:
 *     summary: Get all technologies
 *     tags: [Technologies]
 *     responses:
 *       200:
 *         description: Technologies grouped by categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TechnologyCategory'
 *                 technologies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Technology'
 */
export const getAllTechnologies = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = loadTechnologies();
        res.json(data);
    } catch (error) {
        console.error('Error loading technologies:', error);
        res.status(500).json({ error: 'Failed to load technologies' });
    }
};

/**
 * GET /api/technologies/:key
 * Returns a single technology by its key
 * 
 * @param req - Express request with key parameter
 * @param res - Express response
 * 
 * @swagger
 * /api/technologies/{key}:
 *   get:
 *     summary: Get technology by key
 *     tags: [Technologies]
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
export const getTechnologyByKey = async (req: Request, res: Response): Promise<void> => {
    try {
        const { key } = req.params;
        const data = loadTechnologies();

        const technology = data.technologies.find(t => t.key === key);

        if (!technology) {
            res.status(404).json({ error: `Technology '${key}' not found` });
            return;
        }

        res.json(technology);
    } catch (error) {
        console.error('Error finding technology:', error);
        res.status(500).json({ error: 'Failed to find technology' });
    }
};

/**
 * Clear cache (for development/testing)
 * Not exposed as public endpoint
 */
export const clearCache = (): void => {
    technologiesCache = null;
};
