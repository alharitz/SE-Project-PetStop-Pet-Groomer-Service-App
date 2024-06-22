import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PetGroomer from "./petGroomer";
import PetHotel from "./petHotel";
import ProfilePage from "./profile";
import AdminPetGroomer from "./adminGroomer"; // Import the top tab bar
import PetDoctor from "./petDoctor";

const AdminTab = createBottomTabNavigator();

const AdminDashboard = () => {
  return (
    <AdminTab.Navigator
      initialRouteName="Pet Groomer"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'dog-service'

          if (route.name === 'Pet Groomer') {
            iconName = focused ? 'dog-side' : 'dog-side';
          } else if (route.name === 'Pet Hotel') {
            iconName = focused ? 'office-building' : 'office-building';
          } else if (route.name === 'Pet Doctor') {
            iconName = focused ? 'medical-bag' : 'medical-bag';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FA751C',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          height: 70, 
          paddingBottom: 10, 
          paddingTop: 10, 
          borderTopWidth: 3,
          borderBottomWidth: 4,
          borderTopColor: '#FA751C',
          borderBottomColor: '#FA751C'
        },
      })}
    >
      <AdminTab.Screen name="Pet Groomer" component={AdminPetGroomer} options={{ headerShown: false }} />
      <AdminTab.Screen name="Pet Hotel" component={PetHotel} options={{ headerShown: false }} />
      <AdminTab.Screen name="Pet Doctor" component={PetDoctor} options={{ headerShown: false }} />
      <AdminTab.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
    </AdminTab.Navigator>
  );
};

export default AdminDashboard;
