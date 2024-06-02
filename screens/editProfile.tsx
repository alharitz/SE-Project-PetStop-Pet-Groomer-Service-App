import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomButton from '../assets/properties/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const EditProfilePage = ({navigation}: any) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

//   YANG GW COMMENT CODINGANNYA CHAT GPT

//   const user = auth().currentUser;
//   const uid = user?.uid;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userDoc = await firestore().collection('user').doc(uid).get();
//         const data = userDoc.data();
//         setUserData({
//           firstName: data.firstName || '',
//           lastName: data.lastName || '',
//           email: data.email || '',
//           phoneNumber: data.phoneNumber || '',
//           address: data.address || ''
//         });
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, [uid]);

  const handleUploadImage = () =>{

  }

  const handleCancelEdit = () =>{
    navigation.goBack();
  }

  const handleSave =() => {
    navigation.popToTop();


    // try {
    //   await firestore().collection('user').doc(uid).update(userData);
    //   navigation.goBack(); // Navigate back to the profile page
    // } catch (error) {
    //   console.error('Error saving user data:', error);
    // }
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <View style={styles.edit_profile_pict_container}>
            <View style={{alignItems: 'center'}}>
              <Image 
                source={require('./images/logoFix.png')}
                style = {styles.profile_pict}/>
            </View>
            <TouchableOpacity
            style={[styles.upload_button]}
            activeOpacity={0.7}
            onPress={handleUploadImage}>
              <MaterialCommunityIcons name='image-plus' size={30} color={'#FA751C'} />
          </TouchableOpacity>
          </View>
          <View style={styles.form_container}>
            <Text style={styles.input_title}>First Name</Text>
           <TextInput
              style={styles.input}
              placeholder="First Name"
              value={userData.firstName}
              onChangeText={(text) => setUserData({ ...userData, firstName: text })}
            />
            <Text style={styles.input_title}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={userData.lastName}
              onChangeText={(text) => setUserData({ ...userData, lastName: text })}
            />
            <Text style={styles.input_title}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
            />
            <Text style={styles.input_title}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={userData.phoneNumber}
              onChangeText={(text) => setUserData({ ...userData, phoneNumber: text })}
            />
            <Text style={styles.input_title}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={userData.address}
              onChangeText={(text) => setUserData({ ...userData, password: text })}
            />
            <Text style={styles.input_title}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChangeText={(text) => setUserData({ ...userData, confirmPassword: text })}
            />
          </View>
          <View style={{display: 'flex', alignItems: 'center', marginBottom: 10}}>
            <CustomButton
                  disabled={false}
                  title="Cancel Edit"
                  buttonStyle={styles.button}
                  textStyle={styles.buttonText}
                  onPress={handleCancelEdit}
              />
            <CustomButton
                disabled={false}
                title="Save Changes"
                buttonStyle={styles.button}
                textStyle={styles.buttonText}
                onPress={handleSave}
            />
          </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  edit_profile_pict_container:{
    marginVertical: 20,
    marginTop: 45,
    alignItems: 'center',
    position: 'relative',
  },
  profile_pict: {
    width: 160,
    height: 160,
  },
  upload_button:{
    position: 'absolute',
    right: 150,
    bottom: 0,
    backgroundColor: '#F2F2F2',
    padding: 5,
    borderRadius: 10
  },
 form_container: {
    padding: 20,
  },
  input_title:{
    color: 'black',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ed9121',
    borderRadius: 22,
    paddingLeft: 17,
    padding: 13,
    marginVertical: 10
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  }
});

export default EditProfilePage;
