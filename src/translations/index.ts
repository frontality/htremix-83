
export * from './en';
export * from './es';
export * from './fr';

export const translations = {
  en: () => import('./en').then(m => m.en),
  es: () => import('./es').then(m => m.es),
  fr: () => import('./fr').then(m => m.fr),
};

// Export the type from the English translations
export type TranslationKey = keyof typeof import('./en').en;
