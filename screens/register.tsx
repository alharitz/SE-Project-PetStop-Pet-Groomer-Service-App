import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../assets/properties/CustomButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RegisterPage = ({ navigation }:any) => {
  const [email, onChangeEmail] = useState('');
  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');
  const [password, onChangePassword] = useState('');
  const [confirmPassword, onChangePasswordConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [iconName, setIconName] = useState('eye');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSelected, setSelection] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setIconName(iconName === 'eye' ? 'eye-off' : 'eye');
  };

  const handlePhoneNumberChange = (text:string) => {
    const formattedPhoneNumber = text.replace(/[^0-9]/g, '');
    setPhoneNumber(formattedPhoneNumber);
  };

  const isFieldsFilled = () => {
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      isSelected
    );
  };

  const handleSubmit = async () => {
    try {
      if (password != confirmPassword) {
        setErrorMessage('Confirm Password not match!.');
        console.log('password error');
        return true;
      } else {
        const querySnapshot = await firestore()
          .collection('user')
          .where('email', '==', email)
          .get();

        if (!querySnapshot.empty) {
          setErrorMessage('Email Already Exist, please use a different email.');
        } else {
          try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const { uid } = userCredential.user;

            await firestore().collection('user').doc(uid).set({
              first_name: firstName,
              last_name: lastName,
              email,
              phone_number: phoneNumber,
            });

            navigation.navigate('Login');
          } catch (error) {
            if (error === 'auth/weak-password') {
              setErrorMessage('Password atleast 6 characters!');
            } else if (error=== 'auth/invalid-email') {
              setErrorMessage('Invalid email address!');
            } else {
              console.error(error);
              setErrorMessage('Error Saving Credential');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error handle submit: ', error);
      return;
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
      scrollEnabled={true}
      snapToEnd={true}
      keyboardShouldPersistTaps="handled"
    >
      <SafeAreaView style={styles.title_container}>
        <Text style={styles.title}>Let's Create Your Account</Text>
      </SafeAreaView>
      <View style={styles.form_container}>
        <TextInput
          style={styles.form}
          placeholder='First Name'
          onChangeText={onChangeFirstName}
          value={firstName}
        />
        <TextInput
          style={styles.form}
          placeholder='Last Name'
          onChangeText={onChangeLastName}
          value={lastName}
        />
        <TextInput
          style={styles.form}
          placeholder='Email Address'
          onChangeText={onChangeEmail}
          value={email}
        />
        <View>
          <TextInput
            style={styles.form}
            placeholder='Choose Password'
            secureTextEntry={!showPassword}
            onChangeText={onChangePassword}
            value={password}
          />
          <TouchableOpacity
            style={styles.eye_button}
            activeOpacity={0.7}
            onPress={toggleShowPassword}
          >
            <Icon name={iconName} size={27} color="grey" />
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            style={styles.form}
            placeholder='Confirm Password'
            secureTextEntry={!showPassword}
            onChangeText={onChangePasswordConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity
            style={styles.eye_button}
            activeOpacity={0.7}
            onPress={toggleShowPassword}
          >
            <Icon name={iconName} size={27} color="grey" />
          </TouchableOpacity>
        </View>
        <TextInput
          keyboardType='numeric'
          style={styles.form}
          placeholder='Phone Number'
          onChangeText={handlePhoneNumberChange}
          value={phoneNumber}
        />
      </View>
      <View style={styles.check_box_container}>
        <Text style={{ color: 'black', fontSize: 14 }}>Accept Our Company</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={{ color: '#4169e1', fontSize: 14 }}> Terms and Conditions</Text>
        </TouchableOpacity>
        <CheckBox
          value={isSelected}
          onValueChange={() => setSelection(!isSelected)}
          tintColors={{ true: '#4630EB', false: undefined }}
        />
      </View>
      <View style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {errorMessage !== '' && (
          <Text style={{ color: 'red' }}>
            {errorMessage}
          </Text>
        )}
        <CustomButton
          title="Create Account"
          buttonStyle={{
            width: 300,
            height: 60,
            borderRadius: 40,
            marginTop: 20,
          }}
          textStyle={{
            color: 'white',
            fontSize: 22,
            fontWeight: '500',
          }}
          disabled={!isFieldsFilled()}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  title_container: {
    marginTop: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: 'black',
    textAlign: 'center',
  },
  form_container: {
    // empty for now
  },
  form: {
    fontSize: 16,
    borderWidth: 1.5,
    height: 60,
    width: 335,
    marginTop: 20,
    marginHorizontal: 37,
    borderRadius: 20,
    paddingRight: 60,
    paddingHorizontal: 20,
    borderColor: '#ed9121',
  },
  check_box_container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  eye_button: {
    position: 'absolute',
    right: 55,
    bottom: 15,
  },
});

export default RegisterPage;
