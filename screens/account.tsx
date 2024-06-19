import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomButton from '../assets/properties/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Account = ({ navigation }: any) => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const user = auth().currentUser;
  const uid = user?.uid;

  useEffect(() => {
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
            address: data.address || '',
            password: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [uid]);

  useEffect(() => {
    const allFieldsFilled = Object.values(userData).every(field => field !== '');
    setIsSaveEnabled(allFieldsFilled);
  }, [userData]);

  const handleUploadImage = () => {
    // Handle image upload
  };

  const handleSave = async () => {
    try {
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

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.edit_profile_pict_container}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('./images/logoFix.png')}
              style={styles.profile_pict}
            />
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
            value={userData.first_name}
            onChangeText={(text) => handleInputChange('firstName', text)}
          />
          <Text style={styles.input_title}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={userData.last_name}
            onChangeText={(text) => handleInputChange('lastName', text)}
          />
          <Text style={styles.input_title}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={userData.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
          <Text style={styles.input_title}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="numeric"
            value={userData.phone_number}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
          />
          <Text style={styles.input_title}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={userData.address}
            onChangeText={(text) => handleInputChange('address', text)}
          />
          <Text style={styles.input_title}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={userData.password}
            onChangeText={(text) => handleInputChange('password', text)}
          />
          <Text style={styles.input_title}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={userData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
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
