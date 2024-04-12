import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

export {
  ErrorBoundary,
} from 'expo-router';

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="list" options={{ title: "My Books", headerLeft: () => null }} />
        <Stack.Screen name="profile" options={{ title: "My Profile" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
      </Stack>
    </ThemeProvider>
  );
}

export default RootLayoutNav;