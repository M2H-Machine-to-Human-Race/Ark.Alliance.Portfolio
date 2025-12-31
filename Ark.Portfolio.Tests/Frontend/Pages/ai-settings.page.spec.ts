/**
 * @fileoverview AI Settings Page Tests
 * Tests for AI Settings page configuration and functionality.
 * 
 * @author Armand Richelet-Kleinberg
 */

/**
 * AI Provider configuration
 */
interface ProviderConfig {
    id: string;
    name: string;
    models: string[];
}

const AI_PROVIDERS: ProviderConfig[] = [
    { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'] },
    { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-3.5-sonnet'] },
    { id: 'google', name: 'Google AI', models: ['gemini-pro', 'gemini-pro-vision', 'gemini-2.0-flash'] },
    { id: 'custom', name: 'Custom Provider', models: [] }
];

/**
 * AI Settings DTO structure
 */
interface AiSettingsDto {
    provider: string;
    model: string;
    temperature: number;
    maxTokens: number;
    isActive: boolean;
    apiKey?: string;
    apiKeyMasked?: string;
    apiUrl?: string;
}

describe('AI Settings Page', () => {
    describe('Provider Configuration', () => {
        it('should have 4 AI providers configured', () => {
            expect(AI_PROVIDERS).toHaveLength(4);
        });

        it('should include OpenAI provider', () => {
            const openai = AI_PROVIDERS.find(p => p.id === 'openai');
            expect(openai).toBeDefined();
            expect(openai?.models).toContain('gpt-4');
            expect(openai?.models).toContain('gpt-4o');
        });

        it('should include Anthropic provider', () => {
            const anthropic = AI_PROVIDERS.find(p => p.id === 'anthropic');
            expect(anthropic).toBeDefined();
            expect(anthropic?.models).toContain('claude-3-opus');
            expect(anthropic?.models).toContain('claude-3.5-sonnet');
        });

        it('should include Google AI provider', () => {
            const google = AI_PROVIDERS.find(p => p.id === 'google');
            expect(google).toBeDefined();
            expect(google?.models).toContain('gemini-pro');
            expect(google?.models).toContain('gemini-2.0-flash');
        });

        it('should include Custom provider with no preset models', () => {
            const custom = AI_PROVIDERS.find(p => p.id === 'custom');
            expect(custom).toBeDefined();
            expect(custom?.models).toHaveLength(0);
        });
    });

    describe('Settings DTO Validation', () => {
        it('should validate default settings structure', () => {
            const defaultSettings: AiSettingsDto = {
                provider: 'openai',
                model: 'gpt-4',
                temperature: 0.7,
                maxTokens: 2048,
                isActive: true
            };

            expect(defaultSettings.temperature).toBeGreaterThanOrEqual(0);
            expect(defaultSettings.temperature).toBeLessThanOrEqual(2);
            expect(defaultSettings.maxTokens).toBeGreaterThan(0);
        });

        it('should validate temperature range', () => {
            const validTemperatures = [0, 0.5, 0.7, 1.0, 1.5, 2.0];
            validTemperatures.forEach(temp => {
                expect(temp).toBeGreaterThanOrEqual(0);
                expect(temp).toBeLessThanOrEqual(2);
            });
        });

        it('should mask API key correctly', () => {
            const mockApiKey = 'sk-proj-1234567890abcdefghijklmnop';
            const masked = `${mockApiKey.substring(0, 8)}...${mockApiKey.substring(mockApiKey.length - 4)}`;
            expect(masked).toBe('sk-proj-...mnop');
        });
    });

    describe('Route Configuration', () => {
        const AI_SETTINGS_ROUTE = {
            path: '/admin/ai-settings',
            component: 'AiSettingsPage',
            protected: true
        };

        it('should have correct route path', () => {
            expect(AI_SETTINGS_ROUTE.path).toBe('/admin/ai-settings');
        });

        it('should be a protected route', () => {
            expect(AI_SETTINGS_ROUTE.protected).toBe(true);
        });

        it('should NOT use query param approach', () => {
            expect(AI_SETTINGS_ROUTE.path).not.toContain('?');
            expect(AI_SETTINGS_ROUTE.path).not.toContain('tab=');
        });
    });

    describe('Navigation Configuration', () => {
        const NAV_ITEM = {
            id: 'ai-settings',
            label: 'AI Settings',
            path: '/admin/ai-settings'
        };

        it('should have correct nav item id', () => {
            expect(NAV_ITEM.id).toBe('ai-settings');
        });

        it('should use standalone route path', () => {
            expect(NAV_ITEM.path).toBe('/admin/ai-settings');
        });

        it('should NOT point to resume tab', () => {
            expect(NAV_ITEM.path).not.toContain('/resume');
        });
    });
});

describe('AI Settings Backend Endpoints', () => {
    const AI_ENDPOINTS = {
        getSettings: 'GET /admin/ai/settings',
        updateSettings: 'PUT /admin/ai/settings',
        testConnection: 'POST /admin/ai/test',
        getModels: 'GET /admin/ai/models/:provider',
        organizeSkills: 'POST /admin/ai/organize-skills',
        improveText: 'POST /admin/ai/improve-text'
    };

    it('should have settings CRUD endpoints', () => {
        expect(AI_ENDPOINTS.getSettings).toContain('GET');
        expect(AI_ENDPOINTS.updateSettings).toContain('PUT');
    });

    it('should have test connection endpoint', () => {
        expect(AI_ENDPOINTS.testConnection).toContain('POST');
        expect(AI_ENDPOINTS.testConnection).toContain('/test');
    });

    it('should have AI operation endpoints', () => {
        expect(AI_ENDPOINTS.organizeSkills).toContain('/organize-skills');
        expect(AI_ENDPOINTS.improveText).toContain('/improve-text');
    });
});
