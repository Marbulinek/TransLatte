export interface TranslationSource {
  inputFile: string;
  outputDir: string;
  name?: string; // Optional name for the source (e.g., "Core Module", "Auth Module")
}

export interface TranslatteConfig {
  sourceLanguage: string;
  targetLanguages: string[];
  // Support both single file and multiple sources
  inputFile?: string;
  outputDir?: string;
  sources?: TranslationSource[]; // Multiple input/output pairs for modular apps
  lingvaInstance?: string; // Custom Lingva instance URL
  preserveInterpolation?: boolean; // Whether to preserve interpolation placeholders (default: true)
  interpolationPattern?: string; // Regex pattern for placeholders (default: matches {{var}}, {var}, %var%, $var$)
  enableCache?: boolean; // Enable translation caching for faster re-runs (default: true)
}

export interface TranslationResult {
  language: string;
  translations: Record<string, any>;
  success: boolean;
  error?: string;
  sourceName?: string; // Which source this result is for
}

export interface TranslationSummary {
  totalSources: number;
  totalLanguages: number;
  successCount: number;
  failCount: number;
  results: TranslationResult[];
  cacheHits?: number; // Number of translations served from cache
  cacheSize?: number; // Total number of cached translations
}
