const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

export function subscribeNewsletter(payload) {
  return request('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function createReservation(payload) {
  return request('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
