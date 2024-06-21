import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth  from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingPage from './loading';
import CustomButton from '../assets/properties/CustomButton';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import collection from '@react-native-firebase/firestore';
import query from '@react-native-firebase/firestore';
import orderBy from '@react-native-firebase/firestore';
import limit from '@react-native-firebase/firestore';
import getDocs from '@react-native-firebase/firestore';
import addDoc from '@react-native-firebase/firestore';

// Define type for data item
type Item = {
  id: string;
  title: string;
  image: string;
  desc: string[];
  price: string;
};

const screenWidth = Dimensions.get("window").width;

const PetGroomer = ({ navigation }: any) => {
  const [listData, setListData] = useState<Item[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPetType, setSelectedPetType] = useState('');
  const [isOtherPetType, setIsOtherPetType] = useState(false);
  const [notes, setNotes] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [addressOptions, setAddressOptions] = useState<string[]>([]); // State untuk menyimpan opsi alamat dari Firestore
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      try {
        const groomingCollection = await firestore().collection('petGroomer').get();
        const groomingData = groomingCollection.docs.map(doc => doc.data()) as Item[];
        setListData(groomingData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data from Firestore: ', error);
      }
    };

    fetchData();

    // Fetch addresses from Firestore and set options for Picker
    const fetchAddresses = async () => {
      const user = auth().currentUser;
      const Uid = user?.uid
      try {
        const documentSnapshot = await firestore().collection('user').doc(Uid).get(); // Ganti 'userId' dengan userID sesuai aplikasi Anda
        const userData = documentSnapshot.data();
        if (userData && userData.addresses) {
          const addresses = Object.values(userData.addresses) as string[];
          setAddressOptions(addresses);
          setSelectedAddress(addresses[0]); // Set default selected address
        }
      } catch (error) {
        console.error('Error fetching addresses: ', error);
      }
    };

    fetchAddresses();
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

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.flatlist_container}>
      <Image source={getImage(item.image)} style={styles.flatlist_image} resizeMode="contain" />
      <Text style={styles.flatlist_title}>{item.title}</Text>
      <Text style={styles.flatlist_desc}>
        {item.desc.map((desc, index) => (
          <React.Fragment key={index}>
            {desc}{"\n"}{"\n"}
          </React.Fragment>
        ))}
      </Text>
      <Text style={styles.flatlist_title}>
        {item.price}
      </Text>
    </View>
  );

  const renderDotIndicator = listData.map((Dot, Index) =>
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
  );

  const getCurrentDateTime = () => {
    const currentDate = new Date();
  
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // +1 karena bulan dimulai dari 0
    const day = ('0' + currentDate.getDate()).slice(-2);
  
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };  

  const uploadTransactionData = async(Uid:string, currentDateTime: string, paymentProof:string) =>{
    await firestore().collection('petGroomerTransaction').doc(`${currentDateTime} ${Uid}`).set(
      {
        Uid: Uid,
        service: selectedService.title,
        transactionDateTime: currentDateTime,
        transactionProof: paymentProof,
        address: selectedAddress,
        petType: selectedPetType,
        deliveryOption: selectedDeliveryOption,
        notes: notes
      }
    )
    await firestore().collection('petGroomerTransaction').doc('transactionStatus').set({
      unConfirm: firestore.FieldValue.arrayUnion(`${currentDateTime} ${Uid}`)
    }, { merge: true });  }
  
  const handlePayment = async() => {
    if (selectedPetType.length > 0) {
      console.log(activeIndex);
      const user = auth().currentUser;
      if(user){
        const uid = user.uid;
        if(imageUri == null){
          Alert.alert("Please upload payment proof !");
          return;
        }
        const currentDateTime = getCurrentDateTime();
        const paymentProof = `payment/'${currentDateTime} ${uid}`;
        const uploadUri = imageUri;
        const storageRef = storage().ref(paymentProof);
        const uploadTask = storageRef.putFile(uploadUri);
        uploadTransactionData(uid, currentDateTime, paymentProof)

        uploadTask.on('state_changed', (taskSnapshot) => {
          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        });
    
        uploadTask.then(() => {
          console.log('Image uploaded to the bucket!');
        }).catch((error) => {
          console.log('Image Upload Error', error);
        });
      }
      navigation.goBack()
      Alert.alert(`Thank you for your transaction, please wait for our admin to confirm the payment`);
    } else {
      console.log("Pet Type is required");
    }
  }

  const handleUploadPaymentProof = async () => {
    //pick image from gallery
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePIcker Error: ', response.errorMessage);
        } else {
          if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0]?.uri;
            if (uri) {
              Alert.alert('Payment proof successfully selected')
              setImageUri(uri);
            }
          }
        }
      }
    );  
  
    
    console.log('Active');
  }

  const handleContinueToPayment = () => {
    if (selectedPetType.length > 0 && selectedDeliveryOption.length > 0 && selectedAddress.length > 0) {
      setShowPayment(true);
    } else {
      Alert.alert('Please select all options before continuing to payment');
    }
  }

  if (isLoading) {
    return (
      <LoadingPage />
    );
  }

  const selectedService = listData[activeIndex];

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
          keyExtractor={(item: any) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          onScroll={(event: any) => { setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / screenWidth)) }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
        {renderDotIndicator}
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>Address</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedAddress}
            onValueChange={(itemValue: string) => { setSelectedAddress(itemValue) }}
            style={styles.picker}
          >
            <Picker.Item label='Select Address' value='' />
            {addressOptions.map((address, index) => (
              <Picker.Item key={index} label={address} value={address} />
            ))}
          </Picker>
        </View>
        <Text style={styles.subtitle}>Pet Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPetType}
            onValueChange={(itemValue: string) => {
              setSelectedPetType(itemValue);
              setIsOtherPetType(itemValue === 'Other');
            }}
            style={styles.picker}
          >
            <Picker.Item label='Select Pet Type' value='' />
            <Picker.Item label='Cat' value='Cat' />
            <Picker.Item label='Dog' value='Dog' />
            <Picker.Item label='Bird' value='Bird' />
            <Picker.Item label='Rabbit' value='Rabbit' />
            <Picker.Item label='Fish' value='Fish' />
            <Picker.Item label='Reptile' value='Reptile' />
            <Picker.Item label='Other' value='Other' />
          </Picker>
        </View>
        {isOtherPetType && (
          <TextInput
            style={styles.form}
            onChangeText={setSelectedPetType}
            value={selectedPetType}
            placeholder="Pet Type"
          />
        )}
        <Text style={styles.subtitle}>Delivery Options</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDeliveryOption}
            onValueChange={(itemValue: string) => { setSelectedDeliveryOption(itemValue) }}
            style={styles.picker}
          >
            <Picker.Item label='Select Options' value='' />
            <Picker.Item label='Picked Up and Drop Off' value='Picked Up and Drop Off' />
            <Picker.Item label='Deliver by Yourself' value='Deliver by Yourself' />
            <Picker.Item label='Picked Up' value='Picked Up' />
            <Picker.Item label='Drop Off' value='Drop Off' />
          </Picker>
        </View>
        <Text style={styles.subtitle}>Notes</Text>
        <TextInput
          style={styles.form}
          onChangeText={setNotes}
          value={notes}
          placeholder="Notes"
        />
      </View>

      {!showPayment ? (
        <CustomButton
          disabled={false}
          onPress={handleContinueToPayment}
          buttonStyle={styles.button_style}
          textStyle={styles.button_text_style}
          title={"Continue to Payment"}
        />
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Payment</Text>
          <Text style={styles.banckAccount}>222-425-444-1200</Text>
          <Text style={{ color: '#6c757d', fontSize: 18, fontWeight: '700', marginTop: 10 }}>Pet Stop Corp</Text>
          <Text style={styles.subtitle}>Total Price: {selectedService?.price}</Text>
          <TouchableOpacity
            style={styles.uploadPaymentProofButton}
            activeOpacity={0.7}
            onPress={handleUploadPaymentProof}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginTop: 10 }}>Upload
              Proof of Payment
            </Text>
            <MaterialCommunityIcons name='image-plus' size={25} color={'white'} style={{ marginTop: 10, marginLeft: 12 }} />
          </TouchableOpacity>
          <CustomButton
            disabled={false}
            onPress={handlePayment}
            buttonStyle={styles.button_style}
            textStyle={styles.button_text_style}
            title={"Confirm Payment"}
          />
        </View>
      )}
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
  },
  flatlist_image: {
    height: 320,
    alignSelf: 'center',
  },
  flatlist_desc: {
    fontSize: 16,
    color: '#343a40',
    fontWeight: '400',
  },
  button_style: {
    marginBottom: 30,
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
    marginBottom: 10,
  },
  pickerContainer: {
    borderRadius: 20,
    borderColor: '#ed9121',
    borderWidth: 1.5,
    marginTop: 10,
    overflow: 'hidden', // This is necessary for the border radius to take effect
  },
  picker: {
    width: '100%',
    height: 60,
  },
  banckAccount: {
    color: '#FA751C',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
  },
  uploadPaymentProofButton: {
    elevation: 5,
    marginTop: 20,
    alignSelf: 'center',
    paddingTop: 9,
    paddingBottom: 20,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ed9121',
    borderRadius: 40
  },
});

export default PetGroomer;
