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
    KeyboardAvoidingView
  } from 'react-native';

  import CheckBox from '@react-native-community/checkbox';
  
  import Icon from 'react-native-vector-icons/Feather';
  import CustomButton from '../assets/properties/CustomButton';

const RegisterPage =  ({navigation} : any) => {

  // hidden and shown password

  const [showPassword, setShowPassword] = useState(false);
  const [iconName, setIconName] = useState('eye');

  const  toggleShowPassword = ()=>{
      setShowPassword(!showPassword);
      setIconName(iconName === 'eye' ? 'eye-off' : 'eye');
  };

  // for phone number
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberChange = (text: any) => {
    const formattedPhoneNumber = text.replace(/[^0-9]/g, '');
    setPhoneNumber(formattedPhoneNumber);
  };  

  // handle submit  
  const [isSelected, setSelection] = useState(false);
  const handleSubmit = () =>{
    navigation.navigate("Index");
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
          />
          <TextInput
            style={styles.form}
            placeholder='Last Name'
          />
          <TextInput
            style={styles.form}
            placeholder='Email Address'
          />
          <SafeAreaView>
            <TextInput
              style={styles.form}
              placeholder='Choose Password'
              secureTextEntry = {!showPassword}
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
            />
            <TouchableOpacity
              style={styles.eye_button}
              activeOpacity={0.7}
              onPress = {toggleShowPassword}>
                <Icon name={iconName} size={27} color="grey"/>
            </TouchableOpacity>
          </SafeAreaView>
          <TextInput
            value={phoneNumber}
            keyboardType='numeric'
            style={styles.form}
            placeholder='Phone Number'
            onChangeText={handlePhoneNumberChange}
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
            disabled={!isSelected}
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