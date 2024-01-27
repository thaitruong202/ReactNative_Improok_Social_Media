import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import VectorIcon from '../utils/VectorIcon';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { Box, HStack, Heading, Spinner } from 'native-base';
import { SPSheet } from 'react-native-popup-confirm-toast'
import Swiper from 'react-native-swiper';
import SubHeader from "../layouts/SubHeader";
import Header from "../layouts/Header";

const HomeScreen = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [postList, setPostList] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [countPostReaction, setCountPostReaction] = useState([]);
    const [countPostComment, setCountPostComment] = useState([]);
    const [checkReaction, setCheckReaction] = useState([]);
    const [imageList, setImageList] = useState([]);

    const [seletedPostId, setSelectedPostId] = useState();

    const [isMenuVisible, setMenuVisible] = useState(false);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(null);

    const [loading, setLoading] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true)
        if (userInfo?.id) {
            const getPostAgain = async (pageNumber) => {
                setLoading(true);
                try {
                    const token = await AsyncStorage.getItem('token');
                    let res = await djangoAuthApi(token).get(endpoints['get-all-post'](pageNumber))
                    setPostList(res.data.results);
                    setPage(pageNumber);
                    setPageSize(res.data.count);
                    console.log(res.data.results.length);
                    const postIds = res.data.results.map(post => post.id);
                    const reactionCounts = [];
                    const commentCounts = [];
                    const reactionChecks = [];
                    const imageLists = [];
                    for (let i = 0; i < res.data.results.length; i++) {
                        let postId = postIds[i];
                        let reactionRes = await djangoAuthApi(token).get(endpoints['count-post-reaction'](postId));
                        let commentRes = await djangoAuthApi(token).get(endpoints['count-post-comment'](postId));
                        let resCheck = await djangoAuthApi(token).get(endpoints['check-reacted-to-post'](userInfo?.id, postId));
                        let imgs = await djangoAuthApi(token).get(endpoints['get-post-image'](postId));
                        let reactCount = reactionRes.data
                        reactionCounts.push(reactCount);
                        let cmtCounts = commentRes.data
                        commentCounts.push(cmtCounts);
                        let reactedCheck = resCheck.data;
                        reactionChecks.push(reactedCheck);
                        let imgArr = imgs.data;
                        imageLists.push(imgArr)
                    }
                    setCountPostReaction(reactionCounts);
                    setCountPostComment(commentCounts);
                    setCheckReaction(reactionChecks);
                    setImageList(imageLists);
                    console.log(res.data.results);
                    console.log(reactionCounts);
                    console.log(reactionChecks);
                    console.log(imageLists);
                    console.log("Refresh")
                } catch (error) {
                    console.log(error)
                }
                setLoading(false);
            }
            getPostAgain(1)
        }
        setRefreshing(false);
    };

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
            let res = await djangoAuthApi(token).get(endpoints['get-all-post'](pageNumber))
            setPostList((prevPostList) => [...prevPostList, ...res.data.results]);
            setPage(pageNumber);
            setPageSize(res.data.count);
            console.log(res.data.results.length);
            const postIds = res.data.results.map(post => post.id);
            const reactionCounts = [];
            const commentCounts = [];
            const reactionChecks = [];
            const imageLists = [];
            for (let i = 0; i < res.data.results.length; i++) {
                let postId = postIds[i];
                let reactionRes = await djangoAuthApi(token).get(endpoints['count-post-reaction'](postId));
                let commentRes = await djangoAuthApi(token).get(endpoints['count-post-comment'](postId));
                let resCheck = await djangoAuthApi(token).get(endpoints['check-reacted-to-post'](userInfo?.id, postId));
                let imgs = await djangoAuthApi(token).get(endpoints['get-post-image'](postId));
                let reactCount = reactionRes.data
                reactionCounts.push(reactCount);
                let cmtCounts = commentRes.data
                commentCounts.push(cmtCounts);
                let reactedCheck = resCheck.data;
                reactionChecks.push(reactedCheck);
                let imgArr = imgs.data;
                imageLists.push(imgArr)
            }
            setCountPostReaction((prevCountPostReaction) => [...prevCountPostReaction, ...reactionCounts]);
            setCountPostComment((prevCountPostComment) => [...prevCountPostComment, ...commentCounts]);
            setCheckReaction((prevCheckReaction) => [...prevCheckReaction, ...reactionChecks]);
            setImageList((prevImageList) => [...prevImageList, ...imageLists]);
            console.log(res.data.results);
            console.log(reactionCounts);
            console.log(reactionChecks);
            console.log(imageLists);
            console.log("Refresh")
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

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
                if (isModalVisible === true) {
                    setModalVisible(false)
                }
            }
            else {
                console.log("Xóa like");
                console.log(postId, userInfo?.id);
                let res = await djangoAuthApi(token).get(endpoints['check-reaction'](postId, userInfo?.id))
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

    const reactionPopUp = async (reactionType) => {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log(userInfo?.id, seletedPostId)
            let check = await djangoAuthApi(token).get(endpoints['check-reacted-to-post'](userInfo?.id, seletedPostId))
            console.log(check.data.reacted);
            if (check.data.reacted === false) {
                console.log("Vô if nè")
                console.log("New reaction")
                console.log("Loại reaction: ", reactionType)
                console.log("Bài post số: ", seletedPostId)
                console.log("User: ", userInfo?.id)
                console.log(typeof (reactionType))
                let res = await djangoAuthApi(token).post(endpoints['reaction-on-post'], {
                    "reaction": reactionType,
                    "post": seletedPostId,
                    "account": userInfo?.id
                })
                console.log(res.data)
                if (isModalVisible === true) {
                    setModalVisible(false)
                }
            }
            else {
                console.log("Vô else nè")
                console.log(check.data.data[0].reaction_id)
                if (check.data.data[0].reaction_id == reactionType) {
                    console.log("Không có gì xảy ra hết!")
                    setModalVisible(false)
                }
                else {
                    let res = await djangoAuthApi(token).get(endpoints['check-reaction'](seletedPostId, userInfo?.id))
                    console.log(res.data[0].id);
                    let change = await djangoAuthApi(token).patch(endpoints['update-post-reaction'](res.data[0].id), {
                        "reaction": reactionType,
                        "post": seletedPostId
                    })
                    console.log(change.data)
                    setModalVisible(false)
                    console.log("Đổi reaction thành công!")
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const toggleMenu = (postId) => {
        setMenuVisible(!isMenuVisible);
        setSelectedPostId(postId);
    }

    const toggleReaction = (postId) => {
        setModalVisible(!isModalVisible)
        setSelectedPostId(postId)
    }

    const handleScroll = async (event) => {
        console.log("Hello");
        event.persist();
        const { layoutMeasurement, contentOffset, contentSize } = event?.nativeEvent || {};

        const isEndOfScrollView = layoutMeasurement?.height + contentOffset?.y >= contentSize?.height;
        if (!isEndOfScrollView) return;

        try {
            const hasMoreData = postList.length > 0 && postList.length < pageSize;
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

    const lockOrUnlock = async (phId, spSheet) => {
        try {
            console.log("Khóa bình luận bài post", phId);
            const token = await AsyncStorage.getItem("token");
            let check = await djangoAuthApi(token).get(endpoints['get-post-by-post-id'](phId))
            console.log(check.data.comment_lock);
            let res = await djangoAuthApi(token).patch(endpoints['lock-comment'](phId), {
                "comment_lock": check.data.comment_lock === true ? false : true
            })
            spSheet.hide()
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deletePost = async (phId, spSheet) => {
        try {
            const token = await AsyncStorage.getItem('token')
            let del = await djangoAuthApi(token).delete(endpoints['delete-post'](phId))
            console.log(del.data, del.status)
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
                    <TouchableOpacity onPress={() => lockOrUnlock(props.phId, props.spSheet)}>
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
                    <TouchableOpacity onPress={() => deletePost(props.phId, props.spSheet)}>
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
            </Fragment>
        );
    };

    return (
        <Fragment>
            <Header />
            <ScrollView onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >
                <SubHeader />
                <View style={{
                    height: 5, backgroundColor: "lightgrey", marginTop: 15, marginBottom: 15
                }}>
                </View>
                {postList.map((pl, index) => {
                    return (
                        <>
                            <View key={pl.id}>
                                <View style={styles.postHeaderContainer}>
                                    <View style={styles.postTop}>
                                        <View style={styles.row}>
                                            <Image source={pl.account?.avatar === null ? require('../images/user.png') : { uri: pl.account?.avatar }}
                                                style={styles.userProfile} />
                                            <View style={styles.userSection}>
                                                <Text style={styles.username}>{pl.account.user?.last_name} {pl.account.user?.first_name}</Text>
                                                <View style={styles.row}>
                                                    <Text style={styles.days}>{pl.created_date}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    const spSheet = SPSheet;
                                                    spSheet.show({
                                                        component: () => component({ ...this.props, phId: pl.id, spSheet }),
                                                        dragFromTopOnly: true,
                                                        height: 0.4 * windowHeight
                                                    });
                                                }}>
                                                <VectorIcon
                                                    name="dots-three-horizontal"
                                                    type="Entypo"
                                                    size={25}
                                                    color="#606770"
                                                    style={styles.headerIcons}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text style={styles.caption}>{pl.post_content}</Text>
                                </View>
                                {imageList[index] && imageList[index].length !== 0 ?
                                    <View style={{ width: windowWidth, height: windowHeight / 3 }}>
                                        <Swiper autoplay={false} loop={false} showsButtons={true}>
                                            {imageList[index].map((item, itemIndex) => (
                                                <View key={itemIndex}>
                                                    <Image source={{ uri: item.post_image_url }} style={styles.image} />
                                                </View>
                                            ))}
                                        </Swiper>
                                    </View>
                                    : ""}
                                <View style={styles.postFooterContainer}>
                                    <View style={styles.footerReactionSec}>
                                        {countPostReaction[index] > 0 && (
                                            <View style={styles.row}>
                                                {countPostReaction[index] > 0 && <VectorIcon
                                                    name="like1"
                                                    type="AntDesign"
                                                    size={20}
                                                    color="blue"
                                                />}
                                                {countPostReaction[index] > 0 &&
                                                    <VectorIcon
                                                        name="heart"
                                                        type="AntDesign"
                                                        size={20}
                                                        color="red"
                                                    />
                                                }
                                                {countPostReaction[index] > 0 &&
                                                    <VectorIcon
                                                        name="laugh-squint"
                                                        type="FontAwesome5"
                                                        size={20}
                                                        color="#f7a339"
                                                    />
                                                }
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.userActionSec}>
                                        <View>
                                            {checkReaction[index] && checkReaction[index].reacted === true && checkReaction[index].data.length > 0 ? (
                                                checkReaction[index].data[0].reaction_id === 1 ? (
                                                    <TouchableOpacity
                                                        onLongPress={() => { setCurrentPostId(pl.id); toggleReaction(pl.id); }}
                                                        onPress={() => likeReaction(pl.id)}
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
                                                        onLongPress={() => { setCurrentPostId(pl.id); toggleReaction(pl.id); }}
                                                        // onPress={() => { setCurrentPostId(pl.id); setIsPostIdUpdated(true); }}
                                                        onPress={() => likeReaction(pl.id)}
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
                                                        onLongPress={() => { setCurrentPostId(pl.id); toggleReaction(pl.id) }}
                                                        onPress={() => likeReaction(pl.id)}
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
                                                        onLongPress={() => { setCurrentPostId(pl.id); toggleReaction(pl.id) }}
                                                        onPress={() => likeReaction(pl.id)}
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
                                                    onLongPress={() => { setCurrentPostId(pl.id); toggleReaction(pl.id); }}
                                                    // onPress={() => { setCurrentPostId(pl.id); setIsPostIdUpdated(true); }}
                                                    onPress={() => likeReaction(pl.id)}
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
                                                onBackdropPress={() => toggleReaction(index)}
                                                style={styles.modalReaction}>
                                                <View style={styles.modalContainer}>
                                                    <TouchableOpacity onPress={() => reactionPopUp("1")}>
                                                        <VectorIcon
                                                            name="like1"
                                                            type="AntDesign"
                                                            size={35}
                                                            color="blue"
                                                        />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => reactionPopUp("2")}>
                                                        <VectorIcon
                                                            name="heart"
                                                            type="AntDesign"
                                                            size={35}
                                                            color="red"
                                                        />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => reactionPopUp("3")}>
                                                        <VectorIcon
                                                            name="laugh-squint"
                                                            type="FontAwesome5"
                                                            size={35}
                                                            color="#f7a339"
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </Modal>
                                        </View>
                                        <View>
                                            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Comment', { postId: pl.id, accountId: pl.account })}>
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
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                            </View>
                        </>
                    );
                })}
            </ScrollView>
            {loading && <HStack space={2} justifyContent="center">
                <Spinner color="indigo.500" accessibilityLabel=" Loading posts" />
                <Heading color="indigo.500" fontSize="lg">
                    Loading
                </Heading>
            </HStack>}
        </Fragment >
    );
};

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
    },
    image: {
        width: '100%',
        height: '100%'
    }
});

export default HomeScreen;