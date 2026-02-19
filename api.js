// Environment-driven API configuration.
// Vite exposes only variables prefixed with VITE_ to client code.
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '')

export const API_BASE_URL = normalizedBaseUrl
export const API_PREFIX = '/api/v1'

export const API_PATHS = {
  document: '/document',
  documentById: (id) => `/document/${id}`,
}

export const buildApiUrl = (path) => {
  const safePath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${API_PREFIX}${safePath}`
}
