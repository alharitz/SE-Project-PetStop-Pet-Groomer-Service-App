import React from 'react';
import {
  Text,
  StyleSheet,
  View
} from 'react-native';

const CustomTextBox = ({title, text}) =>{
    return(
        <View style={styles.text_container}>
            <Text style={styles.title_style}>{title}</Text>
            <Text style={styles.text_style}>{text}</Text>
            <View style={styles.underline}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    text_container: {
        marginLeft: 20,
        marginVertical: 5
    },  
    title_style: {
        marginLeft: 5,
        fontSize: 18,
        fontWeight: '700',
        color: '#343a40'
    },
    text_style: {
        marginLeft: 5,
        marginVertical: 5,
        fontSize: 16,
        color: '#6c757d',
        fontWeight: '500'
    },
    underline: {

        borderBottomColor: '#495057',
        borderBottomWidth: 1,
        width: '90%' // Ensures the underline stretches to the width of the parent
    }
});

export default CustomTextBox;
