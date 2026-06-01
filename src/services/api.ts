// API service for TRAVERSE backend integration
// DO NOT MODIFY API routes, request payloads, or response structures

import type { Ride } from '@/types/ride';

const API_BASE = 'https://traverse-backend-mvdv.onrender.com';

// Helper to get auth token
const getToken = (): string | null => localStorage.getItem('token');

// Helper for authenticated requests
const authHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

type ApiError = Error & {
  status?: number;
  url?: string;
  body?: string;
};

const readErrorMessage = async (response: Response): Promise<{ message: string; body: string }> => {
  const body = await response.text().catch(() => '');
  const contentType = response.headers.get('content-type') || '';

  // Prefer JSON error message if present
  if (contentType.includes('application/json')) {
    try {
      const json = JSON.parse(body);
      const message = json?.message || json?.error || '';
      if (message) return { message: String(message), body };
    } catch {
      // fall through
    }
  }

  // HTML errors (like "Cannot GET ...") or plain text
  const trimmed = (body || '').replace(/\s+/g, ' ').trim();
  return { message: trimmed.slice(0, 180) || response.statusText || 'Request failed', body };
};

const fetchJson = async (url: string, init: RequestInit) => {
  const response = await fetch(url, init);

  if (!response.ok) {
    const { message, body } = await readErrorMessage(response);
    const err: ApiError = new Error(`${response.status} ${response.statusText}: ${message}`.trim());
    err.status = response.status;
    err.url = url;
    err.body = body;
    throw err;
  }

  // Some endpoints may return empty body on success
  const text = await response.text().catch(() => '');
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const postJsonWithFallback = async (urls: string[], bodyCandidates: unknown[]) => {
  let lastError: ApiError | null = null;

  for (const url of urls) {
    for (const body of bodyCandidates) {
      try {
        return await fetchJson(url, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(body),
        });
      } catch (e: any) {
        lastError = e;

        // If the route doesn't exist, try next url.
        if (e?.status === 404 || e?.status === 405) continue;

        // If payload is wrong, try next body candidate.
        if (e?.status === 400 || e?.status === 422) continue;

        // Anything else (401/403/500) should surface immediately.
        throw e;
      }
    }
  }

  throw lastError || new Error('Failed to create ride');
};

const getJsonWithFallback = async (urls: string[]) => {
  let lastError: ApiError | null = null;

  for (const url of urls) {
    try {
      return await fetchJson(url, {
        headers: authHeaders(),
      });
    } catch (e: any) {
      lastError = e;
      if (e?.status === 404 || e?.status === 405) continue;
      throw e;
    }
  }

  throw lastError || new Error('Request failed');
};

