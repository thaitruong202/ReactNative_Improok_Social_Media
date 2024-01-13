import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { Fragment, useContext, useEffect, useState, useRef, useImperativeHandle } from 'react';
import VectorIcon from '../utils/VectorIcon';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import Like from '../images/like.jpeg';
import Wow from '../images/wow.jpeg';
import Love from '../images/love.jpeg';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';
import { djangoAuthApi, endpoints } from '../configs/Apis';

const Post = React.forwardRef((props, ref) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [postHead, setPostHead] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    // const [likedPosts, setLikedPosts] = useState([]);
    const [isPostIdUpdated, setIsPostIdUpdated] = useState(false);
    const [countPostReaction, setCountPostReaction] = useState([]);
    const [countPostComment, setCountPostComment] = useState([]);
    const [checkReaction, setCheckReaction] = useState([]);

    // const [openModal, setOpenModal] = useState(false);

    const [isMenuVisible, setMenuVisible] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(null);

    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user.id))
                setUserInfo(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getCurrentUser();
        if (userInfo?.id) {
            getPost(1);
        }
    }, [userInfo?.id])

    const getPost = async (pageNumber) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-post-by-account'](userInfo?.id, pageNumber))
            setPostHead((prevPostHead) => [...prevPostHead, ...res.data.results]);
            setPage(pageNumber);
            setPageSize(res.data.count);
            console.log(res.data.results.length);
            const postIds = res.data.results.map(post => post.id);
            const reactionCounts = [];
            const commentCounts = [];
            const reactionChecks = [];
            for (let i = 0; i < res.data.results.length; i++) {
                let postId = postIds[i];
                let reactionRes = await djangoAuthApi(token).get(endpoints['count-post-reaction'](postId));
                let commentRes = await djangoAuthApi(token).get(endpoints['count-post-comment'](postId));
                let resCheck = await djangoAuthApi(token).get(endpoints['check-reacted-to-post'](userInfo?.id, postId));
                let reactCount = reactionRes.data
                reactionCounts.push(reactCount);
                let cmtCounts = commentRes.data
                commentCounts.push(cmtCounts);
                let reactedCheck = resCheck.data;
                reactionChecks.push(reactedCheck);
            }
            setCountPostReaction((prevCountPostReaction) => [...prevCountPostReaction, ...reactionCounts]);
            setCountPostComment((prevCountPostComment) => [...prevCountPostComment, ...commentCounts]);
            setCheckReaction((prevCheckReaction) => [...prevCheckReaction, ...reactionChecks]);
            console.log(res.data.results);
            console.log(reactionCounts);
            console.log(reactionChecks);
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    useEffect(() => {
        if (isPostIdUpdated) {
            likeReaction();
            setIsPostIdUpdated(false);
        }
    }, [isPostIdUpdated]);

    const likeReaction = async (postId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log("Bài post id", postId);
            let check = await djangoAuthApi(token).get(endpoints['check-reacted-to-post'](userInfo?.id, postId))
            console.log(check.data.reacted);
            if (check.data.reacted === false) {
                console.log("like");
                let res = await djangoAuthApi(token).post(endpoints['like-reaction'], {
                    "reaction": "1",
                    "post": postId,
                    "account": userInfo?.id
                })
                console.log("Like thành công", res.data);
            }
            else {
                console.log("Xóa like");
                console.log(postId, userInfo?.id);
                let res = await djangoAuthApi(token).get(endpoints['get-post-reaction'](postId, 1, userInfo?.id))
                console.log("Tôi xóa reaction");
                console.log(res.data);
                console.log(res.data[0].id);
                let del = await djangoAuthApi(token).delete(endpoints['delete-like'](res.data[0].id))
                console.log("Xóa like thành công", del.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    }

    const handleScroll = async (event) => {
        console.log("Hello");
        event.persist();
        const { layoutMeasurement, contentOffset, contentSize } = event?.nativeEvent || {};

        const isEndOfScrollView = layoutMeasurement?.height + contentOffset?.y >= contentSize?.height;
        if (!isEndOfScrollView) return;

        try {
            const hasMoreData = postHead.length > 0 && postHead.length < pageSize;
            if (hasMoreData && !loading) {
                const nextPage = page + 1;
                getPost(nextPage);
                console.log(nextPage);
            }
            console.log(pageSize)
        } catch (error) {
            console.error(error);
        }
    };

    useImperativeHandle(ref, () => ({
        handleScroll,
    }));

    return (
        <Fragment>
            <ScrollView onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {postHead.map((ph, index) => {
                    return (
                        <>
                            <View key={ph.id}>
                                <View style={styles.postHeaderContainer}>
                                    <View style={styles.postTop}>
                                        <View style={styles.row}>
                                            <Image source={{ uri: userInfo?.avatar }} style={styles.userProfile} />
                                            <View style={styles.userSection}>
                                                <Text style={styles.username}>{user.last_name} {user.first_name}</Text>
                                                <View style={styles.row}>
                                                    <Text style={styles.days}>{ph.created_date}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <TouchableOpacity onPress={() => toggleMenu()}>
                                                <VectorIcon
                                                    name="dots-three-horizontal"
                                                    type="Entypo"
                                                    size={25}
                                                    color="#606770"
                                                    style={styles.headerIcons}
                                                />
                                            </TouchableOpacity>
                                            <Modal
                                                isVisible={isMenuVisible}
                                                animationIn={'slideInUp'}
                                                animationInTiming={150}
                                                animationOut={'slideOutDown'}
                                                backdropColor='transparent'
                                                animationOutTiming={150}
                                                swipeDirection="down"
                                                onSwipeComplete={() => {
                                                    toggleMenu();
                                                }}
                                                onBackdropPress={() => {
                                                    toggleMenu();
                                                }}
                                                style={{ justifyContent: 'flex-end', margin: 0 }}
                                            >
                                                <View style={{ height: windowHeight / 2, backgroundColor: 'white', width: '100%', position: 'absolute', bottom: 0 }}>
                                                    <View style={{ padding: 20 }}>
                                                        <TouchableOpacity>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <VectorIcon
                                                                    name="pin"
                                                                    type="Entypo"
                                                                    size={25}
                                                                    style={{
                                                                        backgroundColor: '#EBECF0',
                                                                        height: 40,
                                                                        width: 40,
                                                                        borderRadius: 50,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        marginRight: 10,
                                                                    }}
                                                                />
                                                                <Text>Pin Post</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <VectorIcon
                                                                    name="edit"
                                                                    type="MaterialIcons"
                                                                    size={25}
                                                                    style={{
                                                                        backgroundColor: '#EBECF0',
                                                                        height: 40,
                                                                        width: 40,
                                                                        borderRadius: 50,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        marginRight: 10,
                                                                    }}
                                                                />
                                                                <Text>Edit Post</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <VectorIcon
                                                                    name="lock"
                                                                    type="FontAwesome"
                                                                    size={25}
                                                                    style={{
                                                                        backgroundColor: '#EBECF0',
                                                                        height: 40,
                                                                        width: 40,
                                                                        borderRadius: 50,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        marginRight: 10,
                                                                    }}
                                                                />
                                                                <Text>Lock Comment</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <VectorIcon
                                                                    name="delete"
                                                                    type="MaterialIcons"
                                                                    size={25}
                                                                    style={{
                                                                        backgroundColor: '#EBECF0',
                                                                        height: 40,
                                                                        width: 40,
                                                                        borderRadius: 50,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        marginRight: 10,
                                                                    }}
                                                                />
                                                                <Text>Delete Post</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </Modal>
                                        </View>
                                    </View>
                                    <Text style={styles.caption}>{ph.post_content}</Text>
                                </View>
                                <View style={styles.postFooterContainer}>
                                    <View style={styles.footerReactionSec}>
                                        {countPostReaction[index] > 0 && (
                                            <View style={styles.row}>
                                                {countPostReaction[index] > 0 && <Image source={Like} style={styles.reactionIcon} />}
                                                {countPostReaction[index] > 0 && <Image source={Wow} style={styles.reactionIcon} />}
                                                {countPostReaction[index] > 0 && <Image source={Love} style={styles.reactionIcon} />}
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.userActionSec}>
                                        <View>
                                            {checkReaction[index] && checkReaction[index].reacted === true && checkReaction[index].data.length > 0 ? (
                                                checkReaction[index].data[0].reaction_id === 1 ? (
                                                    <TouchableOpacity
                                                        onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true); }}
                                                        // onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }}
                                                        onPress={() => likeReaction(ph.id)}
                                                        style={styles.row}>
                                                        <VectorIcon
                                                            name="like1"
                                                            type="AntDesign"
                                                            size={25}
                                                            color="blue"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                ) : checkReaction[index].data[0].reaction_id === 2 ? (
                                                    <TouchableOpacity
                                                        onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true); }}
                                                        // onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }}
                                                        onPress={() => likeReaction(ph.id)}
                                                        style={styles.row}>
                                                        <VectorIcon
                                                            name="heart"
                                                            type="AntDesign"
                                                            size={25}
                                                            color="red"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                ) : checkReaction[index].data[0].reaction_id === 3 ? (
                                                    <TouchableOpacity
                                                        onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true); }}
                                                        // onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }}
                                                        onPress={() => likeReaction(ph.id)}
                                                        style={styles.row}>
                                                        <VectorIcon
                                                            name="laugh-squint"
                                                            type="FontAwesome5"
                                                            size={25}
                                                            color="#f7a339"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity
                                                        onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true); }}
                                                        // onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }}
                                                        onPress={() => likeReaction(ph.id)}
                                                        style={styles.row}>
                                                        <VectorIcon
                                                            name="like2"
                                                            type="AntDesign"
                                                            size={25}
                                                            color="#3A3A3A"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                )
                                            ) : (
                                                <TouchableOpacity
                                                    onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true); }}
                                                    // onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }}
                                                    onPress={() => likeReaction(ph.id)}
                                                    style={styles.row}>
                                                    <VectorIcon
                                                        name="like2"
                                                        type="AntDesign"
                                                        size={25}
                                                        color="#3A3A3A"
                                                    />
                                                    <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                </TouchableOpacity>
                                            )}
                                            < Modal
                                                isVisible={isModalVisible}
                                                backdropColor='transparent'
                                                onBackdropPress={() => setModalVisible(false)}
                                                style={styles.modalReaction}>
                                                <View style={styles.modalContainer}>
                                                    <TouchableOpacity>
                                                        <Image source={Like} style={styles.reactionAction} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Image source={Love} style={styles.reactionAction} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Image source={Wow} style={styles.reactionAction} />
                                                    </TouchableOpacity>
                                                </View>
                                            </Modal>
                                        </View>
                                        <View>
                                            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Bình luận', { postId: ph.id })}>
                                                <VectorIcon
                                                    name="chatbox-outline"
                                                    type="Ionicons"
                                                    size={25}
                                                    color="#3A3A3A"
                                                />
                                                <Text style={styles.reactionCount}>{countPostComment[index]}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.row}>
                                            <VectorIcon
                                                name="arrow-redo-outline"
                                                type="Ionicons"
                                                size={25}
                                                color="#3A3A3A"
                                            />
                                            {/* <Text style={styles.reactionCount}>Share</Text> */}
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                            </View>
                        </>
                    );
                })}
            </ScrollView>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </Fragment >
    );
});

