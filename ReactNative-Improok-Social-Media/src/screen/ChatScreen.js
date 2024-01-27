import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Apis, { djangoAuthApi, endpoints } from '../configs/Apis';
import { MyUserContext } from '../../App';
import { windowWidth } from '../utils/Dimensions';
import VectorIcon from '../utils/VectorIcon';

const ChatScreen = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const route = useRoute()
    const { roomId, firstName, lastName, avatar } = route.params
    // const roomName = 'djangoChat';
    const [message, setMessage] = useState({
        "content": "",
        "who_sent": userInfo?.id,
        "room": roomId
    })

    const [userInfo, setUserInfo] = useState()
    const [messageList, setMessageList] = useState([])
    const [initialScroll, setInitialScroll] = useState(false)

    const scrollViewRef = useRef()

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
            let res = await Apis.get(endpoints['get-message-by-room'](roomId))
            setMessageList(res.data.results)
            console.log(res.data.results)
        } catch (error) {
            console.log("Lỗi 2")
            console.log(error)
        }
    }

    const chatSocket = new WebSocket(
        'ws://' + '192.168.1.8:8000' + '/ws/chat/' + roomId + '/'
    );

    const showMessage = () => {
        console.log(message.messagecontent)
    }

    const sendMessage = async () => {
        try {
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
            // setMessageList((prevMessageList) => [receivedMessage, ...prevMessageList]);
        }
    }, [])

    useEffect(() => {
        setInitialScroll(true)
        getMessage()
    }, [])

    // useEffect(() => {
    //     if (initialScroll && scrollViewRef.current) {
    //         scrollViewRef.current.scrollToEnd({ animated: true });
    //         console.log("Scroll")
    //     }
    // }, [initialScroll]);

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginVertical: 15,
                marginHorizontal: 20,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
                padding: 12,
                borderRadius: 12
            }}>
                <Image source={avatar === null ? require('../images/user.png') : { uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <Text style={{ fontSize: 16 }}>{lastName}</Text>
                    <Text style={{ fontSize: 16 }}>{firstName}</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}
            >
                <View>
                    {messageList.map((ml, index) => {
                        const isSentByCurrentUser = ml.who_sent === userInfo?.id;
                        const messageStyle = {
                            backgroundColor: isSentByCurrentUser ? "lightblue" : "lightgray",
                            alignSelf: isSentByCurrentUser ? 'flex-end' : 'flex-start',
                            marginBottom: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 10,
                            flexDirection: 'row',

                        };

                        return (
                            // <View key={index} style={messageStyle}>
                            //     <Image source={avatar === null ? require('../images/user.png') : { uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                            //     <Text style={{ fontSize: 16 }}>{ml.content}</Text>
                            // </View>
                            <View key={index} style={messageStyle}>
                                {/* {avatar === null || !isSentByCurrentUser && (
                                    <Image
                                        source={require('../images/user.png')}
                                        style={{ width: 40, height: 40, borderRadius: 20 }}
                                    />
                                )} */}
                                <Text style={{ fontSize: 16 }}>{ml.content}</Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <View style={styles.replyMessage}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 15, justifyContent: 'space-between' }}>
                    <TextInput
                        placeholder="Enter your message..."
                        value={message.content}
                        onChangeText={(e) => change(e, "content")}
                        numberOfLines={1}
                        style={message.content.length > 0 ? styles.inputComment : styles.emptyInputComment} />
                    {message.content.length > 0 &&
                        <TouchableOpacity style={{ width: "10%" }} onPress={() => sendMessage()}>
                            <VectorIcon
                                name="send"
                                type="Ionicons"
                                size={22}
                                color="blue" />
                        </TouchableOpacity>}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 60,
        paddingTop: 10,
        gap: 8
    },
    replyMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f2f2f2',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 1,
        width: windowWidth,
        gap: 8
    },
    emptyInputComment: {
        width: '85%',
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    inputComment: {
        width: '85%',
        paddingHorizontal: 10,
        paddingVertical: 3
    }
});

export default ChatScreen;