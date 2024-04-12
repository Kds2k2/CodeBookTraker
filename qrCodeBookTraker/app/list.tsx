import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList, ListRenderItem, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
 
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { getBookByISBN } from '../api/books';

import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { FIRESOTRE_DB } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';

 const list = () => {
    const [scanned, setScanned] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [books, setBooks] = useState<any[]>([]);
    const router = useRouter();

    const handleBarCodeScanned = async ({ type, data }: {type: string, data: string }) => {
        setScanned(true);
        const code = data;
        const bookJson = await getBookByISBN(code);
        setShowScanner(false);
        if (!bookJson.items) return;
        addBook(bookJson.items[0]);
    };

    const addBook = async (book: any) => {
        const newBook = {
            bookId: book.id,
            volumeInfo: book.volumeInfo,
            webReaderLink: book.accessInfo.webReaderLink,
            textSnippet: book.searchInfo.textSnippet,
            favorite: false,
            createAt: serverTimestamp()
        };
        //simonId = userId
        const db = await addDoc(collection(FIRESOTRE_DB, 'users', 'simonId', 'books'), newBook);
    }

    useEffect(() => {
        const booksCollection = collection(FIRESOTRE_DB, 'users', 'simonId', 'books');
        onSnapshot(booksCollection, (snapshot) => {
            const books = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });
            setBooks(books);
        })
    }, []);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        };
    
        getBarCodeScannerPermissions();
    }, []);

    const renderItem: ListRenderItem<any> = ({item}) => {
        const link = '/(book)/' + item.id;
        return (
            <TouchableOpacity onPress={() => router.push(link as never)}>
                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', marginBottom: 20 }}>
                    <Image source={item.volumeInfo.imageLinks?.thumbnail ? { uri: item.volumeInfo.imageLinks?.thumbnail} : require("../assets/images/placeholder.jpg")}
                    style={{ width: 50, height: 50 }}/>
                    <View>
                        <Text>{item.volumeInfo.title}</Text>
                        <Text>{item.volumeInfo.authors[0]}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (<View style={styles.container}>
        {showScanner && <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject}/>}
        {!showScanner && <FlatList
            data={books}
            renderItem={(item) => renderItem(item)}
            keyExtractor={(item) => item.id}/>
        }
        {hasPermission && (<TouchableOpacity style={styles.fab} onPress={() => { setShowScanner(true); setScanned(false); }}><Ionicons name="add" size={24} color="white" /></TouchableOpacity>)}
        {showScanner && (<TouchableOpacity style={styles.close} onPress={() => setShowScanner(false)}><Ionicons name="close" size={24} color="white" /></TouchableOpacity>)}
    </View>);
 };

 const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    fab: {
      backgroundColor: '#03A9F4',
      alignItems: 'center',
      justifyContent: 'center',
      width: 56,
      height: 56,
      borderRadius: 28,
      position: 'absolute',
      bottom: 24,
      right: 24,
      elevation: 8,
    },
    close: {
        backgroundColor: '#b22222',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: 28,
        position: 'absolute',
        bottom: 24,
        left: 24,
        elevation: 8,
      },
  });
 
 export default list
