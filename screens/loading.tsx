import React from "react";
import LoginPage from './Login.tsx';
import { 
    Text,
    View,
    Image,
    StyleSheet
} from "react-native";

const LoadingPage =  () => {
return (
    <View style={style.container}>
        <Image
            source ={require('./images/logoFix.png')}
            style = {style.image}
         />
        <Text style={style.title}>PetStop</Text>
    </View>
)};

const style = StyleSheet.create({   
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent:  "center",
        alignItems: "center"
    },
    logo: {
        width: 100,
        height: 100
    },
    title: {
        fontWeight: "900",
        fontSize: 42,
        color: "#FE771D",
    },

    image: {
        width: 100,
        height: 100,
    }
});

export default LoadingPage;