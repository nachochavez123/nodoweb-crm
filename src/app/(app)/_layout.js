import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(app)/index"
        options={{
          title: 'Prospectos',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginBottom: 2 }}>
              <Text style={{ color: focused ? '#0ea5e9' : '#64748b', fontSize: 20 }}>📋</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(app)/new-prospect"
        options={{
          title: 'Nuevo',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginBottom: 2 }}>
              <Text style={{ color: focused ? '#0ea5e9' : '#64748b', fontSize: 20 }}>➕</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(app)/profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <View style={{ marginBottom: 2 }}>
              <Text style={{ color: focused ? '#0ea5e9' : '#64748b', fontSize: 20 }}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
