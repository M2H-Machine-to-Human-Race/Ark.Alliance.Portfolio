import { AiProviderEnum } from '../enums/ai-provider.enum';

/**
 * AI Provider Configuration Data.
 * Contains metadata about supported models and provider descriptions.
 * Icon rendering is handled by the UI layer to keep this shared layer framework-agnostic.
 */
export const AI_PROVIDER_CONFIG = [
    {
        id: AiProviderEnum.OPENAI,
        name: 'OpenAI',
        models: ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
        description: 'Industry-leading AI models with strong reasoning capabilities'
    },
    {
        id: AiProviderEnum.ANTHROPIC,
        name: 'Anthropic',
        models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-3.5-sonnet'],
        description: 'Advanced AI with focus on safety and helpfulness'
    },
    {
        id: AiProviderEnum.GOOGLE,
        name: 'Google AI',
        models: ['gemini-pro', 'gemini-pro-vision', 'gemini-2.0-flash'],
        description: 'Multimodal AI models from Google DeepMind'
    },
    {
        id: AiProviderEnum.CUSTOM,
        name: 'Custom Provider',
        models: [],
        description: 'Configure your own AI endpoint (OpenAI-compatible)'
    }
];

/**
 * Map of available models per provider for quick lookup.
 */
export const PROVIDER_MODELS: Record<AiProviderEnum, string[]> = {
    [AiProviderEnum.OPENAI]: ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    [AiProviderEnum.ANTHROPIC]: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-3.5-sonnet'],
    [AiProviderEnum.GOOGLE]: ['gemini-pro', 'gemini-pro-vision', 'gemini-2.0-flash'],
    [AiProviderEnum.CUSTOM]: []
};
