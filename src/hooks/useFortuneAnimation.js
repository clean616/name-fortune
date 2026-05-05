import { useState, useCallback, useRef } from 'react';
import { getCharStrokes, getTotalStrokes } from '../utils/korean';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function useFortuneAnimation(onComplete) {
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [strokesRevealedForChar, setStrokesRevealedForChar] = useState(0);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const cancelRef = useRef(false);

  const start = useCallback(
    async (name) => {
      cancelRef.current = false;
      const chars = [...name];
      const total = getTotalStrokes(name);
      const strokeDelay = Math.max(150, Math.min(420, 7500 / total));

      setTotalStrokes(total);
      setCurrentStroke(0);
      setCurrentThemeIndex(0);

      let cumulativeStroke = 0;
      let themeIndex = 0;

      for (let ci = 0; ci < chars.length; ci++) {
        if (cancelRef.current) return;
        const char = chars[ci];
        const charStrokeCount = getCharStrokes(char);

        setCurrentCharIndex(ci);
        setStrokesRevealedForChar(0);

        // 글자 등장 후 짧게 대기
        await wait(200);
        if (cancelRef.current) return;

        for (let si = 0; si < charStrokeCount; si++) {
          if (cancelRef.current) return;
          cumulativeStroke++;
          themeIndex = (cumulativeStroke - 1) % 4;

          setStrokesRevealedForChar(si + 1);
          setCurrentStroke(cumulativeStroke);
          setCurrentThemeIndex(themeIndex);

          await wait(strokeDelay);
        }

        // 글자 완성 후 짧게 유지
        await wait(300);
      }

      if (!cancelRef.current) {
        onComplete(themeIndex);
      }
    },
    [onComplete]
  );

  const cancel = useCallback(() => {
    cancelRef.current = true;
  }, []);

  return {
    start,
    cancel,
    currentCharIndex,
    strokesRevealedForChar,
    currentThemeIndex,
    currentStroke,
    totalStrokes,
  };
}
