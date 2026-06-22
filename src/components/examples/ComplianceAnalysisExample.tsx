/**
 * Example: Compliance Analysis Component
 * Demonstrates how to use the refactored AI and configuration system
 */

import { useState } from 'react';
import { sendAIMessageWithSystem } from '@/services/ai';
import { COMPLIANCE_CONFIG, RISK_CONFIG } from '@/config';
import type { AIMessage } from '@/services/ai';

interface ComplianceAnalysisProps {
  data: string;
  onAnalysisComplete?: (result: string) => void;
}

export function ComplianceAnalysisExample({ data, onAnalysisComplete }: ComplianceAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const analyzeCompliance = async () => {
    setLoading(true);
    setError('');

    try {
      // Use AI service with configuration
      const response = await sendAIMessageWithSystem(
        `Analyze this for compliance issues:\n\n${data}`,
        'compliance', // Uses SYSTEM_PROMPTS.compliance from config/prompts.ts
        {
          maxTokens: 2048,
          temperature: 0.7,
        },
      );

      setAnalysis(response.content);
      onAnalysisComplete?.(response.content);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Compliance analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Compliance Analysis</h3>

      {/* Configuration Display */}
      <div className="bg-blue-50 p-3 rounded text-sm">
        <p>
          <strong>Audit Log Retention:</strong> {COMPLIANCE_CONFIG.auditLogRetentionDays} days
        </p>
        <p>
          <strong>Export Formats:</strong> {COMPLIANCE_CONFIG.reportExportFormats.join(', ')}
        </p>
      </div>

      {/* Analysis Input */}
      <textarea
        value={data}
        disabled
        className="w-full p-2 border rounded disabled:bg-gray-50"
        rows={4}
      />

      {/* Action Button */}
      <button
        onClick={analyzeCompliance}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {loading ? 'Analyzing...' : 'Analyze Compliance'}
      </button>

      {/* Results */}
      {error && <div className="text-red-600 p-3 bg-red-50 rounded">{error}</div>}

      {analysis && (
        <div className="bg-green-50 p-3 rounded">
          <h4 className="font-semibold mb-2">Analysis Result:</h4>
          <pre className="text-sm overflow-x-auto">{analysis}</pre>
        </div>
      )}
    </div>
  );
}

export default ComplianceAnalysisExample;
