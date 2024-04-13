import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs safeAreaInsets={{ bottom: 0 }} screenOptions={{ tabBarActiveBackgroundColor: '#F8F8F8', tabBarInactiveBackgroundColor: '#F8F8F8', tabBarStyle: { height: 70 }}}>
      <Tabs.Screen name="list" options={{ tabBarLabel: "Catalog", tabBarLabelStyle: { paddingBottom: 10}, tabBarActiveTintColor: '#EE9320', headerTitle: "CATALOG", headerStyle: { backgroundColor: "#F8F8F8" }, tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color}/> }}/>
      <Tabs.Screen name="profile" options={{ tabBarLabel: "Profile", tabBarLabelStyle: { paddingBottom: 10}, tabBarActiveTintColor: '#EE9320', headerTitle: "PROFILE", headerStyle: { backgroundColor: "#F8F8F8" }, tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />}}/>
    </Tabs>
  );
}
