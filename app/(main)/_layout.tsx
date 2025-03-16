import { Tabs } from 'expo-router';
import { Text } from 'react-native';

// Main layout with bottom tabs
const MainLayout = () => (
  <Tabs
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#C73D10',
      tabBarInactiveTintColor: '#888',
    }}
  >
    <Tabs.Screen
      name="home/index"
      options={{
        title: 'Home',
        tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
      }}
    />
    <Tabs.Screen
      name="explore/index"
      options={{
        title: 'Explore',
        tabBarIcon: ({ color }) => <Text style={{ color }}>🔍</Text>,
      }}
    />
    <Tabs.Screen
      name="contributor/index"
      options={{
        title: 'Contribute',
        tabBarIcon: ({ color }) => <Text style={{ color }}>✏️</Text>,
      }}
    />
  </Tabs>
);

export default MainLayout;
