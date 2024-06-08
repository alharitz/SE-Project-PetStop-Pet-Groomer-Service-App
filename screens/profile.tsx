import React, { useEffect, useState } from 'react';
import {
  View,
  Text, 
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomButton from '../assets/properties/CustomButton';
import CustomProfileButton from '../assets/properties/CustomProfileButton';
import LoadingPage from './loading';

const ProfilePage = ({ navigation }:any) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData) {
            setUserName(userData.first_name + " " + userData.last_name);
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
  };

  // Handle LogOut
  const handleLogOut = async () => {
    try {
      await auth().signOut(); // Sign out
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error); // handle error
    }
  };

  if (loading) {
    return (
      <LoadingPage/>
    );
  }

  return (
    <ScrollView contentContainerStyle={style.page}>
      <View style={{ alignItems: 'center', marginHorizontal: 20 }}>
        <View style={[style.profile_name_pict_container, style.elevation]}>
          <Image 
            source={require('./images/logoFix.png')}
            style={style.profile_pict} 
          />
          <Text style={style.tittle}>{userName}</Text>
        </View>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <CustomProfileButton title={'Account'} icon={'account-outline'} onPress={() => { navigation.navigate('Account') }} />
        <CustomProfileButton title={'Address'} icon={'home-outline'} onPress={() => { }} />
        <CustomProfileButton title={'Notification'} icon={'bell-outline'} onPress={() => { }} />
        <CustomProfileButton title={'History'} icon={'history'} onPress={() => { }} />
        <CustomProfileButton title={'Contact Us'} icon={'phone'} onPress={() => { }} />
      </View>
      <View style={style.logoutButtonContainer}>
        <CustomButton
          title="Log Out"
          buttonStyle={style.logoutButton}
          textStyle={style.logoutButtonText}
          disabled={false}
          onPress={handleLogOut}
        />
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  page: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    justifyContent: 'space-between',
  },
  profile_name_pict_container: {
    width: '100%',
    height: 210,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  profile_pict: {
    width: 100,
    height: 100,
  },
  tittle: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: '700',
    color: '#495057',
  },
  logoutButtonContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  logoutButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FA751C',
    width: 300,
    height: 50,
    borderRadius: 30,
  },
  logoutButtonText: {
    color: '#FA751C',
    fontSize: 16,
    fontWeight: '600',
  },
  elevation: {
    elevation: 5,
  }
});

export default ProfilePage;
