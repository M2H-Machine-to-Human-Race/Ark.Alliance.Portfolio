/**
 * @fileoverview Class Name Utility
 * Combines class names using clsx and tailwind-merge for conflict resolution.
 * 
 * @module utils/cn
 * @author Armand Richelet-Kleinberg
 * @license MIT
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, with Tailwind CSS conflict resolution.
 * 
 * @remarks
 * This utility merges class names intelligently, resolving Tailwind CSS conflicts
 * (e.g., `bg-red-500` and `bg-blue-500` will result in only `bg-blue-500`).
 * 
 * @param inputs - Variable number of class values (strings, arrays, objects, etc.)
 * @returns A single merged class name string
 * 
 * @example
 * ```typescript
 * // Basic usage
 * cn("px-2 py-1", "bg-blue-500"); // "px-2 py-1 bg-blue-500"
 * 
 * // With conditional classes
 * cn("base-class", isActive && "active-class"); // "base-class active-class" or "base-class"
 * 
 * // With Tailwind conflict resolution
 * cn("bg-red-500", "bg-blue-500"); // "bg-blue-500"
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
