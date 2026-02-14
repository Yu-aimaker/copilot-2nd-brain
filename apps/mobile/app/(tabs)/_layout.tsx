import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

function TabBarIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 24, color: focused ? '#3B82F6' : '#6B7280' }}>
      {name === 'home' ? '🏠' : name === 'record' ? '📅' : '⚡'}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'HOME',
          tabBarIcon: ({ focused }) => <TabBarIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'RECORD',
          tabBarIcon: ({ focused }) => <TabBarIcon name="record" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="next"
        options={{
          title: 'NEXT',
          tabBarIcon: ({ focused }) => <TabBarIcon name="next" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
