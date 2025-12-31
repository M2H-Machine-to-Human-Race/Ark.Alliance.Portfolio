/**
 * @fileoverview Style DTOs
 * Data Transfer Objects for Style management.
 */

import { ThemeColorSchemeEnum, FontWeightEnum } from '../enums/admin.enums';

/**
 * @swagger
 * components:
 *   schemas:
 *     ColorPaletteEntry:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         value:
 *           type: string
 *         description:
 *           type: string
 *     FontConfig:
 *       type: object
 *       properties:
 *         family:
 *           type: string
 *         fallback:
 *           type: string
 *         weights:
 *           type: array
 *           items:
 *             type: string
 *         googleFontUrl:
 *           type: string
 *     AdminStyleConfig:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         colorScheme:
 *           type: string
 *           enum: [LIGHT, DARK, SYSTEM]
 *         primaryColor:
 *           type: string
 *         secondaryColor:
 *           type: string
 *         accentColor:
 *           type: string
 *         backgroundColor:
 *           type: string
 *         textColor:
 *           type: string
 *         colorPalette:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ColorPaletteEntry'
 *         headingFont:
 *           $ref: '#/components/schemas/FontConfig'
 *         bodyFont:
 *           $ref: '#/components/schemas/FontConfig'
 *         baseFontSize:
 *           type: integer
 *         borderRadius:
 *           type: integer
 *         isActive:
 *           type: boolean
 */
export interface ColorPaletteEntryDto {
    name: string;
    value: string;
    description?: string;
}

/**
 * Font configuration.
 */
export interface FontConfigDto {
    family: string;
    fallback: string;
    weights: FontWeightEnum[];
    googleFontUrl?: string;
}

/**
 * Full style configuration DTO.
 */
export interface AdminStyleConfigDto {
    id?: number;
    name: string;
    colorScheme: ThemeColorSchemeEnum;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    colorPalette: ColorPaletteEntryDto[];
    headingFont: FontConfigDto;
    bodyFont: FontConfigDto;
    baseFontSize: number;
    borderRadius: number;
    isActive: boolean;
}
