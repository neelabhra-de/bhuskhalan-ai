const API_BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch (error) {
    throw new Error(
      'Unable to connect to the backend. Please ensure the backend and ML services are running.'
    );
  }

  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new Error('The backend returned an invalid response.');
  }

  if (!response.ok) {
    throw new Error(
      body.message || 'The backend could not complete the request.'
    );
  }

  return body;
}

export function checkBackendHealth() {
  return request('/health');
}

export function getPrediction(data) {
  return request('/predict', { method: 'POST', body: JSON.stringify(data) });
}
