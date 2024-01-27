import React, { useState, useEffect, useLayoutEffect, useCallback, createContext } from 'react';
import { TouchableOpacity, Text, Button, Image, View, ScrollView } from 'react-native';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { database } from '../configs/Firebase';
import { useNavigation } from '@react-navigation/native';

export const NotificationsContext = createContext([]);

export default function NotificationScreen() {

    const [notifications, setNotifications] = useState([])
    const navigation = useNavigation()

    const [date, setDate] = useState()

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
            content: 'Thông báo',
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
            <ScrollView>
                <View style={{ flexDirection: 'column', gap: 20, padding: 10 }}>
                    {notifications.map(notification => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, borderBottomWidth: 1, borderBottomColor: 'lightgray', paddingBottom: 10 }}>
                            <Image source={{ uri: `${notification.avatar}` }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                            <View style={{ flex: 1, flexShrink: 1 }}>
                                <Text style={{ fontSize: 17, fontWeight: '600' }} ellipsizeMode="tail" numberOfLines={2}>{notification.content}</Text>
                                <Text style={{ fontSize: 14, fontWeight: '100' }}>{notification.createAt}</Text>
                            </View>
                        </View>
                    ))}
                    {/* <Button title="Send" onPress={() => onSend()} /> */}
                </View>
            </ScrollView>
        </>
    );
}
