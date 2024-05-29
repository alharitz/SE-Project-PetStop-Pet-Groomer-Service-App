import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// screens
import HistoryPage from "./history";
import NotificationPage from "./notification";
import ProfilePage from "./profile";
import PetGroomer from "./petGroomer";
import PetHotel from "./petHotel";
import PetDoctor from "./petDoctor";
import PetForum from "./petForum";
import HomePage from "./home";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomePage">
      <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="PetGroomer" component={PetGroomer} />
      <Stack.Screen name="PetHotel" component={PetHotel} />
      <Stack.Screen name="PetDoctor" component={PetDoctor} />
      <Stack.Screen name="PetForum" component={PetForum} />
    </Stack.Navigator>
  );
};

const Index = () => {
  return (
    <Tab.Navigator
    initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home'; // Default icon name

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = 'history';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'bell' : 'bell-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          // Return the MaterialCommunityIcons component with the correct icon name
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFA600',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 10},
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="History" component={HistoryPage} options={{ headerShown: false }} />
      <Tab.Screen name="Notification" component={NotificationPage} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default Index;
