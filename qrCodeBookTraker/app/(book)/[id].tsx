import { View, Text, ScrollView, StyleSheet, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useGlobalSearchParams, useNavigation, useSearchParams } from 'expo-router';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { FIRESOTRE_DB } from '../../config/firebaseConfig';

const BookPage = () => {
    const { id } = useGlobalSearchParams();
    const [book, setBook] = useState<any>(null);
    const navigation = useNavigation();

    useEffect(() => {
        if (!id) return;
        const path = 'users/simonId/books/' + id;
        const load = async () => {
            const fbDoc = await getDoc(doc(FIRESOTRE_DB, path));
            if(!fbDoc.exists()) return;
            const data = await fbDoc.data();
            setBook(data);
        }
        load();
    }, [id])

    const removeBook = () => {
        const fbDoc = doc(FIRESOTRE_DB, `users/simonId/books/${id}`);
        deleteDoc(fbDoc);
        navigation.goBack();
    }

    return (
        <ScrollView>
        <Stack.Screen options={{ headerTitle: book ? `${book.volumeInfo.title}` : '...' }} />
  
        <View style={styles.card}>
          {book && (
            <>
              <Image style={styles.image} source={book.volumeInfo.imageLinks?.thumbnail ? { uri: book.volumeInfo.imageLinks?.thumbnail } : require("../../assets/images/placeholder.jpg")} />
              <Text style={styles.title}>{book.volumeInfo.title}</Text>
              <Text>{book.volumeInfo.description}</Text>
              <Button title="Remove" onPress={removeBook} color={'red'} />
            </>
          )}
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      padding: 20,
      margin: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 4,
      marginBottom: 20,
      alignSelf: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      alignSelf: 'center',
      textAlign: 'center',
    },
  });

export default BookPage