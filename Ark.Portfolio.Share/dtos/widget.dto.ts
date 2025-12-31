/**
 * @fileoverview Widget DTOs
 * Data Transfer Objects for Widget management.
 */

import { WidgetTypeEnum } from '../enums/admin.enums';

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminWidget:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [TEXT, IMAGE, CODE, CAROUSEL, SPACER, DIVIDER]
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         order:
 *           type: integer
 *         pageId:
 *           type: string
 *         isActive:
 *           type: boolean
 *         config:
 *           type: object
 *     ReorderWidgets:
 *       type: object
 *       properties:
 *         pageId:
 *           type: string
 *         widgetIds:
 *           type: array
 *           items:
 *             type: integer
 */
export interface AdminWidgetDto {
    id?: number;
    type: WidgetTypeEnum;
    title?: string;
    content?: string;
    order: number;
    pageId: string;
    isActive: boolean;
    config?: Record<string, unknown>;
}

/**
 * Reorder widgets request.
 */
export interface ReorderWidgetsDto {
    pageId: string;
    widgetIds: number[];
}
