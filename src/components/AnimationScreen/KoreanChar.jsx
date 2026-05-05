import { useMemo } from 'react';
import { getCharJamo, getLayoutType } from '../../utils/korean';
import { JAMO_SVG_PATHS, LAYOUT_BOXES } from '../../constants/jamoSvg';
import styles from './KoreanChar.module.css';

function buildStrokes(jamo, layoutType) {
  const boxes = LAYOUT_BOXES[layoutType];
  const strokes = [];

  const add = (jamoKey, boxKey) => {
    const paths = JAMO_SVG_PATHS[jamoKey];
    if (!paths) return;
    const box = boxes[boxKey];
    paths.forEach((d) => strokes.push({ d, box }));
  };

  add(jamo.cho, 'cho');
  add(jamo.jung, 'jung');
  if (jamo.jong) add(jamo.jong, 'jong');

  return strokes;
}

export default function KoreanChar({ char, strokesRevealed }) {
  const jamo = useMemo(() => getCharJamo(char), [char]);
  const layoutType = useMemo(
    () => (jamo ? getLayoutType(jamo.jung, !!jamo.jong) : 'A'),
    [jamo]
  );
  const strokes = useMemo(
    () => (jamo ? buildStrokes(jamo, layoutType) : []),
    [jamo, layoutType]
  );

  if (!jamo) return null;

  return (
    <svg
      viewBox="0 0 200 200"
      className={styles.charSvg}
      aria-label={char}
    >
      {strokes.map(({ d, box }, i) => {
        const revealed = i < strokesRevealed;
        const sx = box.w / 100;
        const sy = box.h / 100;
        return (
          <path
            key={i}
            d={d}
            transform={`translate(${box.x},${box.y}) scale(${sx},${sy})`}
            stroke="currentColor"
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className={revealed ? styles.revealed : styles.hidden}
          />
        );
      })}
    </svg>
  );
}
