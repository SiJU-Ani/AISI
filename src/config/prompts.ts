/**
 * Centralized Prompt Management
 * All AI prompts should be defined here to maintain consistency and allow easy updates
 */

export const SYSTEM_PROMPTS = {
  /**
   * Default system prompt for general queries
   */
  default: `You are a helpful AI assistant for the AISI (Advanced Intelligence System Interface) platform.
You help users with compliance management, risk assessment, permit handling, and emergency response.
Be precise, concise, and professional in your responses.`,

  /**
   * System prompt for compliance analysis
   */
  compliance: `You are a compliance expert assisting with regulatory compliance checks and audit trail management.
Provide detailed analysis of compliance issues with specific references to regulations.
Always mention relevant compliance standards and required remediation steps.
Focus on risk mitigation and regulatory adherence.`,

  /**
   * System prompt for risk assessment
   */
  riskAssessment: `You are a risk assessment specialist helping evaluate and score potential risks.
Analyze provided risk factors and calculate a comprehensive risk score.
Consider likelihood, impact, and mitigation strategies.
Provide clear recommendations for risk reduction.`,

  /**
   * System prompt for emergency response
   */
  emergency: `You are an emergency response coordinator.
Provide rapid assessment of emergencies and recommend immediate actions.
Prioritize by severity and impact.
Include escalation procedures and notification requirements.`,

  /**
   * System prompt for permit analysis
   */
  permits: `You are a permit management specialist.
Review permit requests for completeness and compliance.
Identify missing information and regulatory requirements.
Recommend approval or rejection with clear justification.`,

  /**
   * System prompt for data extraction
   */
  extraction: `You are a data extraction specialist.
Extract relevant information from unstructured text or documents.
Return structured JSON with clear field mappings.
Flag any ambiguities or missing information.`,
} as const;

export const AGENT_PROMPTS = {
  /**
   * Compliance audit agent
   */
  complianceAudit: `Analyze the provided data for compliance violations.
Check against these standards:
- Regulatory requirements
- Internal policies
- Industry best practices

Return findings in JSON format with: violation_type, severity, recommendation.`,

  /**
   * Risk calculation agent
   */
  riskCalculation: `Calculate risk score based on provided factors.
Formula: (compliance_risk * 0.3) + (security_risk * 0.25) + (operational_risk * 0.2) + (financial_risk * 0.15) + (reputational_risk * 0.1)
Ensure final score is between 0-100.
Classify as: Low (<30), Medium (30-60), High (60-80), Critical (>80).`,

  /**
   * Emergency classifier agent
   */
  emergencyClassifier: `Classify the emergency and determine response priority.
Severity levels: Low, Medium, High, Critical
Consider: immediate threat level, affected systems, escalation needs.
Return JSON with: severity, response_type, escalation_required, estimated_impact.`,

  /**
   * Permit validator agent
   */
  permitValidator: `Validate permit request completeness and compliance.
Check for:
- All required fields populated
- Valid data formats
- Regulatory compliance
- Completeness percentage

Return JSON with: is_complete, completeness_percentage, missing_fields, compliance_issues.`,
} as const;

export const EXTRACTION_PROMPTS = {
  /**
   * Extract compliance information from text
   */
  complianceData: `Extract compliance-related information from the following text.
Return JSON with fields: regulations_mentioned, compliance_gaps, required_actions, timeline.
If information is not present, leave field as null.`,

  /**
   * Extract risk factors from text
   */
  riskFactors: `Identify and extract all risk factors from the text.
Categorize each risk as: compliance, security, operational, financial, or reputational.
Estimate likelihood (1-10) and impact (1-10) for each.
Return as JSON array with fields: risk_type, category, likelihood, impact, description.`,

  /**
   * Extract emergency details from report
   */
  emergencyDetails: `Extract critical emergency information.
Return JSON with: incident_type, severity, location, affected_systems, number_affected, immediate_actions_needed, escalation_contacts.`,

  /**
   * Extract permit requirements from documents
   */
  permitRequirements: `Extract permit application requirements and constraints.
Return JSON with: permit_type, validity_period_days, required_documents, conditions, restrictions, approval_authority.`,
} as const;

