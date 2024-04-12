import React, { useState } from 'react'
import { View } from 'react-native'
import { Redirect } from 'expo-router'

const index = () => {
  const [user, setUser] = useState(false);
  return (
    <View>
      {user ? <Redirect href="/list"/> : <Redirect href="/login"/>}
    </View>
  );
}

export default index;