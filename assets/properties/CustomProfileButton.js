import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation'


const CustomProfileButton = ({title, onPress, icon})=>{
    return(
        <TouchableOpacity
        style={style.button_style}
        onPress={onPress}>
              <MaterialCommunityIcons style={style.left_icon} name={icon} size={26} color={'white'}/>
                <Text style={style.button_text}>{title}</Text>
              <Foundation name='paw' size={30} color={'#ed9121'}/>
          </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    button_style: {
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#e9ecef',
        padding: 10,
        borderRadius: 30,
      },
      button_text:{
        fontSize: 16,
        color: 'black',
        fontWeight: '600',
      },
      left_icon:{
        padding: 7,
        backgroundColor: '#ed9121',
        borderRadius: 30
      },
});

export default CustomProfileButton;