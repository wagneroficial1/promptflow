import { LandingPage } from './components/LandingPage';

export default function App() {
  const handleStart = () => {
    window.location.href = '/login';
  };

  return <LandingPage onStart={handleStart} />;
}

