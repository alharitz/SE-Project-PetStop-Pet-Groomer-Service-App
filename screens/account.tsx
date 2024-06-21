import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View, Text, Image, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomButton from '../assets/properties/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';

const Account = ({ navigation }: any) => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const user = auth().currentUser;
  const uid = user?.uid;

  useEffect(() => {
    if(user){
      fetchProfilePicture(uid);
    }
    
    const fetchUserData = async () => {
      try { 
        const userDoc = await firestore().collection('user').doc(uid).get();
        const data = userDoc.data();
        if (data) {
          setUserData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone_number: data.phone_number || '',
            password: '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [uid]);

  const fetchProfilePicture = async (uid?: string | undefined) => {
    //fetching profile pic
    try{
      const url = await storage().ref(uid).getDownloadURL();
      if(url){
        setImageUri(url);
      }
    } catch (error){
      console.log('Error fetching profile picture');
    }
  }

  useEffect(() => {
    const allFieldsFilled = Object.values(userData).every(field => field !== '');
    setIsSaveEnabled(allFieldsFilled);
  }, [userData]);

  const pickImage = () => {
    //pick image from gallery
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        maxWidth: 300,
        maxHeight: 300,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePIcker Error: ', response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0]?.uri;
            if (uri) {
              setImageUri(uri);
            }
          }
        }
      }
    );
  };

  const handleSave = async () => {
    try {
      //upload image to storage
      if (imageUri == null){
        return;
      }
      const uploadUri = imageUri;
      const storageRef = storage().ref(uid);

      const uploadTask = storageRef.putFile(uploadUri);
  
      uploadTask.on('state_changed', (taskSnapshot) => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });
  
      uploadTask.then(() => {
        console.log('Image uploaded to the bucket!');
      }).catch((error) => {
        console.log('Image Upload Error', error);
      });
      
      //save data
      await firestore().collection('user').doc(uid).update(userData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phoneNumber' && !/^\d*$/.test(value)) {
      return;
    }
    setUserData(prevData => ({ ...prevData, [field]: value }));
  };

  const defaultImage = require('./images/logoFix.png');

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.edit_profile_pict_container}>
          <View style={{ alignItems: 'center' }}>
            <Image 
              source={imageUri ? { uri: imageUri } : defaultImage} 
              style={styles.profile_pict}
             />
          </View>
          <TouchableOpacity
            style={[styles.upload_button]}
            activeOpacity={0.7}
            onPress={pickImage}>
            <MaterialCommunityIcons name='image-plus' size={30} color={'#FA751C'} />
          </TouchableOpacity>
        </View>
        <View style={styles.form_container}>
          <Text style={styles.input_title}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={userData.first_name}
            onChangeText={(text: string) => handleInputChange('first_name', text)}
          />
          <Text style={styles.input_title}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={userData.last_name}
            onChangeText={(text: string) => handleInputChange('last_name', text)}
          />
          <Text style={styles.input_title}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={userData.email}
            onChangeText={(text: string) => handleInputChange('email', text)}
          />
          <Text style={styles.input_title}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="numeric"
            value={userData.phone_number}
            onChangeText={(text: string) => handleInputChange('phone_number', text)}
          />
          <Text style={styles.input_title}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={userData.password}
            onChangeText={(text: string) => handleInputChange('password', text)}
          />
        </View>
        <View style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <CustomButton
            disabled={!isSaveEnabled}
            title="Save Changes"
            buttonStyle={[styles.button, { backgroundColor: isSaveEnabled ? '#FA751C' : '#cccccc' }]}
            textStyle={styles.buttonText}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  edit_profile_pict_container: {
    marginVertical: 20,
    marginTop: 45,
    alignItems: 'center',
    position: 'relative',
  },
  profile_pict: {
    width: 160,
    height: 160,
    borderRadius: 100,
  },
  upload_button: {
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
  input_title: {
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

export default Account;
