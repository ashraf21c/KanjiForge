import {
  AmbiguityAlert,
  ConversionDirection,
  ConversionSummary,
  KanjiCharInfo,
  LineConversionResult,
} from '../types/kanji';
import { AMBIGUITY_DEFINITIONS } from '../data/ambiguityDict';
import {
  KANJI_METADATA_MAP,
  KYU_TO_SHIN_MAP,
  SHIN_TO_KYU_MAP,
} from '../data/kanjiDict';
import { getCharEncodingInfo, isKanjiChar } from './encodingService';

import { getKanjiLevel } from '../data/kanjiLevels';

/**
 * Check if a character has known 1-to-many ambiguity when converting from Shinjitai to Kyūjitai
 */
export function hasAmbiguity(char: string): boolean {
  return char in AMBIGUITY_DEFINITIONS;
}

/**
 * Get detailed metadata and encoding for a character
 */
export function getEnrichedCharInfo(char: string): KanjiCharInfo {
  const base = getCharEncodingInfo(char);
  const meta = KANJI_METADATA_MAP[char];

  if (base.isKanji) {
    const isKyu = Boolean(meta && base.char === meta.kyu) || (char in KYU_TO_SHIN_MAP);
    const levels = getKanjiLevel(char, isKyu);

    if (meta) {
      return {
        ...base,
        radical: meta.radical,
        strokeCount: base.char === meta.shin ? meta.shinStrokes : meta.kyuStrokes,
        readings: {
          on: meta.on,
          kun: meta.kun,
        },
        meaning: meta.meaning,
        kanken: levels.kanken,
        jlpt: levels.jlpt,
        grade: levels.grade,
        gradeNumber: levels.gradeNumber,
      };
    }

    return {
      ...base,
      kanken: levels.kanken,
      jlpt: levels.jlpt,
      grade: levels.grade,
      gradeNumber: levels.gradeNumber,
    };
  }

  return base;
}

/**
 * Convert a single line of text with compound context detection and ambiguity tracking
 */
