import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import Apis, { djangoAuthApi, endpoints } from '../configs/Apis';
import { MyUserContext } from '../../App';

const ChatScreen = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const route = useRoute()
    const { roomId } = route.params
    // const roomName = 'djangoChat';
    const [message, setMessage] = useState({
        "content": "",
        "who_sent": userInfo?.id,
        "room": roomId
    })

    const [userInfo, setUserInfo] = useState()

    const [messageList, setMessageList] = useState([])

    const change = (e, field) => {
        setMessage(current => {
            return { ...current, [field]: e }
        })
    }

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user.id))
            setUserInfo(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getMessage = async () => {
        try {
            // const token = await AsyncStorage.getItem('token')
            let res = await Apis.get(endpoints['get-message-by-room'](roomId))
            setMessageList(res.data.results)
            console.log(res.data.results)
        } catch (error) {
            console.log("Lỗi 2")
            console.log(error)
        }
    }

    const chatSocket = new WebSocket(
        'ws://' + '192.168.1.7:8000' + '/ws/chat/' + roomId + '/'
    );

    const showMessage = () => {
        console.log(message.messagecontent)
    }

    const sendMessage = async () => {
        try {
            // const token = await AsyncStorage.setItem('token')
            let res = await Apis.post(endpoints['send-message'], {
                "content": message.content,
                "who_sent": userInfo?.id,
                "room": roomId
            })
            console.log(res.data)
            chatSocket.send(JSON.stringify({ message: res.data }))
            // const newMessage = { ...message };
            // setMessageList((prevMessageList) => [...prevMessageList, newMessage])
            setMessage({
                "content": "",
                "who_sent": userInfo?.id,
                "room": roomId
            })
        } catch (error) {
            console.log("Lỗi 1")
            console.error(error)
        }
    }

    useEffect(() => {
        console.log("Đây là", messageList)
        getCurrentUser()
        chatSocket.onmessage = function (e) {
            // console.info(e.data)
            // setMessageList((prevMessageList) => [...prevMessageList, e.data.message])
            const receivedMessage = JSON.parse(e.data).message; // Giải pháp 1
            // const receivedMessage = JSON.parse(e.data); // Giải pháp 2
            setMessageList((prevMessageList) => [...prevMessageList, receivedMessage]);
        }
    }, [])

    useEffect(() => {
        getMessage()
    }, [])

    return (
        <View>
            <ScrollView>
                <Text>Tin nhắn của room {roomId}</Text>
                <View>
                    {messageList.map((ml, index) => {
                        const isSentByCurrentUser = ml.who_sent === userInfo?.id;
                        const messageStyle = {
                            backgroundColor: isSentByCurrentUser ? "yellow" : "red",
                            alignSelf: isSentByCurrentUser ? 'flex-end' : 'flex-start',
                            marginBottom: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 10,
                        };

                        return (
                            <View key={index} style={messageStyle}>
                                <Text>{ml.content}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <TextInput
                value={message.content}
                onChangeText={(e) => change(e, "content")}
                placeholder="Enter your message"
            />
            <Button title='Send' onPress={sendMessage} />
            <Button title='Check' onPress={getMessage} />
        </View>
    );
};

export default ChatScreen;