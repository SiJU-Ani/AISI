/**
 * Server API Functions Index
 * Re-exports all server functions for easy importing
 * 
 * @example
 * // Import specific functions
 * import { fetchTodos, createTodo } from '@/server/api'
 * 
 * // Or import from specific modules
 * import { fetchTodos } from '@/server/api/supabase'
 * import { loginUser } from '@/server/api/auth'
 */

// Supabase API
export {
  fetchTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  getCurrentUser,
} from './supabase'

// Auth API
export {
  loginUser,
  logoutUser,
  getCurrentSession,
} from './auth'

// Compliance API
export {
  getComplianceReports,
  createComplianceReport,
  submitAuditLog,
} from './compliance'

// Risk Engine API
export {
  calculateRisk,
  getRiskAssessments,
  saveRiskAssessment,
} from './risk-engine'

// Permits API
export {
  getPermits,
  createPermit,
  updatePermitStatus,
  approvePermit,
  rejectPermit,
} from './permits'

// Emergency API
export {
  getEmergencyAlerts,
  createEmergencyAlert,
  escalateIncident,
  resolveIncident,
} from './emergency'
