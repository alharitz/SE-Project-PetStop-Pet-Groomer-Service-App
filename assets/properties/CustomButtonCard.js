import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomButtonCard = ({ onPress, title, desc, isSelected }) => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.button, isSelected && styles.selectedButton]}
        onPress={onPress}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F5f5f5',
    elevation: 5,
    height: 130,
    width: 340,
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'white'
  },
  title: {
    color: 'black',
    fontWeight: '700',
    fontSize: 20,
  },
  desc: {
    marginTop: 10,
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: '#FA751C',
  },
});

export default CustomButtonCard;