const styles = StyleSheet.create({
    postHeaderContainer: {
        padding: 16,
        width: windowWidth
    },
    userProfile: {
        height: 40,
        width: 40,
        borderRadius: 50,
    },
    row: {
        flexDirection: 'row',
    },
    postTop: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    username: {
        fontSize: 16,
        color: "#26282b",
        marginBottom: 2,
    },
    userSection: {
        marginLeft: 12,
    },
    days: {
        fontSize: 14,
        color: "#989FA7"
    },
    dot: {
        fontSize: 14,
        color: "#989FA7",
        paddingHorizontal: 8,
    },
    userIcon: {
        marginTop: 3,
    },
    headerIcons: {
        marginRight: 20,
    },
    caption: {
        color: "#3A3A3A",
        fontSize: 15,
        marginTop: 10,
    },
    reactionIcon: {
        height: 20,
        width: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postFooterContainer: {
        padding: 16,
        width: windowWidth
    },
    reactionCount: {
        color: "#3A3A3A",
        fontSize: 14,
        paddingLeft: 5,
    },
    footerReactionSec: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF0",
        paddingBottom: 15,
    },
    userActionSec: {
        marginTop: 15,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    divider: {
        height: 1,
        width: windowWidth,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    modalReaction: {
        width: 0.7 * windowWidth,
        height: 0.4 * windowHeight
    },
    modalContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20
    },
    reactionAction: {
        width: 50,
        height: 50
    }
});

export default Post;