export const CLASSIFICATION_PROMPTS = {
  /**
   * Classify risk severity
   */
  severityClassification: `Classify the risk into one of these categories based on the description:
- Low: Minimal impact, easily mitigated
- Medium: Moderate impact, requires attention
- High: Significant impact, urgent action needed
- Critical: Severe impact, immediate action required

Return JSON with: severity_level, confidence (0-100), reasoning.`,

  /**
   * Classify emergency type
   */
  emergencyTypeClassification: `Classify the emergency into a type:
- Infrastructure: System/hardware failures
- Security: Data breaches, unauthorized access
- Operational: Process failures, outages
- Compliance: Regulatory violations
- External: Natural disaster, third-party issues

Return JSON with: emergency_type, confidence (0-100), reasoning.`,

  /**
   * Classify permit status
   */
  permitStatusClassification: `Determine the appropriate permit status:
- Pending: Initial review
- Approved: Requirements met, approved for issuance
- Rejected: Does not meet requirements
- Conditional: Approved with conditions
- Expired: Past validity date

Return JSON with: recommended_status, confidence (0-100), reasoning.`,
} as const;

export const SUMMARIZATION_PROMPTS = {
  /**
   * Summarize compliance report
   */
  complianceSummary: `Provide an executive summary of the compliance report.
Include: overall compliance status, critical issues, recommended actions, timeline.
Keep summary to 2-3 paragraphs.`,

  /**
   * Summarize risk assessment
   */
  riskSummary: `Provide an executive summary of the risk assessment.
Include: overall risk level, top 5 risks, mitigation strategies, timeline.
Keep summary concise and actionable.`,

  /**
   * Summarize emergency incident
   */
  emergencySummary: `Provide a brief incident summary for quick comprehension.
Include: what happened, when, impact, response taken, ongoing actions.
Use clear bullet points, limit to one page.`,
} as const;

export const ANALYSIS_PROMPTS = {
  /**
   * Trend analysis for compliance
   */
  complianceTrendAnalysis: `Analyze the compliance trend over the provided time period.
Identify patterns, improvements, and deterioration.
Provide forecast for next quarter.
Return JSON with: trend_direction (improving/stable/deteriorating), key_drivers, forecast, recommendations.`,

  /**
   * Pattern detection in risk data
   */
  riskPatternDetection: `Detect patterns and anomalies in the provided risk data.
Identify recurring issues, seasonal patterns, and emerging risks.
Return JSON with: patterns, anomalies, root_causes (if identifiable), recommendations.`,

  /**
   * Comparative analysis
   */
  comparative: `Compare the two provided datasets or reports.
Highlight differences, similarities, and anomalies.
Provide analysis on performance changes.
Return JSON with: key_differences, improvements, regressions, overall_assessment.`,
} as const;

export const DECISION_PROMPTS = {
  /**
   * Make approval recommendation
   */
  approvalRecommendation: `Based on the provided criteria and data, should this request be approved?
Consider: completeness, compliance, risk level, regulatory requirements.
Return JSON with: recommendation (approve/reject/conditional), confidence (0-100), reasoning, conditions_if_any.`,

  /**
   * Prioritization decision
   */
  prioritization: `Prioritize the provided items based on urgency and impact.
Return ranked JSON array with: item_id, priority_rank, reasoning, estimated_time_to_resolve.`,
} as const;

/**
 * Get a prompt by category and name
 */
export function getPrompt(
  category: keyof typeof PROMPTS_REGISTRY,
  name: string,
): string | null {
  const categoryPrompts = PROMPTS_REGISTRY[category] as Record<string, string>;
  return categoryPrompts[name] ?? null;
}

/**
 * List all available prompts by category
 */
export function listPrompts() {
  return Object.entries(PROMPTS_REGISTRY).reduce(
    (acc, [category, prompts]) => {
      acc[category] = Object.keys(prompts);
      return acc;
    },
    {} as Record<string, string[]>,
  );
}

// Registry for easy lookup and validation
const PROMPTS_REGISTRY = {
  system: SYSTEM_PROMPTS,
  agent: AGENT_PROMPTS,
  extraction: EXTRACTION_PROMPTS,
  classification: CLASSIFICATION_PROMPTS,
  summarization: SUMMARIZATION_PROMPTS,
  analysis: ANALYSIS_PROMPTS,
  decision: DECISION_PROMPTS,
} as const;
