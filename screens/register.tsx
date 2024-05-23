//  NOTES

import React,{
    useState
  } from 'react';
  import {
    View,
    TextInput,
    Text, 
    StyleSheet,
    Alert,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
  } from 'react-native';  
  
  import CheckBox from '@react-native-community/checkbox';
  import firestore from '@react-native-firebase/firestore';
  
  // Icon
  import Icon from 'react-native-vector-icons/Feather';
  import CustomButton from '../assets/properties/CustomButton';

  // byrcrypt
  const bycrypt = require('bcryptjs');

const RegisterPage =  ({navigation} : any) => {
  // VARIABLES
  //email
  const [email, onChangeEmail] = useState('');

  //name
  const [firstName, onChangeFirstName] = useState('');
  const [lastName, onChangeLastName] = useState('');

// password
  const [password, onChangePassword] = useState('');

  // confirm password
  const [confirmPassword, onChangePasswordConfirmPassword] = useState('');

  //password show or hide
  const [showPassword, setShowPassword] = useState(false);
  const [iconName, setIconName] = useState('eye');

  // hidden and shown password
  const toggleShowPassword = ()=>{
      setShowPassword(!showPassword);
      setIconName(iconName === 'eye' ? 'eye-off' : 'eye');
  };

  // for phone number
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberChange = (text: any) => {
    const formattedPhoneNumber = text.replace(/[^0-9]/g, '');
    setPhoneNumber(formattedPhoneNumber);
  }; 

  // Checking all the fields are filled
  const isFieldsFilled = () =>{
    return firstName.trim() !== '' && 
       lastName.trim() !== '' && 
       email.trim() !== '' && 
       password.trim() !== '' && 
       confirmPassword.trim() !== '' && 
       phoneNumber.trim() !== '' &&
       isSelected;
  }

  // Terms and condition check
  const [isSelected, setSelection] = useState(false);

  // Saving User data
  const saveUserData = async() =>{
    try {
      const salt = await bycrypt.genSalt(10);
      const hashedPassword = await bycrypt.hash(password, salt);

      firestore()
      .collection('user')
      .doc(email)
      .set({
        email_address: email,
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        phone_number: phoneNumber
      });
    return;
    } catch (error) {
      console.error("Error saving user credential: ", error);
    }
  }

  // check repeat password match
  const checkRepeatPassword = () =>{
    if(password != confirmPassword){
      setErrorMessage("Confirm Password not match!.");
      console.log("password error");
      return;
    }else{
      setErrorMessage('');
      return;
    }
  }

  // check email
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async() =>{

    checkRepeatPassword();
    // try {
      const querySnapshot = await firestore()
      .collection('user')
      .doc(email)
      .get();

      if(querySnapshot.exists){
        setErrorMessage("Email Already Exist, please use a different email.");
      }else{
        saveUserData();
        setErrorMessage('');
      }
      return;
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    //   throw error;
    // }
  };

  return(
    <KeyboardAvoidingView style={styles.page} behavior="padding">
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.title_container}>
          <Text style={styles.title}>Let's Create Your Account</Text>
        </SafeAreaView>
        <View style={styles.form_container}>
          <TextInput
            style={styles.form}
            placeholder='Firts Name'
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
          <SafeAreaView>
            <TextInput
              style={styles.form}
              placeholder='Choose Password'
              secureTextEntry = {!showPassword}
              onChangeText={onChangePassword}
              value={password}
            />
            <TouchableOpacity
              style={styles.eye_button}
              activeOpacity={0.7}
              onPress = {toggleShowPassword}>
                <Icon name={iconName} size={27} color="grey"/>
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView>
            <TextInput
              style={styles.form}
              placeholder='Confirm Password'
              secureTextEntry = {!showPassword}
              onChangeText={onChangePasswordConfirmPassword}
              value={confirmPassword}
            />
            <TouchableOpacity
              style={styles.eye_button}
              activeOpacity={0.7}
              onPress = {toggleShowPassword}>
                <Icon name={iconName} size={27} color="grey"/>
            </TouchableOpacity>
          </SafeAreaView>
          <TextInput
            keyboardType='numeric'
            style={styles.form}
            placeholder='Phone Number'
            onChangeText={handlePhoneNumberChange}
            value={phoneNumber}
          />
        </View>
        <View style={styles.check_box_container}>
          <Text style={{color: 'black', fontSize: 14}}>Accept Our Company</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            // onPress={()=> }
            >
            <Text style={{color: '#4169e1', fontSize: 14}}> Terms and Conditons</Text>
          </TouchableOpacity>
          <CheckBox
            value={isSelected}
            onValueChange={() => setSelection(!isSelected)}
            tintColors={{ true: '#4630EB', false: undefined }}/>
        </View>
        <View>
          {errorMessage !== '' && (
            <Text style={{color: 'red'}}>
              {errorMessage}
            </Text>
          )}
          <CustomButton
            title="Create Account"
            buttonStyle={{
              width: 300,
              height: 60,
              borderRadius: 20,
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const  styles = StyleSheet.create({

  page: {
    backgroundColor: '#FFFFFF', 
    flex: 1
  },

  container:{
    flexDirection:"column",
    alignItems: "center",
  },

  title_container :{
    marginTop: 50,
    marginBottom: 10
  },

  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "black"
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
    borderColor: "#ed9121",
  },

  check_box_container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },

  eye_button: {
    position: "absolute",
    right: 55,
    bottom: 15,
  },

});

export default RegisterPage;