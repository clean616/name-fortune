import { useState } from 'react';
import { isValidKoreanName } from '../../utils/korean';
import styles from './StartScreen.module.css';

export default function StartScreen({ onStart }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShareApp = async () => {
    const url = window.location.origin;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      prompt('아래 주소를 복사해주세요:', url);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // 한글 + 공백 외 입력 차단
    if (/[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/.test(value)) return;
    setName(value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!isValidKoreanName(trimmed)) {
      setError('한글 이름을 2~5글자로 입력해주세요');
      return;
    }
    onStart(trimmed);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.emojiRow} aria-hidden="true">
          🌸 ⭐ ☁️ 🔥
        </div>
        <h1 className={styles.title}>꽃별천지</h1>
        <p className={styles.subtitle}>당신은 사후에 어디로 갈까요?</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="name-input" className={styles.label}>
            이름 입력
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="홍길동"
            maxLength={5}
            autoComplete="off"
            className={styles.input}
            aria-describedby={error ? 'name-error' : undefined}
          />
          {error && (
            <p id="name-error" className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className={styles.button}
            aria-label="이름점 점치기"
          >
            점치기 ✨
          </button>
          <button
            type="button"
            className={styles.shareButton}
            onClick={handleShareApp}
            aria-label="앱 공유하기"
          >
            {copied ? '복사됨! ✅' : '공유하기 🔗'}
          </button>
        </form>

        <p className={styles.hint}>획수로 알아보는 90년대 감성 이름점</p>
      </div>
    </div>
  );
}
