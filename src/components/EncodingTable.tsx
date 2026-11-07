import React, { useState } from 'react';
import { Search, Copy, Check, Filter } from 'lucide-react';
import { KanjiCharInfo, Language, FontMode } from '../types/kanji';
import { TRANSLATIONS } from '../i18n/translations';

interface EncodingTableProps {
  characters: KanjiCharInfo[];
  currentLang: Language;
  fontMode: FontMode;
  onSelectChar: (char: KanjiCharInfo) => void;
}

export const EncodingTable: React.FC<EncodingTableProps> = ({
  characters,
  currentLang,
  fontMode,
  onSelectChar,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // De-duplicate characters
  const uniqueCharsMap = new Map<string, KanjiCharInfo>();
  characters.forEach(c => {
    if (c.char.trim() && !uniqueCharsMap.has(c.char)) {
      uniqueCharsMap.set(c.char, c);
    }
  });
  const uniqueChars = Array.from(uniqueCharsMap.values());

  // Filter
  const filtered = uniqueChars.filter(c => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase().trim();
    return (
      c.char.includes(q) ||
      c.unicodeHex.toLowerCase().includes(q) ||
      c.shiftJisHex.toLowerCase().includes(q) ||
      c.jisHex.toLowerCase().includes(q) ||
      c.kuten.toLowerCase().includes(q) ||
      (c.classification && c.classification.toLowerCase().includes(q)) ||
      (c.kanken && c.kanken.toLowerCase().includes(q)) ||
      (c.jlpt && c.jlpt.toLowerCase().includes(q)) ||
      (c.grade && c.grade.toLowerCase().includes(q))
    );
  });

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const fontClass =
    fontMode === 'serif'
      ? 'font-serif'
      : fontMode === 'ud'
      ? 'font-ud font-medium'
      : 'font-sans';

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Toolbar */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <Filter className="w-3.5 h-3.5" />
          <span>
            {filtered.length} / {uniqueChars.length} 文字
          </span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="文字, U+..., JIS, SJIS, 区点..."
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-xs"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-neutral-50 dark:bg-neutral-800/60 sticky top-0 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 select-none">
            <tr>
              <th className="py-2 px-3 font-semibold">{t.charCol}</th>
              <th className="py-2 px-3 font-semibold">{t.typeCol}</th>
              <th className="py-2 px-3 font-semibold">{t.unicodeCol}</th>
              <th className="py-2 px-3 font-semibold">{t.sjisCol}</th>
              <th className="py-2 px-3 font-semibold">{t.jisCol}</th>
              <th className="py-2 px-3 font-semibold">{t.kutenCol}</th>
              <th className="py-2 px-3 font-semibold text-right">アクション</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/70 text-neutral-800 dark:text-neutral-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-400">
                  該当する文字が見つかりません
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <tr
                  key={`${item.char}_${idx}`}
                  onClick={() => onSelectChar(item)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-3 font-semibold">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded bg-neutral-100 dark:bg-neutral-800 text-base ${fontClass}`}>
                      {item.char}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-neutral-500 dark:text-neutral-400">
                    <div className="flex flex-col gap-1">
                      <span className="truncate max-w-xs">{item.classification || '-'}</span>
                      {(item.kanken || item.jlpt || item.grade) && (
                        <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                          {item.kanken && (
                            <span className="px-1 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50">
                              {item.kanken}
                            </span>
                          )}
                          {item.jlpt && (
                            <span className="px-1 py-0.2 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/50">
                              {item.jlpt}
                            </span>
                          )}
                          {item.grade && (
                            <span className="px-1 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                              {item.grade}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3 font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                    {item.unicodeHex}
                  </td>
                  <td className="py-2 px-3 font-mono tabular-nums">
                    {item.shiftJisHex}
                  </td>
                  <td className="py-2 px-3 font-mono tabular-nums">
                    {item.jisHex}
                  </td>
                  <td className="py-2 px-3 font-mono tabular-nums text-amber-700 dark:text-amber-400">
                    {item.kuten}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={e =>
                        handleCopy(
                          `${item.char}\t${item.unicodeHex}\t${item.shiftJisHex}\t${item.jisHex}\t${item.kuten}`,
                          `row_${idx}`,
                          e
                        )
                      }
                      title="TSVコピー"
                      className="inline-flex items-center gap-1 p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      {copiedKey === `row_${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
