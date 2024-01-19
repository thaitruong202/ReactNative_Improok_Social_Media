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