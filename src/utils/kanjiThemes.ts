export type KanjiColorThemeKey = 'amber' | 'sky' | 'emerald' | 'purple';

export interface KanjiThemeDefinition {
  key: KanjiColorThemeKey;
  numberSymbol: string; // ①, ②, ③, ④
  name: {
    ja: string;
    en: string;
    ar: string;
  };
  // Token / Badge in first row
  tokenBg: string;
  tokenBorder: string;
  tokenText: string;
  tokenRing: string;
  badgeBg: string;
  badgeText: string;
  // Strip Card
  stripCardBorder: string;
  stripCardBgActive: string;
  stripCardRing: string;
  stripBadge: string;
  arrowColor: string;
  // Inspector Section & Cards
  sectionBorder: string;
  sectionHeaderBg: string;
  sectionHeaderText: string;
  cardBorder: string;
  glyphBoxBg: string;
  glyphBoxBorder: string;
  glyphText: string;
  accentText: string;
}

export const THEME_KEYS: KanjiColorThemeKey[] = ['amber', 'sky', 'emerald', 'purple'];
export const NUMBER_SYMBOLS = ['①', '②', '③', '④'];

export const KANJI_THEMES: Record<KanjiColorThemeKey, KanjiThemeDefinition> = {
  amber: {
    key: 'amber',
    numberSymbol: '①',
    name: {
      ja: '琥珀 (第1変換文字)',
      en: 'Amber (#1 Changed Kanji)',
      ar: 'عنبري (#1 كانجي محوّل)',
    },
    tokenBg: 'bg-amber-100 dark:bg-amber-950/80',
    tokenBorder: 'border-amber-400 dark:border-amber-600',
    tokenText: 'text-amber-950 dark:text-amber-100',
    tokenRing: 'ring-2 ring-amber-400/80 dark:ring-amber-500/80',
    badgeBg: 'bg-amber-500 text-white',
    badgeText: 'text-amber-900 dark:text-amber-200 bg-amber-200/90 dark:bg-amber-900/80',
    stripCardBorder: 'border-amber-400 dark:border-amber-600',
    stripCardBgActive: 'bg-amber-50/80 dark:bg-amber-950/40',
    stripCardRing: 'ring-2 ring-amber-400/80 dark:ring-amber-500/80 border-amber-500',
    stripBadge: 'bg-amber-200/90 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 border border-amber-300 dark:border-amber-700',
    arrowColor: 'text-amber-600 dark:text-amber-400',
    sectionBorder: 'border-amber-300 dark:border-amber-800/80',
    sectionHeaderBg: 'bg-amber-50/90 dark:bg-amber-950/50',
    sectionHeaderText: 'text-amber-950 dark:text-amber-100',
    cardBorder: 'border-amber-300/80 dark:border-amber-800/70',
    glyphBoxBg: 'bg-amber-100/70 dark:bg-amber-950/60',
    glyphBoxBorder: 'border-amber-300 dark:border-amber-700',
    glyphText: 'text-amber-950 dark:text-amber-100',
    accentText: 'text-amber-700 dark:text-amber-400',
  },
  sky: {
    key: 'sky',
    numberSymbol: '②',
    name: {
      ja: '浅葱・藍 (第2変換文字)',
      en: 'Sky Blue (#2 Changed Kanji)',
      ar: 'أزرق سماوي (#2 كانجي محوّل)',
    },
    tokenBg: 'bg-sky-100 dark:bg-sky-950/80',
    tokenBorder: 'border-sky-400 dark:border-sky-600',
    tokenText: 'text-sky-950 dark:text-sky-100',
    tokenRing: 'ring-2 ring-sky-400/80 dark:ring-sky-500/80',
    badgeBg: 'bg-sky-500 text-white',
    badgeText: 'text-sky-900 dark:text-sky-200 bg-sky-200/90 dark:bg-sky-900/80',
    stripCardBorder: 'border-sky-400 dark:border-sky-600',
    stripCardBgActive: 'bg-sky-50/80 dark:bg-sky-950/40',
    stripCardRing: 'ring-2 ring-sky-400/80 dark:ring-sky-500/80 border-sky-500',
    stripBadge: 'bg-sky-200/90 dark:bg-sky-900/80 text-sky-950 dark:text-sky-100 border border-sky-300 dark:border-sky-700',
    arrowColor: 'text-sky-600 dark:text-sky-400',
    sectionBorder: 'border-sky-300 dark:border-sky-800/80',
    sectionHeaderBg: 'bg-sky-50/90 dark:bg-sky-950/50',
    sectionHeaderText: 'text-sky-950 dark:text-sky-100',
    cardBorder: 'border-sky-300/80 dark:border-sky-800/70',
    glyphBoxBg: 'bg-sky-100/70 dark:bg-sky-950/60',
    glyphBoxBorder: 'border-sky-300 dark:border-sky-700',
    glyphText: 'text-sky-950 dark:text-sky-100',
    accentText: 'text-sky-700 dark:text-sky-400',
  },
  emerald: {
    key: 'emerald',
    numberSymbol: '③',
    name: {
      ja: '萌黄・翡翠 (第3変換文字)',
      en: 'Emerald Green (#3 Changed Kanji)',
      ar: 'زمردي أخضر (#3 كانجي محوّل)',
    },
    tokenBg: 'bg-emerald-100 dark:bg-emerald-950/80',
    tokenBorder: 'border-emerald-400 dark:border-emerald-600',
    tokenText: 'text-emerald-950 dark:text-emerald-100',
    tokenRing: 'ring-2 ring-emerald-400/80 dark:ring-emerald-500/80',
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: 'text-emerald-900 dark:text-emerald-200 bg-emerald-200/90 dark:bg-emerald-900/80',
    stripCardBorder: 'border-emerald-400 dark:border-emerald-600',
    stripCardBgActive: 'bg-emerald-50/80 dark:bg-emerald-950/40',
    stripCardRing: 'ring-2 ring-emerald-400/80 dark:ring-emerald-500/80 border-emerald-500',
    stripBadge: 'bg-emerald-200/90 dark:bg-emerald-900/80 text-emerald-950 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700',
    arrowColor: 'text-emerald-600 dark:text-emerald-400',
    sectionBorder: 'border-emerald-300 dark:border-emerald-800/80',
    sectionHeaderBg: 'bg-emerald-50/90 dark:bg-emerald-950/50',
    sectionHeaderText: 'text-emerald-950 dark:text-emerald-100',
    cardBorder: 'border-emerald-300/80 dark:border-emerald-800/70',
    glyphBoxBg: 'bg-emerald-100/70 dark:bg-emerald-950/60',
    glyphBoxBorder: 'border-emerald-300 dark:border-emerald-700',
    glyphText: 'text-emerald-950 dark:text-emerald-100',
    accentText: 'text-emerald-700 dark:text-emerald-400',
  },
  purple: {
    key: 'purple',
    numberSymbol: '④',
    name: {
      ja: '紫苑・藤 (第4変換文字)',
      en: 'Purple/Violet (#4 Changed Kanji)',
      ar: 'أرجواني (#4 كانجي محوّل)',
    },
    tokenBg: 'bg-purple-100 dark:bg-purple-950/80',
    tokenBorder: 'border-purple-400 dark:border-purple-600',
    tokenText: 'text-purple-950 dark:text-purple-100',
    tokenRing: 'ring-2 ring-purple-400/80 dark:ring-purple-500/80',
    badgeBg: 'bg-purple-600 text-white',
    badgeText: 'text-purple-900 dark:text-purple-200 bg-purple-200/90 dark:bg-purple-900/80',
    stripCardBorder: 'border-purple-400 dark:border-purple-600',
    stripCardBgActive: 'bg-purple-50/80 dark:bg-purple-950/40',
    stripCardRing: 'ring-2 ring-purple-400/80 dark:ring-purple-500/80 border-purple-500',
    stripBadge: 'bg-purple-200/90 dark:bg-purple-900/80 text-purple-950 dark:text-purple-100 border border-purple-300 dark:border-purple-700',
    arrowColor: 'text-purple-600 dark:text-purple-400',
    sectionBorder: 'border-purple-300 dark:border-purple-800/80',
    sectionHeaderBg: 'bg-purple-50/90 dark:bg-purple-950/50',
    sectionHeaderText: 'text-purple-950 dark:text-purple-100',
    cardBorder: 'border-purple-300/80 dark:border-purple-800/70',
    glyphBoxBg: 'bg-purple-100/70 dark:bg-purple-950/60',
    glyphBoxBorder: 'border-purple-300 dark:border-purple-700',
    glyphText: 'text-purple-950 dark:text-purple-100',
    accentText: 'text-purple-700 dark:text-purple-400',
  },
};

/**
 * Get theme for a specific changed character order index (0 to 3)
 */
export function getKanjiThemeByOrder(orderIndex: number): KanjiThemeDefinition {
  const key = THEME_KEYS[Math.max(0, orderIndex) % THEME_KEYS.length];
  return KANJI_THEMES[key];
}

/**
 * Get theme for a character index given changedIndices array
 */
export function getKanjiThemeForCharIndex(
  charIndex: number,
  changedIndices: number[]
): KanjiThemeDefinition | null {
  const order = changedIndices.indexOf(charIndex);
  if (order === -1) return null;
  return getKanjiThemeByOrder(order);
}
