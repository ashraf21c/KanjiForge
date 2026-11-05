import React from 'react';
import { BookOpen, Sparkles, ArrowRight, ExternalLink, HelpCircle } from 'lucide-react';
import { Language } from '../types/kanji';
import { TRANSLATIONS } from '../i18n/translations';
import { AMBIGUITY_DEFINITIONS } from '../data/ambiguityDict';

import { getKanjiLevel } from '../data/kanjiLevels';

interface OrthographyLibraryProps {
  currentLang: Language;
  fontMode: 'serif' | 'sans';
  onSelectCompoundForTesting: (text: string) => void;
}

export const OrthographyLibrary: React.FC<OrthographyLibraryProps> = ({
  currentLang,
  fontMode,
  onSelectCompoundForTesting,
}) => {
  const t = TRANSLATIONS[currentLang];
  const fontClass = fontMode === 'serif' ? 'font-serif' : 'font-sans';

  const ambiguityList = Object.values(AMBIGUITY_DEFINITIONS);

  return (
    <div className="space-y-6">
      {/* Educational Header Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>学術資料・国語審議会「同音の漢字による書きかえ」</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {t.libraryTitle}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-4xl leading-relaxed">
          1946年の当用漢字表制定、および1956年の国語審議会報告「同音の漢字による書きかえ」により、当用漢字表外の難しい漢字が同音の簡単な漢字へ統合・代用されました。
          例えば<strong className="text-neutral-900 dark:text-neutral-100 font-semibold">「混交」</strong>は、本来入り混じって乱れる意味の正字<strong className="text-amber-600 dark:text-amber-400 font-bold">「混淆」</strong>でしたが、表外字の「淆」が「交」に同音書き換えられた代表例です。
        </p>
      </div>

      {/* Grid of Key 1-to-Many Cases */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
          <span>代表的な「一対多」統合文字・書きかえ一覧 ({ambiguityList.length} 例)</span>
          <span className="text-xs font-normal text-neutral-400">カード内のボタンで即座に解析可能</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ambiguityList.map(item => {
            const shinLevel = getKanjiLevel(item.shinjitaiChar);

            return (
              <div
                key={item.shinjitaiChar}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-amber-300 dark:hover:border-amber-800/80 transition-all"
              >
                <div className="space-y-3">
                  {/* Header: Shinjitai vs Options */}
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 flex items-center justify-center text-2xl font-bold border border-neutral-200 dark:border-neutral-700 ${fontClass}`}
                      >
                        {item.shinjitaiChar}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                            新字体
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {shinLevel.grade} · 漢検: {shinLevel.kanken} · JLPT: {shinLevel.jlpt}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          {item.options.map(opt => (
                            <span
                              key={opt.char}
                              className={`px-1.5 py-0.5 rounded text-xs font-bold font-serif ${
                                opt.isRecommendedContext
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                              }`}
                            >
                              {opt.char}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Explanation text */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.explanation[currentLang] || item.explanation.ja}
                  </p>

                  {/* Options Breakdown */}
                  <div className="space-y-2 pt-1 text-xs">
                    {item.options.map(opt => {
                      const optLevel = getKanjiLevel(opt.char, true);

                      return (
                        <div
                          key={opt.char}
                          className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-1"
                        >
                          <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between flex-wrap gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span>{opt.label[currentLang] || opt.label.ja}</span>
                              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">
                                (漢検: {optLevel.kanken} · JLPT: {optLevel.jlpt} · {optLevel.grade})
                              </span>
                            </div>
                            {opt.isRecommendedContext && (
                              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded font-medium">
                                推奨文脈
                              </span>
                            )}
                          </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {opt.nuance[currentLang] || opt.nuance.ja}
                      </p>
                      {opt.examples.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-[10px]">
                          <span className="text-neutral-400 font-medium">用例:</span>
                          {opt.examples.map((ex, i) => (
                            <span
                              key={i}
                              className="bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Button: Test in Educational Console */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                代表熟語: {Object.keys(item.compoundContexts)[0] || item.shinjitaiChar}
              </span>
              <button
                type="button"
                onClick={() => {
                  const testWord = Object.keys(item.compoundContexts)[0] || item.shinjitaiChar;
                  onSelectCompoundForTesting(testWord);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
              >
                <span>コンソールで検証</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
      </div>
    </div>
  );
};
