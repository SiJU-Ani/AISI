/**
 * AI Service Layer
 * Central point for all AI interactions
 * Handles provider initialization and management
 */

import { createAIProvider, BaseAIProvider } from './provider';
import { getCurrentAIConfig, validateAIConfig } from '@/config/ai';
import { getPrompt, listPrompts, SYSTEM_PROMPTS } from '@/config/prompts';
import type { AIMessage, AIRequestOptions, AIResponse } from '@/config/ai';

// Singleton instance
let aiProvider: BaseAIProvider | null = null;

/**
 * Initialize the AI provider
 * Must be called before using AI services
 */
export async function initializeAIProvider(): Promise<BaseAIProvider> {
  if (aiProvider) {
    return aiProvider;
  }

  const validation = validateAIConfig();
  if (!validation.valid) {
    throw new Error(`AI Configuration invalid: ${validation.errors.join(', ')}`);
  }

  const config = getCurrentAIConfig();
  aiProvider = createAIProvider(config.provider, config.model, config.apiKey);

  const available = await aiProvider.isAvailable();
  if (!available) {
    throw new Error(`AI Provider ${config.provider} is not available`);
  }

  console.log(
    `✅ AI Provider initialized: ${config.provider} (${config.model})`,
  );

  return aiProvider;
}

/**
 * Get the current AI provider instance
 */
export function getAIProvider(): BaseAIProvider {
  if (!aiProvider) {
    throw new Error(
      'AI Provider not initialized. Call initializeAIProvider() first.',
    );
  }
  return aiProvider;
}

/**
 * Send a message to the AI provider
 */
export async function sendAIMessage(
  messages: AIMessage[],
  options?: AIRequestOptions,
): Promise<AIResponse> {
  const provider = getAIProvider();
  return provider.sendMessage(messages, options);
}

/**
 * Send a message with streaming response
 */
export async function streamAIMessage(
  messages: AIMessage[],
  onChunk: (chunk: string) => void,
  options?: AIRequestOptions,
): Promise<AIResponse> {
  const provider = getAIProvider();
  return provider.streamMessage(messages, onChunk, options);
}

/**
 * Simple helper: send a message with system prompt
 */
export async function sendAIMessageWithSystem(
  userMessage: string,
  systemPromptKey: keyof typeof SYSTEM_PROMPTS = 'default',
  options?: AIRequestOptions,
): Promise<AIResponse> {
  const systemPrompt = SYSTEM_PROMPTS[systemPromptKey];

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  return sendAIMessage(messages, options);
}

/**
 * Send multiple messages (conversation)
 */
export async function sendAIConversation(
  messages: AIMessage[],
  systemPromptKey?: keyof typeof SYSTEM_PROMPTS,
  options?: AIRequestOptions,
): Promise<AIResponse> {
  let messagesWithSystem = [...messages];

  if (systemPromptKey) {
    const systemPrompt = SYSTEM_PROMPTS[systemPromptKey];
    const hasSystemMessage = messages.some((m) => m.role === 'system');

    if (!hasSystemMessage) {
      messagesWithSystem = [
        { role: 'system', content: systemPrompt },
        ...messages,
      ];
    }
  }

  return sendAIMessage(messagesWithSystem, options);
}

/**
 * Get a prompt from the prompts registry
 */
export function getAIPrompt(
  category: string,
  promptName: string,
): string | null {
  return getPrompt(
    category as keyof typeof SYSTEM_PROMPTS,
    promptName,
  );
}

/**
 * List all available prompts
 */
export function listAIPrompts() {
  return listPrompts();
}

/**
 * Reset provider (for testing or switching)
 */
export function resetAIProvider(): void {
  aiProvider = null;
}

/**
 * Get provider information
 */
export function getAIProviderInfo() {
  const provider = getAIProvider();
  return provider.getProviderInfo();
}

export { BaseAIProvider, createAIProvider } from './provider';
export { GeminiProvider } from './gemini';
export { OpenRouterProvider } from './openrouter';
export type { AIMessage, AIRequestOptions, AIResponse } from '@/config/ai';
