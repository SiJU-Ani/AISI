import { createServerFn } from "@tanstack/react-start/server";
import { json } from "@tanstack/react-start";

/**
 * Root API handler
 * Returns API metadata and available endpoints
 */
export const apiRoot = createServerFn({ method: "GET" }, async () => {
  return json({
    status: "ok",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      compliance: "/api/compliance",
      copilot: "/api/copilot",
      emergency: "/api/emergency",
      heatmap: "/api/heatmap",
      permits: "/api/permits",
      "risk-engine": "/api/risk-engine",
    },
    timestamp: new Date().toISOString(),
  });
});

export default function ApiRoot() {
  return null;
}
