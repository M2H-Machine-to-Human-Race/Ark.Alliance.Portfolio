/**
 * @fileoverview Theme AI Assistant Component
 * Chat interface for AI-assisted theme editing.
 * 
 * @module pages/Admin/Themes/ThemeAiAssistant
 * @author Armand Richelet-Kleinberg
 */

import React, { useState, useRef, useEffect } from 'react';
import { useThemeAiAssistantModel, ChatMessage, PropertyChange } from './ThemeAiAssistant.model';
import { Send, Trash2, Sparkles, Wand2, Copy, Check, AlertCircle } from 'lucide-react';
import './ThemeAiAssistant.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface MessageBubbleProps {
    message: ChatMessage;
    onApplyChanges?: (changes: PropertyChange[]) => void;
    onCopyCss?: (css: string) => void;
}

/**
 * Single chat message bubble
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onApplyChanges, onCopyCss }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (message.cssSnippet) {
            navigator.clipboard.writeText(message.cssSnippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            onCopyCss?.(message.cssSnippet);
        }
    };

    return (
        <div className={`tai-message ${message.role}`}>
            <div className="tai-message-content">
                <p>{message.content}</p>

                {/* Property Changes */}
                {message.changes && message.changes.length > 0 && (
                    <div className="tai-changes">
                        <h4>Suggested Changes:</h4>
                        <ul>
                            {message.changes.map((change, idx) => (
                                <li key={idx} className="tai-change">
                                    <code>{change.property}</code>
                                    <span className="tai-change-arrow">→</span>
                                    <code className="tai-change-value">{change.suggestedValue}</code>
                                    <small>{change.reason}</small>
                                </li>
                            ))}
                        </ul>
                        {onApplyChanges && (
                            <button
                                className="tai-apply-btn"
                                onClick={() => onApplyChanges(message.changes!)}
                            >
                                <Wand2 size={14} />
                                Apply All Changes
                            </button>
                        )}
                    </div>
                )}

                {/* CSS Snippet */}
                {message.cssSnippet && (
                    <div className="tai-css-snippet">
                        <div className="tai-css-header">
                            <span>CSS</span>
                            <button onClick={handleCopy} title="Copy to clipboard">
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                        <pre><code>{message.cssSnippet}</code></pre>
                    </div>
                )}
            </div>
            <span className="tai-message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ThemeAiAssistantProps {
    /** Current theme CSS for context */
    currentCss?: string;
    /** Current theme name */
    themeName?: string;
    /** Callback when user wants to apply changes */
    onApplyChanges?: (changes: PropertyChange[]) => void;
    /** Callback when CSS is copied */
    onCopyCss?: (css: string) => void;
}

/**
 * Theme AI Assistant Chat Interface
 */
export const ThemeAiAssistant: React.FC<ThemeAiAssistantProps> = ({
    currentCss,
    themeName,
    onApplyChanges,
    onCopyCss
}) => {
    const vm = useThemeAiAssistantModel();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [vm.messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || vm.isLoading) return;

        vm.sendMessage(input.trim(), currentCss, themeName);
        setInput('');
    };

    const handleQuickAction = (action: 'generate' | 'suggest') => {
        if (action === 'generate') {
            const desc = prompt('Describe the theme you want to create:');
            if (desc) vm.generateTheme(desc);
        } else if (action === 'suggest' && currentCss) {
            const goal = prompt('What style would you like to achieve? (optional)');
            vm.suggestImprovements(currentCss, goal || undefined);
        }
    };

    return (
        <div className="theme-ai-assistant">
            {/* Header */}
            <div className="tai-header">
                <div className="tai-header-title">
                    <Sparkles size={18} />
                    <span>AI Theme Assistant</span>
                </div>
                <div className="tai-header-actions">
                    <button
                        onClick={() => handleQuickAction('generate')}
                        className="tai-quick-btn"
                        title="Generate new theme"
                    >
                        <Wand2 size={14} />
                        Generate
                    </button>
                    {currentCss && (
                        <button
                            onClick={() => handleQuickAction('suggest')}
                            className="tai-quick-btn"
                            title="Get improvement suggestions"
                        >
                            <Sparkles size={14} />
                            Suggest
                        </button>
                    )}
                    {vm.messages.length > 0 && (
                        <button
                            onClick={vm.clearMessages}
                            className="tai-clear-btn"
                            title="Clear conversation"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Error Display */}
            {vm.error && (
                <div className="tai-error">
                    <AlertCircle size={14} />
                    <span>{vm.error}</span>
                    <button onClick={vm.clearError}>×</button>
                </div>
            )}

            {/* Messages */}
            <div className="tai-messages">
                {vm.messages.length === 0 ? (
                    <div className="tai-empty">
                        <Sparkles size={32} />
                        <p>Ask me anything about theme design!</p>
                        <small>Try: "Make the colors more vibrant" or "Add a purple accent"</small>
                    </div>
                ) : (
                    vm.messages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onApplyChanges={onApplyChanges}
                            onCopyCss={onCopyCss}
                        />
                    ))
                )}
                {vm.isLoading && (
                    <div className="tai-message assistant">
                        <div className="tai-typing">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="tai-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Describe the style change you want..."
                    disabled={vm.isLoading}
                    className="tai-input"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || vm.isLoading}
                    className="tai-send-btn"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ThemeAiAssistant;
