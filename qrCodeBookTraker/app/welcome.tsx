import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ActivityIndicator, KeyboardAvoidingView, Vibration, Dimensions, ScrollView, SafeAreaView, Pressable, Switch, Image } from "react-native";
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { handleLoginEmptyFields } from '../services/Alert'
import { FIREBASE_AUTH } from "../config/firebaseConfig";
import { useRouter } from "expo-router";

var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height;

const welcome = () => {
    const router = useRouter();

    const handleLogin = async () => {
        router.push('/login')
    }

    const handleSignUp = () => {
        router.push('/signUp')
    }

    return(
<SafeAreaView style={styles.container}>
<ScrollView contentContainerStyle={styles.scrollView} alwaysBounceVertical={true}>
   <View style={styles.imageView}>
       <Image source={require('../assets/images/reverse_icon.png')} style={styles.image}/>
   </View>

    <View style={styles.mainView}>
        <View>
            <Text style={styles.title}>Welcome</Text>   
            <Text style={styles.subTitle}>Welcome to BookHunt! Your go-to app for effortlessly finding books by their ISBN codes. Simply scan ISBN code, and let us do the rest. Explore book details, reviews, and easily add them to your reading list. Happy reading!</Text>  
        </View>

        <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.text}>Enter</Text>
            </TouchableOpacity>
        </View>

        <Pressable onPress={handleSignUp}>
            <View>
                <Text style={styles.footerText}>Don't have an account yet?</Text>
            </View>
        </Pressable>
    </View>

 </ScrollView>
</SafeAreaView>
    );
}

export default welcome;

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
        marginTop: 50,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    mainView: {
        flex: 1,
        justifyContent: 'space-between'
    },
    image: {
        width: width,
        height: height * 0.3,
        resizeMode: 'contain'
    },
    text: {
        fontSize: 18,
        fontWeight: 'normal',
        textTransform: "uppercase",
        color: "#15191E",
        marginVertical: 10
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingBottom: 20,
        color: "#15191E",
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: "center",
        color: "#15191E",
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
        marginBottom: 10,
        paddingLeft: 10,
        borderColor: '#EE9320',
        borderWidth: 1,
        borderRadius: 7,
        color: "#202D85",
        fontSize: 16
    },
    placeholderInput: {
      fontSize: 14
    },
    switch: {
        flexDirection: 'row',
        gap: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    remeberView: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 5,
        marginBottom: 15
    },
    button: {
        backgroundColor: '#EE9320',
        height: 40,
        borderColor: '#EE9320',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonView: {
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
        color: '#383F47'
    }
  });