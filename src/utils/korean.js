import { JAMO_STROKES } from '../constants/jamo';

const CHOSEONG = [
  'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ',
  'ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];

const JUNGSEONG = [
  'ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ',
  'ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ',
];

const JONGSEONG = [
  null,'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ',
  'ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ',
  'ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
];

export function decomposeChar(char) {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return [];
  const cho = CHOSEONG[Math.floor(code / 588)];
  const jung = JUNGSEONG[Math.floor((code % 588) / 28)];
  const jong = JONGSEONG[code % 28];
  return jong ? [cho, jung, jong] : [cho, jung];
}

export function getCharJamo(char) {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return null;
  return {
    cho: CHOSEONG[Math.floor(code / 588)],
    jung: JUNGSEONG[Math.floor((code % 588) / 28)],
    jong: JONGSEONG[code % 28] || null,
  };
}

export function getCharStrokes(char) {
  return decomposeChar(char).reduce((sum, j) => sum + (JAMO_STROKES[j] ?? 0), 0);
}

export function getTotalStrokes(name) {
  return [...name].reduce((sum, ch) => sum + getCharStrokes(ch), 0);
}

export function getFinalThemeIndex(name) {
  return (getTotalStrokes(name) - 1) % 4;
}

export function isValidKoreanName(name) {
  return /^[가-힣]{2,5}$/.test(name);
}

// 중성이 세로모음인지 여부 (초성이 왼쪽에 배치되는 레이아웃)
const VERTICAL_VOWELS = new Set([
  'ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅣ',
  'ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ',
]);

export function getLayoutType(jung, hasJong) {
  const isVertical = VERTICAL_VOWELS.has(jung);
  if (isVertical && !hasJong) return 'A'; // 초성 좌 / 중성 우
  if (!isVertical && !hasJong) return 'B'; // 초성 상 / 중성 하
  if (isVertical && hasJong) return 'C';  // 초성 상좌 / 중성 우 / 종성 하
  return 'D';                              // 초성 상 / 중성 중 / 종성 하
}
