import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ConfirmPage: React.FC = () => {
  const [confirmTransactions, setConfirmTransactions] = useState<string[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    fetchConfirmTransactions();
  }, []);

  const fetchConfirmTransactions = async () => {
    try {
      const unConfirmSnapshot = await firestore().collection('petGroomerTransaction').doc('transactionStatus').get();
      if (unConfirmSnapshot.exists) {
        const unConfirmData = unConfirmSnapshot.data()?.unConfirm || [];
        setConfirmTransactions(unConfirmData);
        fetchTransactionDetails(unConfirmData);
      }
    } catch (error) {
      console.error('Error fetching confirm transactions:', error);
    }
  };

  const fetchTransactionDetails = async (transactionIds: string[]) => {
    try {
      const details: { [key: string]: any } = {};
      for (const transactionId of transactionIds) {
        const transactionSnapshot = await firestore().collection('petGroomerTransaction').doc(transactionId).get();
        if (transactionSnapshot.exists) {
          details[transactionId] = transactionSnapshot.data();
        } else {
          console.log(`Transaction document not found for ID: ${transactionId}`);
        }
      }
      setTransactionDetails(details);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  const handleConfirmTransaction = async (transactionId: string) => {
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

  const renderTransactionDetail = (transactionId: string) => {
    const transactionDetail = transactionDetails[transactionId];
    if (transactionDetail) {
      return (
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Details:</Text>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>Pet Type: </Text>
            <Text style={styles.detailText}>{transactionDetail.petType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>Address: </Text>
            <Text style={styles.detailText}>{transactionDetail.address}</Text>
          </View>
          {/* Add more properties as needed */}
        </View>
      );
    } else {
      return <Text style={styles.noData}>Transaction details not available</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      {confirmTransactions.length > 0 ? (
        confirmTransactions.map((transactionId, index) => (
          <View key={index} style={styles.container}>
            <View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Transaction ID: {transactionId}</Text>
              </View>
              {/* Render transaction detail from state */}
              {renderTransactionDetail(transactionId)}
              <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmTransaction(transactionId)}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No transactions to confirm</Text>
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
  confirmButton: {
    backgroundColor: '#FA751C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
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

export default ConfirmPage;
