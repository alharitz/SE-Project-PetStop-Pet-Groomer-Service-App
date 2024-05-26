import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesomeIcon6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomePage = ({ navigation }: any) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth().currentUser;
      if (user) {
        const uid = user.uid;
        try {
          const userDoc = await firestore().collection('user').doc(uid).get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      } else {
        console.log('No user is logged in');
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.page}>
      <TouchableOpacity
        style={[styles.header, styles.elevation]}
        activeOpacity={0.7}
        onPress={() => {navigation.navigate('Profile')}}>
        <View>
          <Text style={styles.title}>Hello,{'\n'} {userData.first_name} </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.body}>
        <View style={styles.feature_container}>
          <TouchableOpacity
            style={[styles.feature_button, styles.elevation]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PetGroomer')}>
            <View style={styles.feature_content}>
              <FontAwesomeIcon6 style={styles.feature_icon} name='cat' size={50} color={'white'} />
              <Text style={styles.feature_text}>Pet Groomer</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feature_button, styles.elevation]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PetHotel')}>
            <View style={[styles.feature_content, { marginTop: 10 }]}>
              <FontAwesomeIcon6 style={styles.feature_icon} name='hotel' size={40} color={'white'} />
              <Text style={styles.feature_text}>Pet Hotel</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.feature_container}>
          <TouchableOpacity
            style={[styles.feature_button, styles.elevation]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PetDoctor')}>
            <View style={styles.feature_content}>
              <FontAwesomeIcon6 style={styles.feature_icon} name='user-doctor' size={50} color={'white'} />
              <Text style={styles.feature_text}>Pet Doctor</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.feature_button, styles.elevation]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PetForum')}>
            <View style={styles.feature_content}>
              <MaterialCommunityIcons style={styles.feature_icon} name='forum' size={50} color={'white'} />
              <Text style={styles.feature_text}>Pet Forum</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
    maxWidth: 1080,
    maxHeight: 2040,
  },

  header: {
    backgroundColor: 'white',
    marginTop: 50,
    marginHorizontal: 40,
    shadowColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
  },

  elevation: {
    elevation: 15
  },

  title: {
    fontSize: 25,
    color: 'black',
    fontWeight: '700',
  },

  body: {
    marginHorizontal: 40,
    flexDirection: 'column',
  },

  feature_container: {
    marginTop: 27,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  feature_button: {
    width: 150,
    height: 150,
    backgroundColor: '#FFA600',
    borderRadius: 25,
  },

  feature_content: {
    alignItems: 'center'
  },

  feature_icon: {
    marginTop: 35,
  },

  feature_text: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '700',
    color: 'white'
  },
});

export default HomePage;
