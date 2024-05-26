import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{
    useState
  } from 'react';
  import {
    View,
    Text, 
    StyleSheet,
    TouchableOpacity,
  } from 'react-native';
import auth from '@react-native-firebase/auth';

const ProfilePage = ({navigation}:any) =>{

  
  const handleLogOut = async ()=>{
    try {
      await auth().signOut(); // Sign out
      navigation.navigate('Login'); // Navigate ke login
    } catch (error) {
      console.error('Error signing out:', error); // handle error
    }
  }
    return(
        <View>
          <TouchableOpacity onPress={handleLogOut}>
            <Text>
              LogOut
            </Text>
          </TouchableOpacity>
        </View>
    );
};

export default ProfilePage;