const putJsonWithFallback = async (urls: string[], body?: unknown) => {
  let lastError: ApiError | null = null;

  for (const url of urls) {
    try {
      return await fetchJson(url, {
        method: 'PUT',
        headers: authHeaders(),
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
    } catch (e: any) {
      lastError = e;
      if (e?.status === 404 || e?.status === 405) continue;
      throw e;
    }
  }

  throw lastError || new Error('Request failed');
};

// Try multiple HTTP methods for an endpoint (PUT, PATCH, POST)
const multiMethodFallback = async (urls: string[], body?: unknown) => {
  const methods = ['PUT', 'PATCH', 'POST'];
  let lastError: ApiError | null = null;

  for (const url of urls) {
    for (const method of methods) {
      try {
        console.log(`Trying ${method} ${url}`);
        return await fetchJson(url, {
          method,
          headers: authHeaders(),
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });
      } catch (e: any) {
        lastError = e;
        console.log(`${method} ${url} failed:`, e?.status);
        // Keep probing on route/method mismatch and common validation failures.
        if (e?.status === 404 || e?.status === 405 || e?.status === 400 || e?.status === 422) continue;
        throw e;
      }
    }
  }

  throw lastError || new Error('Request failed');
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  signup: async (data: { name: string; email: string; password: string; role: 'student' | 'driver' }) => {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE}/api/auth/profile`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },
};

// Rides API - Updated routes to match backend
export const ridesAPI = {
  createRide: async (data: { pickup: string; dropoff: string }) => {
    // Backend variants seen in different implementations:
    // - { pickup: { address, lat, lng }, drop: { address, lat, lng } }
    // - { pickup: { address, lat, lng }, dropoff: { address, lat, lng } }
    // - { pickup: string, dropoff: string }
    const pickupObj = { address: data.pickup, lat: 0, lng: 0 };
    const dropObj = { address: data.dropoff, lat: 0, lng: 0 };

    const bodyCandidates = [
      { pickup: pickupObj, drop: dropObj },
      { pickup: pickupObj, dropoff: dropObj },
      { pickup: data.pickup, dropoff: data.dropoff },
      { pickup: data.pickup, drop: data.dropoff },
    ];

    const urls = [
      // Working endpoint (confirmed via network logs)
      `${API_BASE}/api/rides/book`,
      // Fallbacks
      `${API_BASE}/api/ride/request`,
      `${API_BASE}/api/ride`,
      `${API_BASE}/api/rides/request`,
      `${API_BASE}/api/rides`,
    ];

    // Normalize the response to uppercase status
    const response = await postJsonWithFallback(urls, bodyCandidates);
    if (response?.ride?.status) {
      response.ride.status = response.ride.status.toUpperCase();
    }
    return response;
  },

  getMyRides: async () => {
    try {
      const data = await getJsonWithFallback([
        `${API_BASE}/api/ride/student`,
        `${API_BASE}/api/rides/student`,
        // Some backends only expose a generic rides list with query params
        `${API_BASE}/api/rides`,
        `${API_BASE}/api/rides?status=REQUESTED`,
        `${API_BASE}/api/rides?status=requested`,
        `${API_BASE}/api/rides?status=ACCEPTED`,
        `${API_BASE}/api/rides?status=accepted`,
        `${API_BASE}/api/rides?status=ONGOING`,
        `${API_BASE}/api/rides?status=ongoing`,
        `${API_BASE}/api/rides?status=COMPLETED`,
        `${API_BASE}/api/rides?status=completed`,
      ]);
      return data;
    } catch (e: any) {
      // Preserve previous behavior: empty state if endpoint doesn't exist
      if (e?.status === 404 || e?.status === 405) return [];
      return [];
    }
  },

  getAvailableRides: async () => {
    try {
      const data = await getJsonWithFallback([
        // Confirmed working endpoint
        `${API_BASE}/api/rides?status=REQUESTED`,
        `${API_BASE}/api/rides?status=requested`,
        `${API_BASE}/api/ride/available`,
        `${API_BASE}/api/rides/available`,
      ]);
      return data;
    } catch (e: any) {
      console.error('getAvailableRides error:', e);
      return [];
    }
  },

  getDriverRides: async () => {
    try {
      const data = await getJsonWithFallback([
        `${API_BASE}/api/ride/driver`,
        `${API_BASE}/api/rides/driver`,
        `${API_BASE}/api/ride/my-rides`,
        `${API_BASE}/api/rides/my-rides`,
        `${API_BASE}/api/ride/assigned`,
        `${API_BASE}/api/rides/assigned`,
        `${API_BASE}/api/driver/rides`,
        `${API_BASE}/api/driver/ride`,
      ]);
      return data;
    } catch (e: any) {
      console.error('getDriverRides error:', e);
      if (e?.status === 404 || e?.status === 405) return [];
      return [];
    }
  },

  acceptRide: async (rideId: string, driverId: string) => {
    // Confirmed endpoint: PATCH /api/rides/:rideId/status with { status, driverId }
    const response = await fetchJson(
      `${API_BASE}/api/rides/${rideId}/status`,
      {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status: 'accepted', driverId }),
      }
    );
    const ride = (response as any)?.ride ?? response;
    if (ride?.status) ride.status = String(ride.status).toUpperCase();
    return ride;
  },

  updateRideStatus: async (rideId: string, status: string, driverId?: string) => {
    // Confirmed endpoint: PATCH /api/rides/:rideId/status
    const body: Record<string, string> = { status };
    if (driverId) body.driverId = driverId;
    
    return fetchJson(`${API_BASE}/api/rides/${rideId}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
  },

  cancelRide: async (rideId: string) => {
    const response = await fetchJson(`${API_BASE}/api/rides/${rideId}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status: 'cancelled' }),
    });
    const ride = (response as { ride?: Ride })?.ride ?? response;
    if (ride && typeof ride === 'object' && 'status' in ride && ride.status) {
      (ride as { status: string }).status = String(ride.status).toUpperCase();
    }
    return ride;
  },

  rejectRide: async (rideId: string, driverId: string) => {
    const urls = [
      `${API_BASE}/api/rides/${rideId}/reject`,
      `${API_BASE}/api/ride/${rideId}/reject`,
    ];
    const bodyCandidates = [{ driverId }, { driverId, rideId }];

    let lastError: ApiError | null = null;
    for (const url of urls) {
      for (const body of bodyCandidates) {
        try {
          return await fetchJson(url, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body),
          });
        } catch (e: unknown) {
          const err = e as ApiError;
          lastError = err;
          if (err?.status === 404 || err?.status === 405 || err?.status === 400) continue;
          throw e;
        }
      }
    }

    throw lastError || new Error('Reject not supported');
  },

  triggerEmergency: async (rideId: string) => {
    // Keep method POST as required
    const urls = [`${API_BASE}/api/ride/${rideId}/emergency`, `${API_BASE}/api/rides/${rideId}/emergency`];
    let lastError: ApiError | null = null;

    for (const url of urls) {
      try {
        return await fetchJson(url, {
          method: 'POST',
          headers: authHeaders(),
        });
      } catch (e: any) {
        lastError = e;
        if (e?.status === 404 || e?.status === 405) continue;
        throw e;
      }
    }

    throw lastError || new Error('Failed to trigger emergency');
  },
};

export { API_BASE };
