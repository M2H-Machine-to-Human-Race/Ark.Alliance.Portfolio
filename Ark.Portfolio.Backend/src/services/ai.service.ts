/**
 * @fileoverview AI Service
 * Multi-provider AI integration for text generation and CV assistance.
 * 
 * @module services/ai
 * @author Armand Richelet-Kleinberg
 * @since 1.0.0
 * 
 * @description
 * Provides a unified interface for AI completions across multiple providers:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude)
 * - Google (Gemini)
 * - Custom/self-hosted endpoints
 * 
 * Features:
 * - Encrypted API key storage
 * - Connection testing
 * - CV-specific operations (skill organization, text improvement)
 * 
 * @example
 * // Basic usage
 * const aiService = new AiService();
 * 
 * // Get current settings
 * const settings = await aiService.getSettings();
 * 
 * // Generate completion
 * const response = await aiService.generateCompletion({
 *     prompt: 'Summarize this text...',
 *     context: 'You are a professional editor.'
 * });
 * 
 * // CV assistance
 * const improved = await aiService.improveDescription(
 *     'Worked on projects',
 *     'work experience'
 * );
 * 
 * @see {@link AiSettings} for configuration entity
 * @see {@link encrypt} for API key encryption
 */

import { AiSettingsRepository } from '../database/repositories/ai-settings.repository';
import { AiSettings } from '../database/entities/ai-settings.entity';
import { encrypt, decrypt, maskApiKey } from '../utils/encryption';
import { CrudResponseDto } from '@ark/portfolio-share';

/**
 * Request object for AI completion.
 * 
 * @interface AiCompletionRequest
 */
interface AiCompletionRequest {
    /** The prompt/question to send to the AI */
    prompt: string;
    /** Optional system context/instructions */
    context?: string;
    /** Override default max tokens */
    maxTokens?: number;
}

/**
 * Response object from AI completion.
 * 
 * @interface AiCompletionResponse
 */
interface AiCompletionResponse {
    /** Generated text response */
    result: string;
    /** Token usage statistics (if available) */
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    /** Error message if request failed */
    error?: string;
}

/**
 * Data transfer object for AI settings.
 * 
 * @interface AiSettingsDto
 */
interface AiSettingsDto {
    /** Settings record ID */
    id?: number;
    /** AI provider identifier */
    provider: string;
    /** Custom API URL (optional) */
    apiUrl?: string;
    /** API key (plaintext, for updates only) */
    apiKey?: string;
    /** Masked API key for display */
    apiKeyMasked?: string;
    /** Model identifier */
    model: string;
    /** Temperature setting (0-2) */
    temperature: number;
    /** Maximum response tokens */
    maxTokens: number;
    /** Whether AI is enabled */
    isActive: boolean;
}

/**
 * AI Service class for multi-provider AI integration.
 * 
 * @class AiService
 * @description Provides AI completion capabilities with secure API key management
 * and CV-specific assistance features.
 * 
 * @remarks
 * - API keys are stored encrypted in the database
 * - Supports OpenAI, Anthropic, Google, and custom providers
 * - Includes CV-specific helpers for skill organization and text improvement
 */
export class AiService {
    /** @private Repository for AI settings */
    private settingsRepo = new AiSettingsRepository();

    /**
     * Default API URLs for each provider.
     * @private
     */
    private readonly providerUrls: Record<string, string> = {
        'openai': 'https://api.openai.com/v1/chat/completions',
        'anthropic': 'https://api.anthropic.com/v1/messages',
        'google': 'https://generativelanguage.googleapis.com/v1beta/models',
    };

    /**
     * Available models for each provider.
     * @private
     */
    private readonly providerModels: Record<string, string[]> = {
        'openai': ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        'anthropic': ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        'google': ['gemini-pro', 'gemini-pro-vision'],
        'custom': []
    };

    /**
     * Get current AI settings.
     * 
     * @returns {Promise<AiSettingsDto | null>} Settings DTO with masked API key, or null if not configured
     * 
     * @description
     * Retrieves the current AI configuration with the API key masked for security.
     * 
     * @example
     * const settings = await aiService.getSettings();
     * if (settings) {
     *     console.log(`Using ${settings.provider} - ${settings.model}`);
     *     console.log(`API Key: ${settings.apiKeyMasked}`); // 'sk-a...xyz'
     * }
     */
    async getSettings(): Promise<AiSettingsDto | null> {
        const settings = await this.settingsRepo.getFirst();
        if (!settings) return null;

        return {
            id: settings.id,
            provider: settings.provider,
            apiUrl: settings.apiUrl,
            apiKeyMasked: maskApiKey(decrypt(settings.apiKeyEncrypted || '')),
            model: settings.model,
            temperature: Number(settings.temperature),
            maxTokens: settings.maxTokens,
            isActive: settings.isActive
        };
    }

