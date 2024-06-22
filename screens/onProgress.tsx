import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Define TypeScript interfaces for transaction details
interface TransactionDetail {
  petType: string;
  address: string;
  // Add more properties as needed
}

const OnProgressPage = () => {
  const [onProgressTransactions, setOnProgressTransactions] = useState<string[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<{ [key: string]: TransactionDetail }>({});

  useEffect(() => {
    fetchOnProgressTransactions();
  }, []);

  const fetchOnProgressTransactions = async () => {
    try {
      const onProgressSnapshot = await firestore().collection('petGroomerTransaction').doc('transactionStatus').get();
      if (onProgressSnapshot.exists) {
        const onProgressData = onProgressSnapshot.data()?.onProgress || [];
        setOnProgressTransactions(onProgressData);
        fetchTransactionDetails(onProgressData);
      }
    } catch (error) {
      console.error('Error fetching on progress transactions:', error);
    }
  };

  const fetchTransactionDetails = async (transactionIds: string[]) => {
    try {
      const details: { [key: string]: TransactionDetail } = {};
      for (const transactionId of transactionIds) {
        const transactionSnapshot = await firestore().collection('petGroomerTransaction').doc(transactionId).get();
        if (transactionSnapshot.exists) {
          details[transactionId] = transactionSnapshot.data() as TransactionDetail;
        } else {
          console.log(`Transaction document not found for ID: ${transactionId}`);
        }
      }
      setTransactionDetails(details);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  const handleCompleteTransaction = async (transactionId: string) => {
    try {
      // Remove transaction from 'onProgress'
      await firestore().collection('petGroomerTransaction').doc('transactionStatus').update({
        onProgress: firestore.FieldValue.arrayRemove(transactionId)
      });

      // Add transaction to 'completed'
      await firestore().collection('petGroomerTransaction').doc('transactionStatus').update({
        completed: firestore.FieldValue.arrayUnion(transactionId)
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
      Alert.alert('Transaction Completed', 'Transaction moved to Completed successfully');
      fetchOnProgressTransactions(); // Refresh on progress transactions
    } catch (error) {
      console.error('Error completing transaction:', error);
      Alert.alert('Error', 'Failed to complete transaction');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      {onProgressTransactions.length > 0 ? (
        onProgressTransactions.map((transactionId, index) => (
          <View key={index} style={styles.container}>
            <View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Transaction ID: {transactionId}</Text>
              </View>
              {/* Render transaction detail from state */}
              {transactionDetails[transactionId] && (
                <View style={styles.detailContainer}>
                  <Text style={styles.detailLabel}>Details:</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailText}>Pet Type: </Text>
                    <Text style={styles.detailText}>
                      {transactionDetails[transactionId].petType}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailText}>Address: </Text>
                    <Text style={styles.detailText}>
                      {transactionDetails[transactionId].address}
                    </Text>
                  </View>
                  {/* Add more properties as needed */}
                </View>
              )}
              <TouchableOpacity style={styles.completeButton} onPress={() => handleCompleteTransaction(transactionId)}>
                <Text style={styles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No transactions in progress</Text>
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
  completeButton: {
    backgroundColor: '#FA751C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
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
  detailContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  detailLabel: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
});

export default OnProgressPage;