export function convertLine(
  line: string,
  lineIndex: number,
  direction: ConversionDirection,
  userOverrides: Record<string, string> = {}
): LineConversionResult {
  if (!line) {
    return {
      lineIndex,
      originalText: '',
      convertedText: '',
      hasChanges: false,
      changedIndices: [],
      ambiguities: [],
      inputChars: [],
      outputChars: [],
    };
  }

  const chars = Array.from(line);
  const resultChars = [...chars];
  const changedIndices: number[] = [];
  const ambiguities: AmbiguityAlert[] = [];

  if (direction === 'shin_to_kyu') {
    // Phase 1: Compound context matching (longest match priority)
    // Build combined list of compound patterns from ambiguity definitions
    const compoundRules: Array<{ pattern: string; replacement: string; ambiguousChar: string }> = [];
    for (const [ambKey, def] of Object.entries(AMBIGUITY_DEFINITIONS)) {
      for (const [pattern, replacement] of Object.entries(def.compoundContexts)) {
        compoundRules.push({
          pattern,
          replacement,
          ambiguousChar: ambKey,
        });
      }
    }
    // Sort compound patterns descending by length
    compoundRules.sort((a, b) => b.pattern.length - a.pattern.length);

    // Track which character positions have been consumed by compound matches
    const handledIndices = new Set<number>();

    for (const rule of compoundRules) {
      let startIndex = 0;
      while ((startIndex = line.indexOf(rule.pattern, startIndex)) !== -1) {
        // Check if any character in this range is already handled
        let conflict = false;
        for (let i = 0; i < rule.pattern.length; i++) {
          if (handledIndices.has(startIndex + i)) {
            conflict = true;
            break;
          }
        }

        if (!conflict) {
          const alertId = `amb_${lineIndex}_${startIndex}_${rule.ambiguousChar}`;
          const def = AMBIGUITY_DEFINITIONS[rule.ambiguousChar];

          // Check if user has an override for this specific position
          const chosenReplacement = userOverrides[alertId]
            ? rule.replacement.replace(new RegExp(def.defaultKyujitai, 'g'), userOverrides[alertId])
            : rule.replacement;

          // Replace in resultChars
          const repChars = Array.from(chosenReplacement);
          for (let i = 0; i < rule.pattern.length; i++) {
            const pos = startIndex + i;
            handledIndices.add(pos);
            if (repChars[i] && repChars[i] !== chars[pos]) {
              resultChars[pos] = repChars[i];
              changedIndices.push(pos);
            }
          }

          // Register alert so user can see what context was applied and change if desired
          ambiguities.push({
            id: alertId,
            sourceChar: rule.ambiguousChar,
            lineIndex,
            charIndex: startIndex,
            compoundFound: rule.pattern,
            recommendedChar: repChars[rule.pattern.indexOf(rule.ambiguousChar)] || def.defaultKyujitai,
            explanation: def.explanation,
            options: def.options.map(opt => ({
              ...opt,
              isRecommendedContext: opt.char === repChars[rule.pattern.indexOf(rule.ambiguousChar)],
            })),
            resolvedChoice: userOverrides[alertId] || repChars[rule.pattern.indexOf(rule.ambiguousChar)],
          });
        }
        startIndex += rule.pattern.length;
      }
    }

    // Phase 2: Single character conversion for unhandled positions
    for (let i = 0; i < chars.length; i++) {
      if (handledIndices.has(i)) continue;

      const c = chars[i];
      if (hasAmbiguity(c)) {
        const def = AMBIGUITY_DEFINITIONS[c];
        const alertId = `amb_${lineIndex}_${i}_${c}`;
        const userChoice = userOverrides[alertId];
        const targetChar = userChoice || def.defaultKyujitai;

        if (targetChar !== c) {
          resultChars[i] = targetChar;
          changedIndices.push(i);
        }

        ambiguities.push({
          id: alertId,
          sourceChar: c,
          lineIndex,
          charIndex: i,
          explanation: def.explanation,
          options: def.options,
          resolvedChoice: targetChar,
        });
      } else if (SHIN_TO_KYU_MAP[c]) {
        resultChars[i] = SHIN_TO_KYU_MAP[c];
        changedIndices.push(i);
      }
    }
  } else {
    // Direction: Kyūjitai to Shinjitai
    // First check special reverse compound replacements (like 混淆 -> 混交)
    let processed = line;
    for (const def of Object.values(AMBIGUITY_DEFINITIONS)) {
      for (const [shinCompound, kyuCompound] of Object.entries(def.compoundContexts)) {
        if (processed.includes(kyuCompound)) {
          processed = processed.split(kyuCompound).join(shinCompound);
        }
      }
    }

    // Now convert characters
    const pChars = Array.from(processed);
    for (let i = 0; i < pChars.length; i++) {
      const c = pChars[i];
      if (KYU_TO_SHIN_MAP[c]) {
        resultChars[i] = KYU_TO_SHIN_MAP[c];
        changedIndices.push(i);
      } else {
        resultChars[i] = c;
        if (c !== chars[i]) {
          changedIndices.push(i);
        }
      }
    }
  }

  const convertedText = resultChars.join('');

  // Generate enriched char info for input and output
  const inputChars = chars.map(c => getEnrichedCharInfo(c));
  const outputChars = resultChars.map(c => getEnrichedCharInfo(c));

  return {
    lineIndex,
    originalText: line,
    convertedText,
    hasChanges: changedIndices.length > 0,
    changedIndices,
    ambiguities,
    inputChars,
    outputChars,
  };
}

/**
 * Batch convert multi-line text (one line per word/sentence)
 */
export function convertBatch(
  text: string,
  direction: ConversionDirection,
  userOverrides: Record<string, string> = {}
): ConversionSummary {
  const lines = text.split(/\r?\n/);
  const results: LineConversionResult[] = [];
  let totalChars = 0;
  let convertedCharsCount = 0;
  let ambiguityCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const res = convertLine(lines[i], i, direction, userOverrides);
    results.push(res);
    totalChars += lines[i].length;
    convertedCharsCount += res.changedIndices.length;
    ambiguityCount += res.ambiguities.length;
  }

  return {
    totalLines: lines.length,
    totalChars,
    convertedCharsCount,
    ambiguityCount,
    lines: results,
  };
}
