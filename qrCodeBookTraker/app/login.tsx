import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ActivityIndicator, KeyboardAvoidingView, Vibration, Dimensions, ScrollView, SafeAreaView, Pressable, Switch, Image } from "react-native";
import { User, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { handleLoginEmptyFields } from '../services/Alert'
import { FIREBASE_AUTH } from "../config/firebaseConfig";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";

var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height;

const login = () => {
    const [email, setEmail] = useState("dimakruzha@gmail.com");
    const [password, setPassword] = useState("Pass12345!");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);

        if (handleLoginEmptyFields(email, password)) {
            setLoading(false);
            return;
        }

        try {
            const user = (await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)).user;
            console.log(user);
            if(user) {
                if (user.emailVerified) 
                {
                    router.replace('/(tabs)/list')
                } else {
                    alert("Your email is not verified");
                }
            }
        } catch(error) {
            alert("Error when login" + error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSignUp = () => {
        router.push('/signUp')
    }

    const goBack = () => {
        console.log("BACK");
        router.back();
    }

    return(
<SafeAreaView style={styles.container}>
<ScrollView contentContainerStyle={styles.scrollView} alwaysBounceVertical={true}>
<TouchableOpacity onPress={goBack} style={styles.backButton}>
    <AntDesign name="left" size={32} color="#EE9320"/>
</TouchableOpacity>
   <View style={styles.imageView}>
       <Image source={require('../assets/images/reverse_icon.png')} style={styles.image}/>
   </View>

   <Text style={styles.title}>Login</Text>

   <View style={styles.inputView}>
       <TextInput style={styles.input} placeholder="Email or Username" value={email} onChangeText={setEmail} autoCorrect={false} autoCapitalize='sentences' />
       <TextInput style={styles.input} placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} autoCorrect={false} autoCapitalize='none' />

       <View style={styles.remeberView}>
           <View style={styles.switch}>
               <Switch trackColor={{ true: "#F8F8F8", false: "#F8F8F8" }} />
               <Text style={styles.text}>  Remeber Me</Text>
           </View>

           <Pressable>
               <Text style={styles.text}>Forgot Password?</Text>
           </Pressable>
       </View>
   </View>
   

   <View style={styles.buttonView}>
   { loading
                ? <ActivityIndicator size={"large"} color={"black"}/>
                : <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
        }
   </View>
   <Pressable onPress={handleSignUp}>
        <View>
            <Text style={styles.footerText}>Don't have an account yet?</Text>
        </View>
    </Pressable>
 </ScrollView>
</SafeAreaView>
    );
}

export default login;

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
    image: {
        width: width,
        height: height * 0.3,
        resizeMode: 'contain'
    },
    backButton: {
        flex: 1,
        position: 'absolute',
        top: 15,
        left: 10,
        width: 32,
        height: 32
      },
    text: {
        fontSize: 16,
        fontWeight: '400',
        color: "#15191E"
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingBottom: 20,
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
        color: "#15191E",
        backgroundColor: "#F8F8F8",
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
        flex: 1,
        width: "100%",
        paddingHorizontal: 15,
    },
    buttonText: {
        color: "#15191E",
        fontSize: 18,
        fontWeight: 'normal'
    },
    optionsText: {
        textAlign: 'center',
        paddingVertical: 10,
        color: '#15191E',
        fontSize: 13
    },
    footerText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#383F47'
    }
  });