import React, { useState } from "react";
import { Button, TextInput, View, ScrollView, SafeAreaView, Dimensions, StyleSheet, Alert, Image, TouchableOpacity, Text } from "react-native";

import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH, FIRESOTRE_DB, FIREBASE_STORAGE, REALTIME_DB, FIREBASE_APP } from "../../config/firebaseConfig";
import { set, ref, update, get, child, Database } from 'firebase/database'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { ref as storageRef, uploadBytes } from "firebase/storage";

var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height;

export const profile = (props: any) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [initialize, setInitialize] = useState(true);
    const [image, setImage] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

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

            setImageUrl(image.substring(image.lastIndexOf('/') + 1));
            const reference = storageRef(FIREBASE_STORAGE, "profile");

            const metadata = {
                contentType: 'image/jpeg',
                };

            await uploadBytes(reference, blob, metadata).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                });
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const signout = async () => {
        try {
            await signOut(FIREBASE_AUTH).then(() => {
                //setUser(null);
            });
        } catch(error) {
            console.log(error)
        }
    };

    const updateData = async () => {
        update(ref(REALTIME_DB, 'users/' + FIREBASE_AUTH.currentUser?.uid), {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            imageUrl: imageUrl ?? null
        }).then(() => {
            alert("Your profile was updated!");
        }).catch((error) => {
            console.log(error);
        })

        await uploadImage();
    };

    const readData = async () => {
        const query = child(ref(REALTIME_DB), `users/${FIREBASE_AUTH.currentUser?.uid}`)
        get(query).then((snapshot) => {
            if (snapshot.exists()) {
                const userProfile = snapshot.val();
                setFirstName(userProfile.firstName);
                setLastName(userProfile.lastName);
                setPhone(userProfile.phone);
                setImageUrl(userProfile.imageUrl ?? "");
              } else {
                console.log("No data available");
              }
        }).catch((error) => {
            console.error(error);
        });
    };

    if(initialize) {
        readData();
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
        borderColor: "#f0f8ff",
        backgroundColor: "#f0f8ff"
    },
    text: {
        fontSize: 16,
        fontWeight: 'normal',
        color: 'white',
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
        borderColor: '#008CFF',
        borderWidth: 1,
        borderRadius: 7,
        fontSize: 16
    },
    placeholderInput: {
      fontSize: 14
    },
    buttonLoad: {
        backgroundColor: '#008CFF',
        height: 40,
        width: "40%",
        borderColor: '#006DFF',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonOut: {
        backgroundColor: '#ff0000',
        width: "40%",
        height: 40,
        borderColor: '#b22222',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: "space-around",
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