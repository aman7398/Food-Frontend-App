import { StatusBar } from 'expo-status-bar';

import './global.css';
import SplashScreen from './app/splash';

export default function App() {
  return (
    <>
      <SplashScreen />
      <StatusBar style="auto" />
    </>
  );
}
