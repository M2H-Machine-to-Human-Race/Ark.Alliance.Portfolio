/**
 * @fileoverview AI DTOs
 * Data Transfer Objects for AI configuration and operations.
 */

/**
 * Available AI providers.
 */
export type AiProvider = 'openai' | 'anthropic' | 'google' | 'custom';

/**
 * AI Settings configuration DTO.
 */
export interface AiSettingsDto {
    id?: number;
    provider: AiProvider;
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
 */
export const AI_PROVIDER_MODELS: Record<AiProvider, string[]> = {
    openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    google: ['gemini-pro', 'gemini-pro-vision'],
    custom: []
};
