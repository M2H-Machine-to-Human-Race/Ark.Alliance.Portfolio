/**
 * @fileoverview Theme AI Service
 * AI-assisted theme editing and generation.
 * 
 * @module services/theme-ai
 * @author Armand Richelet-Kleinberg
 * 
 * @description
 * Provides AI-powered theme design assistance:
 * - Natural language theme property suggestions
 * - Full theme generation from descriptions
 * - Conversational theme refinement
 * 
 * Reuses the existing AiService infrastructure for provider management.
 * 
 * @see {@link AiService} for base AI functionality
 */

import { AiService } from './ai.service';

/**
 * Message in a theme AI conversation
 */
export interface ThemeAiMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

/**
 * Proposed theme property change from AI
 */
export interface ThemePropertyChange {
    /** CSS variable or property name */
    property: string;
    /** Original value (if editing) */
    originalValue?: string;
    /** Suggested new value */
    suggestedValue: string;
    /** Explanation of the change */
    reason: string;
}

/**
 * AI response for theme suggestions
 */
export interface ThemeAiResponse {
    /** Chat response message */
    message: string;
    /** Proposed CSS changes */
    changes?: ThemePropertyChange[];
    /** Generated CSS snippet */
    cssSnippet?: string;
    /** Error if request failed */
    error?: string;
}

/**
 * Request for AI theme assistance
 */
export interface ThemeAiRequest {
    /** User's message/prompt */
    message: string;
    /** Current theme CSS content */
    currentCss?: string;
    /** Conversation history */
    history?: ThemeAiMessage[];
    /** Current theme name for context */
    themeName?: string;
}

/**
 * System prompt for theme design assistance
 */
const THEME_SYSTEM_PROMPT = `You are an expert CSS/SCSS theme designer specializing in cyber-futuristic, neon-glow aesthetics.

Your task is to help users modify and create themes through natural language.

When the user describes style changes:
1. Suggest specific CSS variable changes
2. Explain the visual impact of each change
3. Provide the CSS code snippet

Available CSS variables to modify:
- --neon-primary, --neon-cyan, --neon-accent (main colors)
- --bg-deep, --bg-surface, --bg-overlay (backgrounds)
- --text-neon, --text-neon-secondary, --text-neon-muted (text colors)
- --border-neon, --border-neon-bright (borders)
- --glow-soft, --glow-medium, --glow-strong (glow effects)
- --radius-sm, --radius-md, --radius-lg, --radius-xl (border radius)
- --glass-blur-light, --glass-blur-medium (blur effects)

Respond with JSON in this format:
{
  "message": "Your explanation to the user",
  "changes": [
    {
      "property": "--variable-name",
      "originalValue": "old value if known",
      "suggestedValue": "new value",
      "reason": "why this change helps"
    }
  ],
  "cssSnippet": ":root { /* the CSS code */ }"
}

Be creative but practical. Focus on cohesive color palettes and visual harmony.`;

/**
 * Theme AI Service
 * 
 * @class ThemeAiService
 * @description Provides AI-powered theme design assistance using existing AI infrastructure.
 */
export class ThemeAiService {
    private aiService: AiService;

    constructor() {
        this.aiService = new AiService();
    }

    /**
     * Process a theme chat message
     */
    async chat(request: ThemeAiRequest): Promise<ThemeAiResponse> {
        try {
            // Build context with conversation history
            let contextPrompt = THEME_SYSTEM_PROMPT;

            if (request.currentCss) {
                contextPrompt += `\n\nCurrent theme CSS:\n\`\`\`css\n${request.currentCss.substring(0, 2000)}\n\`\`\``;
            }

            if (request.themeName) {
                contextPrompt += `\n\nCurrent theme name: ${request.themeName}`;
            }

            // Build prompt with history
            let prompt = request.message;
            if (request.history && request.history.length > 0) {
                const historyText = request.history
                    .slice(-5) // Last 5 messages for context
                    .map(m => `${m.role}: ${m.content}`)
                    .join('\n');
                prompt = `Previous conversation:\n${historyText}\n\nUser: ${request.message}`;
            }

            const response = await this.aiService.generateCompletion({
                prompt,
                context: contextPrompt,
                maxTokens: 1500
            });

            if (response.error) {
                return { message: '', error: response.error };
            }

            // Parse JSON response
            try {
                const parsed = JSON.parse(response.result);
                return {
                    message: parsed.message || '',
                    changes: parsed.changes || [],
                    cssSnippet: parsed.cssSnippet
                };
            } catch {
                // If not valid JSON, return as plain message
                return { message: response.result };
            }
        } catch (error) {
            return {
                message: '',
                error: (error as Error).message || 'Failed to process request'
            };
        }
    }

    /**
     * Generate a complete theme from a description
     */
    async generateTheme(description: string): Promise<ThemeAiResponse> {
        const prompt = `Create a complete cyber-futuristic theme based on this description:
"${description}"

Generate CSS variables for all available properties. Make it cohesive and visually striking.
Include at least:
- 3 primary/accent colors
- 3 background shades
- 3 text color variants
- Border and glow settings`;

        try {
            const response = await this.aiService.generateCompletion({
                prompt,
                context: THEME_SYSTEM_PROMPT,
                maxTokens: 2000
            });

            if (response.error) {
                return { message: '', error: response.error };
            }

            try {
                const parsed = JSON.parse(response.result);
                return {
                    message: parsed.message || 'Theme generated successfully',
                    changes: parsed.changes || [],
                    cssSnippet: parsed.cssSnippet
                };
            } catch {
                return { message: response.result };
            }
        } catch (error) {
            return {
                message: '',
                error: (error as Error).message || 'Failed to generate theme'
            };
        }
    }

    /**
     * Suggest improvements for existing CSS
     */
    async suggestImprovements(css: string, goal?: string): Promise<ThemeAiResponse> {
        let prompt = `Analyze this theme CSS and suggest improvements for better visual appeal and consistency:\n\n${css.substring(0, 3000)}`;

        if (goal) {
            prompt += `\n\nThe user wants to achieve: ${goal}`;
        }

        try {
            const response = await this.aiService.generateCompletion({
                prompt,
                context: THEME_SYSTEM_PROMPT,
                maxTokens: 1500
            });

            if (response.error) {
                return { message: '', error: response.error };
            }

            try {
                const parsed = JSON.parse(response.result);
                return {
                    message: parsed.message || '',
                    changes: parsed.changes || [],
                    cssSnippet: parsed.cssSnippet
                };
            } catch {
                return { message: response.result };
            }
        } catch (error) {
            return {
                message: '',
                error: (error as Error).message || 'Failed to suggest improvements'
            };
        }
    }
}
