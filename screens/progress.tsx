import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const PetGroomer = () => {
    const [confirmStatus, setConfirmStatus] = useState(false);
    const [onProgressStatus, setOnProgressStatus] = useState(false);
    const [completedStatus, setCompletedStatus] = useState(false);
    const [transactionDetail, setTransactionDetail] = useState<Data[]>([]);

    type Data = {
        Uid: string;
        address: string;
        deliveryOption: string;
        notes?: string;
        petType: string;
        service: string;
        transactionDateTime: string;
        transactionProof: string;
    };

    useEffect(() => {
        fetchTransactionDetail();
        fetchUserTransaction();
        fetchTransactionIds();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchData = () => {
                fetchTransactionDetail();
                fetchUserTransaction();
                fetchTransactionIds();
            };

            fetchData();
            const interval = setInterval(fetchData, 5000);

            return () => clearInterval(interval);
        }, [])
    );

    const fetchTransactionIds = async () => {
        const user = auth().currentUser;
        const uid = user?.uid;
    
        if (!uid) return;
    
        try {
            const userDoc = await firestore().collection('user').doc(uid).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                const transactionId = data?.transactionId;
                return transactionId;
            } else {
                console.log('Document not found');
            }
        } catch (error) {
            console.error('Error fetching transaction ID:', error);
        }
    };

    const fetchTransactionDetail = async () => {
        const user = auth().currentUser;
        const uid = user?.uid;

        if (!uid) return;

        try {
            const transactionId = await fetchTransactionIds();
            const docSnapshot = await firestore().collection('petGroomerTransaction').doc(transactionId).get();
            if (docSnapshot.exists) {
                const data = docSnapshot.data() as Data;
                setTransactionDetail([data]);
            } else {
                console.log('Document not found');
            }
        } catch (error) {
            console.error('Error fetching transaction detail:', error);
        }
    };

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
                    
                    setConfirmStatus(filteredUnconfirmIds.length > 0);
                } else {
                    setConfirmStatus(false);
                }

                // Fetch onProgress
                if (data?.onProgress && Array.isArray(data?.onProgress)) {
                    const onProgressIds = data.onProgress;
                    const filteredOnProgressIds = onProgressIds.filter(id => id.endsWith(uid));

                    setOnProgressStatus(filteredOnProgressIds.length > 0);
                } else {
                    setOnProgressStatus(false);
                }

                // Fetch completed
                if (data?.completed && Array.isArray(data?.completed)) {
                    const completedIds = data.completed;
                    const filteredCompletedIds = completedIds.filter(id => id.endsWith(uid));

                    setCompletedStatus(filteredCompletedIds.length > 0);
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
            {confirmStatus ? (
                transactionDetail.map((detail, index) => (
                    <View key={index} style={styles.container}>
                        <View>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{detail.service}</Text>
                                <Text style={styles.subtitle}>{detail.transactionDateTime}</Text>
                            </View>
                            <View style={styles.descContainer}>
                                <Text style={styles.desc}>{detail.petType}</Text>
                                <Text style={styles.desc}>{detail.address}</Text>
                                {detail.notes && <Text style={styles.desc}>{detail.notes}</Text>}
                            </View>
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
                ))
            ) : (
                <Text style={styles.noData}>No transactions</Text>
            )}
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
        fontWeight: '400',
        marginVertical: 10,
    },
    label: {
        fontWeight: '800',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    noData: {
        fontSize: 18,
        fontWeight: '700',
        color: 'grey',
        marginTop: 50,
    },
});

export default ProgressPage;
