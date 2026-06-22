/**
 * Example: Risk Calculation Component
 * Demonstrates configuration usage and AI utilities
 */

import { useState } from 'react';
import { calculateRiskScore } from '@/services/ai/utils';
import { RISK_CONFIG } from '@/config';

interface RiskFactors {
  compliance: number;
  security: number;
  operational: number;
  financial: number;
  reputational: number;
}

export function RiskCalculationExample() {
  const [factors, setFactors] = useState<RiskFactors>({
    compliance: 50,
    security: 70,
    operational: 40,
    financial: 30,
    reputational: 20,
  });

  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateRisk = async () => {
    setLoading(true);
    try {
      const score = await calculateRiskScore(factors);
      setRiskScore(score);
    } catch (error) {
      console.error('Risk calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score: number): string => {
    if (score < RISK_CONFIG.thresholds.low) return 'MINIMAL';
    if (score < RISK_CONFIG.thresholds.medium) return 'LOW';
    if (score < RISK_CONFIG.thresholds.high) return 'MEDIUM';
    if (score < RISK_CONFIG.thresholds.critical) return 'HIGH';
    return 'CRITICAL';
  };

  const getRiskColor = (score: number): string => {
    const level = getRiskLevel(score);
    const colors: Record<string, string> = {
      MINIMAL: 'bg-green-100 text-green-800',
      LOW: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800',
    };
    return colors[level];
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg max-w-md">
      <h3 className="text-lg font-semibold">Risk Calculator</h3>

      {/* Configuration Reference */}
      <div className="bg-gray-50 p-3 rounded text-sm">
        <h4 className="font-semibold mb-2">Thresholds (from config):</h4>
        <ul className="space-y-1">
          <li>Low: {'<'} {RISK_CONFIG.thresholds.low}</li>
          <li>Medium: {RISK_CONFIG.thresholds.low} - {RISK_CONFIG.thresholds.medium}</li>
          <li>High: {RISK_CONFIG.thresholds.medium} - {RISK_CONFIG.thresholds.high}</li>
          <li>Critical: {'>'} {RISK_CONFIG.thresholds.critical}</li>
        </ul>

        <h4 className="font-semibold mt-3 mb-2">Weights (from config):</h4>
        <ul className="space-y-1 text-xs">
          <li>Compliance: {RISK_CONFIG.weights.compliance}%</li>
          <li>Security: {RISK_CONFIG.weights.security}%</li>
          <li>Operational: {RISK_CONFIG.weights.operational}%</li>
          <li>Financial: {RISK_CONFIG.weights.financial}%</li>
          <li>Reputational: {RISK_CONFIG.weights.reputational}%</li>
        </ul>
      </div>

      {/* Risk Factor Inputs */}
      <div className="space-y-2">
        {(Object.keys(factors) as (keyof RiskFactors)[]).map((factor) => (
          <div key={factor}>
            <label className="text-sm font-medium capitalize">{factor}: {factors[factor]}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={factors[factor]}
              onChange={(e) =>
                setFactors({ ...factors, [factor]: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateRisk}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {loading ? 'Calculating...' : 'Calculate Risk Score'}
      </button>

      {/* Result */}
      {riskScore !== null && (
        <div className={`p-4 rounded ${getRiskColor(riskScore)} text-center`}>
          <div className="text-3xl font-bold">{riskScore.toFixed(1)}</div>
          <div className="text-lg font-semibold">{getRiskLevel(riskScore)}</div>
          {riskScore >= RISK_CONFIG.thresholds.critical && (
            <p className="text-sm mt-2">⚠️ Requires immediate attention</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RiskCalculationExample;
