import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  Download,
  Trash2,
  AlertTriangle,
  Sparkles,
  Layers,
  FileCode,
  FileText,
  ChevronRight,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import {
  AmbiguityAlert,
  ConversionDirection,
  ConversionSummary,
  KanjiCharInfo,
  KanjiFontSize,
  Language,
  FontMode,
} from '../types/kanji';
import { TRANSLATIONS } from '../i18n/translations';
import { convertBatch } from '../services/converterService';
import { CharacterInspector } from './CharacterInspector';
import { EncodingTable } from './EncodingTable';
import { AmbiguityModal } from './AmbiguityModal';
import { getKanjiThemeForCharIndex } from '../utils/kanjiThemes';
import { getRubyReadingForChar, speakJapaneseText } from '../utils/accessibility';

interface EducationalConsoleProps {
  currentLang: Language;
  fontMode: FontMode;
  fontSize?: KanjiFontSize;
  onFontSizeChange?: (size: KanjiFontSize) => void;
  initialText?: string;
  showRuby?: boolean;
  speechRate?: number;
  onAnnounce?: (msg: string) => void;
}

const SAMPLE_PRESETS: Record<
  string,
  { label: { ja: string; en: string; ar: string }; text: string; direction: ConversionDirection }
> = {
  ambiguity: {
    label: {
      ja: '一対多・同音書き換え (混交・弁護・予定・缶詰)',
      en: '1-to-Many & Substitutions (混交, 弁護, 予定, 缶詰)',
      ar: 'حالات الغموض والاستبدال (混交، 弁護، 予定، 缶詰)',
    },
    text: `混交
交通
弁護士
弁償
花弁
予定
予言
芸術
欠席
缶詰
台風
舞台
扇動
恐竜`,
    direction: 'shin_to_kyu',
  },
  joyo_classics: {
    label: {
      ja: '常用・正字ペア (国・体・学・桜・広・気・鉄)',
      en: 'Standard Joyo Pairs (国, 体, 学, 桜, 広, 気, 鉄)',
      ar: 'أزواج الكانجي القياسية (国، 体، 学، 桜، 広، 気، 鉄)',
    },
    text: `国家
身体
学校
桜花
広大
空気
寿命
鉄道
渓谷
万歳
歯車
仏教
写真
礼儀
真実
医院
京都駅
旧暦
東京湾`,
    direction: 'shin_to_kyu',
  },
  surnames_places: {
    label: {
      ja: '名字・地名・異体字 (渡辺・斉藤・横浜・広島)',
      en: 'Surnames & Toponyms (渡辺, 斉藤, 横浜, 広島)',
      ar: 'ألقاب العائلات وأسماء الأماكن (渡辺، 斉藤، 横浜، 広島)',
    },
    text: `渡辺
渡邊
斉藤
齊藤
齋藤
広島
横浜
東京駅
沖縄
福島
台湾`,
    direction: 'shin_to_kyu',
  },
  literature: {
    label: {
      ja: '古典・近代文学 (吾輩ハ猫デアル・羅生門)',
      en: 'Modern Literature Excerpt (Soseki Natsume)',
      ar: 'مقتطفات من الأدب الياباني الحديث (ناتسومي سوسيكي)',
    },
    text: `吾輩は猫である。名前はまだ無い。
どこで生れたかとんと見当がつかぬ。
何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。
吾輩はここで始めて人間というものを見た。
しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。`,
    direction: 'shin_to_kyu',
  },
};

