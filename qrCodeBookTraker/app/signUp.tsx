import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ActivityIndicator, KeyboardAvoidingView, Vibration, SafeAreaView, ScrollView, Pressable, Dimensions, Image } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { useNavigation } from "@react-navigation/native";
import { handleSignUpEmptyFields, handleSignUpEqualPasswords } from '../services/Alert'
import { FIREBASE_AUTH } from "../config/firebaseConfig";
import { useRouter } from "expo-router";

var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height;

export const signUp = () => {
    const [firstName, setFirstName] = useState("Dima");
    const [lastName, setLastName] = useState("Kryzhanovsky");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("dimakruzha@gmail.com");
    const [password, setPassword] = useState("Pass12345!");
    const [confirmPassword, setConfirmPassword] = useState("Pass12345!");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSignUp = async () => {
        setLoading(true);

        if (handleSignUpEmptyFields(email, password, confirmPassword) && handleSignUpEqualPasswords(password, confirmPassword)) {
            setLoading(false);
            alert("Fields are empty!");
            return;
        }

        try {
            await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password).then((userCredentials) => {
                sendEmailVerification(userCredentials.user);
                handleLogin();
                alert("On your email was send verification link. Please, verify your email.");
            }).catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    alert("User with this email is already registered! Try another email.");
                    Vibration.vibrate(2000);
                }
                console.log(error);
            })
        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = async () => {
        router.replace('/login')
    };

    return (
        <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.scrollView} alwaysBounceVertical={true}>
            <View style={styles.imageView}>
                <Image source={require('../assets/images/react_logo.png')} style={styles.image}/>
            </View>
            <Text style={styles.title}>Let's Get Started!</Text>
            <Text style={styles.subTitle}>Please enter the following information to create a new account</Text>

            {/* Input View for email & password */}
            <View style={styles.inputView}>
                <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={(text) => setFirstName(text)} autoCorrect={false} autoCapitalize='none' />
                <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={(text) => setLastName(text)} autoCorrect={false} autoCapitalize='none' />
                <TextInput style={styles.input} placeholder="Phone (optimal)" value={phone} onChangeText={(text) => setPhone(text)} autoCorrect={false} autoCapitalize='none' />
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={(text) => setEmail(text)} autoCorrect={false} autoCapitalize='none' />
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={(text) => setPassword(text)} secureTextEntry autoCorrect={false} autoCapitalize='none' />
                <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} secureTextEntry autoCorrect={false} autoCapitalize='none' />

                <Pressable style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
    );
}

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
    imageView: {
        paddingTop: 40,
        flex: 1,
        justifyContent: 'center'
    },
    image: {
        width: width,
        height: height * 0.3,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        color: "#008CFF"
    },
    subTitle: {
      fontSize: 22,
      fontWeight: "normal",
      textAlign: "center",
      paddingTop: 10,
      paddingBottom: 25,
      color: "#008CFF"
    },
    inputView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        width: "100%",
        paddingHorizontal: 15,
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderColor: '#008CFF',
        borderWidth: 1,
        borderRadius: 7,
        fontSize: 16
    },
    switch: {
        flexDirection: 'row',
        gap: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    remeberView: {
        width: "100%",
        paddingHorizontal: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 15
    },
    button: {
        backgroundColor: '#008CFF',
        height: 40,
        borderColor: '#006DFF',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 15,
        paddingTop: 25
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
        textAlign: 'center',
        color: 'gray'
    }
  });

  export default signUp;