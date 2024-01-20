import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';


const ChatScreen = () => {
    const roomName = 'djangoChat';
    const [message, setMessage] = useState({
        messagecontent: "",
        whoSent: 1
    })

    const [messageList, setMessageList] = useState([])

    const change = (e, field) => {
        setMessage(current => {
            return { ...current, [field]: e }
        })
    }

    const chatSocket = new WebSocket(
        'ws://' + '192.168.1.7:8000' + '/ws/chat/' + roomName + '/'
    );

    const showMessage = () => {
        console.log(message.messagecontent)
    }

    const sendMessage = () => {
        try {
            chatSocket.send(JSON.stringify({ message: message }))
            // const newMessage = { ...message };
            // setMessageList((prevMessageList) => [...prevMessageList, newMessage])
            setMessage({
                messagecontent: '',
                whoSent: 2
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        console.log("Đây là", messageList)
        chatSocket.onmessage = function (e) {
            // console.info(e.data)
            // setMessageList((prevMessageList) => [...prevMessageList, e.data.message])
            const receivedMessage = JSON.parse(e.data).message; // Giải pháp 1
            // const receivedMessage = JSON.parse(e.data); // Giải pháp 2
            setMessageList((prevMessageList) => [...prevMessageList, receivedMessage]);
        }
    }, [])

    return (
        <View>
            <ScrollView>
                <Text>Tin nhắn</Text>
                {messageList.map((ml, index) => {
                    return <Text key={index} style={{ backgroundColor: ml.whoSent == 1 ? "yellow" : "red" }}>{ml.messagecontent} {ml.whoSent} {index}</Text>
                })}
            </ScrollView>
            <TextInput
                value={message.messagecontent}
                onChangeText={(e) => change(e, "messagecontent")}
                placeholder="Enter your message"
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
};


export default ChatScreen;