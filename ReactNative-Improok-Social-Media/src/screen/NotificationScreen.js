import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, Text, Button, Image, View } from 'react-native';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { database } from '../configs/Firebase';
import { useNavigation } from '@react-navigation/native';

export default function NotificationScreen() {

    const [notifications, setNotifications] = useState([]);
    const navigation = useNavigation();

    const [date, setDate] = useState()

    // useLayoutEffect(() => {

    //     const collectionRef = collection(database, 'notifications');
    //     const q = query(collectionRef, orderBy('createAt', 'desc'));

    //     const unsubscribe = onSnapshot(q, querySnapshot => {
    //         console.log('querySnapshot unsusbscribe');
    //         setNotifications(
    //             querySnapshot.docs.map(doc => ({
    //                 // _id: doc.data()._id,
    //                 createAt: doc.data().createAt.toDate(),
    //                 // text: doc.data().text,
    //                 // user: doc.data().user
    //                 content: doc.data().content
    //             }))
    //         );
    //     });
    //     return unsubscribe;
    // }, []);

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'notifications');
        const q = query(collectionRef, orderBy('createAt', 'desc'));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            console.log('querySnapshot unsubscribed');
            setNotifications(
                querySnapshot.docs.map(doc => ({
                    // _id: doc.data()._id,
                    createAt: doc.data().createAt.toDate().toLocaleString(), // Chuyển đổi Timestamp thành ngày bình thường
                    // text: doc.data().text,
                    // user: doc.data().user
                    content: doc.data().content,
                    avatar: doc.data().avatar
                }))
            );
        });
        return unsubscribe;
    }, []);


    const onSend = useCallback((messages = []) => {
        // setMessages([...messages, ...messages]);
        const { createAt, content, avatar } = {
            createAt: new Date(),
            content: 'Free Fire sống dai thành bà ngoại',
            avatar: "https://images.fpt.shop/unsafe/filters:quality(5)/fptshop.com.vn/uploads/images/tin-tuc/158160/Originals/2%20(7).jpg"
        };
        addDoc(collection(database, 'notifications'), {
            createAt,
            content,
            avatar
        });
    }, []);

    return (
        <>
            {notifications.map(notification => (
                <View>
                    <Image source={{ uri: notification.avatar }} style={{ width: 40, height: 40 }} />
                    <Text>{notification.content} {notification.createAt}</Text>
                </View>
            ))}
            <Button title="Send" onPress={() => onSend()} />
        </>
    );
}