export const EducationalConsole: React.FC<EducationalConsoleProps> = ({
  currentLang,
  fontMode,
  fontSize = 'md',
  onFontSizeChange,
  initialText,
  showRuby = false,
  speechRate = 1.0,
  onAnnounce,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [direction, setDirection] = useState<ConversionDirection>('shin_to_kyu');
  const [inputText, setInputText] = useState<string>(
    initialText !== undefined ? initialText : SAMPLE_PRESETS.ambiguity.text
  );
  const [userOverrides, setUserOverrides] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'batch' | 'diff' | 'inspector' | 'encodings'>('batch');

  // Selected character for deep inspection
  const [selectedInputChar, setSelectedInputChar] = useState<KanjiCharInfo | null>(null);
  const [selectedOutputChar, setSelectedOutputChar] = useState<KanjiCharInfo | null>(null);

  // Active ambiguity alert for modal
  const [activeAlert, setActiveAlert] = useState<AmbiguityAlert | null>(null);

  // Copy notification states
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Run conversion
  const summary: ConversionSummary = useMemo(() => {
    return convertBatch(inputText, direction, userOverrides);
  }, [inputText, direction, userOverrides]);

  // Set default selected char on initial load or text change
  useEffect(() => {
    if (summary.lines.length > 0) {
      const lineWithChange = summary.lines.find(l => l.changedIndices.length > 0);
      if (lineWithChange && lineWithChange.inputChars.length > 0) {
        const targetIdx = lineWithChange.changedIndices[0] ?? 0;
        setSelectedInputChar(lineWithChange.inputChars[targetIdx] || lineWithChange.inputChars[0]);
        setSelectedOutputChar(lineWithChange.outputChars[targetIdx] || lineWithChange.outputChars[0]);
      } else {
        const firstLine = summary.lines.find(l => l.inputChars.length > 0);
        if (firstLine && firstLine.inputChars.length > 0) {
          setSelectedInputChar(firstLine.inputChars[0]);
          setSelectedOutputChar(firstLine.outputChars[0] || null);
        }
      }
    }
  }, [direction, inputText]);

  // Aggregate all unique output characters for the encoding table
  const allOutputChars = useMemo(() => {
    const list: KanjiCharInfo[] = [];
    summary.lines.forEach(line => {
      line.outputChars.forEach(c => list.push(c));
    });
    return list;
  }, [summary]);

  // Ambiguities list flattened
  const allAmbiguities = useMemo(() => {
    const list: AmbiguityAlert[] = [];
    summary.lines.forEach(l => {
      l.ambiguities.forEach(a => list.push(a));
    });
    return list;
  }, [summary]);

  const handleSelectCharForInspection = (inChar: KanjiCharInfo, outChar?: KanjiCharInfo) => {
    setSelectedInputChar(inChar);
    setSelectedOutputChar(outChar || inChar);
    setActiveTab('inspector');
  };

  const handleApplyOverride = (alertId: string, chosenChar: string) => {
    setUserOverrides(prev => ({
      ...prev,
      [alertId]: chosenChar,
    }));
  };

  const handleCopyConverted = () => {
    const fullConverted = summary.lines.map(l => l.convertedText).join('\n');
    navigator.clipboard.writeText(fullConverted);
    setCopiedType('converted');
    setTimeout(() => setCopiedType(null), 1800);
  };

  const handleCopyTsv = () => {
    const tsv = summary.lines
      .map(l => `${l.originalText}\t${l.convertedText}`)
      .join('\n');
    navigator.clipboard.writeText(tsv);
    setCopiedType('tsv');
    setTimeout(() => setCopiedType(null), 1800);
  };

  const handleExportCsv = () => {
    const header = 'Line,Original,Converted,ChangedKanjiCount,AmbiguityFound\n';
    const rows = summary.lines
      .map(l => {
        const origEsc = `"${l.originalText.replace(/"/g, '""')}"`;
        const convEsc = `"${l.convertedText.replace(/"/g, '""')}"`;
        const ambNames = l.ambiguities.map(a => a.sourceChar).join(';');
        return `${l.lineIndex + 1},${origEsc},${convEsc},${l.changedIndices.length},"${ambNames}"`;
      })
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kanji_conversion_${direction}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadPreset = (key: string) => {
    const preset = SAMPLE_PRESETS[key];
    if (preset) {
      setDirection(preset.direction);
      setInputText(preset.text);
      setUserOverrides({});
    }
  };

  const fontClass =
    fontMode === 'serif'
      ? 'font-serif'
      : fontMode === 'ud'
      ? 'font-ud font-medium'
      : 'font-sans';

  const sizeStyles = {
    sm: {
      textarea: 'text-sm leading-relaxed',
      display: 'text-sm leading-relaxed',
      cell: 'text-sm',
      token: 'text-sm',
    },
    md: {
      textarea: 'text-base leading-relaxed',
      display: 'text-base leading-relaxed',
      cell: 'text-base',
      token: 'text-base',
    },
    lg: {
      textarea: 'text-lg leading-relaxed',
      display: 'text-lg leading-relaxed',
      cell: 'text-lg',
      token: 'text-lg',
    },
    xl: {
      textarea: 'text-xl leading-relaxed sm:text-2xl',
      display: 'text-xl leading-relaxed sm:text-2xl',
      cell: 'text-xl',
      token: 'text-xl',
    },
  }[fontSize];

  return (
    <div className="space-y-6">
      {/* Direction & Workflow Control Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {t.directionLabel}:
            </span>
            <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setDirection('shin_to_kyu')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
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
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  direction === 'kyu_to_shin'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <span>旧字体 → 新字体</span>
              </button>
            </div>
          </div>

          {/* Sample Preset Buttons & In-Console Font Size Controller */}
          <div className="flex items-center gap-3 flex-wrap justify-between xl:justify-end">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-neutral-400 hidden lg:inline">{t.sampleButton}:</span>
              {Object.entries(SAMPLE_PRESETS).map(([key, sample]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleLoadPreset(key)}
                  className="px-2.5 py-1 text-xs rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors truncate max-w-xs"
                >
                  {sample.label[currentLang] || sample.label.ja}
                </button>
              ))}
            </div>

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
      </div>

      {/* Input / Output Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Input Box */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs flex flex-col h-full">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {direction === 'shin_to_kyu' ? t.shinShort : t.kyuShort}
              </span>
              <span className="text-neutral-400">({t.linesCount}: {summary.totalLines})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setInputText('');
                  setUserOverrides({});
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearText}</span>
              </button>
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={t.batchInputPlaceholder}
              rows={14}
              className={`w-full flex-1 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500 ${sizeStyles.textarea} resize-y ${fontClass}`}
            />
          </div>

          <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/30 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>{t.charsCount}: {summary.totalChars}</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">{t.kakikaeNotice}</span>
          </div>
        </div>

        {/* Right Column: Output Box & Quick Copy */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs flex flex-col h-full">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {direction === 'shin_to_kyu' ? t.kyuShort : t.shinShort}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                ({t.convertedCount}: {summary.convertedCharsCount})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyConverted}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-medium text-xs"
              >
                {copiedType === 'converted' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
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
                onClick={handleCopyTsv}
                title={t.copyTsv}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs"
              >
                {copiedType === 'tsv' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Layers className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">TSV</span>
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                title={t.exportCsv}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <div
              className={`w-full flex-1 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-950/40 text-neutral-900 dark:text-neutral-100 ${sizeStyles.display} overflow-y-auto whitespace-pre-wrap min-h-[308px] select-all ${fontClass}`}
            >
              {summary.lines.map(line => line.convertedText).join('\n') || (
                <span className="text-neutral-400 italic">結果がここに表示されます...</span>
              )}
            </div>
          </div>

          <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/30 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>
              {t.convertedCount}: <strong className="text-neutral-800 dark:text-neutral-200">{summary.convertedCharsCount}</strong> 字
            </span>
            {summary.ambiguityCount > 0 && (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3 h-3" />
                {t.ambiguityAlertsCount}: {summary.ambiguityCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ambiguity Alert Notice Banner (if any 1-to-many case detected) */}
      {allAmbiguities.length > 0 && (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 text-xs shadow-xs space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <span>{t.ambiguityBannerPrefix} ({allAmbiguities.length} 件)</span>
              </h4>
              <p className="text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                {t.ambiguityOneToManyNotice}
              </p>
            </div>
          </div>

          {/* Quick Disambiguation Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {allAmbiguities.map((alert, idx) => (
              <div
                key={`${alert.id}_${idx}`}
                className="bg-white dark:bg-neutral-900 border border-amber-200/80 dark:border-amber-800/40 rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-2xs hover:border-amber-400 dark:hover:border-amber-600 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-6 h-6 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold flex items-center justify-center shrink-0 font-serif">
                    {alert.sourceChar}
                  </span>
                  <div className="truncate">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate flex items-center gap-1">
                      {alert.compoundFound ? (
                        <>
                          <span className="text-neutral-500 font-normal">文脈:</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {alert.compoundFound}
                          </span>
                          <span className="text-neutral-400">→</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            {alert.resolvedChoice}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>「{alert.sourceChar}」の選択</span>
                          <span className="text-neutral-400">→</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            {alert.resolvedChoice}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveAlert(alert)}
                  className="px-2 py-1 text-[11px] font-medium rounded text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors shrink-0 flex items-center gap-0.5 border border-amber-200 dark:border-amber-800"
                >
                  <span>{t.resolveAmbiguity}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Tabs Container */}
      <div className="space-y-4">
        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg w-fit border border-neutral-200 dark:border-neutral-700/80">
          <button
            type="button"
            onClick={() => setActiveTab('batch')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'batch'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.tabBatch}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'diff'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{t.tabDiff}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'inspector'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{t.tabInspector}</span>
            {selectedInputChar && (
              <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] flex items-center justify-center font-bold">
                {selectedInputChar.char}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('encodings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'encodings'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.tabEncodings}</span>
            <span className="text-[10px] text-neutral-400">({allOutputChars.length})</span>
          </button>
        </div>

        {/* Tab 1: Batch Side-by-Side View */}
        {activeTab === 'batch' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 select-none">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    <th className="py-2.5 px-4 font-semibold">{t.shinShort}</th>
                    <th className="py-2.5 px-4 font-semibold">{t.kyuShort}</th>
                    <th className="py-2.5 px-4 font-semibold w-28 text-center">ステータス</th>
                    <th className="py-2.5 px-4 font-semibold w-24 text-right">解析</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {summary.lines.map((line, idx) => {
                    const hasAmbiguityAlert = line.ambiguities.length > 0;

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-center text-neutral-400 font-mono text-[11px] tabular-nums">
                          {idx + 1}
                        </td>
                        <td className={`py-2.5 px-4 text-neutral-900 dark:text-neutral-100 ${sizeStyles.cell} ${fontClass}`}>
                          <div className="flex items-center gap-1 flex-wrap">
                            {line.inputChars.map((inChar, cIdx) => {
                              const rubyReading = showRuby ? getRubyReadingForChar(inChar.char) : null;
                              return (
                                <button
                                  key={cIdx}
                                  type="button"
                                  onClick={() =>
                                    handleSelectCharForInspection(inChar, line.outputChars[cIdx])
                                  }
                                  title={`Click to inspect ${inChar.char} (${inChar.unicodeHex})`}
                                  className="hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-900 dark:hover:text-amber-200 px-1 py-0.5 rounded transition-colors"
                                >
                                  {rubyReading ? (
                                    <ruby>
                                      <span>{inChar.char}</span>
                                      <rt className="text-[9px] font-normal opacity-85 select-none leading-none">
                                        {rubyReading}
                                      </rt>
                                    </ruby>
                                  ) : (
                                    <span>{inChar.char}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className={`py-2.5 px-4 text-neutral-900 dark:text-neutral-100 ${sizeStyles.cell} ${fontClass}`}>
                          <div className="flex items-center gap-1 flex-wrap">
                            {line.outputChars.map((outChar, cIdx) => {
                              const isChanged = line.changedIndices.includes(cIdx);
                              const ambForChar = line.ambiguities.find(
                                a => a.charIndex === cIdx || (a.compoundFound && a.charIndex <= cIdx)
                              );
                              const rubyReading = showRuby ? getRubyReadingForChar(outChar.char) : null;

                              return (
                                <button
                                  key={cIdx}
                                  type="button"
                                  onClick={() => {
                                    if (ambForChar) {
                                      setActiveAlert(ambForChar);
                                    } else {
                                      handleSelectCharForInspection(
                                        line.inputChars[cIdx] || outChar,
                                        outChar
                                      );
                                    }
                                  }}
                                  title={`Output: ${outChar.char} (${outChar.unicodeHex})${isChanged ? ' - Converted' : ''}`}
                                  className={`px-1 py-0.5 rounded transition-colors ${
                                    isChanged
                                      ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800/60'
                                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                  }`}
                                >
                                  {rubyReading ? (
                                    <ruby>
                                      <span>{outChar.char}</span>
                                      <rt className="text-[9px] font-normal opacity-85 select-none leading-none">
                                        {rubyReading}
                                      </rt>
                                    </ruby>
                                  ) : (
                                    <span>{outChar.char}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {hasAmbiguityAlert ? (
                            <button
                              type="button"
                              onClick={() => setActiveAlert(line.ambiguities[0])}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>一対多あり</span>
                            </button>
                          ) : line.hasChanges ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>変換済 ({line.changedIndices.length})</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-neutral-400">同形</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => speakJapaneseText(line.convertedText, speechRate)}
                              className="text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                              title={`第${idx + 1}行の音声を再生`}
                              aria-label={`第${idx + 1}行の音声を再生: ${line.convertedText}`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (line.inputChars.length > 0) {
                                  const targetIdx = line.changedIndices.length > 0 ? line.changedIndices[0] : 0;
                                  handleSelectCharForInspection(
                                    line.inputChars[targetIdx] || line.inputChars[0],
                                    line.outputChars[targetIdx] || line.outputChars[0]
                                  );
                                }
                              }}
                              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              title="この行の変換文字をインスペクターで開く"
                            >
                              <FileCode className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Diff Highlight Inspector */}
        {activeTab === 'diff' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              新字体から旧字体へ変更された文字を黄色い枠線でハイライト表示しています。文字をクリックすると詳細な文字コードが表示されます。
            </p>

            <div className="space-y-3">
              {summary.lines.map((line, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/30 flex items-start gap-4"
                >
                  <span className="text-neutral-400 font-mono text-xs w-6 shrink-0 pt-0.5">
                    {idx + 1}.
                  </span>

                  <div className="flex-1 space-y-2">
                    {/* Before */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-400 w-12 shrink-0 font-medium">原文:</span>
                      <div className={`flex items-center gap-1.5 flex-wrap ${fontClass}`}>
                        {line.inputChars.map((c, cIdx) => {
                          const theme = getKanjiThemeForCharIndex(cIdx, line.changedIndices);
                          return (
                            <span
                              key={cIdx}
                              className={`px-1.5 py-0.5 rounded ${sizeStyles.token} flex items-center gap-1 ${
                                theme
                                  ? `${theme.tokenBg} ${theme.tokenBorder} border ${theme.tokenText} font-semibold`
                                  : 'text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              <span>{c.char}</span>
                              {theme && (
                                <span className={`text-[9px] font-bold px-1 rounded-full ${theme.badgeBg}`}>
                                  {theme.numberSymbol}
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* After (with Highlight) */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-400 w-12 shrink-0 font-medium">変換:</span>
                      <div className={`flex items-center gap-1.5 flex-wrap ${fontClass}`}>
                        {line.outputChars.map((c, cIdx) => {
                          const theme = getKanjiThemeForCharIndex(cIdx, line.changedIndices);
                          const inChar = line.inputChars[cIdx];

                          return (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => handleSelectCharForInspection(inChar || c, c)}
                              className={`px-1.5 py-0.5 rounded ${sizeStyles.token} transition-all flex items-center gap-1 ${
                                theme
                                  ? `${theme.tokenBg} ${theme.tokenBorder} border ${theme.tokenText} font-bold shadow-2xs hover:scale-105`
                                  : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                              }`}
                            >
                              <span>{c.char}</span>
                              {theme && (
                                <span className={`text-[9px] font-bold px-1 rounded-full ${theme.badgeBg}`}>
                                  {theme.numberSymbol}
                                </span>
                              )}
                              {theme && inChar && (
                                <span className={`text-[10px] ${theme.arrowColor} font-normal`}>
                                  ({inChar.char}→)
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Character Inspector */}
        {activeTab === 'inspector' && (
          <div className="space-y-4">
            <CharacterInspector
              inputChar={selectedInputChar}
              outputChar={selectedOutputChar}
              currentLang={currentLang}
              fontMode={fontMode}
              speechRate={speechRate}
            />
          </div>
        )}

        {/* Tab 4: Encoding Table */}
        {activeTab === 'encodings' && (
          <EncodingTable
            characters={allOutputChars}
            currentLang={currentLang}
            fontMode={fontMode}
            onSelectChar={c => {
              setSelectedInputChar(c);
              setSelectedOutputChar(c);
              setActiveTab('inspector');
            }}
          />
        )}
      </div>

      {/* Historical Kakikae Explanatory Box */}
      <div className="bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
        <h4 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{t.aboutTitle}</span>
        </h4>
        <p className="leading-relaxed">
          {t.aboutText}
        </p>
      </div>

      {/* Ambiguity Modal Dialog */}
      <AmbiguityModal
        alert={activeAlert}
        currentLang={currentLang}
        onClose={() => setActiveAlert(null)}
        onSelectOption={handleApplyOverride}
      />
    </div>
  );
};
