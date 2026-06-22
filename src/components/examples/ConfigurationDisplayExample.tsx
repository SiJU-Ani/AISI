/**
 * Example: Configuration Display Component
 * Shows current AI provider and configuration
 */

import { getAIProviderInfo } from '@/services/ai';
import { AI_CONFIG, LOG_CONFIG } from '@/config';
import { isProviderAvailable, getAvailableProviders } from '@/config/ai';

export function ConfigurationDisplayExample() {
  const providerInfo = getAIProviderInfo();
  const availableProviders = getAvailableProviders();

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Configuration Status</h3>

      {/* Active AI Provider */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-semibold mb-2">Active AI Provider</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Provider:</span> {providerInfo.provider}
          </div>
          <div>
            <span className="font-medium">Model:</span> {providerInfo.model}
          </div>
          <div>
            <span className="font-medium">Configured:</span>{' '}
            {providerInfo.configured ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <span className="font-medium">Environment:</span> {LOG_CONFIG.environment}
          </div>
        </div>
      </div>

      {/* Available Providers */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-semibold mb-2">Available Providers</h4>
        {availableProviders.length > 0 ? (
          <div className="space-y-1">
            {availableProviders.map((provider) => (
              <div key={provider} className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span className="capitalize">{provider}</span>
                {provider === AI_CONFIG.provider && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600 text-sm">No providers configured</p>
        )}
      </div>

      {/* AI Settings */}
      <div className="bg-white p-3 rounded border">
        <h4 className="font-semibold mb-2">AI Configuration</h4>
        <div className="text-sm space-y-1">
          <div>
            <span className="font-medium">Request Timeout:</span>{' '}
            {AI_CONFIG.requestTimeout}ms
          </div>
          <div>
            <span className="font-medium">Provider:</span> {AI_CONFIG.provider}
          </div>
          <div>
            <span className="font-medium">Model:</span> {AI_CONFIG.model}
          </div>
        </div>
      </div>

      {/* How to Switch Providers */}
      <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <h4 className="font-semibold mb-2 text-blue-900">To Switch Providers:</h4>
        <p className="text-sm text-blue-800 mb-2">Edit your .env file and change:</p>
        <code className="block bg-white p-2 rounded text-xs mb-2 overflow-x-auto">
          VITE_AI_PROVIDER=gemini
        </code>
        <p className="text-sm text-blue-800">Then restart the development server.</p>
      </div>

      {/* Configuration Files Reference */}
      <div className="bg-purple-50 p-3 rounded border border-purple-200">
        <h4 className="font-semibold mb-2 text-purple-900">Configuration Files:</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <code className="bg-white px-1">.env</code> - Environment variables & secrets</li>
          <li>• <code className="bg-white px-1">src/config/index.ts</code> - Central configuration</li>
          <li>• <code className="bg-white px-1">src/config/ai.ts</code> - AI provider settings</li>
          <li>• <code className="bg-white px-1">src/config/prompts.ts</code> - Prompt management</li>
        </ul>
      </div>
    </div>
  );
}

export default ConfigurationDisplayExample;
