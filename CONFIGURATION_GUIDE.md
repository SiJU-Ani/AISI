# Configuration & AI Service Refactor Guide

## 📋 Overview

This refactor introduces a centralized configuration system and abstracted AI provider layer, allowing the entire application to be customized through environment variables and configuration files without modifying business logic.

## 🗂️ New Directory Structure

```
src/
├── config/
│   ├── index.ts          ← Central configuration (APIs, timeouts, thresholds, feature flags)
│   ├── ai.ts             ← AI provider abstraction & configuration
│   └── prompts.ts        ← Centralized prompt management
├── services/
│   └── ai/
│       ├── index.ts      ← Main AI service interface
│       ├── provider.ts   ← Base provider interface
│       ├── gemini.ts     ← Gemini implementation
│       ├── openrouter.ts ← OpenRouter implementation
│       └── utils.ts      ← Helper utilities
```

## 🔑 Key Files

### 1. `.env.example` → `.env`

Copy and configure:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```bash
VITE_AI_PROVIDER=gemini
GEMINI_API_KEY=your-key-here
VITE_RISK_THRESHOLD_CRITICAL=90
```

### 2. `src/config/index.ts` - Central Configuration

All configurable values:
- API URLs and timeouts
- Risk thresholds
- Feature flags
- Database settings
- Pagination limits
- Cache TTLs
- Rate limits

**No magic numbers in code!**

```typescript
import { API_CONFIG, RISK_CONFIG, FEATURES } from '@/config';

// Use configuration instead of hardcoding
const timeout = API_CONFIG.timeout; // 30000
const criticalThreshold = RISK_CONFIG.thresholds.critical; // 90
```

### 3. `src/config/ai.ts` - AI Provider Configuration

Handles AI provider abstraction:
- Get current provider configuration
- Check available providers
- Validate AI configuration
- Switch providers via `.env`

```typescript
import { getCurrentAIConfig, getAvailableProviders } from '@/config/ai';

const config = getCurrentAIConfig(); // { provider: 'gemini', model: '...', apiKey: '...' }
const available = getAvailableProviders(); // ['gemini', 'openrouter']
```

### 4. `src/config/prompts.ts` - Prompt Management

Organize prompts by category:
- System prompts
- Agent prompts
- Extraction prompts
- Classification prompts
- Summarization prompts
- Analysis prompts
- Decision prompts

```typescript
import { SYSTEM_PROMPTS, getPrompt, listPrompts } from '@/config/prompts';

const systemPrompt = SYSTEM_PROMPTS.compliance;
const allPrompts = listPrompts(); // { system: [...], agent: [...], ... }
```

## 🤖 AI Service Layer

### Initialization

Initialize before using AI:

```typescript
import { initializeAIProvider } from '@/services/ai';

// In app startup (main.tsx or similar)
await initializeAIProvider();
```

### Basic Usage

```typescript
import {
  sendAIMessage,
  sendAIMessageWithSystem,
  getAIPrompt,
} from '@/services/ai';
import type { AIMessage } from '@/services/ai';

// Simple message
const response = await sendAIMessage([
  { role: 'user', content: 'Hello!' }
]);
console.log(response.content);

// With system prompt
const response = await sendAIMessageWithSystem(
  'Analyze this risk',
  'riskAssessment' // Uses SYSTEM_PROMPTS.riskAssessment
);

// Get a prompt from registry
const extractionPrompt = getAIPrompt('extraction', 'complianceData');
```

### Advanced Usage with Utils

```typescript
import {
  calculateRiskScore,
  classifyText,
  extractData,
  summarizeText,
  askAI,
  retryAIRequest,
} from '@/services/ai/utils';

// Calculate risk score
const score = await calculateRiskScore({
  compliance: 50,
  security: 70,
  operational: 40,
});

// Classify text
const category = await classifyText('Critical error in system', [
  'critical',
  'high',
  'medium',
  'low',
]);

// Extract structured data
const data = await extractData('Jane Doe, 30, NYC', {
  name: 'string',
  age: 'number',
  location: 'string',
});

// Summarize
const summary = await summarizeText(longText, 50);

// Ask questions with context
const answer = await askAI('What are compliance requirements?', 'compliance');

// Retry with exponential backoff
const result = await retryAIRequest(
  () => sendAIMessage(messages),
  3, // max retries
  1000 // initial delay
);
```

### Streaming Responses

```typescript
import { streamAIMessage } from '@/services/ai';

await streamAIMessage(
  [{ role: 'user', content: 'Generate a report...' }],
  (chunk) => {
    // Called for each chunk
    console.log(chunk);
    // Update UI in real-time
  }
);
```

## 🔄 Switching AI Providers

### Option 1: Gemini
```env
VITE_AI_PROVIDER=gemini
VITE_AI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your-gemini-key
```

