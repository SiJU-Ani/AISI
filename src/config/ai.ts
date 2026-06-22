/**
 * AI Provider Abstraction Layer
 * Centralizes AI provider configuration and switching logic
 */

import { AI_CONFIG } from './index';

export type AIProvider = 'gemini' | 'openrouter';

export type AIMessageRole = 'user' | 'assistant' | 'system';

export interface AIMessage {
  role: AIMessageRole;
  content: string;
}

export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  timeout?: number;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: AIProvider;
}

export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

/**
 * Get current AI provider configuration
 */
export function getCurrentAIConfig(): AIProviderConfig {
  const provider = AI_CONFIG.provider;
  const apiKey = AI_CONFIG.apiKeys[provider];

  if (!apiKey) {
    throw new Error(
      `API key not configured for provider: ${provider}. ` +
      `Please set ${provider === 'gemini' ? 'GEMINI_API_KEY' : 'OPENROUTER_API_KEY'} in .env`,
    );
  }

  return {
    provider,
    model: AI_CONFIG.model,
    apiKey,
  };
}

/**
 * Check if a provider is available and configured
 */
export function isProviderAvailable(provider: AIProvider): boolean {
  const apiKey = AI_CONFIG.apiKeys[provider];
  return Boolean(apiKey && apiKey.length > 0);
}

/**
 * Get list of available providers
 */
export function getAvailableProviders(): AIProvider[] {
  const available: AIProvider[] = [];

  if (isProviderAvailable('gemini')) {
    available.push('gemini');
  }

  if (isProviderAvailable('openrouter')) {
    available.push('openrouter');
  }

  return available;
}

/**
 * Switch to a different AI provider
 * Note: This requires environment variable to be changed (not runtime switching)
 */
export function getSwitchProviderInstruction(toProvider: AIProvider): string {
  return `To switch to ${toProvider} provider, set VITE_AI_PROVIDER=${toProvider} in your .env file and restart the application.`;
}

/**
 * Validate AI configuration
 */
export function validateAIConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    const config = getCurrentAIConfig();
    if (!config.apiKey) {
      errors.push(`No API key configured for ${config.provider}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error.message);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
