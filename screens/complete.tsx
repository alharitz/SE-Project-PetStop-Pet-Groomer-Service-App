import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const CompletePage = () => {
  const [completedTransactions, setCompletedTransactions] = useState([]);

  useEffect(() => {
    fetchCompletedTransactions();
  }, []);

  const fetchCompletedTransactions = async () => {
    try {
      const completedSnapshot = await firestore().collection('petGroomerTransaction').doc('transactionStatus').get();
      if (completedSnapshot.exists) {
        const completedData = completedSnapshot.data()?.completed || [];
        setCompletedTransactions(completedData);
      }
    } catch (error) {
      console.error('Error fetching completed transactions:', error);
    }
  };

  const handleViewDetail = async (transactionId: string) => {
    try {
      // Fetch transaction details from Firestore
      const transactionSnapshot = await firestore().collection('petGroomerTransaction').doc(transactionId).get();
      if (transactionSnapshot.exists) {
        const transactionData = transactionSnapshot.data();
        Alert.alert('Transaction Details', JSON.stringify(transactionData, null, 2));
      } else {
        Alert.alert('Error', 'Transaction details not found');
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      Alert.alert('Error', 'Failed to fetch transaction details');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      {completedTransactions.length > 0 ? (
        completedTransactions.map((transactionId, index) => (
          <View key={index} style={styles.container}>
            <View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Transaction ID: {transactionId}</Text>
              </View>
              <TouchableOpacity style={styles.viewDetailButton} onPress={() => handleViewDetail(transactionId)}>
                <Text style={styles.viewDetailButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No completed transactions</Text>
      )}
    </ScrollView>
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
    borderColor: '#4CAF50',
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
  viewDetailButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  viewDetailButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  noData: {
    fontSize: 18,
    fontWeight: '700',
    color: 'grey',
    marginTop: 50,
  },
});

export default CompletePage;
