
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

export const translations = {
  en,
  es,
  fr,
  de: en, // Fallback to English for now
  it: en, // Fallback to English for now
  pt: en, // Fallback to English for now
  ru: en, // Fallback to English for now
  ja: en, // Fallback to English for now
  ko: en, // Fallback to English for now
  zh: en, // Fallback to English for now
  ar: en, // Fallback to English for now
  hi: en, // Fallback to English for now
  tr: en, // Fallback to English for now
  pl: en, // Fallback to English for now
  nl: en, // Fallback to English for now
};

export type TranslationKey = keyof typeof en;
