import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './index';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}