// NOTES
// 1. adding some response when user typing
// 2. making sure all the fields are filled
// 3. adding hook to the backend
// 4. adding token for async storage

import React,{
  useId,
  useState
} from 'react';
import {
  TextInput,
  Text, 
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import  firestore  from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../assets/properties/CustomButton';
import LoadingPage from './loading';

// BACK END
const LoginPage = ({navigation}: any) => {
// set error message
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  // Variables
  // Email
  const [email, onChangeEmail] = useState('');

  // password
  const [password, onChangePassword] = useState('');

  // Checking all the fields are filled
  const isFieldsFilled = () =>{
    return email.trim() !== '' && 
       password.trim() !== '';
  }

  // handle login button
  const handleLoginButtonPress = async() =>{
    try{
      await auth().signInWithEmailAndPassword(email, password);
      setMessage("Login Successful");
      navigation.reset({
        index: 0,
        routes: [{ name: 'Index' }],
      });
    } catch (error:any) {
      // console.error(error);
      if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Email or password incorrect!');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Incorrect email format');
      } else {
        setErrorMessage("Login Error");
        // console.error("Login error:", error);
     }
    }
  };

  // handle register password
  const handleRegisterButtonPress = () => {
     navigation.navigate("Register");
  };

  // show or hide password
  const [showPassword, setShowPassword] = useState(false);
  const [iconName, setIconName] = useState('eye');

  const  toggleShowPassword = ()=>{
      setShowPassword(!showPassword);
      setIconName(iconName === 'eye' ? 'eye-off' : 'eye');
  };

  // handle forget password
  const handleForgetPassword = ()=>{

  }

  // FRONT END
  return (
    <KeyboardAvoidingView style={styles.page} behavior='padding'>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <Text style={styles.title}>
          Hello,{'\n'}Welcome Back!
        </Text>
        <Text style={styles.text}>
          Water is life. Water is a basic human need in various lines of life, humans need water
        </Text>
        {message ? <Text testID="messageText">{message}</Text> : null}
        <TextInput
          style={styles.form}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="youremail@mail.com"
          testID="emailInput"
         />
        <SafeAreaView style={styles.password_form_container}>
          <TextInput
            style={styles.form}
            placeholder="Password"
            secureTextEntry = {!showPassword}
            onChangeText={onChangePassword}
            testID="passwordInput"
            value={password}
          />
            <TouchableOpacity  
              style={styles.eye_button}
              activeOpacity={0.7}
              onPress = {toggleShowPassword}>
              <Icon name={iconName} size={27} color="grey"/>
          </TouchableOpacity>
        </SafeAreaView>
        <View style={{position: 'relative', marginTop: 30,}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleForgetPassword}>
            <Text style={{fontWeight:'bold',fontSize: 16, color: '#ed9121'}}>Forget Password</Text>
          </TouchableOpacity>
        </View>
        <View> 
          {errorMessage !== '' && (
            <Text style={{color: 'red', marginTop:20}}>
              {errorMessage}
            </Text>
          )}
        </View>
        <CustomButton 
          title="Login"
          buttonStyle={{
            marginTop: 30,
            width: 300,
            height: 60,
            borderRadius: 50,
          }}
          textStyle={{
            color: 'white',
            fontSize: 22,
            fontWeight: '500',
          }}
          disabled={!isFieldsFilled()}
          onPress = {handleLoginButtonPress}
          testID="Login"
        />
        <SafeAreaView style={{flexDirection:'row', marginTop: 30}} >
          <Text style={{fontSize: 16, color: 'black'}}>
              Don't have an account yet?,
          </Text>
          <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleRegisterButtonPress}>
              <Text style={{fontWeight:'bold',fontSize: 16, color: '#ed9121'}}> Register here</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    marginTop: 80,
    alignItems: "center",
  },

  title: {
    fontSize: 45,
    fontWeight: "800",
    color: "black"
  },

  text: {
    width: 335,
    marginTop: 40,
    marginBottom: 30,
    fontSize: 16,
    color: "grey",
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
    borderColor: "#ed9121",
  },

  password_form_container: {
    flexDirection: 'row',
    alignItems: "center",
  },

  eye_button:{
    position: "absolute",
    right: 55,
    bottom: 15,
  },
});

export default LoginPage;
