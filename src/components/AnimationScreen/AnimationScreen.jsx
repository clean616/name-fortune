import { useEffect } from 'react';
import { useFortuneAnimation } from '../../hooks/useFortuneAnimation';
import { THEMES } from '../../constants/themes';
import KoreanChar from './KoreanChar';
import styles from './AnimationScreen.module.css';

export default function AnimationScreen({ name, onComplete }) {
  const {
    start,
    cancel,
    currentCharIndex,
    strokesRevealedForChar,
    currentThemeIndex,
    currentStroke,
    totalStrokes,
  } = useFortuneAnimation(onComplete);

  useEffect(() => {
    start(name);
    return () => cancel();
  }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

  const theme = THEMES[currentThemeIndex];
  const chars = [...name];
  const currentChar = currentCharIndex >= 0 ? chars[currentCharIndex] : null;

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: theme.bg }}
    >
      {/* 현재 테마 표시 */}
      <div className={styles.themeIndicator}>
        <span className={styles.themeEmoji}>{theme.emoji}</span>
        <span className={styles.themeLabel}>{theme.label}</span>
      </div>

      {/* 완성된 글자 (작게) + 현재 글자 (크게) */}
      <div className={styles.charArea}>
        {/* 이미 완성된 글자들 */}
        <div className={styles.completedChars}>
          {chars.slice(0, currentCharIndex).map((ch, i) => (
            <span key={i} className={styles.completedChar}>
              {ch}
            </span>
          ))}
        </div>

        {/* 현재 그려지는 글자 */}
        {currentChar && (
          <div className={styles.currentCharWrap}>
            <KoreanChar
              char={currentChar}
              strokesRevealed={strokesRevealedForChar}
            />
          </div>
        )}
      </div>

      {/* 획수 카운터 */}
      <div className={styles.counter}>
        <span className={styles.counterCurrent}>{currentStroke}</span>
        <span className={styles.counterSep}> / </span>
        <span className={styles.counterTotal}>{totalStrokes}획</span>
      </div>

      {/* 꽃별천지 순환 표시 */}
      <div className={styles.cycleRow} aria-hidden="true">
        {THEMES.map((t, i) => (
          <span
            key={t.key}
            className={`${styles.cycleItem} ${i === currentThemeIndex ? styles.cycleActive : ''}`}
          >
            {t.key}
          </span>
        ))}
      </div>
    </div>
  );
}
