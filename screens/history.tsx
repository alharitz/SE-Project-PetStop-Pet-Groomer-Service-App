import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Tab = createMaterialTopTabNavigator();

const HistoryPage = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
                tabBarStyle: { height: 60 },
                tabBarIndicatorStyle: { backgroundColor: '#FA751C' },
            }}
        >
            <Tab.Screen name='Pet Groomer' component={PetGroomerScreen} />
            <Tab.Screen name='Pet Doctor' component={PetDoctorScreen} />
            <Tab.Screen name='Pet Hotel' component={PetHotelScreen} />
        </Tab.Navigator>
    );
};

const PetGroomerScreen = () => {
    const [completedTransactions, setCompletedTransactions] = useState<Data[]>([]);
    const [transactionDetail, setTransactionDetail] = useState<Data | null>(null);

    type Data = {
        id: string;
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
    }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchData = () => {
                fetchTransactionDetail();
                fetchUserTransaction();
            };

            fetchData();
            const interval = setInterval(fetchData, 5000);

            return () => clearInterval(interval);
        }, [])
    );

    const fetchTransactionDetail = async () => {
        const user = auth().currentUser;
        const uid = user?.uid;

        if (!uid) return;

        try {
            const docSnapshot = await firestore().collection('petGroomerTransaction').doc(uid).get();
            if (docSnapshot.exists) {
                const data = docSnapshot.data() as Data;
                setTransactionDetail(data);
            } else {
                console.log('Transaction detail document not found');
                setTransactionDetail(null);
            }
        } catch (error) {
            console.error('Error fetching transaction detail:', error);
        }
    };

    const fetchUserTransaction = async () => {
        const user = auth().currentUser;
        const uid = user?.uid;

        if (!uid) return;

        try {
            const docSnapshot = await firestore().collection('petGroomerTransaction').doc('transactionStatus').get();
            if (docSnapshot.exists) {
                const data = docSnapshot.data();

                let completedTransactionsData: Data[] = [];

                // Fetch completed transactions
                if (data?.completed && Array.isArray(data?.completed)) {
                    const completedIds = data.completed;
                    const userCompletedIds = completedIds.filter(id => id.endsWith(uid));

                    const completedTransactionsPromises = userCompletedIds.map(id => 
                        firestore().collection('petGroomerTransaction').doc(id).get()
                    );

                    const completedTransactionsSnapshots = await Promise.all(completedTransactionsPromises);

                    completedTransactionsData = completedTransactionsSnapshots
                        .filter(doc => doc.exists)
                        .map(doc => ({ id: doc.id, ...doc.data() } as Data));
                }

                setCompletedTransactions(completedTransactionsData);
            } else {
                console.log('Transaction status document not found');
                setCompletedTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching user transactions:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.page}>
            {completedTransactions.length > 0 ? (
                completedTransactions.map((transaction, index) => (
                    <View key={index} style={styles.container}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{transaction.service}</Text>
                            <Text style={styles.subtitle}>
                                {transaction.transactionDateTime}
                            </Text>
                        </View>
                        <View style={styles.descContainer}>
                            <Text style={styles.desc}>{transaction.petType}</Text>
                            <Text style={styles.desc}>{transaction.address}</Text>
                        </View>
                        <View style={styles.indicatorContainer}>
                            <View style={{ alignItems: 'center' }}>
                                <MaterialCommunityIcon name='star-circle' size={30} color='#FA751C' />
                                <Text style={styles.label}>Complete</Text>
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.noData}>No completed transactions</Text>
            )}
        </ScrollView>
    );
};

const PetDoctorScreen = () => (
    <ScrollView contentContainerStyle={styles.page}>
        {/* Content for Pet Doctor tab */}
    </ScrollView>
);

const PetHotelScreen = () => (
    <ScrollView contentContainerStyle={styles.page}>
        {/* Content for Pet Hotel tab */}
    </ScrollView>
);

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'center',
    },
    container: {
        marginVertical: 20,
        borderWidth: 3,
        borderColor: '#FA751C',
        borderRadius: 30,
        padding: 20,
        width: '80%',
    },
    titleContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: 'black',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
    },
    descContainer: {
        marginBottom: 30,
    },
    desc: {
        fontSize: 16,
        color: '#343a40',
        fontWeight: '400',
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

export default HistoryPage;
