import React, { useState } from 'react';
import { Copy, Check, Info, Hash, BookOpen, Volume2 } from 'lucide-react';
import { KanjiCharInfo, Language, FontMode } from '../types/kanji';
import { TRANSLATIONS } from '../i18n/translations';
import { KANJI_THEMES, KanjiColorThemeKey } from '../utils/kanjiThemes';
import { speakJapaneseText } from '../utils/accessibility';

interface CharacterInspectorProps {
  inputChar: KanjiCharInfo | null;
  outputChar: KanjiCharInfo | null;
  currentLang: Language;
  fontMode: FontMode;
  colorTheme?: KanjiColorThemeKey;
  orderSymbol?: string;
  badgeLabel?: string;
  pairTitle?: string;
  showHeader?: boolean;
  speechRate?: number;
}

export const CharacterInspector: React.FC<CharacterInspectorProps> = ({
  inputChar,
  outputChar,
  currentLang,
  fontMode,
  colorTheme,
  orderSymbol,
  badgeLabel,
  pairTitle,
  showHeader = true,
  speechRate = 1.0,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const theme = colorTheme ? KANJI_THEMES[colorTheme] : null;

  const handleCopy = (text: string, key: string) => {
    if (!text || text === 'N/A') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  if (!inputChar && !outputChar) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-500 dark:text-neutral-400 text-xs">
        <Info className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
        <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t.inspectorTitle}</p>
        <p>{t.clickCharToInspect}</p>
      </div>
    );
  }

  const renderCharCard = (info: KanjiCharInfo | null, label: string, isSource: boolean) => {
    if (!info) return null;

    const fontClass =
      fontMode === 'serif'
        ? 'font-serif'
        : fontMode === 'ud'
        ? 'font-ud font-medium'
        : 'font-sans';
    const cardBorder = theme
      ? theme.cardBorder
      : 'border-neutral-200 dark:border-neutral-800';
    const glyphBoxStyle = theme
      ? `${theme.glyphBoxBg} ${theme.glyphBoxBorder} ${theme.glyphText}`
      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700';

    return (
      <div className={`flex-1 bg-white dark:bg-neutral-900 border rounded-xl p-5 shadow-xs flex flex-col gap-4 ${cardBorder}`}>
        {/* Top: Glyph Display and Primary Info */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border flex items-center justify-center text-4xl sm:text-5xl font-bold select-all shadow-inner ${glyphBoxStyle} ${fontClass}`}>
              {info.char}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {label}
                </span>
                {orderSymbol && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${theme?.badgeText || 'bg-neutral-200 text-neutral-800'}`}>
                    {orderSymbol}
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>{info.unicodeHex}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(info.unicodeHex, `${label}_uni`)}
                  title="Copy Unicode"
                  className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {copiedKey === `${label}_uni` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => speakJapaneseText(info.char, speechRate)}
                  title="日本語の音声を聞く (Listen to Japanese pronunciation)"
                  aria-label={`${info.char}の日本語音声を再生`}
                  className="p-1 rounded text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {info.classification || 'CJK Unified Ideograph'}
              </p>
            </div>
          </div>

          {info.isKanji && (
            <div className="text-right text-xs text-neutral-500 dark:text-neutral-400 space-y-0.5">
              {info.radical && (
                <div>
                  <span className="text-neutral-400">{t.radical}:</span> <span className="font-medium text-neutral-800 dark:text-neutral-200">{info.radical}</span>
                </div>
              )}
              {info.strokeCount !== undefined && (
                <div>
                  <span className="text-neutral-400">{t.strokes}:</span> <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">{info.strokeCount}画</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Readings, Meanings & Pedagogical Levels (KANKEN, JLPT, School Grade) */}
        {(info.readings || info.isKanji) && (
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg text-xs space-y-2 border border-neutral-100 dark:border-neutral-800">
            {/* Pedagogical Levels Badges: KANKEN, JLPT, School Grade */}
            {(info.kanken || info.jlpt || info.grade) && (
              <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-neutral-200/60 dark:border-neutral-700/60">
                {info.kanken && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-[11px]"
                    title={t.kankenHint}
                  >
                    <span className="text-amber-700 dark:text-amber-400 font-semibold">{t.kankenLabel}:</span>
                    <span className="font-bold text-amber-900 dark:text-amber-200">
                      {info.kanken}
                    </span>
                  </div>
                )}
                {info.jlpt && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/50 text-[11px]"
                    title={t.jlptHint}
                  >
                    <span className="text-sky-700 dark:text-sky-400 font-semibold">{t.jlptLabel}:</span>
                    <span className="font-bold text-sky-900 dark:text-sky-200">
                      {info.jlpt}
                    </span>
                  </div>
                )}
                {info.grade && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-[11px]"
                    title={t.gradeHint}
                  >
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{t.gradeLabel}:</span>
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">
                      {info.grade}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ON Reading (音読み) */}
            {info.readings && info.readings.on.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[11px] w-12 shrink-0">音読み:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {info.readings.on.map((r, i) => (
                    <span key={i} className="font-medium text-neutral-800 dark:text-neutral-200">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* KUN Reading (訓読み) */}
            {info.readings && info.readings.kun.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[11px] w-12 shrink-0">訓読み:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {info.readings.kun.map((r, i) => (
                    <span key={i} className="font-medium text-neutral-800 dark:text-neutral-200">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Meaning 字義 */}
            {info.meaning && (
              <div className="flex items-center gap-2 pt-1 border-t border-neutral-200/60 dark:border-neutral-700/60 text-[11px]">
                <span className="text-neutral-400 w-12 shrink-0">{t.meaning}:</span>
                <span className="text-neutral-700 dark:text-neutral-300">
                  {info.meaning[currentLang] || info.meaning.en}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Character Code Encodings Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Unicode Hex */}
          <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{t.unicodeSection}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">{info.unicodeHex}</span>
              <button
                type="button"
                onClick={() => handleCopy(info.unicodeHex, `${label}_uhex`)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
              >
                {copiedKey === `${label}_uhex` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Shift-JIS */}
          <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{t.shiftJisSection}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">{info.shiftJisHex}</span>
              <button
                type="button"
                onClick={() => handleCopy(info.shiftJisHex, `${label}_sjis`)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
              >
                {copiedKey === `${label}_sjis` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* JIS X 0208 Code */}
          <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{t.jisSection}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">{info.jisHex}</span>
              <button
                type="button"
                onClick={() => handleCopy(info.jisHex, `${label}_jis`)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
              >
                {copiedKey === `${label}_jis` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Kuten Code */}
          <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{t.kutenSection}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400">{info.kuten}</span>
              <button
                type="button"
                onClick={() => handleCopy(info.kuten, `${label}_kuten`)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
              >
                {copiedKey === `${label}_kuten` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* UTF-8 Bytes */}
          <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{t.utf8Bytes}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300 truncate" title={info.utf8Hex}>{info.utf8Hex}</span>
              <button
                type="button"
                onClick={() => handleCopy(info.utf8Hex, `${label}_utf8`)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 shrink-0 ml-1"
              >
                {copiedKey === `${label}_utf8` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* EUC-JP */}
          <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{t.eucJpSection}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">{info.eucJpHex || 'N/A'}</span>
              <button
                type="button"
                onClick={() => handleCopy(info.eucJpHex || '', `${label}_euc`)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
              >
                {copiedKey === `${label}_euc` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>{t.inspectorTitle}</span>
              {orderSymbol && (
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${theme?.badgeText || ''}`}>
                  {orderSymbol}
                </span>
              )}
              {pairTitle && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {pairTitle}
                </span>
              )}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t.inspectorSubtitle}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderCharCard(inputChar, t.inputGlyph, true)}
        {renderCharCard(outputChar, t.outputGlyph, false)}
      </div>
    </div>
  );
};
