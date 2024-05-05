import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screen
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
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="PetGroomer" component={PetGroomer} />
      <Stack.Screen name="PetHotel" component={PetHotel} />
      <Stack.Screen name="PetDoctor" component={PetDoctor} />
      <Stack.Screen name="PetForum" component={PetForum} />
    </Stack.Navigator>
  );
};

const Index = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="History" component={HistoryPage} options={{ headerShown: false }} />
      <Tab.Screen name="Notification" component={NotificationPage} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default Index;
