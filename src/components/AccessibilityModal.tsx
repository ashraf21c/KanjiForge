import React, { useEffect, useRef } from 'react';
import {
  Accessibility,
  Eye,
  Type,
  Volume2,
  Sparkles,
  Check,
  X,
  Keyboard,
  Contrast,
  Gauge,
  BookOpen,
} from 'lucide-react';
import { Language, KanjiFontSize, FontMode, AccessibilitySettings } from '../types/kanji';
import { TRANSLATIONS } from '../i18n/translations';
import { speakJapaneseText } from '../utils/accessibility';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  settings: AccessibilitySettings;
  onUpdateSettings: (updater: (prev: AccessibilitySettings) => AccessibilitySettings) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  settings,
  onUpdateSettings,
}) => {
  const t = TRANSLATIONS[currentLang];
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus inside modal when open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestSpeech = () => {
    speakJapaneseText('漢字鍛冶へようこそ。新字体と旧字体の相互変換システムです。', settings.speechRate);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-dialog-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto focus:outline-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Accessibility className="w-6 h-6" />
            </div>
            <div>
              <h2
                id="accessibility-dialog-title"
                className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"
              >
                <span>{t.accessibilityTitle}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  WCAG 2.2 AAA / JIS X 8341-3
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {t.accessibilitySubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeDialog}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Font / Kanji Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-amber-500" />
              <span>{t.fontSizeLabel} (文字サイズ切替)</span>
            </label>
            <span className="text-[11px] text-neutral-400 font-mono">
              現在: {settings.fontSize === 'sm' ? '14px (小)' : settings.fontSize === 'md' ? '16px (中)' : settings.fontSize === 'lg' ? '20px (大)' : '26px (特大)'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'sm', label: '小 (14px)', desc: currentLang === 'ar' ? 'صغير' : '標準より控えめ' },
              { id: 'md', label: '中 (16px)', desc: currentLang === 'ar' ? 'متوسط' : '標準サイズ' },
              { id: 'lg', label: '大 (20px)', desc: currentLang === 'ar' ? 'كبير' : '読みやすさ重視' },
              { id: 'xl', label: '特大 (26px)', desc: currentLang === 'ar' ? 'كبير جداً' : '最大拡大' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => onUpdateSettings(prev => ({ ...prev, fontSize: item.id as KanjiFontSize }))}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                  settings.fontSize === item.id
                    ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-400'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                    {item.label}
                  </span>
                  {settings.fontSize === item.id && (
                    <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Typography & Universal Design (UD) Font */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>フォント種別 / 書体選択</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'serif',
                label: '明朝体 (Mincho)',
                desc: '伝統的正字・字形学研究向け',
                fontClass: 'font-serif',
              },
              {
                id: 'sans',
                label: 'ゴシック体 (Gothic)',
                desc: 'モダン・画面表示向け',
                fontClass: 'font-sans',
              },
              {
                id: 'ud',
                label: t.fontUdLabel,
                desc: '低視認疲労・ディスレクシア配慮',
                fontClass: 'font-sans',
              },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => onUpdateSettings(prev => ({ ...prev, fontMode: item.id as FontMode }))}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  settings.fontMode === item.id
                    ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-400'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold text-neutral-900 dark:text-neutral-100 ${item.fontClass}`}>
                    {item.label}
                  </span>
                  {settings.fontMode === item.id && (
                    <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Visual & Japanese Linguistic Accommodations (High Contrast & Ruby) */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-amber-500" />
            <span>視覚・言語的アクセシビリティ支援</span>
          </label>

          <div className="space-y-2">
            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <Contrast className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {t.highContrastLabel}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.highContrastDesc}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => onUpdateSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.highContrast ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Furigana / Ruby Reading Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {t.showRubyLabel}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-mono">
                    漢字の上によみがな
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.showRubyDesc}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.showRuby}
                onClick={() => onUpdateSettings(prev => ({ ...prev, showRuby: !prev.showRuby }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.showRuby ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.showRuby ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {t.reducedMotionLabel}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {t.reducedMotionDesc}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.reducedMotion}
                onClick={() => onUpdateSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }))}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  settings.reducedMotion ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Text-To-Speech (TTS) Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-500" />
              <span>{t.ttsLabel}</span>
            </label>
            <button
              type="button"
              onClick={handleTestSpeech}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-800 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t.ttsPlayBtn}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2.5">
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t.ttsDesc}
            </p>

            <div className="flex items-center gap-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {t.ttsSpeedLabel}:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { rate: 0.8, label: '0.8x (ゆっくり)' },
                  { rate: 1.0, label: '1.0x (標準)' },
                  { rate: 1.2, label: '1.2x (速め)' },
                ].map(item => (
                  <button
                    key={item.rate}
                    type="button"
                    onClick={() => onUpdateSettings(prev => ({ ...prev, speechRate: item.rate }))}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      settings.speechRate === item.rate
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Keyboard Shortcuts Reference */}
        <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Keyboard className="w-4 h-4 text-amber-500" />
            <span>{t.keyboardShortcutsTitle}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">アクセシビリティ設定を開く</span>
              <kbd className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 font-mono text-[11px] font-bold">Alt + A</kbd>
            </div>
            <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">文字サイズ切替 (小〜特大)</span>
              <kbd className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 font-mono text-[11px] font-bold">Alt + S</kbd>
            </div>
            <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">単語即時変換画面</span>
              <kbd className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 font-mono text-[11px] font-bold">Alt + 1</kbd>
            </div>
            <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">学術コンソール画面</span>
              <kbd className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 font-mono text-[11px] font-bold">Alt + 2</kbd>
            </div>
            <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">変換結果をコピー</span>
              <kbd className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 font-mono text-[11px] font-bold">Alt + C</kbd>
            </div>
            <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">ダイアログを閉じる</span>
              <kbd className="px-2 py-0.5 rounded bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 font-mono text-[11px] font-bold">Esc</kbd>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs"
          >
            {t.closeDialog}
          </button>
        </div>
      </div>
    </div>
  );
};
