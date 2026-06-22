/**
 * Environment Variable Validator
 * Use in components to debug configuration issues
 * Safe to use in development, disable in production
 */

export interface EnvironmentStatus {
  supabaseUrl: { present: boolean; value: string | null }
  supabaseKey: { present: boolean; value: string | null }
  aiProvider: { present: boolean; value: string | null }
  geminiKey: { present: boolean }
  openrouterKey: { present: boolean }
  jwtSecret: { present: boolean }
  environment: string
  isProduction: boolean
  allConfigured: boolean
  warnings: string[]
  errors: string[]
}

export function validateEnvironment(): EnvironmentStatus {
  const errors: string[] = [];
  const warnings: string[] = [];

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const aiProvider = import.meta.env.VITE_AI_PROVIDER;
  const geminiKey = import.meta.env.GEMINI_API_KEY;
  const openrouterKey = import.meta.env.OPENROUTER_API_KEY;
  const jwtSecret = import.meta.env.JWT_SECRET;
  const environment = import.meta.env.VITE_APP_ENV || 'development';
  const isProduction = environment === 'production';

  // Validate Supabase
  if (!supabaseUrl) {
    errors.push('❌ VITE_SUPABASE_URL not set');
  }
  if (!supabaseKey) {
    errors.push('❌ VITE_SUPABASE_PUBLISHABLE_KEY not set');
  }

  // Validate AI Provider
  if (!aiProvider) {
    warnings.push('⚠️ VITE_AI_PROVIDER not set (will use default)');
  } else if (!['gemini', 'openrouter'].includes(aiProvider)) {
    errors.push(`❌ Invalid VITE_AI_PROVIDER: ${aiProvider} (use 'gemini' or 'openrouter')`);
  }

  // Validate API keys based on provider
  if (aiProvider === 'gemini' && !geminiKey) {
    errors.push('❌ GEMINI_API_KEY not set but VITE_AI_PROVIDER=gemini');
  }
  if (aiProvider === 'openrouter' && !openrouterKey) {
    errors.push('❌ OPENROUTER_API_KEY not set but VITE_AI_PROVIDER=openrouter');
  }

  // Validate JWT Secret in production
  if (isProduction && !jwtSecret) {
    warnings.push('⚠️ JWT_SECRET not set in production (required for auth)');
  }

  const allConfigured = errors.length === 0 && supabaseUrl && supabaseKey;

  return {
    supabaseUrl: {
      present: !!supabaseUrl,
      value: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : null,
    },
    supabaseKey: {
      present: !!supabaseKey,
      value: supabaseKey ? supabaseKey.substring(0, 30) + '...' : null,
    },
    aiProvider: {
      present: !!aiProvider,
      value: aiProvider || null,
    },
    geminiKey: {
      present: !!geminiKey,
    },
    openrouterKey: {
      present: !!openrouterKey,
    },
    jwtSecret: {
      present: !!jwtSecret,
    },
    environment,
    isProduction,
    allConfigured,
    warnings,
    errors,
  };
}

/**
 * Get environment status message
 * Use for logging and debugging
 */
export function getEnvironmentStatusMessage(): string {
  const status = validateEnvironment();

  const lines: string[] = [];
  lines.push('📋 Environment Status:');
  lines.push(`   Environment: ${status.environment} (${status.isProduction ? 'Production' : 'Development'})`);
  lines.push(`   Supabase URL: ${status.supabaseUrl.present ? '✅' : '❌'}`);
  lines.push(`   Supabase Key: ${status.supabaseKey.present ? '✅' : '❌'}`);
  lines.push(`   AI Provider: ${status.aiProvider.value || 'Not set'} ${status.aiProvider.present ? '✅' : '❌'}`);
  lines.push(`   Gemini Key: ${status.geminiKey.present ? '✅' : '❌'}`);
  lines.push(`   OpenRouter Key: ${status.openrouterKey.present ? '✅' : '❌'}`);
  lines.push(`   JWT Secret: ${status.jwtSecret.present ? '✅' : '❌'}`);
  lines.push('');

  if (status.errors.length > 0) {
    lines.push('❌ Errors:');
    status.errors.forEach((err) => lines.push(`   ${err}`));
    lines.push('');
  }

  if (status.warnings.length > 0) {
    lines.push('⚠️ Warnings:');
    status.warnings.forEach((warn) => lines.push(`   ${warn}`));
    lines.push('');
  }

  if (status.allConfigured) {
    lines.push('✅ All required configuration is present!');
  } else {
    lines.push('❌ Configuration incomplete. Please set missing variables.');
  }

  return lines.join('\n');
}

/**
 * Quick check for Supabase only
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  );
}

/**
 * Quick check for AI
 */
export function isAIConfigured(): boolean {
  const provider = import.meta.env.VITE_AI_PROVIDER;
  const gemini = import.meta.env.GEMINI_API_KEY;
  const openrouter = import.meta.env.OPENROUTER_API_KEY;

  if (provider === 'gemini') {
    return !!gemini;
  }
  if (provider === 'openrouter') {
    return !!openrouter;
  }
  return !!(gemini || openrouter);
}

/**
 * Log all issues to console
 * Use for debugging
 */
export function logEnvironmentStatus(): void {
  if (import.meta.env.DEV) {
    console.log(getEnvironmentStatusMessage());
  }
}
