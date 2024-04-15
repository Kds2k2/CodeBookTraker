import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Redirect } from 'expo-router'
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../config/firebaseConfig';
  // store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';

const index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if(user){
        console.log("UserID:", user.uid);
        console.log("UserEmail:", user.email);
        console.log("UserEmailVerification:", user.emailVerified);
        
        if(user.emailVerified) {
          console.log("User Email VERIFIED - AUTHCHANGE");
          setUser(user);
        }
      }
    });
    return unsubscribe;
  }, []);

  return (
      <View>
        {user ? <Redirect href="/(tabs)/list"/> : <Redirect href="/welcome"/>}
      </View>
  );
}

export default index;