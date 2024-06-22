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
                    const filteredUnconfirmIds = unconfirmIds.filter(id => id.endsWith(uid));

                    if (filteredUnconfirmIds.length > 0) {
                        setConfirmStatus(true);
                    } else {
                        setConfirmStatus(false);
                    }
                } else {
                    setConfirmStatus(false);
                }

                // Fetch onProgress
                if (data?.onProgress && Array.isArray(data?.onProgress)) {
                    const onProgressIds = data.onProgress;
                    const filteredOnProgressIds = onProgressIds.filter(id => id.endsWith(uid));

                    if (filteredOnProgressIds.length > 0) {
                        setOnProgressStatus(true);
                    } else {
                        setOnProgressStatus(false);
                    }
                } else {
                    setOnProgressStatus(false);
                }

                // Fetch completed
                if (data?.completed && Array.isArray(data?.completed)) {
                    const completedIds = data.completed;
                    const filteredCompletedIds = completedIds.filter(id => id.endsWith(uid));

                    if (filteredCompletedIds.length > 0) {
                        setCompletedStatus(true);
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

    const confirmIconColor = confirmStatus ? '#FA751C' : 'grey';
    const onProgressIconColor = onProgressStatus ? '#FA751C' : 'grey';
    const completedIconColor = completedStatus ? '#FA751C' : 'grey';

    return (
        <ScrollView contentContainerStyle={styles.page}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Service Name</Text>
                    <Text style={styles.subtitle}>21/06/2024</Text>
                </View>
                <View style={styles.descContainer}>
                    <Text style={styles.desc}>Dog</Text>
                    <Text style={styles.desc}>st. lorem ipsum, dolor sit, amet</Text>
                </View>
                <View style={styles.indicatorContainer}>
                    <View style={{ alignItems: 'center' }}>
                        <MaterialCommunityIcon name='check-circle' size={30} color={confirmIconColor} />
                        <Text style={styles.label}>Confirm</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <MaterialCommunityIcon name='circle-slice-5' size={30} color={onProgressIconColor} />
                        <Text style={styles.label}>On Progress</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <MaterialCommunityIcon name='star-circle' size={30} color={completedIconColor} />
                        <Text style={styles.label}>Complete</Text>
                    </View>
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

    container: {
        marginVertical: 50,
        borderWidth: 3,
        borderColor: '#FA751C',
        borderRadius: 30,
        padding: 20,
        width: '80%'
    },
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: 'black'
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'black'
    },
    descContainer: {
        marginBottom: 30,
    },
    desc: {
        fontSize: 16,
        color: '#343a40',
        fontWeight: '400'
    },
    label: {
        fontWeight: '800'
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    }

});

export default ProgressPage;

// const [confirmStatus, setConfirmStatus] = useState(false);
    // const [onProgressStatus, setOnProgressStatus] = useState(false);
    // const [completedStatus, setCompletedStatus] = useState(false);
    // const [transactionId, setTransactionId] = useState('');

    

    // useEffect(() => {
    //   fetchUserTransaction();
    // }, []);

    // const fetchUserTransaction = async () => {
    //     const user = auth().currentUser;
    //     const uid = user?.uid;

    //     try {
    //         const docSnapshot = await firestore().collection('petGroomerTransaction').doc('transactionStatus').get();
    //         if (docSnapshot.exists) {
    //             const data = docSnapshot.data();

    //             // Fetch unConfirm
    //             if (data?.unConfirm && Array.isArray(data?.unConfirm)) {
    //                 const unconfirmIds = data.unConfirm;
    //                 const filteredUnconfirmIds = unconfirmIds.filter(id => id.includes(uid));

    //                 if (filteredUnconfirmIds.length > 0) {
    //                     setConfirmStatus(true);
    //                     setTransactionId(filteredUnconfirmIds[0]); // Ambil ID pertama yang cocok
    //                 } else {
    //                     setConfirmStatus(false);
    //                 }
    //             } else {
    //                 setConfirmStatus(false);
    //             }

    //             // Fetch onProgress
    //             if (data?.onProgress && Array.isArray(data?.onProgress)) {
    //                 const onProgressIds = data.onProgress;
    //                 const filteredOnProgressIds = onProgressIds.filter(id => id.includes(uid));

    //                 if (filteredOnProgressIds.length > 0) {
    //                     setOnProgressStatus(true);
    //                     // Lakukan sesuatu dengan data on progress jika diperlukan
    //                 } else {
    //                     setOnProgressStatus(false);
    //                 }
    //             } else {
    //                 setOnProgressStatus(false);
    //             }

    //             // Fetch completed
    //             if (data?.completed && Array.isArray(data?.completed)) {
    //                 const completedIds = data.completed;
    //                 const filteredCompletedIds = completedIds.filter(id => id.includes(uid));

    //                 if (filteredCompletedIds.length > 0) {
    //                     setCompletedStatus(true);
    //                     // Lakukan sesuatu dengan data completed jika diperlukan
    //                 } else {
    //                     setCompletedStatus(false);
    //                 }
    //             } else {
    //                 setCompletedStatus(false);
    //             }
    //         } else {
    //             console.log('Document not found');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    // // Tentukan ikon dan warnanya berdasarkan status