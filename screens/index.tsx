import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// screens
import HistoryPage from "./history";
import ProgressPage from "./progress";
import PetGroomer from "./petGroomer";
import PetHotel from "./petHotel";
import PetDoctor from "./petDoctor";
import PetForum from "./petForum";
import HomePage from "./home";
import ProfilePage from "./profile";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const checkUserRole = async () => {
  const user = auth().currentUser;
  const uid = user?.uid;

  if (!uid) return;

  // UID admin yang dituju
  const adminUid = 'Hq9q3kjcVzYIiC6vA09CMr3v3Sp2';

  try {
    if (uid === adminUid) {
      return 'admin'; // Jika UID adalah UID admin, kembalikan 'admin'
    } else {
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData?.role; // Kembalikan peran pengguna jika dokumen pengguna ada
      } else {
        console.log('User document not found');
      }
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
  }
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="Pet Groomer" component={PetGroomer} />
      <Stack.Screen name="PetHotel" component={PetHotel} />
      <Stack.Screen name="PetDoctor" component={PetDoctor} />
      <Stack.Screen name="PetForum" component={PetForum} />
    </Stack.Navigator>
  );
};

const Index = ({navigation}:any) => {
  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await checkUserRole();
      if (role === 'admin') {
        // Redirect to admin dashboard
        navigation.reset({
          index: 0,
          routes: [{ name: 'Admin Dashboard' }],
        });
      }
    };

    fetchUserRole();
  }, []);

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
          } else if (route.name === 'Progress') {
            iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          // Return the MaterialCommunityIcons component with the correct icon name
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
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="History" component={HistoryPage} options={{ headerShown: false }} />
      <Tab.Screen name="Progress" component={ProgressPage} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default Index;
