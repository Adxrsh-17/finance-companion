/**
 * Configure `insightsApiUrl` to POST insight payloads to your backend.
 * Leave empty to use the bundled public mock JSON (GET) for demos.
 * Shape: POST body matches `InsightsApiRequest` in insights-api.service.ts
 */
export const environment = {
  production: false,
  insightsApiUrl: '' as string,
  // Example: 'http://localhost:3000/api'
  // Leave empty to keep using generated demo data.
  apiBaseUrl: '' as string,
};
