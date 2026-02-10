export const SUPPORTED_LANGUAGES = ['en', 'es', 'de', 'ja', 'ar'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