    /**
     * Update AI settings.
     * 
     * @param dto - Settings data to update
     * @returns {Promise<CrudResponseDto<AiSettings>>} CRUD response with updated settings
     * 
     * @description
     * Updates AI configuration. Creates new settings if none exist.
     * API key is only updated if a new (non-masked) value is provided.
     * 
     * @example
     * const result = await aiService.updateSettings({
     *     provider: 'openai',
     *     apiKey: 'sk-new-key...',
     *     model: 'gpt-4',
     *     temperature: 0.7,
     *     maxTokens: 2000,
     *     isActive: true
     * });
     * 
     * @remarks
     * - Masked API keys (containing '...') are ignored
     * - New API keys are encrypted before storage
     */
    async updateSettings(dto: AiSettingsDto): Promise<CrudResponseDto<AiSettings>> {
        try {
            let settings = await this.settingsRepo.getFirst();

            const updateData: Partial<AiSettings> = {
                provider: dto.provider,
                apiUrl: dto.apiUrl || this.providerUrls[dto.provider],
                model: dto.model,
                temperature: dto.temperature,
                maxTokens: dto.maxTokens,
                isActive: dto.isActive
            };

            // Only update API key if a new one is provided (not masked)
            if (dto.apiKey && !dto.apiKey.includes('...')) {
                updateData.apiKeyEncrypted = encrypt(dto.apiKey);
            }

            if (!settings) {
                settings = await this.settingsRepo.create(updateData as AiSettings);
            } else {
                await this.settingsRepo.update(settings.id, updateData);
                settings = await this.settingsRepo.findById(settings.id) || settings;
            }

            return {
                success: true,
                message: 'AI settings updated successfully',
                data: settings,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update AI settings',
                errors: [(error as Error).message],
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get available models for a provider.
     * 
     * @param provider - Provider identifier ('openai', 'anthropic', 'google')
     * @returns {Promise<string[]>} Array of model identifiers
     * 
     * @example
     * const models = await aiService.getProviderModels('openai');
     * // ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
     */
    async getProviderModels(provider: string): Promise<string[]> {
        return this.providerModels[provider] || [];
    }

    /**
     * Test the AI connection with current settings.
     * 
     * @returns {Promise<{ success: boolean; message: string }>} Connection test result
     * 
     * @description
     * Sends a simple test prompt to verify API connectivity and authentication.
     * 
     * @example
     * const result = await aiService.testConnection();
     * if (result.success) {
     *     console.log('AI provider connected successfully');
     * } else {
     *     console.error('Connection failed:', result.message);
     * }
     */
    async testConnection(): Promise<{ success: boolean; message: string }> {
        const settings = await this.settingsRepo.getFirst();
        if (!settings) {
            return { success: false, message: 'No AI settings configured' };
        }

        try {
            const apiKey = decrypt(settings.apiKeyEncrypted || '');
            if (!apiKey) {
                return { success: false, message: 'API key not configured' };
            }

            const response = await this.generateCompletion({
                prompt: 'Say "connected" if you receive this.',
                maxTokens: 10
            });

            if (response.error) {
                return { success: false, message: response.error };
            }

            return { success: true, message: 'Connection successful' };
        } catch (error) {
            return { success: false, message: (error as Error).message };
        }
    }

    /**
     * Generate an AI completion.
     * 
     * @param request - Completion request with prompt and options
     * @returns {Promise<AiCompletionResponse>} Generated response or error
     * 
     * @description
     * Sends a prompt to the configured AI provider and returns the response.
     * 
     * @example
     * const response = await aiService.generateCompletion({
     *     prompt: 'Explain TypeScript generics',
     *     context: 'You are a programming tutor.',
     *     maxTokens: 500
     * });
     * 
     * if (response.error) {
     *     console.error(response.error);
     * } else {
     *     console.log(response.result);
     * }
     */
    async generateCompletion(request: AiCompletionRequest): Promise<AiCompletionResponse> {
        const settings = await this.settingsRepo.getFirst();
        if (!settings || !settings.isActive) {
            return { result: '', error: 'AI service not configured or disabled' };
        }

        const apiKey = decrypt(settings.apiKeyEncrypted || '');
        if (!apiKey) {
            return { result: '', error: 'API key not configured' };
        }

        try {
            const response = await this.callProvider(settings, apiKey, request);
            return response;
        } catch (error) {
            return { result: '', error: (error as Error).message };
        }
    }

    /**
     * Route request to appropriate provider.
     * @private
     */
    private async callProvider(
        settings: AiSettings,
        apiKey: string,
        request: AiCompletionRequest
    ): Promise<AiCompletionResponse> {
        const url = settings.apiUrl || this.providerUrls[settings.provider];
        const maxTokens = request.maxTokens || settings.maxTokens;

        switch (settings.provider) {
            case 'openai':
                return this.callOpenAI(url, apiKey, settings, request, maxTokens);
            case 'anthropic':
                return this.callAnthropic(url, apiKey, settings, request, maxTokens);
            case 'google':
                return this.callGoogle(url, apiKey, settings, request, maxTokens);
            default:
                return this.callOpenAI(url, apiKey, settings, request, maxTokens);
        }
    }

    /**
     * Call OpenAI API.
     * @private
     */
    private async callOpenAI(
        url: string,
        apiKey: string,
        settings: AiSettings,
        request: AiCompletionRequest,
        maxTokens: number
    ): Promise<AiCompletionResponse> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: settings.model,
                messages: [
                    { role: 'system', content: request.context || 'You are a helpful assistant.' },
                    { role: 'user', content: request.prompt }
                ],
                temperature: Number(settings.temperature),
                max_tokens: maxTokens
            })
        });

        const data = await response.json();
        if (!response.ok) {
            return { result: '', error: data.error?.message || 'API request failed' };
        }

        return {
            result: data.choices?.[0]?.message?.content || '',
            usage: data.usage ? {
                promptTokens: data.usage.prompt_tokens,
                completionTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens
            } : undefined
        };
    }

    /**
     * Call Anthropic API.
     * @private
     */
    private async callAnthropic(
        url: string,
        apiKey: string,
        settings: AiSettings,
        request: AiCompletionRequest,
        maxTokens: number
    ): Promise<AiCompletionResponse> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2024-01-01'
            },
            body: JSON.stringify({
                model: settings.model,
                system: request.context || 'You are a helpful assistant.',
                messages: [{ role: 'user', content: request.prompt }],
                temperature: Number(settings.temperature),
                max_tokens: maxTokens
            })
        });

        const data = await response.json();
        if (!response.ok) {
            return { result: '', error: data.error?.message || 'API request failed' };
        }

        return {
            result: data.content?.[0]?.text || '',
            usage: data.usage ? {
                promptTokens: data.usage.input_tokens,
                completionTokens: data.usage.output_tokens,
                totalTokens: data.usage.input_tokens + data.usage.output_tokens
            } : undefined
        };
    }

    /**
     * Call Google Gemini API.
     * @private
     */
    private async callGoogle(
        url: string,
        apiKey: string,
        settings: AiSettings,
        request: AiCompletionRequest,
        maxTokens: number
    ): Promise<AiCompletionResponse> {
        const fullUrl = `${url}/${settings.model}:generateContent?key=${apiKey}`;

        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: request.prompt }] }],
                generationConfig: {
                    temperature: Number(settings.temperature),
                    maxOutputTokens: maxTokens
                }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            return { result: '', error: data.error?.message || 'API request failed' };
        }

        return {
            result: data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        };
    }

    // ============================================
    // AI-Assisted CV Operations
    // ============================================

    /**
     * Use AI to organize skills into categories.
     * 
     * @param skills - Array of skills with id and name
     * @returns {Promise<{ categories: Array, suggestions: string[] }>} Organized categories and suggestions
     * 
     * @description
     * Analyzes skills using AI and groups them into logical categories.
     * Also provides suggestions for missing skills or improvements.
     * 
     * @example
     * const result = await aiService.organizeSkills([
     *     { id: 1, name: 'TypeScript' },
     *     { id: 2, name: 'React' },
     *     { id: 3, name: 'PostgreSQL' }
     * ]);
     * // { categories: [{ name: 'Frontend', skills: [1, 2] }], suggestions: [...] }
     */
    async organizeSkills(skills: Array<{ id: number; name: string; level?: string }>): Promise<{
        categories: Array<{ name: string; skills: number[] }>;
        suggestions: string[];
    }> {
        const prompt = `Analyze these skills and organize them into logical categories. 
Skills: ${skills.map(s => s.name).join(', ')}

Respond in JSON format:
{
  "categories": [
    { "name": "Category Name", "skillNames": ["skill1", "skill2"] }
  ],
  "suggestions": ["Any missing skills or improvements suggested"]
}`;

        const response = await this.generateCompletion({
            prompt,
            context: 'You are a professional CV and HR expert organizing technical skills.'
        });

        try {
            const parsed = JSON.parse(response.result);
            const categories = parsed.categories.map((cat: any) => ({
                name: cat.name,
                skills: cat.skillNames.map((name: string) =>
                    skills.find(s => s.name.toLowerCase() === name.toLowerCase())?.id
                ).filter(Boolean)
            }));

            return { categories, suggestions: parsed.suggestions || [] };
        } catch {
            return { categories: [], suggestions: ['AI parsing failed'] };
        }
    }

    /**
     * Use AI to improve a text description.
     * 
     * @param text - Original text to improve
     * @param context - Context for improvement (default: 'professional CV')
     * @returns {Promise<string>} Improved text
     * 
     * @description
     * Enhances text to be more professional, impactful, and concise.
     * Preserves the original meaning while improving language.
     * 
     * @example
     * const improved = await aiService.improveDescription(
     *     'I worked on many projects and did coding.',
     *     'work experience'
     * );
     * // 'Led development of multiple software projects, implementing...'
     */
    async improveDescription(text: string, context: string = 'professional CV'): Promise<string> {
        const prompt = `Improve this ${context} description to be more professional, impactful, and concise. 
Keep the same meaning but enhance the language. Return only the improved text, no explanations.

Original: ${text}`;

        const response = await this.generateCompletion({ prompt });
        return response.result || text;
    }
}

