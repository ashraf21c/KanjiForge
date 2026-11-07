import { KANJI_METADATA_MAP } from '../data/kanjiDict';

/**
 * Text-to-Speech synthesis for Japanese Kanji and compounds
 * Uses native Web Speech API (zero dependencies, fully offline)
 */
export function speakJapaneseText(text: string, rate: number = 1.0): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));

    // Try to pick Japanese voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja') || v.lang.includes('JP'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
    return false;
  }
}

/**
 * Stop any ongoing speech
 */
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Convert Katakana to Hiragana for clean phonetic ruby annotations
 */
export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, match => {
    const code = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(code);
  });
}

/**
 * Common reading overrides for frequent educational/idiom kanjis
 */
const COMMON_READING_MAP: Record<string, string> = {
  混: 'こん',
  交: 'こう',
  淆: 'こう',
  継: 'けい',
  繼: 'けい',
  体: 'たい',
  體: 'たい',
  弁: 'べん',
  辯: 'べん',
  瓣: 'べん',
  辨: 'べん',
  護: 'ご',
  士: 'し',
  償: 'しょう',
  花: 'はな',
  予: 'よ',
  豫: 'よ',
  定: 'てい',
  芸: 'げい',
  藝: 'げい',
  術: 'じゅつ',
  欠: 'けつ',
  缺: 'けつ',
  席: 'せき',
  缶: 'かん',
  罐: 'かん',
  詰: 'づめ',
  台: 'たい',
  颱: 'たい',
  風: 'ふう',
  国: 'こく',
  國: 'こく',
  桜: 'さくら',
  櫻: 'さくら',
  学: 'がく',
  學: 'がく',
  気: 'き',
  氣: 'き',
  絶: 'ぜつ',
  絕: 'ぜつ',
  命: 'めい',
  臨: 'りん',
  機: 'き',
  応: 'おう',
  應: 'おう',
  変: 'へん',
  變: 'へん',
  無: 'む',
  双: 'そう',
  雙: 'そう',
  独: 'どく',
  獨: 'どく',
  立: 'りつ',
  歩: 'ほ',
  步: 'ほ',
  実: 'じつ',
  實: 'じつ',
  剛: 'ごう',
  健: 'けん',
  図: 'ず',
  圖: 'ず',
  館: 'かん',
  育: 'いく',
  研: 'けん',
  硏: 'けん',
  究: 'きゅう',
  所: 'しょ',
};

/**
 * Get primary Hiragana reading for a character for Ruby/Furigana display
 */
export function getRubyReadingForChar(char: string): string | null {
  if (COMMON_READING_MAP[char]) {
    return COMMON_READING_MAP[char];
  }

  const meta = KANJI_METADATA_MAP[char];
  if (meta) {
    if (meta.on && meta.on.length > 0) {
      // First clean any punctuation like ・
      const firstOn = meta.on[0].replace(/[・]/g, '');
      return katakanaToHiragana(firstOn);
    }
    if (meta.kun && meta.kun.length > 0) {
      const firstKun = meta.kun[0].split('・')[0].split('.')[0];
      return katakanaToHiragana(firstKun);
    }
  }

  return null;
}
