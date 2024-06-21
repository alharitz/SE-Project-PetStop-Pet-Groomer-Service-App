import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Address {
    id: string;
    name: string;
    address: string; // Ubah tipe sesuai dengan data yang sebenarnya
}

const AddressPage = ({ navigation }: any) => {
    const [addresses, setAddresses] = useState<Address[]>([]); // Tentukan tipe data untuk addresses

    useEffect(() => {
        const unsubscribe = firestore().collection('user').doc(auth().currentUser?.uid)
            .onSnapshot((documentSnapshot) => {
                const userData = documentSnapshot.data();
                if (userData && userData.addresses) {
                    const addressesArray: Address[] = Object.entries(userData.addresses).map(([name, address]) => ({
                        id: name, // Assuming address name as unique identifier
                        name,
                        address: address as string, // Cast address to string if necessary
                    }));
                    setAddresses(addressesArray);
                } else {
                    setAddresses([]);
                }
            });

        return () => unsubscribe();
    }, []);

    const handleAddingAddress = () => {
        navigation.navigate('AddAddress'); // Navigasi ke halaman tambah alamat
    };

    const handleEditAddress = (id: string) => {
        navigation.navigate('EditAddress', { addressId: id }); // Navigasi ke halaman edit alamat dengan id alamat
    };

    const handleDeleteAddress = async (id: string) => {
        if (addresses.length === 1) {
            Alert.alert('Cannot Delete', 'You cannot delete the only address.', [{ text: 'OK' }]);
            return;
        }

        try {
            await firestore().collection('user').doc(auth().currentUser?.uid).update({
                [`addresses.${id}`]: firestore.FieldValue.delete(),
            });
            console.log('Address deleted successfully');
        } catch (error) {
            console.error('Error deleting address: ', error);
        }
    };

    return (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
            {addresses.map((item) => (
                <View key={item.id} style={styles.addressContainer}>
                    <View style={styles.mainAddressContainer}>
                        <Text style={styles.subtitle}>{item.name}</Text>
                        <Text style={styles.address}>{item.address}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleEditAddress(item.id)}
                            style={styles.editButton}>
                            <MaterialCommunityIcons name='pencil' size={20} color={'white'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => handleDeleteAddress(item.id)}
                            style={styles.deleteButton}>
                            <MaterialCommunityIcons name='delete' size={20} color={'white'} />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleAddingAddress}
                style={styles.addButton}>
                <MaterialCommunityIcons name='plus' size={30} color={'white'} />
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    mainAddressContainer: {
        flex: 1,
        borderWidth: 3,
        borderRadius: 27,
        borderColor: '#FA751C',
        padding: 20,
        minHeight: 150,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '700',
        color: 'black',
    },
    address: {
        fontSize: 16,
        color: '#343a40',
        fontWeight: '600',
        marginTop: 10,
    },
    iconContainer: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    editButton: {
        backgroundColor: '#3498db',
        borderRadius: 30,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 30,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    addButton: {
        backgroundColor: '#FA751C',
        borderRadius: 30,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
});

export default AddressPage;
