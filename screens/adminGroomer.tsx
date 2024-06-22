import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
const TopTab = createMaterialTopTabNavigator();
import ConfirmPage from "./confirm";
import OnProgressPage from "./onProgress";
import CompletedPage from "./complete";

const AdminPetGroomer = () => {
  const [confirmTransactions, setConfirmTransactions] = useState([]);

  useEffect(() => {
    fetchConfirmTransactions();
  }, []);

  const fetchConfirmTransactions = async () => {
    try {
      const unConfirmSnapshot = await firestore().collection('petGroomerTransaction').doc('transactionStatus').get();
      if (unConfirmSnapshot.exists) {
        const unConfirmData = unConfirmSnapshot.data()?.unConfirm || [];
        setConfirmTransactions(unConfirmData);
      }
    } catch (error) {
      console.error('Error fetching confirm transactions:', error);
    }
  };

  const handleConfirmTransaction = async (transactionId:string) => {
    try {
      // Remove transaction from 'unConfirm'
      await firestore().collection('petGroomerTransaction').doc('transactionStatus').update({
        unConfirm: firestore.FieldValue.arrayRemove(transactionId)
      });

      // Add transaction to 'onProgress'
      await firestore().collection('petGroomerTransaction').doc('transactionStatus').update({
        onProgress: firestore.FieldValue.arrayUnion(transactionId)
      });

      // Add transaction ID to user's 'completedTransactions' array
      const user = auth().currentUser;
      const uid = user?.uid;
      if (uid) {
        await firestore().collection('users').doc(uid).update({
          completedTransactions: firestore.FieldValue.arrayUnion(transactionId)
        });
      }

      // Show success message
      Alert.alert('Transaction Confirmed', 'Transaction moved to On Progress successfully');
      fetchConfirmTransactions(); // Refresh confirm transactions
    } catch (error) {
      console.error('Error confirming transaction:', error);
      Alert.alert('Error', 'Failed to confirm transaction');
    }
  };

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
        tabBarStyle: { height: 60 },
        tabBarIndicatorStyle: { backgroundColor: '#FA751C' },
      }}
    >
      <TopTab.Screen name="Confirm" component={ConfirmPage} />
      <TopTab.Screen name="On Progress" component={OnProgressPage} />
      <TopTab.Screen name="Completed" component={CompletedPage} />
    </TopTab.Navigator>
  );
};

export default AdminPetGroomer;
