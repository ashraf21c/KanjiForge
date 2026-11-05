import React from 'react';
import { BookOpen, Globe, Moon, Sun, Type } from 'lucide-react';
import { Language, KanjiFontSize } from '../types/kanji';
import { TRANSLATIONS } from '../i18n/translations';

export type ActivePage = 'educational' | 'quick_word' | 'library';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  fontMode: 'serif' | 'sans';
  onFontModeChange: (mode: 'serif' | 'sans') => void;
  fontSize: KanjiFontSize;
  onFontSizeChange: (size: KanjiFontSize) => void;
  isDark: boolean;
  onToggleDark: () => void;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  fontMode,
  onFontModeChange,
  fontSize,
  onFontSizeChange,
  isDark,
  onToggleDark,
  activePage,
  onPageChange,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onPageChange('educational')}
            className="flex items-center gap-3 text-left focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-base shadow-sm">
              漢
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                KanjiForge <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">漢字鍛冶</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                {t.badgeScholar}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links for Pages */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onPageChange('educational')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activePage === 'educational'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            {t.navEducational}
          </button>
          <button
            type="button"
            onClick={() => onPageChange('quick_word')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activePage === 'quick_word'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            {t.navQuickWord}
          </button>
          <button
            type="button"
            onClick={() => onPageChange('library')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activePage === 'library'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
          >
            {t.navLibrary}
          </button>
        </nav>

        {/* Zone 3: Controls (Font Size, Language Switcher, Font Serif/Sans, Dark Mode) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Japanese-Style Font / Kanji Size Controller (小 中 大 特大 & 14 16 20 26px) */}
          <div
            className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700"
            title={`${t.fontSizeLabel}: 小(14px) · 中(16px) · 大(20px) · 特大(26px)`}
          >
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 px-1.5 hidden xl:inline font-sans select-none">
              {currentLang === 'ja' ? '文字' : currentLang === 'ar' ? 'الحجم' : 'Size'}
            </span>
            <button
              type="button"
              onClick={() => onFontSizeChange('sm')}
              title={`${t.fontSizeSm} - 14px`}
              aria-label={`${t.fontSizeSm} 14px`}
              className={`px-2 py-1 text-xs rounded-md transition-all whitespace-nowrap flex items-center gap-0.5 ${
                fontSize === 'sm'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>{currentLang === 'ar' ? 'ص' : '小'}</span>
              <span className="text-[9px] opacity-60 hidden sm:inline">14</span>
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange('md')}
              title={`${t.fontSizeMd} - 16px (標準)`}
              aria-label={`${t.fontSizeMd} 16px`}
              className={`px-2 py-1 text-xs rounded-md transition-all whitespace-nowrap flex items-center gap-0.5 ${
                fontSize === 'md'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>{currentLang === 'ar' ? 'م' : '中'}</span>
              <span className="text-[9px] opacity-60 hidden sm:inline">16</span>
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange('lg')}
              title={`${t.fontSizeLg} - 20px`}
              aria-label={`${t.fontSizeLg} 20px`}
              className={`px-2 py-1 text-xs rounded-md transition-all whitespace-nowrap flex items-center gap-0.5 ${
                fontSize === 'lg'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>{currentLang === 'ar' ? 'ك' : '大'}</span>
              <span className="text-[9px] opacity-60 hidden sm:inline">20</span>
            </button>
            <button
              type="button"
              onClick={() => onFontSizeChange('xl')}
              title={`${t.fontSizeXl} - 26px`}
              aria-label={`${t.fontSizeXl} 26px`}
              className={`px-2 py-1 text-xs rounded-md transition-all whitespace-nowrap flex items-center gap-0.5 ${
                fontSize === 'xl'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>{currentLang === 'ar' ? 'ك+' : '特大'}</span>
              <span className="text-[9px] opacity-60 hidden sm:inline">26</span>
            </button>
          </div>

          {/* Font Toggle (Mincho / Gothic) */}
          <button
            onClick={() => onFontModeChange(fontMode === 'serif' ? 'sans' : 'serif')}
            title={fontMode === 'serif' ? t.fontSans : t.fontSerif}
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-700 whitespace-nowrap"
          >
            <Type className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">{fontMode === 'serif' ? t.fontSerif : t.fontSans}</span>
          </button>

          {/* Language Switcher Segmented Control */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => onLanguageChange('ja')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentLang === 'ja'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              日本語
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentLang === 'en'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('ar')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                currentLang === 'ar'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-arabic'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-arabic'
              }`}
            >
              العربية
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
