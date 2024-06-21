import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ScrollView } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddressPage = ({ navigation }:any) => {
    const handleAddingAddress = () => {
        // Implementasi penambahan alamat baru
    };

    const handleEditAddress = () => {
        // Implementasi pengeditan alamat
    };

    const handleDeleteAddress = () => {
        // Implementasi penghapusan alamat
    };

    return (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
            <View style={styles.addressContainer}>
                <View style={styles.mainAddressContainer}>
                    <Text style={styles.subtitle}>Main Address</Text>
                    <Text style={styles.addres}>st. lorem ipsum dolor sit amet</Text>
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleEditAddress}
                        style={styles.editButton}>
                        <MaterialCommunityIcons name='pencil' size={20} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleDeleteAddress}
                        style={styles.deleteButton}>
                        <MaterialCommunityIcons name='delete' size={20} color={'white'} />
                    </TouchableOpacity>
                </View>
            </View>
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
        height: 150,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '700',
        color: 'black',
    },
    addres: {
        fontSize: 16,
        color: '#343a40',
        fontWeight: '600',
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
