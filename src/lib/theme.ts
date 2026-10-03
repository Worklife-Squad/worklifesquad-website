// src/lib/theme.ts
import { name } from '../../package.json';

export type Theme = 'light' | 'dark';

// Prefixed with the package name so apps sharing an origin (for example
// several projects on localhost) do not overwrite each other's setting.
export const THEME_STORAGE_KEY = `${name}-theme`;
