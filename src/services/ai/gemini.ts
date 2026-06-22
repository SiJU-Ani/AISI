/**
 * Google Gemini AI Provider
 * Implements the BaseAIProvider interface for Google's Gemini API
 */

import { BaseAIProvider } from './provider';
import type {
  AIMessage,
  AIRequestOptions,
  AIResponse,
} from '@/config/ai';
import { AI_CONFIG } from '@/config';

/**
 * Gemini-specific message format
 */
interface GeminiContent {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface GeminiRequest {
  contents: GeminiContent[];
  generationConfig: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
    stopSequences?: string[];
  };
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

/**
 * Gemini API Provider Implementation
 */
export class GeminiProvider extends BaseAIProvider {
  private baseUrl: string;

  constructor(model: string, apiKey: string) {
    super('gemini', model, apiKey);
    this.baseUrl = `${AI_CONFIG.gemini.endpoint}/${model}:generateContent`;
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
   * Stream message (not supported yet, falls back to regular response)
   */
  async streamMessage(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    options?: AIRequestOptions,
  ): Promise<AIResponse> {
    // TODO: Implement streaming support
    console.warn('Streaming not yet implemented for Gemini. Using regular message.');
    const response = await this.sendMessage(messages, options);
    onChunk(response.content);
    return response;
  }

  /**
   * Check if provider is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Make a simple test call
      const testMessages: AIMessage[] = [
        { role: 'user', content: 'test' },
      ];
      const response = await this.sendMessage(testMessages, { maxTokens: 10 });
      return Boolean(response);
    } catch (error) {
      console.error('Gemini provider check failed:', error);
      return false;
    }
  }

  /**
   * Build request payload for Gemini API
   */
  private buildRequest(
    messages: AIMessage[],
    options: AIRequestOptions,
  ): GeminiRequest {
    // Separate system messages from conversation
    const systemMessages = messages.filter((m) => m.role === 'system');
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    // Convert to Gemini format
    const contents: GeminiContent[] = conversationMessages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const request: GeminiRequest = {
      contents,
      generationConfig: {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
        topP: options.topP,
        topK: options.topK,
        stopSequences: options.stopSequences,
      },
    };

    // Add system instruction if present
    if (systemMessages.length > 0) {
      request.systemInstruction = {
        parts: [{ text: systemMessages.map((m) => m.content).join('\n') }],
      };
    }

    return request;
  }

  /**
   * Make API call to Gemini
   */
  private async callAPI(request: GeminiRequest, timeout: number): Promise<GeminiResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
   * Parse Gemini response into standard format
   */
  private parseResponse(response: GeminiResponse): AIResponse {
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No candidates in Gemini response');
    }

    const content = response.candidates[0].content.parts
      .map((part) => part.text)
      .join('');

    return {
      content,
      model: this.model,
      provider: 'gemini',
      usage: response.usageMetadata
        ? {
          promptTokens: response.usageMetadata.promptTokenCount,
          completionTokens: response.usageMetadata.candidatesTokenCount,
          totalTokens: response.usageMetadata.totalTokenCount,
        }
        : undefined,
    };
  }
}
