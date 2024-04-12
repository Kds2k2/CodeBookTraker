import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Navigator, SplashScreen, Stack, Tabs } from 'expo-router';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { FIREBASE_AUTH } from '../config/firebaseConfig';

export {
  ErrorBoundary,
} from 'expo-router';

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ title: "Sign In" }} />
          <Stack.Screen name="signUp" options={{ title: "Sign Up" }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, headerLeft: () => null }} />
        </Stack>
    </ThemeProvider>
  );
}

export default RootLayoutNav;