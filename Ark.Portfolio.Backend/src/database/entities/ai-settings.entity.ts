/**
 * @fileoverview AI Settings Entity
 * Stores AI provider configuration with encrypted API key storage.
 * 
 * @module entities/ai-settings
 * @author Armand Richelet-Kleinberg
 * @since 1.0.0
 * 
 * @example
 * // Creating a new AI settings record
 * const settings = new AiSettings();
 * settings.provider = 'openai';
 * settings.model = 'gpt-4';
 * settings.apiKeyEncrypted = encrypt(apiKey);
 * await repository.save(settings);
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Supported AI providers.
 * @enum {string}
 */
export enum AiProvider {
    /** OpenAI (GPT-3.5, GPT-4) */
    OPENAI = 'openai',
    /** Anthropic (Claude) */
    ANTHROPIC = 'anthropic',
    /** Google (Gemini) */
    GOOGLE = 'google',
    /** Custom/self-hosted API */
    CUSTOM = 'custom'
}

/**
 * AI Settings entity for storing provider configuration.
 * 
 * @class AiSettings
 * @description Stores AI configuration including provider, model, and encrypted API key.
 * Only one active configuration is used at a time.
 * 
 * @remarks
 * - API keys are stored encrypted using AES-256-GCM
 * - Temperature and maxTokens control response generation
 * - Use the AiService to manage settings with encryption handling
 * 
 * @see {@link AiService} for configuration management
 * @see {@link encrypt} for API key encryption
 */
@Entity('ai_settings')
export class AiSettings {
    /**
     * Unique identifier for the settings record.
     * @type {number}
     */
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * AI provider identifier.
     * @type {string}
     * @default 'openai'
     * @example 'openai', 'anthropic', 'google', 'custom'
     */
    @Column({ length: 50, default: 'openai' })
    provider!: string;

    /**
     * Custom API URL for self-hosted or alternative endpoints.
     * @type {string | null}
     * @remarks Only used when provider is 'custom' or for proxy setups
     */
    @Column({ length: 500, nullable: true })
    apiUrl!: string;

    /**
     * Encrypted API key for the provider.
     * @type {string | null}
     * @remarks Encrypted using AES-256-GCM via encryption utility
     * @see {@link encrypt} for encryption details
     */
    @Column('text', { nullable: true })
    apiKeyEncrypted!: string;

    /**
     * Model identifier to use.
     * @type {string}
     * @default 'gpt-4'
     * @example 'gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'gemini-pro'
     */
    @Column({ length: 100, default: 'gpt-4' })
    model!: string;

    /**
     * Sampling temperature for response generation.
     * @type {number}
     * @default 0.7
     * @remarks Range: 0.0 (deterministic) to 2.0 (creative)
     */
    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.7 })
    temperature!: number;

    /**
     * Maximum tokens in the response.
     * @type {number}
     * @default 2000
     */
    @Column({ type: 'integer', default: 2000 })
    maxTokens!: number;

    /**
     * Whether this configuration is currently active.
     * @type {boolean}
     * @default true
     */
    @Column({ default: true })
    isActive!: boolean;

    /**
     * Record creation timestamp.
     * @type {Date}
     */
    @CreateDateColumn()
    createdAt!: Date;

    /**
     * Record last update timestamp.
     * @type {Date}
     */
    @UpdateDateColumn()
    updatedAt!: Date;
}

