import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CustomButton = ({disabled, onPress, title, buttonStyle, textStyle}) => {
  return (
    <TouchableOpacity
      style={[styles.custom_button,styles.elevation, buttonStyle, disabled && styles.disabled_button]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}>
      <Text style={[styles.custom_button_text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  elevation: {
    elevation: 2
  },
  custom_button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ed9121',
  },

  custom_button_text: {},

  disabled_button: {
    backgroundColor: '#c6c6c6', // Change color to grey when disabled
  },

});

export default CustomButton;
