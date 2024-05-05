import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import Index from './screens/index';
// import LoginPage from './screens/Login';
import LoadingPage from './screens/loading';
import RegisterPage from './screens/register';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
   <NavigationContainer>
      <Stack.Navigator initialRouteName='Register'>
        {/* Main Pages */}
        {/* <Stack.Screen name='Loading' component={LoadingPage} options={{headerShown:false}}/> */}
        <Stack.Screen name='Resgister' component={RegisterPage} options={{headerShown:false}}/>
        <Stack.Screen name='Index' component={Index} options={{headerShown:false}}/>
        {/* <Stack.Screen name='Login' component={LoginPage} options={{headerShown:false}}/> */}
      </Stack.Navigator>

   </NavigationContainer>
  );
}