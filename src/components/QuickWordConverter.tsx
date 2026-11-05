import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import {
  AmbiguityAlert,
  ConversionDirection,
  KanjiCharInfo,
  KanjiFontSize,
  Language,
} from '../types/kanji';
import { TRANSLATIONS } from '../i18n/translations';
import { convertLine } from '../services/converterService';
import { AmbiguityModal } from './AmbiguityModal';
import { CharacterInspector } from './CharacterInspector';

interface QuickWordConverterProps {
  currentLang: Language;
  fontMode: 'serif' | 'sans';
  fontSize?: KanjiFontSize;
  onFontSizeChange?: (size: KanjiFontSize) => void;
  onOpenInEducationalConsole: (text: string) => void;
}

export const QuickWordConverter: React.FC<QuickWordConverterProps> = ({
  currentLang,
  fontMode,
  fontSize = 'md',
  onFontSizeChange,
  onOpenInEducationalConsole,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [direction, setDirection] = useState<ConversionDirection>('shin_to_kyu');
  const [singleWordInput, setSingleWordInput] = useState<string>('混交');
  const [userOverrides, setUserOverrides] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [activeAlert, setActiveAlert] = useState<AmbiguityAlert | null>(null);

  // Character selected for deep inspection
  const [inspectedInputChar, setInspectedInputChar] = useState<KanjiCharInfo | null>(null);
  const [inspectedOutputChar, setInspectedOutputChar] = useState<KanjiCharInfo | null>(null);

  const conversionResult = useMemo(() => {
    return convertLine(singleWordInput, 0, direction, userOverrides);
  }, [singleWordInput, direction, userOverrides]);

  const handleCopy = () => {
    if (!conversionResult.convertedText) return;
    navigator.clipboard.writeText(conversionResult.convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSelectChar = (inC: KanjiCharInfo, outC?: KanjiCharInfo) => {
    setInspectedInputChar(inC);
    setInspectedOutputChar(outC || inC);
  };

  const handleApplyOverride = (alertId: string, chosenChar: string) => {
    setUserOverrides(prev => ({
      ...prev,
      [alertId]: chosenChar,
    }));
  };

  const fontClass = fontMode === 'serif' ? 'font-serif' : 'font-sans';

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
    { word: '混交', desc: '混交 ➔ 混淆 (淆の同音書き換え)' },
    { word: '弁護士', desc: '弁護 ➔ 辯護 (言葉・弁論)' },
    { word: '花弁', desc: '花弁 ➔ 花瓣 (花びら・弁膜)' },
    { word: '弁償', desc: '弁償 ➔ 辨償 (償い・処理)' },
    { word: '予定', desc: '予定 ➔ 豫定 (あらかじめ)' },
    { word: '芸術', desc: '芸術 ➔ 藝術 (技芸・美術)' },
    { word: '欠席', desc: '欠席 ➔ 缺席 (不足・すきま)' },
    { word: '缶詰', desc: '缶詰 ➔ 罐詰 (金属容器)' },
    { word: '台風', desc: '台風 ➔ 颱風 (烈風)' },
    { word: '国', desc: '国 ➔ 國 (常用正字)' },
    { word: '桜', desc: '桜 ➔ 櫻 (常用正字)' },
    { word: '学', desc: '学 ➔ 學 (常用正字)' },
    { word: '体', desc: '体 ➔ 體 (常用正字)' },
    { word: '気', desc: '気 ➔ 氣 (常用正字)' },
    { word: '渡辺', desc: '渡辺 ➔ 渡邊 (名字異体)' },
    { word: '斉藤', desc: '斉藤 ➔ 齊藤 / 齋藤' },
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
              onChange={e => setSingleWordInput(e.target.value)}
              placeholder={t.singleWordInputPlaceholder}
              autoFocus
              className={`w-full px-4 py-3.5 ${sizeStyles.input} font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 shadow-inner ${fontClass}`}
            />
            {singleWordInput && (
              <button
                type="button"
                onClick={() => {
                  setSingleWordInput('');
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
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    {direction === 'shin_to_kyu' ? t.shinShort : t.kyuShort}
                  </span>
                  <div className={`${sizeStyles.output} font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 ${fontClass}`}>
                    {conversionResult.inputChars.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectChar(c, conversionResult.outputChars[i])}
                        title={`Click to inspect ${c.char} (${c.unicodeHex})`}
                        className="hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-900 dark:hover:text-amber-200 px-1 py-0.5 rounded transition-colors"
                      >
                        {c.char}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-2xl text-neutral-400 font-mono">➔</span>

                {/* Converted word */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {direction === 'shin_to_kyu' ? t.kyuShort : t.shinShort} ({t.singleWordResult})
                  </span>
                  <div className={`${sizeStyles.output} font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 ${fontClass}`}>
                    {conversionResult.outputChars.map((c, i) => {
                      const isChanged = conversionResult.changedIndices.includes(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectChar(conversionResult.inputChars[i] || c, c)}
                          title={`Click to inspect ${c.char} (${c.unicodeHex})`}
                          className={`px-1 py-0.5 rounded transition-colors ${
                            isChanged
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                              : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                          }`}
                        >
                          {c.char}
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
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                構成文字コード一覧 (クリックで詳細解析):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                {conversionResult.outputChars.map((outC, idx) => {
                  const inC = conversionResult.inputChars[idx] || outC;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectChar(inC, outC)}
                      className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-bold ${fontClass}`}>
                          {outC.char}
                        </span>
                        <div>
                          <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-xs">
                            {outC.unicodeHex}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            SJIS: <span className="font-mono">{outC.shiftJisHex}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-400">
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

      {/* Deep Character Inspector for the inspected character */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          選択文字の精密符号化コード・字形情報
        </h3>
        <CharacterInspector
          inputChar={inspectedInputChar || conversionResult.inputChars[0] || null}
          outputChar={inspectedOutputChar || conversionResult.outputChars[0] || null}
          currentLang={currentLang}
          fontMode={fontMode}
        />
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
