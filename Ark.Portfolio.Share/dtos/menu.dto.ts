/**
 * @fileoverview Menu DTOs
 * Data Transfer Objects for Menu management.
 */

import { MenuPositionEnum } from '../enums/admin.enums';

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminMenuItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         label:
 *           type: string
 *         icon:
 *           type: string
 *         route:
 *           type: string
 *         position:
 *           type: string
 *           enum: [TOP, SIDE, FOOTER]
 *         order:
 *           type: integer
 *         isVisible:
 *           type: boolean
 *         parentId:
 *           type: integer
 *         openInNewTab:
 *           type: boolean
 *     ReorderMenuItems:
 *       type: object
 *       properties:
 *         position:
 *           type: string
 *           enum: [TOP, SIDE, FOOTER]
 *         itemIds:
 *           type: array
 *           items:
 *             type: integer
 */
export interface AdminMenuItemDto {
    id?: number;
    label: string;
    icon?: string;
    route: string;
    position: MenuPositionEnum;
    order: number;
    isVisible: boolean;
    parentId?: number | null;
    openInNewTab?: boolean;
}

/**
 * Reorder menu items request.
 */
export interface ReorderMenuItemsDto {
    position: MenuPositionEnum;
    itemIds: number[];
}
