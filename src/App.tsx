import React, { useState, useEffect, useCallback } from 'react';
import { Header, ActivePage } from './components/Header';
import { EducationalConsole } from './components/EducationalConsole';
import { QuickWordConverter } from './components/QuickWordConverter';
import { OrthographyLibrary } from './components/OrthographyLibrary';
import { AccessibilityModal } from './components/AccessibilityModal';
import { Language, KanjiFontSize, FontMode, AccessibilitySettings } from './types/kanji';
import { detectLanguage, saveLanguagePreference, TRANSLATIONS } from './i18n/translations';

const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  fontSize: 'md',
  fontMode: 'serif',
  highContrast: false,
  showRuby: false,
  reducedMotion: false,
  speechRate: 1.0,
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>(() => detectLanguage());
  const [activePage, setActivePage] = useState<ActivePage>('educational');
  const [consoleInitialText, setConsoleInitialText] = useState<string | undefined>(undefined);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState<boolean>(false);
  const [srAnnouncement, setSrAnnouncement] = useState<string>('');

  // Comprehensive Accessibility State (WCAG 2.2 AAA & JIS X 8341-3)
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kanji_accessibility_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...DEFAULT_ACCESSIBILITY_SETTINGS,
            ...parsed,
          };
        } catch (e) {
          console.warn('Failed to parse saved accessibility settings', e);
        }
      }
      // Check legacy font size if present
      const legacySize = localStorage.getItem('kanji_font_size');
      if (legacySize === 'sm' || legacySize === 'md' || legacySize === 'lg' || legacySize === 'xl') {
        return {
          ...DEFAULT_ACCESSIBILITY_SETTINGS,
          fontSize: legacySize,
        };
      }
    }
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('kanji_applet_theme') === 'dark' ||
        (!('kanji_applet_theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // Persist accessibility settings
  useEffect(() => {
    localStorage.setItem('kanji_accessibility_settings', JSON.stringify(accessibilitySettings));
    localStorage.setItem('kanji_font_size', accessibilitySettings.fontSize);
  }, [accessibilitySettings]);

  // Sync high contrast CSS class on document element
  useEffect(() => {
    if (accessibilitySettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [accessibilitySettings.highContrast]);

  // Sync reduced motion CSS class on document element
  useEffect(() => {
    if (accessibilitySettings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [accessibilitySettings.reducedMotion]);

  // Sync dark theme class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kanji_applet_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kanji_applet_theme', 'light');
    }
  }, [isDark]);

  // Sync RTL / LTR document direction and language attribute based on selected language
  useEffect(() => {
    if (currentLang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', currentLang);
    }
  }, [currentLang]);

  // Screen reader announcer helper
  const handleAnnounce = useCallback((message: string) => {
    setSrAnnouncement(message);
  }, []);

  // Keyboard navigation & accessibility shortcuts (Alt + A, Alt + 1, Alt + 2, Alt + 3, Alt + S, Alt + C)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea (unless modifier is pressed)
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          setIsAccessibilityModalOpen(prev => !prev);
        } else if (e.key === '1') {
          e.preventDefault();
          setActivePage('quick_word');
          handleAnnounce('単語即時変換画面に切り替えました。');
        } else if (e.key === '2') {
          e.preventDefault();
          setActivePage('educational');
          handleAnnounce('学術コンソール画面に切り替えました。');
        } else if (e.key === '3') {
          e.preventDefault();
          setActivePage('library');
          handleAnnounce('同音書き換え学術解説ライブラリ画面に切り替えました。');
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          setAccessibilitySettings(prev => {
            const nextSize: KanjiFontSize =
              prev.fontSize === 'sm'
                ? 'md'
                : prev.fontSize === 'md'
                ? 'lg'
                : prev.fontSize === 'lg'
                ? 'xl'
                : 'sm';
            const sizeLabel = nextSize === 'sm' ? '小 (14px)' : nextSize === 'md' ? '中 (16px)' : nextSize === 'lg' ? '大 (20px)' : '特大 (26px)';
            handleAnnounce(`文字サイズを ${sizeLabel} に変更しました。`);
            return { ...prev, fontSize: nextSize };
          });
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          setAccessibilitySettings(prev => {
            const nextContrast = !prev.highContrast;
            handleAnnounce(nextContrast ? '高コントラストモードを有効にしました。' : '高コントラストモードを無効にしました。');
            return { ...prev, highContrast: nextContrast };
          });
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleAnnounce]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    saveLanguagePreference(lang);
  };

  const handleToggleDark = () => {
    setIsDark(prev => !prev);
  };

  const handleOpenInEducationalConsole = (text: string) => {
    setConsoleInitialText(text);
    setActivePage('educational');
  };

  const t = TRANSLATIONS[currentLang];
  const isArabic = currentLang === 'ar';

  return (
    <div
      className={`min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors ${
        isArabic ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* WCAG 2.2 AAA Skip-to-content Link for Keyboard Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-lg focus:shadow-xl focus:font-bold focus:text-sm focus:outline-hidden focus:ring-4 focus:ring-amber-300"
      >
        {t.skipToMainContent}
      </a>

      {/* Screen Reader Live Region for Dynamic Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {srAnnouncement}
      </div>

      {/* Top Bar */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        fontMode={accessibilitySettings.fontMode}
        onFontModeChange={mode => setAccessibilitySettings(s => ({ ...s, fontMode: mode }))}
        fontSize={accessibilitySettings.fontSize}
        onFontSizeChange={size => setAccessibilitySettings(s => ({ ...s, fontSize: size }))}
        isDark={isDark}
        onToggleDark={handleToggleDark}
        activePage={activePage}
        onPageChange={page => setActivePage(page)}
        onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 focus:outline-hidden"
      >
        {/* Editorial Hero Header */}
        <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>漢字字形研究</span>
            <span aria-hidden="true">·</span>
            <span>当用・常用漢字 1946–2010</span>
            <span aria-hidden="true">·</span>
            <span>JIS X 0208 / 0213</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 text-balance">
            {activePage === 'educational' && t.educationalTitle}
            {activePage === 'quick_word' && t.singleWordQuickTitle}
            {activePage === 'library' && t.libraryTitle}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            {activePage === 'educational' && (
              currentLang === 'ja'
                ? '現代の新字体と古典・正字（旧字体）を相互変換。1対多の分岐（「混交」→「混淆」や「弁護」「予定」など）における文脈推定・手動選択、および各漢字の Unicode、JIS、Shift-JIS、区点コードを即座に解析・照合します。'
                : currentLang === 'ar'
                ? 'محول ثنائي الاتجاه بين رسمي الكانجي الياباني الحديث (شينجيتاي) والتقليدي الكلاسيكي (كيوجيتاي). يتميز بالكشف التلقائي عن السياق لحالات الغموض والتشعب الصوتي (مثل تحويل 混交 إلى 混淆، 弁護، 予定)، مع تحليل فوري لشفرات الترميز القياسية: Unicode و JIS X 0208 و Shift-JIS وأكواد Kuten.'
                : 'Bi-directional conversion between Japanese Shinjitai (modern simplified) and Kyūjitai (traditional/classical) forms. Features contextual resolution for 1-to-many ambiguities (such as 混交 → 混淆, 弁護, 予定) and real-time character encoding inspection for Unicode, JIS, Shift-JIS, and Kuten codes.'
            )}
            {activePage === 'quick_word' && (
              currentLang === 'ja'
                ? '特定の単語や1文字の漢字を素早く入力・変換し、字形や符号化コード（Unicode/JIS/Shift-JIS/区点コード）の対照分析を行います。'
                : currentLang === 'ar'
                ? 'أدخل كلمة واحدة أو كانجي محدد للتحويل الفوري، مع فحص سريع لرسم الحرف ورموز التشفير القياسية.'
                : 'Quickly input and convert a single word or kanji, with instant contextual disambiguation and character code breakdown.'
            )}
            {activePage === 'library' && (
              currentLang === 'ja'
                ? '「混交」から「混淆」をはじめとする、国語審議会「同音の漢字による書きかえ」報告の代表的な一対多統合文字・代用字の学術解説集です。'
                : currentLang === 'ar'
                ? 'دليل أكاديمي يوثق أبرز حالات الدمج الصوتي والتبسيط المعجمي (من 混交 إلى 混淆، وأحرف 弁، 芸、予、欠、 إلخ).'
                : 'Scholarly catalog of official homophone substitutions (Kakikae) and 1-to-many kanji mergers (from 混交 to 混淆, 弁, 芸, 予, 欠, etc.).'
            )}
          </p>
        </div>

        {/* Dynamic Page Views */}
        {activePage === 'educational' && (
          <EducationalConsole
            currentLang={currentLang}
            fontMode={accessibilitySettings.fontMode}
            fontSize={accessibilitySettings.fontSize}
            onFontSizeChange={size => setAccessibilitySettings(s => ({ ...s, fontSize: size }))}
            initialText={consoleInitialText}
            showRuby={accessibilitySettings.showRuby}
            speechRate={accessibilitySettings.speechRate}
            onAnnounce={handleAnnounce}
          />
        )}

        {activePage === 'quick_word' && (
          <QuickWordConverter
            currentLang={currentLang}
            fontMode={accessibilitySettings.fontMode}
            fontSize={accessibilitySettings.fontSize}
            onFontSizeChange={size => setAccessibilitySettings(s => ({ ...s, fontSize: size }))}
            onOpenInEducationalConsole={handleOpenInEducationalConsole}
            showRuby={accessibilitySettings.showRuby}
            speechRate={accessibilitySettings.speechRate}
            onAnnounce={handleAnnounce}
          />
        )}

        {activePage === 'library' && (
          <OrthographyLibrary
            currentLang={currentLang}
            fontMode={accessibilitySettings.fontMode}
            onSelectCompoundForTesting={handleOpenInEducationalConsole}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 py-6 text-xs text-neutral-500 dark:text-neutral-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 dark:text-neutral-200">KanjiForge</span>
            <span aria-hidden="true">·</span>
            <span>Shinjitai &amp; Kyūjitai Converter</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>Unicode Standard 16.0</span>
            <span aria-hidden="true">·</span>
            <span>JIS X 0208:1997</span>
            <span aria-hidden="true">·</span>
            <span>Shift_JIS (CP932)</span>
          </div>
        </div>
      </footer>

      {/* WCAG 2.2 AAA Accessibility Center Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        currentLang={currentLang}
        settings={accessibilitySettings}
        onUpdateSettings={setAccessibilitySettings}
      />
    </div>
  );
}
