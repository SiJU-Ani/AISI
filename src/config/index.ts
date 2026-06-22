/**
 * Central Configuration Management
 * All configurable values should be defined here
 * No magic numbers or hardcoded strings in business logic
 */

// ============ Environment Variables ============
const env = import.meta.env;

// ============ API Configuration ============
export const API_CONFIG = {
  baseUrl: env.VITE_API_BASE_URL || 'http://localhost:5173',
  timeout: parseInt(env.VITE_API_TIMEOUT_MS || '30000', 10),
  retryCount: parseInt(env.VITE_API_RETRY_COUNT || '3', 10),
  retryDelayMs: parseInt(env.VITE_API_RETRY_DELAY_MS || '1000', 10),
} as const;

// ============ AI Configuration ============
export const AI_CONFIG = {
  provider: (env.VITE_AI_PROVIDER || 'gemini') as 'gemini' | 'openrouter',
  model: env.VITE_AI_MODEL || 'gemini-2.5-flash',
  requestTimeout: parseInt(env.VITE_AI_REQUEST_TIMEOUT_MS || '60000', 10),
  apiKeys: {
    gemini: env.GEMINI_API_KEY || '',
    openrouter: env.OPENROUTER_API_KEY || '',
  },
  // Gemini specific
  gemini: {
    model: 'gemini-2.5-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
  // OpenRouter specific
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'openai/gpt-4-turbo-preview',
  },
} as const;

// ============ Database Configuration ============
export const DB_CONFIG = {
  supabase: {
    url: env.SUPABASE_URL || '',
    anonKey: env.SUPABASE_ANON_KEY || '',
  },
  databaseUrl: env.DATABASE_URL || '',
} as const;

// ============ Authentication Configuration ============
export const AUTH_CONFIG = {
  jwtSecret: env.JWT_SECRET || '',
  tokenExpiryMs: 24 * 60 * 60 * 1000, // 24 hours
  refreshThresholdMs: 60 * 60 * 1000, // 1 hour
} as const;

// ============ Risk Engine Configuration ============
export const RISK_CONFIG = {
  thresholds: {
    low: parseInt(env.VITE_RISK_THRESHOLD_LOW || '30', 10),
    medium: parseInt(env.VITE_RISK_THRESHOLD_MEDIUM || '60', 10),
    high: parseInt(env.VITE_RISK_THRESHOLD_HIGH || '80', 10),
    critical: parseInt(env.VITE_RISK_THRESHOLD_CRITICAL || '90', 10),
  },
  // Risk calculation weights (sum should be 100)
  weights: {
    compliance: 30,
    security: 25,
    operational: 20,
    financial: 15,
    reputational: 10,
  },
  // Max risk score
  maxScore: 100,
  // Decay factor for historical data (0-1)
  historicalDecay: 0.8,
  // Number of days to consider for trend analysis
  trendWindow: 30,
} as const;

// ============ Compliance Configuration ============
export const COMPLIANCE_CONFIG = {
  auditLogRetentionDays: 365,
  reportExportFormats: ['pdf', 'csv', 'json'],
  maxReportSizeMb: 50,
} as const;

// ============ Permit Management Configuration ============
export const PERMIT_CONFIG = {
  defaultTimeoutDays: 30,
  statusOptions: ['pending', 'approved', 'rejected', 'expired'],
  notificationWhen: ['submitted', 'approved', 'rejected'],
  maxConcurrentPermits: 100,
} as const;

// ============ Emergency Response Configuration ============
export const EMERGENCY_CONFIG = {
  alertChannels: ['email', 'sms', 'webhook', 'push'],
  severityLevels: ['low', 'medium', 'high', 'critical'],
  escalationThresholdMinutes: 15,
  maxConcurrentAlerts: 500,
  alertRetentionDays: 90,
} as const;

// ============ Heatmap Configuration ============
export const HEATMAP_CONFIG = {
  defaultRegion: 'all',
  defaultTimeframe: '7d', // 7 days, options: 1d, 7d, 30d, 90d
  maxDataPoints: 10000,
  colorScheme: {
    low: '#4CAF50',      // Green
    medium: '#FFC107',   // Amber
    high: '#FF9800',     // Orange
    critical: '#F44336', // Red
  },
} as const;

// ============ Feature Flags ============
export const FEATURES = {
  auditLogs: env.VITE_ENABLE_AUDIT_LOGS === 'true',
  riskPredictions: env.VITE_ENABLE_RISK_PREDICTIONS === 'true',
  aiFeatures: env.VITE_ENABLE_AI_FEATURES === 'true',
} as const;

// ============ Logging Configuration ============
export const LOG_CONFIG = {
  level: (env.VITE_LOG_LEVEL || 'info') as 'silent' | 'error' | 'warn' | 'info' | 'debug',
  debug: env.VITE_APP_DEBUG === 'true',
  environment: (env.VITE_APP_ENV || 'development') as 'development' | 'staging' | 'production',
} as const;

// ============ Pagination Configuration ============
export const PAGINATION_CONFIG = {
  defaultPageSize: 25,
  maxPageSize: 100,
  pageSizeOptions: [10, 25, 50, 100],
} as const;

// ============ Cache Configuration ============
export const CACHE_CONFIG = {
  queryTtlMs: 5 * 60 * 1000, // 5 minutes
  userDataTtlMs: 1 * 60 * 1000, // 1 minute
  staticDataTtlMs: 60 * 60 * 1000, // 1 hour
} as const;

// ============ Request Rate Limiting ============
export const RATE_LIMIT_CONFIG = {
  aiRequestsPerMinute: 60,
  apiRequestsPerMinute: 300,
  maxBatchSize: 100,
} as const;

/**
 * Validate that all required environment variables are set
 */
export function validateConfig(): string[] {
  const errors: string[] = [];

  if (!AI_CONFIG.apiKeys[AI_CONFIG.provider]) {
    errors.push(
      `Missing API key for provider: ${AI_CONFIG.provider}. ` +
      `Set ${AI_CONFIG.provider === 'gemini' ? 'GEMINI_API_KEY' : 'OPENROUTER_API_KEY'}`,
    );
  }

  if (LOG_CONFIG.environment === 'production') {
    if (!AUTH_CONFIG.jwtSecret || AUTH_CONFIG.jwtSecret === '') {
      errors.push('JWT_SECRET must be set in production');
    }
  }

  return errors;
}

/**
 * Get AI configuration based on selected provider
 */
export function getAIProviderConfig() {
  const provider = AI_CONFIG.provider;
  if (provider === 'gemini') {
    return AI_CONFIG.gemini;
  } else if (provider === 'openrouter') {
    return AI_CONFIG.openrouter;
  }
  throw new Error(`Unknown AI provider: ${provider}`);
}
