/**
 * AI Service Utilities
 * Common helper functions for AI interactions
 */

import {
  sendAIMessage,
  streamAIMessage,
  sendAIMessageWithSystem,
  sendAIConversation,
} from './index';
import { AI_CONFIG, RISK_CONFIG } from '@/config';
import type { AIMessage, AIRequestOptions, AIResponse } from '@/config/ai';

/**
 * Parse JSON response from AI
 */
export async function sendAIMessageForJSON<T = any>(
  messages: AIMessage[],
  options?: AIRequestOptions,
): Promise<T> {
  const response = await sendAIMessage(messages, options);

  try {
    // Try to extract JSON from the response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If no JSON found, try parsing the entire response
    return JSON.parse(response.content);
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${response.content}`);
  }
}

/**
 * Calculate risk score from factors
 */
export async function calculateRiskScore(factors: Record<string, number>): Promise<number> {
  const factorsList = Object.entries(factors)
    .map(([name, value]) => `- ${name}: ${value}/100`)
    .join('\n');

  const prompt = `Calculate a risk score from these factors:
${factorsList}

Apply these weights:
- Compliance Risk: ${RISK_CONFIG.weights.compliance}%
- Security Risk: ${RISK_CONFIG.weights.security}%
- Operational Risk: ${RISK_CONFIG.weights.operational}%
- Financial Risk: ${RISK_CONFIG.weights.financial}%
- Reputational Risk: ${RISK_CONFIG.weights.reputational}%

Return ONLY a JSON object with field "risk_score" (0-100).`;

  const messages: AIMessage[] = [
    { role: 'user', content: prompt },
  ];

  const result = await sendAIMessageForJSON<{ risk_score: number }>(messages);
  const score = Math.max(0, Math.min(100, result.risk_score));

  return score;
}

/**
 * Classify text sentiment or category
 */
export async function classifyText(
  text: string,
  categories: string[],
): Promise<string> {
  const prompt = `Classify the following text into one of these categories: ${categories.join(', ')}

Text: "${text}"

Return ONLY the category name.`;

  const messages: AIMessage[] = [
    { role: 'user', content: prompt },
  ];

  const response = await sendAIMessage(messages);
  return response.content.trim();
}

/**
 * Extract structured data from unstructured text
 */
export async function extractData<T = any>(
  text: string,
  schema: Record<string, string>,
): Promise<T> {
  const schemaDescription = Object.entries(schema)
    .map(([key, type]) => `- ${key}: ${type}`)
    .join('\n');

  const prompt = `Extract the following data from the text:
${schemaDescription}

Text:
"${text}"

Return a JSON object with these fields.`;

  const messages: AIMessage[] = [
    { role: 'user', content: prompt },
  ];

  return sendAIMessageForJSON<T>(messages);
}

/**
 * Summarize text
 */
export async function summarizeText(
  text: string,
  maxWords: number = 100,
): Promise<string> {
  const prompt = `Summarize the following text in ${maxWords} words or less:

"${text}"`;

  const messages: AIMessage[] = [
    { role: 'user', content: prompt },
  ];

  const response = await sendAIMessage(messages);
  return response.content.trim();
}

/**
 * Generate recommendations based on analysis
 */
export async function generateRecommendations(
  analysis: string,
  context: string = '',
): Promise<string[]> {
  let prompt = `Based on the following analysis, provide concrete recommendations:

Analysis:
"${analysis}"`;

  if (context) {
    prompt += `\n\nContext: ${context}`;
  }

  prompt += '\n\nReturn recommendations as a JSON array of strings.';

  const messages: AIMessage[] = [
    { role: 'user', content: prompt },
  ];

  const result = await sendAIMessageForJSON<{ recommendations: string[] }>(
    messages,
  );

  return result.recommendations || [];
}

/**
 * Ask a question with system prompt context
 */
export async function askAI(
  question: string,
  systemContext: 'compliance' | 'risk' | 'emergency' | 'permits' | 'general' = 'general',
): Promise<string> {
  const systemPrompts = {
    compliance: 'You are a compliance expert.',
    risk: 'You are a risk assessment specialist.',
    emergency: 'You are an emergency response coordinator.',
    permits: 'You are a permit management specialist.',
    general: 'You are a helpful AI assistant.',
  };

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompts[systemContext] },
    { role: 'user', content: question },
  ];

  const response = await sendAIMessage(messages);
  return response.content;
}

/**
 * Have a multi-turn conversation
 */
export async function startConversation(
  initialMessages: AIMessage[] = [],
  systemContext: 'compliance' | 'risk' | 'emergency' | 'permits' | 'general' = 'general',
): Promise<(userMessage: string) => Promise<string>> {
  const systemPrompts = {
    compliance: 'You are a compliance expert.',
    risk: 'You are a risk assessment specialist.',
    emergency: 'You are an emergency response coordinator.',
    permits: 'You are a permit management specialist.',
    general: 'You are a helpful AI assistant.',
  };

  const conversationHistory: AIMessage[] = [
    { role: 'system', content: systemPrompts[systemContext] },
    ...initialMessages,
  ];

  return async (userMessage: string): Promise<string> => {
    conversationHistory.push({ role: 'user', content: userMessage });

    const response = await sendAIMessage(conversationHistory);

    conversationHistory.push({ role: 'assistant', content: response.content });

    return response.content;
  };
}

/**
 * Stream a response to UI
 */
export async function streamResponse(
  messages: AIMessage[],
  onChunk: (chunk: string) => void,
  onComplete?: (fullText: string) => void,
): Promise<void> {
  const response = await streamAIMessage(messages, onChunk);

  if (onComplete) {
    onComplete(response.content);
  }
}

/**
 * Validate AI configuration before making requests
 */
export function validateAISetup(): { valid: boolean; message: string } {
  if (!AI_CONFIG.apiKeys[AI_CONFIG.provider]) {
    return {
      valid: false,
      message: `API key not configured for ${AI_CONFIG.provider} provider`,
    };
  }

  return {
    valid: true,
    message: `✅ Using ${AI_CONFIG.provider} provider with model ${AI_CONFIG.model}`,
  };
}

/**
 * Retry failed AI requests with exponential backoff
 */
export async function retryAIRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries - 1) {
        const delay = delayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
