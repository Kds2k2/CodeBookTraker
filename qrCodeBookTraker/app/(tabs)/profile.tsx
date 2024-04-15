import React, { useState } from "react";
import { Button, TextInput, View, ScrollView, SafeAreaView, Dimensions, StyleSheet, Alert, Image, TouchableOpacity, Text } from "react-native";

import { User, signOut } from 'firebase/auth'
import { FIREBASE_AUTH, FIRESOTRE_DB, FIREBASE_STORAGE, REALTIME_DB, FIREBASE_APP } from "../../config/firebaseConfig";
import { set, ref, update, get, child, Database } from 'firebase/database'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { deleteObject, getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated } from "../../redux/store";
import { useRouter } from "expo-router";

var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height;

export const profile = (props: any) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [initialize, setInitialize] = useState(true);
    const [image, setImage] = useState<any>(null);
    const [deleted, setDeleted] = useState(true);
    const [uploading, setUploading] = useState(false);

    const router = useRouter();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if(!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        setUploading(true);

        try {
            const { uri } = await FileSystem.getInfoAsync(image);
            const blob: Blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            console.log(FIREBASE_AUTH.currentUser?.uid);
            const reference = storageRef(FIREBASE_STORAGE, `${FIREBASE_AUTH.currentUser?.uid}`);
            deleteObject(reference).then(() => {
                setDeleted(true);
              }).catch((error) => {
                if (error.includes("storage/bucket-not-found")) {
                    setDeleted(false);
                } else {
                    console.error(error);
                }
              });
              
            console.error(deleted);
            if (deleted) {
                await uploadBytes(reference, blob);
            }

            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const signout = async () => {
        try {
            await signOut(FIREBASE_AUTH).then(() => {
                router.push('/welcome');
            });
        } catch(error) {
            console.log(error)
        }
    };

    const updateData = () => {
        if (image) {
            uploadImage();
        }

        console.log(image);
        
        update(ref(REALTIME_DB, 'users/' + FIREBASE_AUTH.currentUser?.uid), {
            firstName: firstName,
            lastName: lastName,
            phone: phone
        }).then(() => {
            alert("Your profile was updated!");
        }).catch((error) => {
            console.log(error);
        })
    };

    const readData = () => {
        const query = child(ref(REALTIME_DB), `users/${FIREBASE_AUTH.currentUser?.uid}`)
        get(query).then((snapshot) => {
            if (snapshot.exists()) {
                const userProfile = snapshot.val();
                setFirstName(userProfile.firstName);
                setLastName(userProfile.lastName);
                setPhone(userProfile.phone);
              } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    const readImage = () => {
        getDownloadURL(storageRef(FIREBASE_STORAGE, `${FIREBASE_AUTH.currentUser?.uid}`))
          .then((url) => {
                setImage(url);
          })
          .catch((error) => {
            console.log('error1')
          });  
    };

    if(initialize) {
        readData();
        readImage();
        setInitialize(false);
    }

    console.log("ProfileS");
    return(
        <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView} alwaysBounceVertical={true}>
                    <TouchableOpacity
                        onPress={pickImage}>
                        <Image
                            source={ image ? { uri: image } : require('../../assets/images/placeholder_user.jpg') }
                            style={styles.image}
                        />
                    </TouchableOpacity>

                    <View style={styles.inputView}>
                        <TextInput style={styles.input} placeholder="firstname" value={firstName} onChangeText={setFirstName}/>
                        <TextInput style={styles.input} placeholder="lastname" value={lastName} onChangeText={setLastName}/>
                        <TextInput style={styles.input} placeholder="phone" value={phone} onChangeText={setPhone}/>
                    </View>

                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.buttonLoad} onPress={updateData}>
                            <Text style={styles.text}>Update profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonOut} onPress={signout}>
                            <Text style={styles.text}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
        </SafeAreaView>
    );
}

export default profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    scrollView: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#3D3D3D",
        backgroundColor: "#F8F8F8"
    },
    text: {
        fontSize: 18,
        textTransform: "uppercase",
        fontWeight: 'normal',
        color: 'black',
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingBottom: 20,
        color: "#008CFF"
    },
    inputView: {
        justifyContent: 'center',
        alignContent: 'center',
        width: "100%",
        paddingTop: 30,
        paddingHorizontal: 15,
    },
    input: {
        height: 50,
        marginBottom: 10,
        paddingLeft: 10,
        borderColor: '#EE9320',
        borderWidth: 1,
        borderRadius: 7,
        color: "#15191E",
        backgroundColor: "#F8F8F8",
        fontSize: 16
    },
    placeholderInput: {
      fontSize: 14
    },
    buttonLoad: {
        backgroundColor: '#EE9320',
        height: 40,
        width: "48%",
        borderColor: '#EE9320',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonOut: {
        backgroundColor: '#DC3D41',
        width: "48%",
        height: 40,
        borderColor: '#DC3D41',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 15,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: 'bold'
    },
    optionsText: {
        textAlign: 'center',
        paddingVertical: 10,
        color: 'gray',
        fontSize: 13
    },
    footerText: {
        fontSize: 16,
        textAlign: 'center',
        color: 'gray'
    }
  });