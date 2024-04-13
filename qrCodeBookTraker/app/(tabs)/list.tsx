import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList, ListRenderItem, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
 
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { getBookByISBN } from '../../api/books';

import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { FIRESOTRE_DB } from '../../config/firebaseConfig';
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
            bookId: book?.id,
            volumeInfo: book?.volumeInfo,
            webReaderLink: book?.accessInfo?.webReaderLink,
            textSnippet: book?.searchInfo?.textSnippet ?? "No text snippet",
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
        console.log(item);
        return (
            <TouchableOpacity onPress={() => router.push(`/(book)/${item?.id}`)}>
                <View style={{ flexDirection: 'row', gap: 10, margin: 10 }}>
                    <Image source={item?.volumeInfo?.imageLinks?.thumbnail ? { uri: item.volumeInfo.imageLinks?.thumbnail} : require("../../assets/images/placeholder.jpg")}
                    style={{ width: 100, height: 100, borderRadius: 15 }}/>
                    <View style={{flex: 1}}>
                        <Text style={{ marginBottom: 5, marginTop: 5 }}>{item?.volumeInfo?.title}</Text>
                        <Text style={{ fontSize: 12, color: '#808080', marginBottom: 10 }}>Author: {item?.volumeInfo?.authors ? item?.volumeInfo?.authors : "Undefined"}</Text>
                        <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: 11, color: '#808080' }}>{item?.textSnippet}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (<View style={styles.container}>
        {showScanner && <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={[StyleSheet.absoluteFillObject, styles.barContainer]}>
            <View style={{ backgroundColor: 'transparent', width: 300, height: 150, flexWrap: 'wrap', borderColor: 'white', borderRadius: 10, borderWidth: 4, alignItems: 'center' }} />
        </BarCodeScanner>}
        {!showScanner && <FlatList
            style={{ backgroundColor: 'white'}}
            data={books}
            renderItem={(item) => renderItem(item)}
            keyExtractor={(item) => item.id}/>
        }
        {hasPermission && (<TouchableOpacity style={styles.fab} onPress={() => { setShowScanner(true); setScanned(false); }}><Ionicons name="add" size={24} color="white" /></TouchableOpacity>)}
        {showScanner && (<TouchableOpacity style={styles.close} onPress={() => setShowScanner(false)}><Ionicons name="close" size={24} color="white" /></TouchableOpacity>)}
    </View>);
 };

 const opacity = 'rgba(0, 0, 0, .6)';
 const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    barContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      },
    fab: {
      backgroundColor: '#EE9320',
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
        backgroundColor: '#DC3D41',
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
