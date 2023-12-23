import { useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MyUserContext } from '../../App';
import VectorIcon from '../utils/VectorIcon';
import { windowWidth } from '../utils/Dimensions';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Comment = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const route = useRoute();
    const { postId } = route.params
    const [content, setContent] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [currentCommentId, setCurrentCommentId] = useState(null);

    const [isCommentCreated, setIsCommentCreated] = useState(false);

    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        getCommentList();
    }, [commentList])

    const getCommentList = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-comment-by-post'](postId))
            setCommentList(res.data);
            console.log(res.data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user.id));
                setUserInfo(res.data);
                console.log(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getCurrentUser();
    }, [])

    const createComment = async () => {
        try {
            let form = new FormData();
            console.log(content, postId, userInfo?.id)
            form.append('comment_content', content);
            form.append('comment_image_url', new Blob());
            form.append('account', userInfo?.id);
            form.append('post', postId);
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).post(endpoints['create-comment'], form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const deleteComment = async (commentId) => {
        try {
            console.log(commentId);
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).delete(endpoints['delete-comment'](commentId))
            console.log(res.status);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {commentList.map(cl => {
                        return (
                            <>
                                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 5 }}>
                                    <Image source={{ uri: cl.account.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                    {/* <Text>{cl.account.avatar}</Text> */}
                                    <View>
                                        <Text style={{ fontSize: 17 }}>{cl.account.user.last_name} {cl.account.user.first_name}</Text>
                                        <Text style={{ fontSize: 16 }}>
                                            {cl.comment_content}
                                        </Text>
                                        {cl.comment_image_url === "/static/" || cl.comment_image_url === "/static/None" ? "" :
                                            <>
                                                <View>
                                                    <Image source={{ uri: cl.comment_image_url }} style={{ width: 100, height: 100 }} />
                                                </View>
                                            </>
                                        }
                                    </View>
                                    <View>
                                        <TouchableOpacity style={{ padding: 5, backgroundColor: 'yellow' }} onPress={() => deleteComment(cl.id)}>
                                            <Text>Xóa nè</Text>
                                        </TouchableOpacity>
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
                        <TouchableOpacity style={{ width: "10%" }} onPress={() => createComment()}>
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