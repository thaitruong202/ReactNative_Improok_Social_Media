import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MyUserContext } from '../../App';
import VectorIcon from '../utils/VectorIcon';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SPSheet } from 'react-native-popup-confirm-toast';
import { Box, HStack, Heading, Spinner } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';

const Comment = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const route = useRoute()
    const { postId, accountId } = route.params
    const [content, setContent] = useState('')
    const [commentList, setCommentList] = useState([])

    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1)

    const [pageSize, setPageSize] = useState(null)

    const [isLock, setIsLock] = useState(null)

    const [userInfo, setUserInfo] = useState()

    const [image, setImage] = useState()

    useEffect(() => {
        getCommentList(1);
    }, [])

    const getCommentList = async (pageNumber) => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem('token')
            let res = await djangoAuthApi(token).get(endpoints['get-comment-by-post'](postId, pageNumber))
            setCommentList((prevCommentList) => [...prevCommentList, ...res.data.results])
            setPage(pageNumber)
            setPageSize(res.data.count)
            console.log(res.data.results)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user.id))
                setUserInfo(res.data)
                console.log(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getCurrentUser();
        const getPostById = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await djangoAuthApi(token).get(endpoints['get-post-by-post-id'](postId))
                console.log(res.data.comment_lock);
                setIsLock(res.data.comment_lock);
            } catch (error) {
                console.log(error);
            }
        }
        getPostById()
    }, [])

    const openImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            console.log('Permission not granted');
            return;
        }

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        };

        const result = await ImagePicker.launchImageLibraryAsync(options);

        if (result.canceled) {
            console.log('User canceled image picker');
        } else {
            const newSelectedImages = result.assets[0];
            const localUri = newSelectedImages.uri;
            console.log('Đường dẫn:', localUri);
            setImage(localUri);
        }
    }

    const createComment = async () => {
        try {
            let form = new FormData();
            console.log(content, postId, userInfo?.id)
            form.append('comment_content', content)
            // form.append('comment_image_url', new Blob());
            form.append('account', userInfo?.id);
            form.append('post', postId);
            if (image !== undefined) {
                const filename = image.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image';
                form.append('comment_image_url', { uri: image, name: filename, type })
            }
            const token = await AsyncStorage.getItem('token');
            // let res = await djangoAuthApi(token).post(endpoints['create-comment'], form)
            let res = await djangoAuthApi(token).post(endpoints['create-comment'], form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (image !== undefined) {
                setImage()
            }
            console.log(res.data)
            setContent('')
            const newComment = {
                "id": res.data.id,
                "comment_image_url": res.data.comment_image_url,
                "account": {
                    "id": user.id,
                    "user": {
                        "first_name": user.first_name,
                        "last_name": user.last_name
                    },
                    "avatar": userInfo?.avatar
                },
                "comment_content": res.data.comment_content,
                "post": res.data.post
            }
            setCommentList(prevComments => [...prevComments, newComment]);
        } catch (error) {
            console.log("Lỗi ở đây");
            console.log("Lỗi error gì", error)
        }
    }

    const deleteComment = async (clId, spSheet) => {
        try {
            console.log(clId)
            const token = await AsyncStorage.getItem('token')
            let res = await djangoAuthApi(token).delete(endpoints['delete-comment'](clId))
            setCommentList(prevCommentList => prevCommentList.filter(comment => comment.id !== clId));
            console.log(res.status)
            spSheet.hide()
        } catch (error) {
            console.log(error)
        }
    }

    const component = (props) => {
        return (
            <Fragment>
                <Box w="100%" h={60} px={4} justifyContent="center">
                    <Text fontSize="16" color="gray.500" _dark={{
                        color: "gray.300"
                    }}>
                        Actions
                    </Text>
                </Box>
                <View style={{ padding: 20, flexDirection: 'column', gap: 10 }}>
                    <TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <VectorIcon
                                name="create"
                                type="Ionicons"
                                size={25}
                                style={{
                                    backgroundColor: '#EBECF0',
                                    height: 40,
                                    width: 40,
                                    borderRadius: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 10,
                                }} />
                            <Text>Edit comment</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteComment(props.clId, props.spSheet)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <VectorIcon
                                name="trash"
                                type="Ionicons"
                                size={25}
                                style={{
                                    backgroundColor: '#EBECF0',
                                    height: 40,
                                    width: 40,
                                    borderRadius: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 10,
                                }} />
                            <Text>Delete comment</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Fragment>
        );
    };

    const handleScroll = async (event) => {
        console.log("Cuộn nữa đi");
        event.persist();
        const { layoutMeasurement, contentOffset, contentSize } = event?.nativeEvent || {};

        const isEndOfScrollView = layoutMeasurement?.height + contentOffset?.y >= contentSize?.height;
        if (!isEndOfScrollView) return;

        try {
            const hasMoreData = commentList.length > 0 && commentList.length < pageSize;

            if (hasMoreData && !loading) {
                const nextPage = page + 1;
                getCommentList(nextPage);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}>
                    {commentList.map(cl => {
                        return (
                            <>
                                <TouchableOpacity
                                    style={{ display: 'flex', flexDirection: 'row', marginBottom: 5, gap: 8 }}
                                    onLongPress={() => {
                                        if (
                                            userInfo?.id == cl.account.id ||
                                            userInfo?.role.id == 1 ||
                                            userInfo?.id == accountId
                                        ) {
                                            const spSheet = SPSheet;
                                            spSheet.show({
                                                component: () => component({ ...this.props, clId: cl.id, spSheet }),
                                                dragFromTopOnly: true,
                                                height: 0.3 * windowHeight,
                                            });
                                        }
                                    }}>
                                    <Image
                                        source={cl.account?.avatar === null ? require('../images/user.png') : { uri: cl.account?.avatar }}
                                        style={{ width: 34, height: 34, borderRadius: 17 }} />
                                    <View style={{ flexShrink: 1 }}>
                                        <View style={{ backgroundColor: 'lightgray', borderRadius: 20 }}>
                                            <View style={{ padding: 10 }}>
                                                <Text style={{ fontSize: 17, fontWeight: '700' }}>{cl.account.user?.last_name} {cl.account.user?.first_name}</Text>
                                                <Text style={{ fontSize: 16 }} ellipsizeMode="tail" numberOfLines={2}>
                                                    {cl.comment_content}
                                                </Text>
                                                {/* <Text>Id {userInfo?.id} comment {cl.account.id} role {userInfo?.role.id} account {accountId}</Text> */}
                                            </View>
                                        </View>
                                        {cl.comment_image_url === null ? "" :
                                            <>
                                                <View>
                                                    <Image source={{ uri: cl.comment_image_url }} style={{ width: 100, aspectRatio: 1 }} />
                                                </View>
                                            </>
                                        }
                                    </View>
                                </TouchableOpacity >
                            </>
                        )
                    })}
                    {loading && <HStack space={2} justifyContent="center">
                        <Spinner color="indigo.500" accessibilityLabel=" Loading comments" />
                        <Heading color="indigo.500" fontSize="lg">
                            Loading
                        </Heading>
                    </HStack>}
                </ScrollView>
                {isLock === true ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ fontSize: 15 }}>The owner has locked comment of this post!</Text>
                    </View>
                    :
                    <View style={{ paddingBottom: 80 }}>
                        {image !== undefined && (
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Image
                                            source={{ uri: image }}
                                            style={styles.selectedImageStyle}
                                        />
                                        <TouchableOpacity style={styles.deleteBg} onPress={() => setImage()}>
                                            <VectorIcon
                                                name="delete"
                                                type="AntDesign"
                                                color="white"
                                                size={18}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                        <View style={styles.replyArea}>
                            <TouchableOpacity style={{ width: "10%" }} onPress={openImagePicker}>
                                <VectorIcon
                                    name="images"
                                    type="Ionicons"
                                    size={25}>
                                </VectorIcon>
                            </TouchableOpacity>
                            <View style={{
                                flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1,
                                borderRadius: 15, justifyContent: 'space-between'
                            }}>
                                <TextInput
                                    placeholder="Write a comment..."
                                    value={content}
                                    onChangeText={(text) => setContent(text)}
                                    numberOfLines={1}
                                    style={content.length > 0 ? styles.inputComment : styles.emptyInputComment} />
                                {content.length > 0 &&
                                    <TouchableOpacity style={{ width: "10%" }} onPress={() => createComment()}>
                                        <VectorIcon
                                            name="send"
                                            type="Ionicons"
                                            size={22}
                                            color="blue" />
                                    </TouchableOpacity>}
                            </View>
                        </View>
                    </View>
                }
            </View >
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        paddingBottom: 20,
        paddingTop: 15,
        gap: 8
    },
    replyArea: {
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
    },
    selectedImageStyle: {
        width: 100,
        aspectRatio: 1,
        marginRight: 5,
    },
    deleteBg: {
        backgroundColor: 'rgb(58 59 60)',
        height: 30,
        width: 30,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        position: 'absolute',
        top: 3,
        right: 3
    }
});

export default Comment;