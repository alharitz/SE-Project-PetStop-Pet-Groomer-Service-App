import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const PetGroomer = () => {
    const [confirmStatus, setConfirmStatus] = useState(false);
    const [onProgressStatus, setOnProgressStatus] = useState(false);
    const [completedStatus, setCompletedStatus] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    

    useEffect(() => {
      fetchUserTransaction();
    }, []);

    const fetchUserTransaction = async () => {
        const user = auth().currentUser;
        const uid = user?.uid;

        try {
            const docSnapshot = await firestore().collection('petGroomerTransaction').doc('transactionStatus').get();
            if (docSnapshot.exists) {
                const data = docSnapshot.data();

                // Fetch unConfirm
                if (data?.unConfirm && Array.isArray(data?.unConfirm)) {
                    const unconfirmIds = data.unConfirm;
                    const filteredUnconfirmIds = unconfirmIds.filter(id => id.includes(uid));

                    if (filteredUnconfirmIds.length > 0) {
                        setConfirmStatus(true);
                        setTransactionId(filteredUnconfirmIds[0]); // Ambil ID pertama yang cocok
                    } else {
                        setConfirmStatus(false);
                    }
                } else {
                    setConfirmStatus(false);
                }

                // Fetch onProgress
                if (data?.onProgress && Array.isArray(data?.onProgress)) {
                    const onProgressIds = data.onProgress;
                    const filteredOnProgressIds = onProgressIds.filter(id => id.includes(uid));

                    if (filteredOnProgressIds.length > 0) {
                        setOnProgressStatus(true);
                        // Lakukan sesuatu dengan data on progress jika diperlukan
                    } else {
                        setOnProgressStatus(false);
                    }
                } else {
                    setOnProgressStatus(false);
                }

                // Fetch completed
                if (data?.completed && Array.isArray(data?.completed)) {
                    const completedIds = data.completed;
                    const filteredCompletedIds = completedIds.filter(id => id.includes(uid));

                    if (filteredCompletedIds.length > 0) {
                        setCompletedStatus(true);
                        // Lakukan sesuatu dengan data completed jika diperlukan
                    } else {
                        setCompletedStatus(false);
                    }
                } else {
                    setCompletedStatus(false);
                }
            } else {
                console.log('Document not found');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Tentukan ikon dan warnanya berdasarkan status
    let unConfirmIcon = 'checkbox-blank-circle-outline';
    if (confirmStatus) {
        unConfirmIcon = 'check-circle';
    }

    let onProgressIcon = 'circle-slice-5';
    if (!onProgressStatus) {
        onProgressIcon = 'circle-outline';
    }

    let completedIcon = 'checkbox-blank-circle-outline';
    if (completedStatus) {
        completedIcon = 'check-circle';
    }

    return (
        <ScrollView contentContainerStyle={styles.page}>
          <View>
          </View>
            <View style={styles.containerAll}>
                <View style={{ justifyContent: 'space-between', height: '101.5%' }}>
                    <MaterialCommunityIcon name={unConfirmIcon} size={40} color={confirmStatus ? '#FA751C' : 'grey'} style={styles.icon} />
                    <MaterialCommunityIcon name={onProgressIcon} size={40} color={onProgressStatus ? '#FA751C' : 'grey'} style={styles.icon} />
                    <MaterialCommunityIcon name={completedIcon} size={40} color={completedStatus ? '#FA751C' : 'grey'} style={styles.icon} />
                </View>
                <View style={{ justifyContent: 'space-between', height: '96.5%' }}>
                    <Text style={styles.text}>Waiting for Groomer{"\n"}Confirmation</Text>
                    <Text style={styles.text}>On Progress</Text>
                    <Text style={styles.text}>Completed</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const PetDoctor = () => (
    <ScrollView contentContainerStyle={styles.page}>
        {/* Content for Pet Doctor tab */}
    </ScrollView>
);

const PetHotel = () => (
    <ScrollView contentContainerStyle={styles.page}>
        {/* Content for Pet Hotel tab */}
    </ScrollView>
);

const Tab = createMaterialTopTabNavigator();

const ProgressPage = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
                tabBarStyle: { height: 60 },
                tabBarIndicatorStyle: { backgroundColor: '#FA751C' },
            }}
        >
            <Tab.Screen name='Pet Groomer' component={PetGroomer} />
            <Tab.Screen name='Pet Doctor' component={PetDoctor} />
            <Tab.Screen name='Pet Hotel' component={PetHotel} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'center'
    },
    containerAll: {
        height: '40%',
        flexDirection: 'row',
        marginTop: 50,
        justifyContent: 'space-between',
        width: '60%'
    },
    text: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
    },
    icon: {
    },
});

export default ProgressPage;
