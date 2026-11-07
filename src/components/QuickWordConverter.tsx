import React, { useState, useMemo, useEffect } from 'react';
import {
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Layers,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  AmbiguityAlert,
  ConversionDirection,
  KanjiCharInfo,
  KanjiFontSize,
  Language,
  FontMode,
} from '../types/kanji';
import { TRANSLATIONS } from '../i18n/translations';
import { convertLine } from '../services/converterService';
import { AmbiguityModal } from './AmbiguityModal';
import { CharacterInspector } from './CharacterInspector';
import {
  KANJI_THEMES,
  THEME_KEYS,
  getKanjiThemeByOrder,
  getKanjiThemeForCharIndex,
} from '../utils/kanjiThemes';
import { getRubyReadingForChar, speakJapaneseText } from '../utils/accessibility';

interface QuickWordConverterProps {
  currentLang: Language;
  fontMode: FontMode;
  fontSize?: KanjiFontSize;
  onFontSizeChange?: (size: KanjiFontSize) => void;
  onOpenInEducationalConsole: (text: string) => void;
  showRuby?: boolean;
  speechRate?: number;
  onAnnounce?: (msg: string) => void;
}

export const QuickWordConverter: React.FC<QuickWordConverterProps> = ({
  currentLang,
  fontMode,
  fontSize = 'md',
  onFontSizeChange,
  onOpenInEducationalConsole,
  showRuby = false,
  speechRate = 1.0,
  onAnnounce,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [direction, setDirection] = useState<ConversionDirection>('shin_to_kyu');
  const [singleWordInput, setSingleWordInput] = useState<string>('継体');
  const [userOverrides, setUserOverrides] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [activeAlert, setActiveAlert] = useState<AmbiguityAlert | null>(null);

  // View mode when multiple kanjis change: 'all' (cards for all changed kanji) vs 'single'
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');

  // Explicit user-selected character index (null = auto-target the changed/ambiguous character)
  const [selectedCharIndex, setSelectedCharIndex] = useState<number | null>(null);

  const conversionResult = useMemo(() => {
    return convertLine(singleWordInput, 0, direction, userOverrides);
  }, [singleWordInput, direction, userOverrides]);

  // Changed characters indices (supports up to 4 changed kanji for 熟語, 三字熟語, 四字熟語)
  const changedIndices = useMemo(() => {
    return conversionResult.changedIndices.slice(0, 4);
  }, [conversionResult]);

  // Dynamically compute the default character index to inspect:
  // If characters changed (e.g. index 0 or 1 for 継体 -> 繼體), prioritize the changed kanji!
  // If an ambiguity exists, inspect that character index.
  // Otherwise default to 0.
  const defaultTargetIndex = useMemo(() => {
    if (conversionResult.changedIndices.length > 0) {
      return conversionResult.changedIndices[0];
    }
    if (conversionResult.ambiguities.length > 0 && conversionResult.ambiguities[0].charIndex !== undefined) {
      return conversionResult.ambiguities[0].charIndex;
    }
    return 0;
  }, [conversionResult]);

  const activeCharIndex =
    selectedCharIndex !== null && selectedCharIndex < conversionResult.outputChars.length
      ? selectedCharIndex
      : defaultTargetIndex;

  const inspectedInputChar =
    conversionResult.inputChars[activeCharIndex] ||
    conversionResult.outputChars[activeCharIndex] ||
    null;

  const inspectedOutputChar =
    conversionResult.outputChars[activeCharIndex] ||
    conversionResult.inputChars[activeCharIndex] ||
    null;

  const handleCopy = () => {
    if (!conversionResult.convertedText) return;
    navigator.clipboard.writeText(conversionResult.convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSelectCharIndex = (index: number) => {
    setSelectedCharIndex(index);
    if (changedIndices.length > 1) {
      setViewMode('single');
    }
  };

  const handleApplyOverride = (alertId: string, chosenChar: string) => {
    setUserOverrides(prev => ({
      ...prev,
      [alertId]: chosenChar,
    }));
  };

  const fontClass =
    fontMode === 'serif'
      ? 'font-serif'
      : fontMode === 'ud'
      ? 'font-ud font-medium'
      : 'font-sans';

  // Screen reader announcer hook
  useEffect(() => {
    if (singleWordInput && conversionResult && onAnnounce) {
      const dirText = direction === 'shin_to_kyu' ? '旧字体' : '新字体';
      onAnnounce(`「${singleWordInput}」を${dirText}「${conversionResult.convertedText}」に変換しました。`);
    }
  }, [singleWordInput, conversionResult.convertedText, direction, onAnnounce]);

  const sizeStyles = {
    sm: {
      input: 'text-lg sm:text-xl',
      output: 'text-2xl sm:text-3xl',
    },
    md: {
      input: 'text-xl sm:text-2xl',
      output: 'text-3xl sm:text-4xl',
    },
    lg: {
      input: 'text-2xl sm:text-3xl',
      output: 'text-4xl sm:text-5xl',
    },
    xl: {
      input: 'text-3xl sm:text-4xl',
      output: 'text-5xl sm:text-6xl',
    },
  }[fontSize];

  const quickWordSuggestions = [
    // 2-Kanji changed pairs (二字熟語)
    { word: '継体', desc: '継体 ➔ 繼體 (2文字共変換・二字熟語)' },
    { word: '混交', desc: '混交 ➔ 混淆 (1対多文脈解決・交➔淆)' },
    { word: '経歴', desc: '経歴 ➔ 經歷 (2文字共変換)' },
    { word: '変革', desc: '変革 ➔ 變革 (変の正字)' },
    { word: '弁償', desc: '弁償 ➔ 辨償 (弁の1対多)' },
    { word: '花弁', desc: '花弁 ➔ 花瓣 (弁の1対多)' },
    // 3-Kanji (三字熟語)
    { word: '弁護士', desc: '弁護士 ➔ 辯護士 (三字熟語・弁の正字)' },
    { word: '図書館', desc: '図書館 ➔ 圖書館 (三字熟語・図の正字)' },
    { word: '体育館', desc: '体育館 ➔ 體育館 (三字熟語・体の正字)' },
    { word: '研究所', desc: '研究所 ➔ 硏究所 (三字熟語・研の正字)' },
    // 4-Kanji (四字熟語)
    { word: '絶体絶命', desc: '絶体絶命 ➔ 絕體絕命 (3箇所変換・四字熟語)' },
    { word: '臨機応変', desc: '臨機応変 ➔ 臨機應變 (2文字変換・四字熟語)' },
    { word: '国士無双', desc: '国士無双 ➔ 國士無雙 (2文字変換・四字熟語)' },
    { word: '独立独歩', desc: '独立独歩 ➔ 獨立獨步 (3文字変換・四字熟語)' },
    { word: '質実剛健', desc: '質実剛健 ➔ 質實剛健 (四字熟語・実の正字)' },
    { word: '百花繚乱', desc: '百花繚乱 ➔ 百花繚亂 (四字熟語・乱の正字)' },
    { word: '温故知新', desc: '温故知新 ➔ 溫故知新 (四字熟語・温の正字)' },
    // 1-Kanji
    { word: '国', desc: '国 ➔ 國 (常用正字)' },
    { word: '桜', desc: '桜 ➔ 櫻 (常用正字)' },
    { word: '学', desc: '学 ➔ 學 (常用正字)' },
    { word: '体', desc: '体 ➔ 體 (常用正字)' },
  ];

  return (
    <div className="space-y-6">
      {/* Direction & Header Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>{t.singleWordQuickTitle}</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              単語や漢字を入力すると即座に旧字体・新字体を変換し、一対多の文脈や各文字の文字コードを表示します。
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-between xl:justify-end">
            {/* Direction Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                {t.directionLabel}:
              </span>
              <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setDirection('shin_to_kyu')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    direction === 'shin_to_kyu'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <span>新字体 → 旧字体</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('kyu_to_shin')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    direction === 'kyu_to_shin'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <span>旧字体 → 新字体</span>
                </button>
              </div>
            </div>

            {/* In-Card Font Size Control */}
            {onFontSizeChange && (
              <div
                className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700"
                title={`${t.fontSizeLabel}: 小(14) · 中(16) · 大(20) · 特大(26)`}
              >
                <span className="text-[11px] text-neutral-400 font-medium px-1 select-none">
                  {currentLang === 'ja' ? '文字サイズ' : currentLang === 'ar' ? 'حجم الخط' : 'Size'}
                </span>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('sm')}
                  title={`${t.fontSizeSm} - 14px`}
                  className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
                    fontSize === 'sm'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {currentLang === 'ar' ? 'ص' : '小'} <span className="text-[10px] opacity-70">14</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('md')}
                  title={`${t.fontSizeMd} - 16px`}
                  className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
                    fontSize === 'md'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {currentLang === 'ar' ? 'م' : '中'} <span className="text-[10px] opacity-70">16</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('lg')}
                  title={`${t.fontSizeLg} - 20px`}
                  className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
                    fontSize === 'lg'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {currentLang === 'ar' ? 'ك' : '大'} <span className="text-[10px] opacity-70">20</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFontSizeChange('xl')}
                  title={`${t.fontSizeXl} - 26px`}
                  className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
                    fontSize === 'xl'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {currentLang === 'ar' ? 'ك+' : '特大'} <span className="text-[10px] opacity-70">26</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Big Word Input Field */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={singleWordInput}
              onChange={e => {
                setSingleWordInput(e.target.value);
                setSelectedCharIndex(null);
              }}
              placeholder={t.singleWordInputPlaceholder}
              autoFocus
              className={`w-full px-4 py-3.5 ${sizeStyles.input} font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 shadow-inner ${fontClass}`}
            />
            {singleWordInput && (
              <button
                type="button"
                onClick={() => {
                  setSingleWordInput('');
                  setSelectedCharIndex(null);
                  setUserOverrides({});
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-md"
                title="クリア"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Word Tags */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-neutral-400 font-medium">代表的な用例:</span>
            {quickWordSuggestions.map(item => (
              <button
                key={item.word}
                type="button"
                onClick={() => {
                  setSingleWordInput(item.word);
                  setSelectedCharIndex(null);
                  setUserOverrides({});
                }}
                title={item.desc}
                className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                  singleWordInput === item.word
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 font-semibold shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {item.word}
              </button>
            ))}
          </div>
        </div>

        {/* Live Conversion Result Card */}
        {conversionResult && singleWordInput && (
          <div className="bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Input word */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      {direction === 'shin_to_kyu' ? t.shinShort : t.kyuShort}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakJapaneseText(singleWordInput, speechRate)}
                      title={`「${singleWordInput}」の音声を再生`}
                      aria-label={`「${singleWordInput}」の音声を再生`}
                      className="p-1 rounded text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className={`${sizeStyles.output} font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 ${fontClass}`}>
                    {conversionResult.inputChars.map((c, i) => {
                      const theme = getKanjiThemeForCharIndex(i, conversionResult.changedIndices);
                      const isSelected = activeCharIndex === i;
                      const rubyReading = showRuby ? getRubyReadingForChar(c.char) : null;

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectCharIndex(i)}
                          title={`Click to inspect ${c.char} (${c.unicodeHex})`}
                          className={`relative px-2 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                            theme
                              ? `${theme.tokenBg} ${theme.tokenBorder} border ${theme.tokenText} shadow-xs ${
                                  isSelected ? `${theme.tokenRing} scale-105` : 'hover:scale-102'
                                }`
                              : `text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
                                  isSelected ? 'ring-2 ring-neutral-400 bg-neutral-100 dark:bg-neutral-800' : ''
                                }`
                          }`}
                        >
                          {rubyReading ? (
                            <ruby>
                              <span>{c.char}</span>
                              <rt className="text-[10px] font-normal opacity-85 select-none leading-none">
                                {rubyReading}
                              </rt>
                            </ruby>
                          ) : (
                            <span>{c.char}</span>
                          )}
                          {theme && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none shadow-2xs ${theme.badgeBg}`}
                              title={theme.name[currentLang] || theme.name.ja}
                            >
                              {theme.numberSymbol}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <span className="text-2xl text-neutral-400 font-mono">➔</span>

                {/* Converted word */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {direction === 'shin_to_kyu' ? t.kyuShort : t.shinShort} ({t.singleWordResult})
                    </span>
                    <button
                      type="button"
                      onClick={() => speakJapaneseText(conversionResult.convertedText, speechRate)}
                      title={`「${conversionResult.convertedText}」の音声を再生`}
                      aria-label={`「${conversionResult.convertedText}」の音声を再生`}
                      className="p-1 rounded text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className={`${sizeStyles.output} font-bold flex items-center gap-1.5 ${fontClass}`}>
                    {conversionResult.outputChars.map((c, i) => {
                      const theme = getKanjiThemeForCharIndex(i, conversionResult.changedIndices);
                      const isSelected = activeCharIndex === i;
                      const rubyReading = showRuby ? getRubyReadingForChar(c.char) : null;

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectCharIndex(i)}
                          title={`Click to inspect ${c.char} (${c.unicodeHex})`}
                          className={`relative px-2 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                            theme
                              ? `${theme.tokenBg} ${theme.tokenBorder} border ${theme.tokenText} shadow-xs ${
                                  isSelected ? `${theme.tokenRing} scale-105` : 'hover:scale-102'
                                }`
                              : `text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 ${
                                  isSelected ? 'ring-2 ring-neutral-400 bg-neutral-100 dark:bg-neutral-800' : ''
                                }`
                          }`}
                        >
                          {rubyReading ? (
                            <ruby>
                              <span>{c.char}</span>
                              <rt className="text-[10px] font-normal opacity-85 select-none leading-none">
                                {rubyReading}
                              </rt>
                            </ruby>
                          ) : (
                            <span>{c.char}</span>
                          )}
                          {theme && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none shadow-2xs ${theme.badgeBg}`}
                              title={theme.name[currentLang] || theme.name.ja}
                            >
                              {theme.numberSymbol}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium text-xs shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                      <span>{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyConverted}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenInEducationalConsole(singleWordInput)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs font-medium"
                  title="学術コンソールでこの単語を開く"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>学術コンソールで開く</span>
                </button>
              </div>
            </div>

            {/* Ambiguity Alert Notice (if 1-to-many case detected in this word) */}
            {conversionResult.ambiguities.length > 0 && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg text-xs space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 dark:text-amber-200">
                        {conversionResult.ambiguities[0].compoundFound ? (
                          <span>
                            文脈照合: 「{conversionResult.ambiguities[0].compoundFound}」により「{conversionResult.ambiguities[0].resolvedChoice}」を自動適用しました
                          </span>
                        ) : (
                          <span>
                            1対多の分岐: 「{conversionResult.ambiguities[0].sourceChar}」には複数の旧字候補があります
                          </span>
                        )}
                      </span>
                      <p className="text-amber-800/90 dark:text-amber-300/90 text-[11px] mt-0.5 leading-relaxed">
                        {conversionResult.ambiguities[0].explanation[currentLang] ||
                          conversionResult.ambiguities[0].explanation.ja}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveAlert(conversionResult.ambiguities[0])}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-200/70 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-800 shrink-0 flex items-center gap-1 transition-colors"
                  >
                    <span>{t.resolveAmbiguity}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Character Code Strip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <span>構成文字コード一覧 (各文字をクリックで精密解析):</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">
                  変換文字は専用色でハイライト表示
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                {conversionResult.outputChars.map((outC, idx) => {
                  const inC = conversionResult.inputChars[idx] || outC;
                  const theme = getKanjiThemeForCharIndex(idx, conversionResult.changedIndices);
                  const isSelected = activeCharIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectCharIndex(idx)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs ${
                        theme
                          ? `${theme.stripCardBorder} ${
                              isSelected
                                ? `${theme.stripCardBgActive} ${theme.stripCardRing}`
                                : 'bg-white dark:bg-neutral-900 hover:border-amber-400'
                            }`
                          : isSelected
                            ? 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600 ring-2 ring-neutral-400'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {theme ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`w-8 h-8 rounded ${theme.glyphBoxBg} ${theme.glyphBoxBorder} border flex items-center justify-center text-lg font-bold ${fontClass} ${theme.glyphText}`}
                              title={`変換前: ${inC.char}`}
                            >
                              {inC.char}
                            </span>
                            <span className={`${theme.arrowColor} font-bold text-xs`}>→</span>
                            <span
                              className={`w-8 h-8 rounded ${theme.tokenBg} ${theme.tokenBorder} border flex items-center justify-center text-lg font-bold ${fontClass} ${theme.tokenText}`}
                              title={`変換後: ${outC.char}`}
                            >
                              {outC.char}
                            </span>
                          </div>
                        ) : (
                          <span className={`w-9 h-9 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-bold shrink-0 ${fontClass}`}>
                            {outC.char}
                          </span>
                        )}

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-xs">
                              {outC.unicodeHex}
                            </span>
                            {theme && (
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${theme.stripBadge}`}>
                                {theme.numberSymbol} 変換
                              </span>
                            )}
                            {isSelected && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                                解析中
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            SJIS: <span className="font-mono">{outC.shiftJisHex}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`text-[11px] font-mono font-semibold ${theme ? theme.accentText : 'text-neutral-600 dark:text-neutral-300'}`}>
                          {outC.kuten}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          JIS: <span className="font-mono">{outC.jisHex}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deep Character Inspector Section: Supports All Changed Kanjis (up to 4) */}
      <div className="space-y-4">
        {/* Navigation & View Mode Controls when multiple kanjis change (e.g. 継体, 絶体絶命, etc.) */}
        {changedIndices.length > 1 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>変換漢字 ({changedIndices.length}文字検出):</span>
              </span>

              {/* Quick Jump/Filter Pills for Each Changed Kanji with Its Color */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {changedIndices.map((charIdx, order) => {
                  const theme = getKanjiThemeByOrder(order);
                  const inC = conversionResult.inputChars[charIdx];
                  const outC = conversionResult.outputChars[charIdx];
                  const isCurrent = viewMode === 'single' && activeCharIndex === charIdx;

                  return (
                    <button
                      key={charIdx}
                      type="button"
                      onClick={() => {
                        setSelectedCharIndex(charIdx);
                        setViewMode('single');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                        theme.tokenBorder
                      } ${
                        isCurrent
                          ? `${theme.tokenBg} ${theme.tokenText} ${theme.tokenRing}`
                          : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${theme.badgeBg}`}>
                        {theme.numberSymbol}
                      </span>
                      <span>
                        {inC?.char} ➔ {outC?.char}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View Mode Toggle Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'all'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>全{changedIndices.length}文字を一括表示</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'single'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>個別カード</span>
              </button>
            </div>
          </div>
        )}

        {/* View Mode A: Render Cards for ALL Changed Kanjis (up to 4 kanjis!) */}
        {viewMode === 'all' && changedIndices.length > 1 ? (
          <div className="space-y-6">
            {changedIndices.map((charIdx, order) => {
              const theme = getKanjiThemeByOrder(order);
              const inChar = conversionResult.inputChars[charIdx];
              const outChar = conversionResult.outputChars[charIdx];
              if (!inChar || !outChar) return null;

              return (
                <div
                  key={charIdx}
                  className={`bg-white dark:bg-neutral-900 border rounded-2xl p-5 shadow-xs transition-all space-y-4 ${theme.sectionBorder}`}
                >
                  {/* Themed Header for this specific changed kanji pair */}
                  <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${theme.sectionBorder} ${theme.sectionHeaderBg} flex-wrap`}>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${theme.badgeBg}`}>
                        {theme.numberSymbol}
                      </span>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          変換漢字 #{order + 1}:
                        </h4>
                        <span className={`text-base font-bold font-mono px-2 py-0.5 rounded border ${theme.badgeText} ${fontClass}`}>
                          {inChar.char} <span className={theme.arrowColor}>➔</span> {outChar.char}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        ({theme.name[currentLang] || theme.name.ja})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-500 font-mono text-[11px]">
                        {inChar.unicodeHex} ➔ {outChar.unicodeHex}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCharIndex(charIdx);
                          setViewMode('single');
                        }}
                        className="px-2.5 py-1 rounded text-[11px] font-medium bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        個別フォーカス
                      </button>
                    </div>
                  </div>

                  {/* The pair of cards for this changed kanji */}
                  <CharacterInspector
                    inputChar={inChar}
                    outputChar={outChar}
                    currentLang={currentLang}
                    fontMode={fontMode}
                    colorTheme={theme.key}
                    orderSymbol={theme.numberSymbol}
                    pairTitle={`「${inChar.char}」→「${outChar.char}」`}
                    showHeader={false}
                    speechRate={speechRate}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* View Mode B: Single Inspected Character Card */
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  選択文字の精密符号化コード・字形情報
                </h3>
                {(() => {
                  const theme = getKanjiThemeForCharIndex(activeCharIndex, conversionResult.changedIndices);
                  if (theme) {
                    return (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold shadow-2xs ${theme.badgeBg}`}>
                        {theme.numberSymbol} 変換文字
                      </span>
                    );
                  }
                  return null;
                })()}
                {inspectedInputChar && inspectedOutputChar && (
                  <span className={`text-xs font-mono px-2.5 py-0.5 rounded border font-bold ${
                    (() => {
                      const theme = getKanjiThemeForCharIndex(activeCharIndex, conversionResult.changedIndices);
                      return theme
                        ? theme.badgeText
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
                    })()
                  }`}>
                    {inspectedInputChar.char !== inspectedOutputChar.char
                      ? `${inspectedInputChar.char} → ${inspectedOutputChar.char}`
                      : inspectedOutputChar.char}
                  </span>
                )}
              </div>

              {changedIndices.length > 1 && (
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>全{changedIndices.length}文字を一括表示に戻す</span>
                </button>
              )}
            </div>

            <CharacterInspector
              inputChar={inspectedInputChar}
              outputChar={inspectedOutputChar}
              currentLang={currentLang}
              fontMode={fontMode}
              colorTheme={getKanjiThemeForCharIndex(activeCharIndex, conversionResult.changedIndices)?.key}
              orderSymbol={getKanjiThemeForCharIndex(activeCharIndex, conversionResult.changedIndices)?.numberSymbol}
              showHeader={false}
              speechRate={speechRate}
            />
          </div>
        )}
      </div>

      {/* Disambiguation Modal */}
      <AmbiguityModal
        alert={activeAlert}
        currentLang={currentLang}
        onClose={() => setActiveAlert(null)}
        onSelectOption={handleApplyOverride}
      />
    </div>
  );
};
