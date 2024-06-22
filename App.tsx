import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

// import screen
import Index from './screens/index';
import LoginPage from './screens/login';
import LoadingPage from './screens/loading';    
import RegisterPage from './screens/register';
import AccountPage from './screens/account';
import PetGroomer from './screens/petGroomer';
import AddressPage from './screens/address';
import ProgressPage from './screens/progress';

const Stack = createNativeStackNavigator();

const App = () => {
  // variables
  const [isLoading, setLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => { // using useEffect so that the app can run many task at the same time
    checkLoginStatus(); 
  }, []);

  // cheking login status using async storage that store data locally
  const checkLoginStatus = async () => {
    setLoading(true);
    try {
      // using email as an id
      const user = auth().currentUser;
      if (user !== null) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.log("Error Retrieving user token: ", error);
    } finally {
      setLoading(false);
    }
  };
  
  // while fetching the data, the app shows a loading screen
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    // <NavigationContainer> 
    //   <ProgressPage/>
    // </NavigationContainer>

    <NavigationContainer>
      {/* <Index/> */}
    {/* Cheking whether user data is stored (isLoggedIn) or not */}
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Index' : 'Login'}
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {/* <Stack.Navigator initialRouteName='Index'> */}
        <Stack.Screen name='Login' component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={RegisterPage} options={{ headerShown: false }} />
        <Stack.Screen name='Index' component={Index} options={{ headerShown: false }} />
        <Stack.Screen name ='Account' component={AccountPage} />
        <Stack.Screen name ='Address' component={AddressPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
