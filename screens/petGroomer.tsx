import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions, Image, TextInput } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import ref from '@react-native-firebase/storage'
import getDownloadURL from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Import data
import groomingData from '../assets/data/petGroomerData.json'; // Adjust the path according to your project structure
import CustomButton from '../assets/properties/CustomButton';

// Define type for data item
type Item = {
  id: string;
  title: string;
  image: string;
  desc1: string;
  desc2: string;
  desc3: string;
  desc4?: string;
  desc5?: string;
  desc6?: string;
  desc7?: string;
};

const screenWidth = Dimensions.get("window").width;

const PetGroomer = () => {
  const [listData, setListData] = useState<Item[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Import data from JSON
    setListData(groomingData);
  }, []);

  const getImage = (imageName: string) => {
    switch (imageName) {
      case 'image_1.png':
        return require('../assets/images/image_1.png');
      case 'image_2.png':
        return require('../assets/images/image_2.png');
      case 'image_3.png':
        return require('../assets/images/image_3.png');
      default:
        return null;
    }
  };

  const renderItem = ({ item }: {item: Item}) => (
    <View style={styles.flatlist_container}>
      <Image source={getImage(item.image)} style={styles.flatlist_image} resizeMode="contain" />
      <Text style={styles.flatlist_title}>{item.title}</Text>
      <Text style={styles.flatlist_desc}>
        {item.desc1}{"\n"}{"\n"}
        {item.desc2}{"\n"}{"\n"}
        {item.desc3}{"\n"}{"\n"}
        {item.desc4}{"\n"}{"\n"}
        {item.desc5}{"\n"}{"\n"}
        {item.desc6}{"\n"}{"\n"}
        {item.desc7}
      </Text>
    </View>
  );

  //buat upload image payment
  const [imageUri, setImageUri] = useState(null);
  const user = auth().currentUser;
  const uid = user?.uid;

  //1. pick image dari library
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
    (response) => {
      if(response.didCancel){
        console.log('User cancelled image picker');
      } else if(response.errorCode){
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  //2. upload image to storage
  const handleSaveImage = async () => {
    if(imageUri == null){
      return;
    }
    const uploadUri = imageUri;
    const storageRef = storage().ref('/payment/'+uid);
    const uploadTask = storageRef.putFile(imageUri);
  
    uploadTask.on('state_changed', (taskSnapshot) => {
      console.log('${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}')
    });
  
    uploadTask.then(() => {
      console.log('Image uploaded to the bucket!');
    }).catch((error) => {
      console.log('Image Upload Error', error);
    });
  }
  

  const renderDotIndicator = (listData.map((Dot, Index) =>
  Index === activeIndex ? 
  (
    <View 
      key={Index}
      style={{
        backgroundColor: '#ed9121',
        height: 10,
        width: 40,
        borderRadius: 5,
        marginHorizontal: 7,
        marginTop: 30,
    }}>
    </View>
  ) 
  :
  (
    <View 
      key={Index}
      style={{
        backgroundColor: 'grey',
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 7,
        marginTop: 30,
    }}>
    </View>
  )
)
);

  // BACK END FUNCTION
  const [petType, onChangePetType] = useState("");
  const [notes, onChangeNotes] = useState("");

  const handlePayment = () => {
    if (petType.length > 0) {
      console.log("Active");
      // Add navigation logic or payment processing logic here
      // ambil optionnya pake active index
      console.log(activeIndex);
      
    } else {
      console.log("Pet Type is required");
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={true}
    >
      <View style={{ marginVertical: 20, height: 700 }}>
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator= {false}
          nestedScrollEnabled  // Enable nested scrolling for FlatList
          onScroll={(event) =>{setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / screenWidth))}}
        />
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'center',}}>
        {renderDotIndicator}
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>Address</Text>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>Lorem ipsum dolor sit amet</Text>
        </View>
        <Text style={styles.subtitle}>Pet Type</Text>
        <TextInput
          style={styles.form}
          onChangeText={onChangePetType}
          value={petType}
          placeholder="Your Pet"
        />
        <Text style={styles.subtitle}>Notes</Text>
        <TextInput
          style={styles.form}
          onChangeText={onChangeNotes}
          value={notes}
          placeholder="Notes"
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          disabled={petType.length === 0} // Disable button if petType is empty
          onPress={handlePayment}
          buttonStyle={styles.button_style}
          textStyle={styles.button_text_style}
          title={"Continue to Payment"}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  flatlist_container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: screenWidth,
  },
  flatlist_title: {
    color: 'black',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
  },
  flatlist_image: {
    height: 320,
    alignSelf: 'center',
  },
  flatlist_desc: {
    marginTop: 10,
    fontSize: 16,
    color: '#343a40',
    fontWeight: '400',
  },
  button_style: {
    width: 300,
    height: 60,
    borderRadius: 40,
    marginTop: 20,
  },
  button_text_style: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'black',
    marginTop: 30,
  },
  form: {
    fontSize: 16,
    borderWidth: 1.5,
    height: 60,
    width: 335,
    marginTop: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderColor: "#ed9121",
  },
  formContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  addressContainer: {
    padding: 15,
    fontSize: 16,
    borderWidth: 1.5,
    height: 120,
    width: 335,
    marginTop: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderColor: "#ed9121",
  },
  address: {
    fontSize: 16,
    color: '#343a40',
    fontWeight: '400',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default PetGroomer;
