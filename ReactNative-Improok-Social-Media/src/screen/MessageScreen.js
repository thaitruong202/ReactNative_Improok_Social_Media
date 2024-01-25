// // import React from 'react';
// // import { Text, View } from 'react-native';

// // const MessageScreen = () => {
// //     return (
// //         <>
// //             <View>
// //                 <Text>
// //                     Tin nhắn
// //                 </Text>
// //             </View>
// //         </>
// //     );
// // };

// // export default MessageScreen;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, ScrollView } from 'react-native';
// // import { WebSocket } from 'react-native-gifted-chat'; // Thay thế bằng thành phần WebSocket của thư viện bạn sử dụng


// const MessageScreen = () => {
//     const [chatLog, setChatLog] = useState('');
//     // const [messageInput, setMessageInput] = useState('');
//     const [message, setMessage] = useState({
//         messageContent: '',
//         whoSent: 1
//     })

//     const change = (e, field) => {
//         setMessage(current => {
//             return { ...current, [field]: e }
//         })
//     }


//     const roomName = 'abcxyz'; // Gán giá trị phù hợp cho roomName


//     const chatSocket = new WebSocket(
//         'ws://' + '192.168.1.7:8000' + '/ws/chat/' + roomName + '/'
//     );


//     useEffect(() => {
//         chatSocket.onmessage = function (e) {
//             console.log(e.data)
//             const data = JSON.parse(e.data);
//             setChatLog((prevChatLog) => prevChatLog + data.message.messageContent + '\n');
//         };


//         chatSocket.onclose = function (e) {
//             console.error('Chat socket closed unexpectedly');
//         };
//     }, []);


//     const handleSendMessage = () => {
//         chatSocket.send(JSON.stringify({ message: message }));
//         setMessage({
//             messageContent: '',
//             whoSent: 1
//         })
//     };


//     return (
//         <View>
//             <ScrollView>
//                 <Text>{chatLog}</Text>
//             </ScrollView>
//             <TextInput
//                 value={message.messageContent}
//                 onChangeText={(e) => change(e, "messageContent")}
//                 placeholder="Enter your message"
//             />
//             <Button title="Send" onPress={() => handleSendMessage()} />
//         </View>
//     );
// };


// export default MessageScreen;

import React, { useContext, useEffect, useState } from 'react';
import { Button, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { djangoAuthApi, endpoints } from '../configs/Apis';
import { useNavigation } from '@react-navigation/native';
import VectorIcon from '../utils/VectorIcon';

const MessageScreen = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext)
    const [listRoom, setListRoom] = useState([])
    const [userInfo, setUserInfo] = useState()
    const [userInfoLoaded, setUserInfoLoaded] = useState()

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user?.id))
            setUserInfo(res.data)
            setUserInfoLoaded(true)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, [])

    useEffect(() => {
        if (userInfoLoaded && userInfo?.id) {
            getRooms();
        }
    }, [userInfoLoaded, userInfo]);

    const getRooms = async () => {
        try {
            // const token = await AsyncStorage.getItem('token')
            let res = await Apis.get(endpoints['get-room-by-account'](userInfo?.id))
            setListRoom(res.data.results)
            console.log(res.data.results)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {/* <ScrollView>
                <View style={{ flexDirection: 'column', gap: 5, padding: 12 }}>
                    {listRoom.map((lr) => {
                        return (
                            <>
                                <TouchableOpacity key={lr.id} style={{ borderWidth: 1, borderRadius: 15 }} onPress={() => navigation.navigate('Message', { roomId: lr.id })}>
                                    <View style={{ padding: 10 }}>
                                        <Text>Room {lr.id}</Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        )
                    })}
                </View>
                <Button title="Check" onPress={() => getRooms()} />
            </ScrollView> */}
            <ScrollView>
                <View style={{ flexDirection: 'column', gap: 5, padding: 12 }}>
                    {listRoom.length > 0 ? (
                        listRoom.map((lr) => {
                            return (
                                <>
                                    <View key={lr.id} style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
                                        <View style={{ padding: 10 }}>
                                            {user?.id === lr.first_user?.id ?
                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => navigation.navigate('Message', { roomId: lr.id, firstName: lr.second_user?.user?.first_name, lastName: lr.second_user?.user?.last_name, avatar: lr.second_user?.avatar })}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, width: '90%' }}>
                                                        <Image source={lr.second_user?.avatar === null ? require('../images/user.png') : { uri: lr.second_user?.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                                                        <Text style={{ fontSize: 17 }}>{lr.second_user?.user?.last_name} {lr.second_user?.user?.first_name}</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => navigation.navigate('Message', { roomId: lr.id, firstName: lr.second_user?.user?.first_name, lastName: lr.second_user?.user?.last_name, avatar: lr.second_user?.avatar })}>
                                                        <VectorIcon
                                                            name="chatbubble-ellipses-outline"
                                                            type="Ionicons"
                                                            size={24} />
                                                    </TouchableOpacity>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 5 }} onPress={() => navigation.navigate('Message', { roomId: lr.id, firstName: lr.first_user?.user?.first_name, lastName: lr.first_user?.user?.last_name, avatar: lr.first_user?.avatar })}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, width: '90%' }}>
                                                        <Image source={lr.first_user?.avatar === null ? require('../images/user.png') : { uri: lr.first_user?.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                                                        <Text style={{ fontSize: 17 }}>{lr.first_user?.user?.last_name} {lr.first_user?.user?.first_name}</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => navigation.navigate('Message', { roomId: lr.id, firstName: lr.first_user?.user?.first_name, lastName: lr.first_user?.user?.last_name, avatar: lr.first_user?.avatar })}>
                                                        <VectorIcon
                                                            name="chatbubble-ellipses-outline"
                                                            type="Ionicons"
                                                            size={24} />
                                                    </TouchableOpacity>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                </>
                            );
                        })
                    ) : (
                        <Text>No rooms available</Text>
                    )}
                </View>
                {/* <Button title="Check" onPress={() => getRooms()} /> */}
            </ScrollView>
        </>
    );
};

export default MessageScreen;