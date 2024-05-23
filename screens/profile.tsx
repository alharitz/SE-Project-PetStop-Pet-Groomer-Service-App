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

const ProfilePage = ({navigation}:any) =>{
  
  const handleLogOut = async ()=>{
    try {
      const userId = await AsyncStorage.getItem('email');
      if(userId){
        await AsyncStorage.removeItem('email');
        navigation.navigate('Login');
        return;
      }else{
        console.log("Couldn't Log out");
      }
    } catch (error) {
      
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