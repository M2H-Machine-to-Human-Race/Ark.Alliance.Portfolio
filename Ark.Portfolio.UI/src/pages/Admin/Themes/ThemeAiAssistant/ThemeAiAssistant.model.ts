/**
 * @fileoverview Theme AI Assistant Model
 * MVVM-compliant viewmodel for AI-assisted theme editing.
 * 
 * @module pages/Admin/Themes/ThemeAiAssistant
 * @author Armand Richelet-Kleinberg
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../../../../api/client/apiClient';
import { generateUniqueId } from '../../../../utils';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Message in conversation
 */
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    changes?: PropertyChange[];
    cssSnippet?: string;
}

/**
 * CSS property change suggestion
 */
export interface PropertyChange {
    property: string;
    originalValue?: string;
    suggestedValue: string;
    reason: string;
}

/**
 * AI Assistant ViewModel interface
 */
export interface ThemeAiAssistantModel {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;

    // Actions
    sendMessage: (message: string, currentCss?: string, themeName?: string) => Promise<void>;
    generateTheme: (description: string) => Promise<ChatMessage | null>;
    suggestImprovements: (css: string, goal?: string) => Promise<ChatMessage | null>;
    clearMessages: () => void;
    clearError: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme AI Assistant ViewModel Hook
 * 
 * @remarks
 * Provides state management and API integration for the AI-assisted
 * theme editing interface. Supports chat, theme generation, and 
 * improvement suggestions.
 * 
 * @returns ThemeAiAssistantModel interface with state and actions
 */
export function useThemeAiAssistantModel(): ThemeAiAssistantModel {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Send a chat message to AI
     */
    const sendMessage = useCallback(async (message: string, currentCss?: string, themeName?: string) => {
        setIsLoading(true);
        setError(null);

        // Add user message
        const userMessage: ChatMessage = {
            id: generateUniqueId('msg'),
            role: 'user',
            content: message,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await apiClient.post('/admin/themes/ai/chat', {
                message,
                currentCss,
                themeName,
                history: messages.slice(-10).map(m => ({
                    role: m.role,
                    content: m.content,
                    timestamp: m.timestamp
                }))
            });

            // Add assistant message
            const assistantMessage: ChatMessage = {
                id: generateUniqueId('msg'),
                role: 'assistant',
                content: response.data.message || 'No response',
                timestamp: new Date(),
                changes: response.data.changes,
                cssSnippet: response.data.cssSnippet
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'Failed to get AI response';
            setError(errMessage);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    /**
     * Generate a complete theme from description
     */
    const generateTheme = useCallback(async (description: string): Promise<ChatMessage | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('/admin/themes/ai/generate', {
                description
            });

            const assistantMessage: ChatMessage = {
                id: generateUniqueId('msg'),
                role: 'assistant',
                content: response.data.message || 'Theme generated',
                timestamp: new Date(),
                changes: response.data.changes,
                cssSnippet: response.data.cssSnippet
            };
            setMessages(prev => [...prev, assistantMessage]);
            return assistantMessage;
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'Failed to generate theme';
            setError(errMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get improvement suggestions for CSS
     */
    const suggestImprovements = useCallback(async (css: string, goal?: string): Promise<ChatMessage | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('/admin/themes/ai/suggest', {
                css,
                goal
            });

            const assistantMessage: ChatMessage = {
                id: generateUniqueId('msg'),
                role: 'assistant',
                content: response.data.message || 'Suggestions ready',
                timestamp: new Date(),
                changes: response.data.changes,
                cssSnippet: response.data.cssSnippet
            };
            setMessages(prev => [...prev, assistantMessage]);
            return assistantMessage;
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'Failed to get suggestions';
            setError(errMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Clear conversation history
     */
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        generateTheme,
        suggestImprovements,
        clearMessages,
        clearError
    };
}

export default useThemeAiAssistantModel;
