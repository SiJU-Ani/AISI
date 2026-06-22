/**
 * AI Provider Interface
 * Defines the contract that all AI providers must implement
 */

import type {
  AIMessage,
  AIRequestOptions,
  AIResponse,
  AIProvider,
} from '@/config/ai';

/**
 * Abstract base class for all AI providers
 * Ensures consistent interface across different LLM providers
 */
export abstract class BaseAIProvider {
  protected provider: AIProvider;
  protected model: string;
  protected apiKey: string;

  constructor(provider: AIProvider, model: string, apiKey: string) {
    this.provider = provider;
    this.model = model;
    this.apiKey = apiKey;

    if (!apiKey) {
      throw new Error(`API key is required for ${provider}`);
    }
  }

  /**
   * Send a message and get a response
   */
  abstract sendMessage(
    messages: AIMessage[],
    options?: AIRequestOptions,
  ): Promise<AIResponse>;

  /**
   * Send a message and stream the response
   */
  abstract streamMessage(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    options?: AIRequestOptions,
  ): Promise<AIResponse>;

  /**
   * Check if the provider is available and configured correctly
   */
  abstract isAvailable(): Promise<boolean>;

  /**
   * Get provider information
   */
  getProviderInfo() {
    return {
      provider: this.provider,
      model: this.model,
      configured: Boolean(this.apiKey),
    };
  }

  /**
   * Apply default options
   */
  protected applyDefaultOptions(options?: AIRequestOptions): AIRequestOptions {
    return {
      temperature: options?.temperature ?? 0.7,
      maxTokens: options?.maxTokens ?? 2048,
      topP: options?.topP ?? 1,
      timeout: options?.timeout ?? 60000,
      ...options,
    };
  }

  /**
   * Format messages for the provider
   */
  protected formatMessages(messages: AIMessage[]): AIMessage[] {
    return messages.filter((msg) => msg.content && msg.content.length > 0);
  }

  /**
   * Validate messages
   */
  protected validateMessages(messages: AIMessage[]): void {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages array cannot be empty');
    }

    for (const msg of messages) {
      if (!msg.role || !['user', 'assistant', 'system'].includes(msg.role)) {
        throw new Error(`Invalid message role: ${msg.role}`);
      }
      if (typeof msg.content !== 'string' || msg.content.length === 0) {
        throw new Error('Message content must be a non-empty string');
      }
    }
  }

  /**
   * Handle API errors gracefully
   */
  protected async handleError(error: any, context: string): Promise<never> {
    const message =
      error?.message ||
      error?.error?.message ||
      JSON.stringify(error) ||
      'Unknown error';

    throw new Error(`[${this.provider}] ${context}: ${message}`);
  }
}

/**
 * Provider factory to create the appropriate provider instance
 */
export function createAIProvider(
  provider: AIProvider,
  model: string,
  apiKey: string,
): BaseAIProvider {
  switch (provider) {
    case 'gemini':
      const { GeminiProvider } = require('./gemini');
      return new GeminiProvider(model, apiKey);

    case 'openrouter':
      const { OpenRouterProvider } = require('./openrouter');
      return new OpenRouterProvider(model, apiKey);

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
