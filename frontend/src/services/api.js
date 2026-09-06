const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch (error) {
    throw new Error('Unable to connect to the backend. Please ensure the backend and ML services are running.');
  }

  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new Error('The backend returned an invalid response.');
  }

  if (!response.ok) {
    throw new Error(body.message || 'The backend could not complete the request.');
  }

  return body;
}

export function checkBackendHealth() {
  return request('/health');
}

export function getPrediction(data) {
  return request('/predict', { method: 'POST', body: JSON.stringify(data) });
}

export function getSlopes() {
  return request('/slopes');
}

export function getPredictions(options = '') {
  return request(`/predictions${options}`);
}

export function getAlerts(options = '') {
  return request(`/alerts${options}`);
}

export function updateAlert(id, data) {
  return request(`/alerts/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function getSensorReadings(slopeId, options = '') {
  return request(`/sensor-readings/${encodeURIComponent(slopeId)}${options}`);
}

export function getFieldReports(options = '') {
  return request(`/field-reports${options}`);
}

export function createFieldReport(data) {
  return request('/field-reports', { method: 'POST', body: JSON.stringify(data) });
}

export function createSimulation(data) {
  return request('/simulations', { method: 'POST', body: JSON.stringify(data) });
}
