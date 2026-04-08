// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// React Query Keys
export const QUERY_KEYS = {
  PLAYERS: 'players',
  PLAYER: 'player',
  RANKINGS: 'rankings',
  DRAFT: 'draft',
  TEAM: 'team',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  DRAFT_STATE: 'draft_state',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  PLAYERS: '/players',
  RANKINGS: '/rankings',
  DRAFT: '/draft',
  MY_TEAM: '/my-team',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Please log in to continue.',
} as const;
