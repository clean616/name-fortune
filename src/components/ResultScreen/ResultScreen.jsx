import { useMemo, useState } from 'react';
import { THEMES } from '../../constants/themes';
import styles from './ResultScreen.module.css';

export default function ResultScreen({ name, themeIndex, onRestart }) {
  const theme = THEMES[themeIndex];
  const message = useMemo(
    () => theme.messages[Math.floor(Math.random() * theme.messages.length)],
    [theme]
  );
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = new URL('/api/share', window.location.origin);
    url.searchParams.set('name', name);
    url.searchParams.set('theme', themeIndex);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      prompt('아래 주소를 복사해주세요:', url.toString());
    }
  };

  return (
    <div className={styles.container} style={{ backgroundColor: theme.bg }}>
      <div className={styles.card}>
        <div className={styles.emoji} aria-hidden="true">
          {theme.emoji}
        </div>
        <h2 className={styles.resultLabel}>{theme.label}</h2>
        <p className={styles.name}>{name}</p>
        <p className={styles.message}>{message}</p>
      </div>

      <div className={styles.buttons}>
        <button
          className={`${styles.btn} ${styles.shareBtn}`}
          onClick={handleShare}
          aria-label="결과 URL 복사하기"
        >
          {copied ? '✅ 복사됨!' : '🔗 공유하기'}
        </button>
        <button
          className={`${styles.btn} ${styles.restartBtn}`}
          onClick={onRestart}
          aria-label="처음부터 다시 하기"
        >
          🔄 다시하기
        </button>
      </div>
    </div>
  );
}
