import { AiProviderEnum } from '../enums/ai-provider.enum';
import { PROVIDER_MODELS } from '../constants/ai.constants';

/**
 * @fileoverview AI DTOs
 * Data Transfer Objects for AI configuration and operations.
 */

// Re-export enum for backward compatibility if needed, or just use it directly
export type AiProvider = AiProviderEnum;

/**
 * AI Settings configuration DTO.
 */
export interface AiSettingsDto {
    id?: number;
    provider: AiProviderEnum;
    apiUrl?: string;
    /** Raw API key (only for updates, never returned) */
    apiKey?: string;
    /** Masked API key for display */
    apiKeyMasked?: string;
    model: string;
    temperature: number;
    maxTokens: number;
    isActive: boolean;
}

/**
 * AI completion request.
 */
export interface AiCompletionRequestDto {
    prompt: string;
    context?: string;
    maxTokens?: number;
}

/**
 * AI completion response.
 */
export interface AiCompletionResponseDto {
    result: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    error?: string;
}

/**
 * Skill organization request.
 */
export interface SkillOrganizeRequestDto {
    skills: Array<{ id: number; name: string; level?: string }>;
}

/**
 * Skill organization response.
 */
export interface SkillOrganizeResponseDto {
    categories: Array<{ name: string; skills: number[] }>;
    suggestions: string[];
}

/**
 * Text improvement request.
 */
export interface TextImproveRequestDto {
    text: string;
    context?: string;
}

/**
 * Provider models mapping.
 * @deprecated Use PROVIDER_MODELS from constants/ai.constants
 */
export const AI_PROVIDER_MODELS = PROVIDER_MODELS;
