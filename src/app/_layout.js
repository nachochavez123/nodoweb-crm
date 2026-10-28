import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext.js';
import { ProspectsProvider } from '../context/ProspectsContext.js';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProspectsProvider>
        <Stack>
          <Stack.Screen
            name="(auth)/login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(auth)/register"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(app)"
            options={{ headerShown: false }}
          />
        </Stack>
      </ProspectsProvider>
    </AuthProvider>
  );
}
