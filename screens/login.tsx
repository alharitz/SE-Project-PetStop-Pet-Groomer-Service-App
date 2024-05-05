import React,{
  useState
} from 'react';
import {
  TextInput,
  Text, 
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import CustomButton from '../assets/properties/CustomButton';

const LoginPage = ({navigation}: any) => {

  const handleLoginButtonPress = () =>{
    // console.log("Login Button Clicked");
    // Alert.alert("Button Clicked", "You Clicked the Button");
    navigation.navigate("Home");
  };

  const handleRegisterButtonPress = () => {
     navigation.navigate("Register");
  };

  const [showPassword, setShowPassword] = useState(false);
  const [iconName, setIconName] = useState('eye');

  const  toggleShowPassword = ()=>{
      setShowPassword(!showPassword);
      setIconName(iconName === 'eye' ? 'eye-off' : 'eye');
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior='padding'>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
        <Text style={styles.title}>
          Hello,{'\n'}Welcome Back!
        </Text>
        <Text style={styles.text}>
          Water is life. Water is a basic human need in various lines of life, humans need water
        </Text>
        <TextInput
          style={styles.form}
          placeholder="youremail@mail.com" />
        <SafeAreaView style={styles.password_form_container}>
          <TextInput
            style={styles.form}
            placeholder="Password"
            secureTextEntry = {!showPassword}
          />
            <TouchableOpacity  
              style={styles.eye_button}
              activeOpacity={0.7}
              onPress = {toggleShowPassword}>
              <Icon name={iconName} size={27} color="grey"/>
          </TouchableOpacity>
        </SafeAreaView>
        <CustomButton 
          disabled={false}
          title="Login"
          buttonStyle={{
            marginTop: 45,
            width: 300,
            height: 60,
            borderRadius: 20,
          }}
          textStyle={{
            color: 'white',
            fontSize: 22,
            fontWeight: '500',
          }}
          onPress = {handleLoginButtonPress}
        />
        <SafeAreaView style={{flexDirection:'row', marginTop: 40}} >
          <Text style={{fontSize: 16, color: 'black'}}>
              Don't have an account yet?,
          </Text>
          <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleRegisterButtonPress}>
              <Text style={{fontWeight:'bold',fontSize: 16, color: '#ed9121'}}> Register here
                 </Text>
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
