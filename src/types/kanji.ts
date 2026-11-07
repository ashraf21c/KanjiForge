/**
 * Kanji Converter Type Definitions
 */

export type ConversionDirection = 'shin_to_kyu' | 'kyu_to_shin';

export type Language = 'ja' | 'en' | 'ar';

export type KanjiFontSize = 'sm' | 'md' | 'lg' | 'xl';

export type FontMode = 'serif' | 'sans' | 'ud';

export interface AccessibilitySettings {
  fontSize: KanjiFontSize;
  fontMode: FontMode;
  highContrast: boolean;
  showRuby: boolean;
  reducedMotion: boolean;
  speechRate: number; // 0.8 | 1.0 | 1.2
}

export interface KanjiCharInfo {
  char: string;
  unicodeHex: string;        // e.g. "U+6E26"
  unicodeDec: number;
  utf8Hex: string;          // e.g. "E6 B8 A6"
  shiftJisHex: string;      // e.g. "8E9F"
  jisHex: string;           // e.g. "3E5A"
  kuten: string;            // e.g. "30-58" (30区58点)
  kutenDetail: {
    men: number;
    ku: number;
    ten: number;
  } | null;
  eucJpHex?: string;
  isKanji: boolean;
  strokeCount?: number;
  radical?: string;
  readings?: {
    on: string[];
    kun: string[];
  };
  classification?: string;   // e.g. "常用漢字", "人名用漢字", "JIS第1水準", etc.
  meaning?: {
    ja: string;
    en: string;
    ar: string;
  };
  kanken?: string;           // e.g. "10級", "6級", "1級 (旧字)"
  jlpt?: string;             // e.g. "N5", "N3", "N1", "N1+ (古典)"
  grade?: string;            // e.g. "小1", "小5", "中学", "旧字・古典"
  gradeNumber?: number | string; // 1..6, "中", "旧"
}

export interface AmbiguityChoice {
  char: string;
  label: {
    ja: string;
    en: string;
    ar: string;
  };
  nuance: {
    ja: string;
    en: string;
    ar: string;
  };
  examples: string[];
  isRecommendedContext?: boolean;
}

export interface AmbiguityAlert {
  id: string;
  sourceChar: string;
  lineIndex: number;
  charIndex: number;
  compoundFound?: string;     // e.g. "混交"
  recommendedChar?: string;   // e.g. "淆"
  explanation: {
    ja: string;
    en: string;
    ar: string;
  };
  options: AmbiguityChoice[];
  resolvedChoice?: string;
}

export interface LineConversionResult {
  lineIndex: number;
  originalText: string;
  convertedText: string;
  hasChanges: boolean;
  changedIndices: number[]; // indices in original that were converted
  ambiguities: AmbiguityAlert[];
  inputChars: KanjiCharInfo[];
  outputChars: KanjiCharInfo[];
}

export interface ConversionSummary {
  totalLines: number;
  totalChars: number;
  convertedCharsCount: number;
  ambiguityCount: number;
  lines: LineConversionResult[];
}