### Option 2: OpenRouter (supports multiple models)
```env
VITE_AI_PROVIDER=openrouter
VITE_AI_MODEL=openai/gpt-4-turbo-preview
OPENROUTER_API_KEY=your-openrouter-key
```

**No code changes needed!** Just restart the app.

## 📊 Configuration Examples

### Risk Engine Configuration

```typescript
import { RISK_CONFIG } from '@/config';

// Get thresholds
const criticalLevel = RISK_CONFIG.thresholds.critical; // 90

// Get weights
const complianceWeight = RISK_CONFIG.weights.compliance; // 30

// Use in calculation
const score = (complianceRisk * complianceWeight +
              securityRisk * RISK_CONFIG.weights.security) / 100;
```

### Feature Flags

```typescript
import { FEATURES } from '@/config';

if (FEATURES.aiFeatures) {
  // AI-related features
}

if (FEATURES.riskPredictions) {
  // Risk prediction features
}
```

### API Configuration

```typescript
import { API_CONFIG } from '@/config';

fetch(url, {
  timeout: API_CONFIG.timeout,
  retryCount: API_CONFIG.retryCount,
  retryDelayMs: API_CONFIG.retryDelayMs,
});
```

## ✅ Customization Checklist

After refactor, customize your app by editing ONLY:

- [ ] `.env` - Environment-specific secrets and configuration
- [ ] `src/config/index.ts` - Feature flags, thresholds, limits
- [ ] `src/config/prompts.ts` - AI prompts and instructions

**DO NOT edit:**
- Business logic files
- Component files
- Service implementations

## 🔍 Validation

Validate configuration on startup:

```typescript
import { validateConfig } from '@/config';
import { validateAIConfig } from '@/config/ai';

const errors = validateConfig();
if (errors.length > 0) {
  console.error('Configuration errors:', errors);
  // Handle errors
}

const aiValidation = validateAIConfig();
if (!aiValidation.valid) {
  console.error('AI Configuration errors:', aiValidation.errors);
}
```

## 📝 Usage in Components

### Example: Using AI in a React Component

```typescript
import { useState, useEffect } from 'react';
import { sendAIMessageWithSystem } from '@/services/ai';
import { RISK_CONFIG } from '@/config';

export function RiskAnalyzer() {
  const [analysis, setAnalysis] = useState('');

  const analyzeRisk = async (riskData: string) => {
    const response = await sendAIMessageWithSystem(
      riskData,
      'riskAssessment',
      { temperature: 0.7 }
    );
    setAnalysis(response.content);
  };

  return (
    <div>
      <p>Critical threshold: {RISK_CONFIG.thresholds.critical}</p>
      <button onClick={() => analyzeRisk(data)}>Analyze</button>
      <pre>{analysis}</pre>
    </div>
  );
}
```

### Example: Using Configuration in Services

```typescript
import { API_CONFIG, COMPLIANCE_CONFIG } from '@/config';

export async function fetchCompliance() {
  const response = await fetch(`${API_CONFIG.baseUrl}/compliance`, {
    timeout: API_CONFIG.timeout,
  });

  const data = await response.json();

  // Export with configured format
  return {
    ...data,
    exportFormats: COMPLIANCE_CONFIG.reportExportFormats,
    maxSize: COMPLIANCE_CONFIG.maxReportSizeMb,
  };
}
```

## 🚀 Migration Guide

If migrating existing code:

### Find & Replace Pattern

```typescript
// Before
const timeout = 30000;
const apiUrl = 'http://localhost:5173';

// After
import { API_CONFIG } from '@/config';

const timeout = API_CONFIG.timeout;
const apiUrl = API_CONFIG.baseUrl;
```

```typescript
// Before
const prompt = "You are a helpful assistant...";
const response = await callGemini(prompt, message);

// After
import { sendAIMessageWithSystem } from '@/services/ai';
import { SYSTEM_PROMPTS } from '@/config/prompts';

const response = await sendAIMessageWithSystem(
  message,
  'default' // Uses SYSTEM_PROMPTS.default
);
```

## 🐛 Troubleshooting

### AI Provider not initializing

```typescript
import { validateAISetup } from '@/services/ai/utils';

const validation = validateAISetup();
console.log(validation.message);
// Output: "✅ Using gemini provider with model gemini-2.5-flash"
// or error message
```

### Configuration not loading

1. Check `.env` file exists and is readable
2. Verify environment variables are set
3. Check console for validation errors
4. Run `validateConfig()` to see all errors

### Wrong AI model being used

```typescript
import { getAIProviderInfo } from '@/services/ai';

const info = getAIProviderInfo();
console.log(info); // { provider: 'gemini', model: 'gemini-2.5-flash', configured: true }
```

## 📚 Further Reading

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode)
- [TypeScript Configuration Best Practices](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [Gemini API Documentation](https://ai.google.dev/tutorials/python_quickstart)
- [OpenRouter Documentation](https://openrouter.ai/docs)
