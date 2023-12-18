import { useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MyUserContext } from '../../App';
import VectorIcon from '../utils/VectorIcon';
import { windowWidth } from '../utils/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Comment = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const route = useRoute();
    const { postId } = route.params
    const [content, setContent] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [listAccountComment, setListAccountComment] = useState([]);

    useEffect(() => {
        const getCommentList = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await axios.get(`http://192.168.1.134:8000/posts/${postId}/comments/`, {
                    headers: {
                        'Authorization': "Bearer" + " " + token
                    },
                })
                setCommentList(res.data);
                const accountIds = res.data.map(account => account.id);
                const listCmtAccount = [];
                for (let i = 0; i < res.data.length; i++) {
                    let accountId = accountIds[i];
                    let resAccount = await axios.get(`http://192.168.1.134:8000/accounts/${accountId}/`, {
                        headers: {
                            'Authorization': "Bearer" + " " + token
                        },
                    })
                    let listAccount = resAccount.data;
                    listCmtAccount.push(listAccount);
                }
                setListAccountComment(listCmtAccount);
                console.log(res.data);
                console.log(listCmtAccount);
            } catch (err) {
                console.log(err)
            }
        }
        getCommentList();
    }, [])

    return (
        <>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* <Text>
                        Đây là bình luận của bài post {postId}
                    </Text> */}
                    {commentList.map((cl, index) => {
                        return (
                            <>
                                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                    <Image source={{ uri: listAccountComment[index]?.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                                    <View>
                                        <Text style={{ fontSize: 17 }}>{listAccountComment[index]?.user.last_name} {listAccountComment[index]?.user.first_name}</Text>
                                        <Text style={{ fontSize: 16 }}>
                                            {cl.comment_content}
                                        </Text>
                                        {cl.comment_image_url === "/static/None" ? "" :
                                            <>
                                                <View>
                                                    <Image source={{ uri: cl.comment_image_url }} style={{ width: 100, height: 100 }} />
                                                </View>
                                            </>
                                        }
                                    </View>
                                </View>
                            </>
                        )
                    })}
                </ScrollView>
                <View style={styles.replyArea}>
                    <TouchableOpacity style={{ width: "10%" }}>
                        <VectorIcon
                            name="images"
                            type="Ionicons"
                            size={22}>
                        </VectorIcon>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Viết bình luận..."
                        value={content}
                        onChangeText={(text) => setContent(text)}
                        numberOfLines={1}
                        style={content.length > 0 ? styles.inputComment : styles.emptyInputComment}
                    />
                    {content.length > 0 &&
                        <TouchableOpacity style={{ width: "10%" }}>
                            <VectorIcon
                                name="send"
                                type="Ionicons"
                                size={22} color="blue" />
                        </TouchableOpacity>}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    replyArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f2f2f2',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 1,
        width: windowWidth
    },
    emptyInputComment: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'black',
        width: '90%',
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    inputComment: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'black',
        width: '75%',
        paddingHorizontal: 10,
        paddingVertical: 3
    }
});

export default Comment;