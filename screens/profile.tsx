import React,{
  useEffect,
    useState
  } from 'react';
  import {
    View,
    Text, 
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
  } from 'react-native';

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import CustomButton from '../assets/properties/CustomButton';
import CustomTextBox from '../assets/properties/CustomTextBox';

const ProfilePage = ({navigation}:any) =>{
  useEffect(() =>{
    fetchingUserData();
  }, []);

  const user = auth().currentUser;
  const uid = user?.uid
  const fetchingUserData = async()=>{
    try {
      const userData = await firestore()
      .collection('user')
      .doc(uid)
      .get();
    } catch (error) {
      
    }
  }
  
  // Handle LogOut
  const handleLogOut = async ()=>{
    try {
      await auth().signOut(); // Sign out
      navigation.navigate('Login'); // Navigate ke login
    } catch (error) {
      console.error('Error signing out:', error); // handle error
    }
  }

  // Handle Edit Profile
  const handleEditProfile = ()=>{
    
  }

    return(
      <ScrollView>
        <View style={style.profile_name_pict_container}>
          <Image 
          source={require('./images/logoFix.png')}
          style = {style.profile_pict}/>
          <Text style={style.tittle}>Name Surname</Text>
        </View>
        <View style={{marginLeft: 10}}>
          <CustomTextBox 
          title="First Name" 
          text="Name" // << insert variables here
          />
          <CustomTextBox 
          title="Last Name" 
          text="Surname" // << insert variables here
          />
          <CustomTextBox 
          title="Email Address" 
          text="name.surname@mail.com" // << insert variables here
          />
          <CustomTextBox 
          title="Phone Number" 
          text="12345678910" // << insert variables here
          />
          <CustomTextBox 
          title="Adress" 
          text="st. lorem ipsum dolor sit amet" // << insert variables here
          />
    
        </View>
        <View style={{alignItems: 'center'}}>
          <CustomButton
            title="Edit Profile"
            buttonStyle={{
              width: 300,
              height: 50,
              borderRadius: 25,
              marginTop: 20,
            }}
            textStyle={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
            }}
            disabled={false}
            onPress={handleEditProfile}/>

            <CustomButton
            title="Log Out"
            buttonStyle={{
              width: 300,
              height: 50,
              borderRadius: 25,
              marginVertical: 20,
            }}
            textStyle={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
            }}
            disabled={false}
            onPress={handleLogOut}/>
        </View>
      </ScrollView>

    );
};

const style = StyleSheet.create({
  profile_name_pict_container: {
    display: 'flex',
    alignItems: 'center',
    marginVertical: 30,
  },
  profile_pict: {
    width: 160,
    height: 160
  },
  tittle:{
    marginTop: 10,
    fontSize: 30,
    fontWeight: '800',
    color: 'black'
  },
  
})

export default ProfilePage;