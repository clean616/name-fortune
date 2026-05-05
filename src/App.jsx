import { useState, useEffect } from 'react';
import { isValidKoreanName } from './utils/korean';
import StartScreen from './components/StartScreen/StartScreen';
import AnimationScreen from './components/AnimationScreen/AnimationScreen';
import ResultScreen from './components/ResultScreen/ResultScreen';

export default function App() {
  const [screen, setScreen] = useState('start');
  const [name, setName] = useState('');
  const [resultThemeIndex, setResultThemeIndex] = useState(null);

  // URL 공유 파라미터 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedName = params.get('name');
    if (sharedName && isValidKoreanName(sharedName)) {
      setName(sharedName);
      setScreen('animation');
    }
  }, []);

  const handleStart = (inputName) => {
    setName(inputName);
    setScreen('animation');
  };

  const handleAnimationComplete = (themeIndex) => {
    setResultThemeIndex(themeIndex);
    setScreen('result');
  };

  const handleRestart = () => {
    setResultThemeIndex(null);
    setName('');
    window.history.replaceState({}, '', window.location.pathname);
    setScreen('start');
  };

  if (screen === 'animation') {
    return (
      <AnimationScreen
        key={name}
        name={name}
        onComplete={handleAnimationComplete}
      />
    );
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        name={name}
        themeIndex={resultThemeIndex}
        onRestart={handleRestart}
      />
    );
  }

  return <StartScreen onStart={handleStart} />;
}
