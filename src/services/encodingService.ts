import Encoding from 'encoding-japanese';
import { KanjiCharInfo } from '../types/kanji';

/**
 * Check if a character is a CJK ideograph (Kanji)
 */
export function isKanjiChar(char: string): boolean {
  if (!char) return false;
  const code = char.codePointAt(0);
  if (!code) return false;
  // CJK Unified Ideographs & extensions & compatibility ideographs
  return (
    (code >= 0x4e00 && code <= 0x9fff) ||   // CJK Unified Ideographs
    (code >= 0x3400 && code <= 0x4dbf) ||   // CJK Extension A
    (code >= 0x20000 && code <= 0x2a6df) || // CJK Extension B
    (code >= 0xf900 && code <= 0xfaff)      // CJK Compatibility Ideographs
  );
}

/**
 * Convert Shift-JIS bytes (s1, s2) to JIS X 0208 Ku-Ten (区点) coordinates
 */
export function sjisToKuten(s1: number, s2: number): { ku: number; ten: number } | null {
  let kuBase = 0;
  if (s1 >= 0x81 && s1 <= 0x9f) {
    kuBase = (s1 - 0x81) * 2 + 1;
  } else if (s1 >= 0xe0 && s1 <= 0xea) {
    kuBase = (s1 - 0xe0) * 2 + 63;
  } else if (s1 >= 0xeb && s1 <= 0xfc) {
    kuBase = (s1 - 0xeb) * 2 + 85;
  } else {
    return null;
  }

  let ku = kuBase;
  let ten = 0;

  if (s2 >= 0x40 && s2 <= 0x7e) {
    ten = s2 - 0x3f;
  } else if (s2 >= 0x80 && s2 <= 0x9e) {
    ten = s2 - 0x40;
  } else if (s2 >= 0x9f && s2 <= 0xfc) {
    ku = kuBase + 1;
    ten = s2 - 0x9e;
  } else {
    return null;
  }

  if (ku < 1 || ku > 94 || ten < 1 || ten > 94) {
    return null;
  }

  return { ku, ten };
}

/**
 * Convert Ku-Ten to JIS 2-byte hex (Ku+0x20, Ten+0x20)
 */
export function kutenToJisHex(ku: number, ten: number): string {
  const b1 = (ku + 0x20).toString(16).toUpperCase().padStart(2, '0');
  const b2 = (ten + 0x20).toString(16).toUpperCase().padStart(2, '0');
  return `0x${b1}${b2}`;
}

/**
 * Determine character JIS level / standard based on Ku-Ten
 */
export function getJisLevelClassification(ku: number): string {
  if (ku >= 1 && ku <= 8) return 'JIS非漢字 (記号・仮名)';
  if (ku >= 16 && ku <= 47) return 'JIS第1水準 (常用・基本)';
  if (ku >= 48 && ku <= 84) return 'JIS第2水準 (旧字・人名・難読)';
  if (ku >= 85) return 'JIS拡張/第3水準・第4水準';
  return 'JIS X 0208';
}

/**
 * Inspect a character and return full encoding breakdown
 */
export function getCharEncodingInfo(char: string): KanjiCharInfo {
  const codePoint = char.codePointAt(0) || 0;
  const unicodeHex = `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;

  // UTF-8 Bytes
  const encoder = new TextEncoder();
  const utf8Bytes = Array.from(encoder.encode(char));
  const utf8Hex = utf8Bytes
    .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');

  // Shift-JIS & EUC-JP via encoding-japanese
  const unicodeArray = Encoding.stringToCode(char);
  const sjisBytes = Encoding.convert(unicodeArray, { to: 'SJIS', from: 'UNICODE' });
  const eucBytes = Encoding.convert(unicodeArray, { to: 'EUCJP', from: 'UNICODE' });

  let shiftJisHex = 'N/A';
  let jisHex = 'N/A';
  let kuten = 'N/A';
  let kutenDetail: { men: number; ku: number; ten: number } | null = null;
  let classification = isKanjiChar(char) ? '漢字 (CJK Unified)' : '記号・文字';

  // Check if valid 2-byte Shift-JIS
  if (
    Array.isArray(sjisBytes) &&
    sjisBytes.length === 2 &&
    sjisBytes[0] !== 0x3f // 0x3f is '?' fallback
  ) {
    const s1 = sjisBytes[0];
    const s2 = sjisBytes[1];
    shiftJisHex = `0x${s1.toString(16).toUpperCase().padStart(2, '0')}${s2.toString(16).toUpperCase().padStart(2, '0')}`;

    const kt = sjisToKuten(s1, s2);
    if (kt) {
      kutenDetail = { men: 1, ku: kt.ku, ten: kt.ten };
      kuten = `${kt.ku}区${kt.ten}点 (${kt.ku}-${kt.ten})`;
      jisHex = kutenToJisHex(kt.ku, kt.ten);
      classification = getJisLevelClassification(kt.ku);
    }
  } else if (Array.isArray(sjisBytes) && sjisBytes.length === 1) {
    // 1-byte ASCII / Hankaku Kana
    shiftJisHex = `0x${sjisBytes[0].toString(16).toUpperCase().padStart(2, '0')}`;
  }

  let eucJpHex = 'N/A';
  if (Array.isArray(eucBytes) && eucBytes.length > 0 && eucBytes[0] !== 0x3f) {
    eucJpHex = eucBytes
      .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
      .join('');
    if (eucJpHex) eucJpHex = `0x${eucJpHex}`;
  }

  return {
    char,
    unicodeHex,
    unicodeDec: codePoint,
    utf8Hex,
    shiftJisHex,
    jisHex,
    kuten,
    kutenDetail,
    eucJpHex,
    isKanji: isKanjiChar(char),
    classification,
  };
}
