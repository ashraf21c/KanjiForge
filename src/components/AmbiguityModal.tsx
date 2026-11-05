import React from 'react';
import { X, Check, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { AmbiguityAlert, Language } from '../types/kanji';
import { TRANSLATIONS } from '../i18n/translations';

import { getKanjiLevel } from '../data/kanjiLevels';

interface AmbiguityModalProps {
  alert: AmbiguityAlert | null;
  currentLang: Language;
  onClose: () => void;
  onSelectOption: (alertId: string, chosenChar: string) => void;
}

export const AmbiguityModal: React.FC<AmbiguityModalProps> = ({
  alert,
  currentLang,
  onClose,
  onSelectOption,
}) => {
  if (!alert) return null;
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center text-sm border border-amber-300 dark:border-amber-800/60">
              {alert.sourceChar}
            </span>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {t.ambiguityTitle}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {alert.compoundFound ? (
                  <span>
                    {t.contextApplied}: <strong className="text-neutral-800 dark:text-neutral-200">{alert.compoundFound}</strong>
                  </span>
                ) : (
                  <span>{t.singleKanjiQuestion}</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Explanation Banner */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 leading-relaxed">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <p>{alert.explanation[currentLang] || alert.explanation.ja}</p>
            </div>
          </div>

          {/* Options List */}
          <div>
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              {t.selectOption}
            </h4>
            <div className="space-y-2.5">
              {alert.options.map(opt => {
                const isSelected = alert.resolvedChoice === opt.char;
                const isContextRec = opt.isRecommendedContext;
                const optLevel = getKanjiLevel(opt.char, true);

                return (
                  <button
                    key={opt.char}
                    type="button"
                    onClick={() => {
                      onSelectOption(alert.id, opt.char);
                      onClose();
                    }}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-1 ring-amber-500/50'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-serif text-2xl font-bold w-9 h-9 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700">
                          {opt.char}
                        </span>
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 flex-wrap">
                            <span>{opt.label[currentLang] || opt.label.ja}</span>
                            {isContextRec && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded">
                                <Sparkles className="w-3 h-3" />
                                {t.contextApplied}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] mt-0.5 text-neutral-500">
                            <span>漢検: <strong className="text-neutral-700 dark:text-neutral-300">{optLevel.kanken}</strong></span>
                            <span>·</span>
                            <span>JLPT: <strong className="text-neutral-700 dark:text-neutral-300">{optLevel.jlpt}</strong></span>
                            <span>·</span>
                            <span>学年: <strong className="text-neutral-700 dark:text-neutral-300">{optLevel.grade}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isSelected ? (
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold text-xs">
                            <Check className="w-4 h-4" />
                            選択中
                          </span>
                        ) : (
                          <span className="text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 text-xs flex items-center gap-0.5">
                            適用 <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Nuance description */}
                    <p className="text-neutral-600 dark:text-neutral-400 leading-normal pl-11">
                      {opt.nuance[currentLang] || opt.nuance.ja}
                    </p>

                    {/* Example compounds */}
                    {opt.examples && opt.examples.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pl-11 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">
                          {t.compoundExamples}:
                        </span>
                        {opt.examples.map((ex, idx) => (
                          <span
                            key={idx}
                            className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.5 rounded font-mono text-[11px]"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
