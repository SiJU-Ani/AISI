/**
 * OpenRouter AI Provider
 * Implements the BaseAIProvider interface for OpenRouter's unified LLM API
 * Supports multiple models: Claude, GPT, Llama, and more
 */

import { BaseAIProvider } from './provider';
import type {
  AIMessage,
  AIRequestOptions,
  AIResponse,
} from '@/config/ai';
import { AI_CONFIG } from '@/config';

/**
 * OpenRouter request format
 */
interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  stop?: string[];
  stream?: boolean;
}

/**
 * OpenRouter response format
 */
interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

/**
 * OpenRouter API Provider Implementation
 */
export class OpenRouterProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(model: string, apiKey: string) {
    super('openrouter', model, apiKey);
    this.baseUrl = AI_CONFIG.openrouter.endpoint;
  }

  /**
   * Send a message and get a response
   */
  async sendMessage(
    messages: AIMessage[],
    options?: AIRequestOptions,
  ): Promise<AIResponse> {
    this.validateMessages(messages);
    const opts = this.applyDefaultOptions(options);

    try {
      const request = this.buildRequest(messages, opts);
      const response = await this.callAPI(request, opts.timeout!);

      return this.parseResponse(response);
    } catch (error) {
      return this.handleError(error, 'Failed to send message');
    }
  }

  /**
   * Stream message responses
   */
  async streamMessage(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    options?: AIRequestOptions,
  ): Promise<AIResponse> {
    this.validateMessages(messages);
    const opts = this.applyDefaultOptions(options);

    try {
      const request = { ...this.buildRequest(messages, opts), stream: true };
      const response = await this.callAPIStream(request, onChunk, opts.timeout!);

      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to stream message');
    }
  }

  /**
   * Check if provider is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const testMessages: AIMessage[] = [
        { role: 'user', content: 'test' },
      ];
      const response = await this.sendMessage(testMessages, { maxTokens: 10 });
      return Boolean(response);
    } catch (error) {
      console.error('OpenRouter provider check failed:', error);
      return false;
    }
  }

  /**
   * Build request payload for OpenRouter API
   */
  private buildRequest(
    messages: AIMessage[],
    options: AIRequestOptions,
  ): OpenRouterRequest {
    return {
      model: this.model,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
      top_k: options.topK,
      stop: options.stopSequences,
    };
  }

  /**
   * Make API call to OpenRouter
   */
  private async callAPI(
    request: OpenRouterRequest,
    timeout: number,
  ): Promise<OpenRouterResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'http://localhost',
          'X-Title': 'AISI Platform',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.error?.message ||
          `API request failed with status ${response.status}`,
        );
      }

      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Make streaming API call to OpenRouter
   */
  private async callAPIStream(
    request: OpenRouterRequest,
    onChunk: (chunk: string) => void,
    timeout: number,
  ): Promise<AIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let fullContent = '';
    let model = this.model;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'http://localhost',
          'X-Title': 'AISI Platform',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.error?.message ||
          `API request failed with status ${response.status}`,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              continue;
            }

            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta;

            if (delta?.content) {
              fullContent += delta.content;
              onChunk(delta.content);
            }

            if (parsed.model) {
              model = parsed.model;
            }
          }
        }
      }

      return {
        content: fullContent,
        model,
        provider: 'openrouter',
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parse OpenRouter response into standard format
   */
  private parseResponse(response: OpenRouterResponse): AIResponse {
    if (!response.choices || response.choices.length === 0) {
      throw new Error('No choices in OpenRouter response');
    }

    const content = response.choices[0].message.content;

    return {
      content,
      model: response.model || this.model,
      provider: 'openrouter',
      usage: response.usage
        ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        }
        : undefined,
    };
  }
}
