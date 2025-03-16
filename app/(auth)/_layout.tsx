import { Stack } from 'expo-router';

// Auth layout with no bottom tabs
const AuthLayout = () => (
  <Stack
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  />
);

export default AuthLayout;
