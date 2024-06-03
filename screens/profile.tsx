import React,{
  useEffect,
    useState
  } from 'react';
  import {
    View,
    Text, 
    StyleSheet,
    ScrollView,
    Image,
  } from 'react-native';

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import CustomButton from '../assets/properties/CustomButton';
import CustomTextBox from '../assets/properties/CustomTextBox';

const ProfilePage = ({navigation}:any) =>{
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [Address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth().currentUser;
    if (user) {
      const uid = user.uid;
      try {
        const userDoc = await firestore()
          .collection('user')
          .doc(uid)
          .get();

        if (userDoc.exists){
          const userData = userDoc.data();
          if(userData){
            setUserName(userData.first_name + " " + userData.last_name);
            setFirstName(userData.first_name);
            setLastName(userData.last_name);
            setEmailAddress(userData.email);
            setPhoneNumber(userData.phone_number);
          } else {
            console.log('Data does not exist!');
          }
        } else {
          console.log('Document does not exist!');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    } else {
      console.log('No user is logged in');
    }
    setLoading(false);
  }
  
  // Handle LogOut
  const handleLogOut = async ()=>{
    try {
      await auth().signOut(); // Sign out
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error); // handle error
    }
  }

  // Handle Edit Profile
  const handleEditProfile = ()=>{
    navigation.navigate('Edit Profile');
  }

    return(
      <ScrollView>
        <View style={style.profile_name_pict_container}>
          <Image 
          source={require('./images/logoFix.png')}
          style = {style.profile_pict}/>
          <Text style={style.tittle}>{userName}</Text>
        </View>
        <View style={{marginLeft: 10}}>
          <CustomTextBox 
          title="First Name" 
          text={firstName} // << insert variables here
          />
          <CustomTextBox 
          title="Last Name" 
          text={lastName} // << insert variables here
          />
          <CustomTextBox 
          title="Email Address" 
          text={emailAddress} // << insert variables here
          />
          <CustomTextBox 
          title="Phone Number" 
          text={phoneNumber} // << insert variables here
          />
          <CustomTextBox 
          title="Address"  //insert address jgn lupa
          text="st. lorem ipsum dolor sit amet" // << insert variables here
          />
    
        </View>
        <View style={{alignItems: 'center'}}>
          <CustomButton
            title="Edit Profile"
            buttonStyle={{
              width: 300,
              height: 50,
              borderRadius: 20,
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
              borderRadius: 20,
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
    color: '#495057'
  },
  
})

export default ProfilePage;