import React, { useContext, useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { MyUserContext } from '../../App';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import VectorIcon from '../utils/VectorIcon';
import Like from '../images/like.jpeg';
import Wow from '../images/wow.jpeg';
import Love from '../images/love.jpeg';
import Modal from 'react-native-modal'
import { HStack, Heading, Spinner } from 'native-base';

const Survey = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [postSurveyList, setPostSurveyList] = useState([]);
    const [countPostReaction, setCountPostReaction] = useState([]);
    const [countPostComment, setCountPostComment] = useState([]);
    const [checkReaction, setCheckReaction] = useState([]);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [pageSize, setPageSize] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const [isMenuVisible, setMenuVisible] = useState(false);

    const getPostSurvey = async (pageNumber) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-post-surveys'](pageNumber))
            console.log("-------------------");
            setPostSurveyList((prevPostSurveyList) => [...prevPostSurveyList, ...res.data.results]);
            setPage(pageNumber);
            setPageSize(res.data.count);
            console.log(res.data.results);
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleScroll = async (event) => {
        console.log("Cuộn tiếp đi");
        event.persist();
        const { layoutMeasurement, contentOffset, contentSize } = event?.nativeEvent || {};

        const isEndOfScrollView = layoutMeasurement?.height + contentOffset?.y >= contentSize?.height;
        if (!isEndOfScrollView) return;

        try {
            const hasMoreData = postSurveyList.length > 0 && postSurveyList.length < pageSize;

            if (hasMoreData && !loading) {
                const nextPage = page + 1;
                getPostSurvey(nextPage);
            }
        } catch (error) {
            console.error(error);
        }
    };

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
        getPostSurvey(1);
    }, [])

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    return (
        <>
            <ScrollView onScroll={handleScroll}
                scrollEventThrottle={16}>
                {postSurveyList.map((ps, index) => {
                    return (
                        <>
                            <View key={ps.id}>
                                <View style={styles.postHeaderContainer}>
                                    <View style={styles.postTop}>
                                        <View style={styles.row}>
                                            <Image
                                                source={ps.post.account.avatar === null ? require('../images/user.png') : { uri: ps.post.account.avatar }}
                                                style={styles.userProfile} />
                                            <View style={styles.userSection}>
                                                <Text style={styles.username}>{ps.post.account.user.last_name} {ps.post.account.user.first_name}</Text>
                                                <View style={styles.row}>
                                                    <Text style={styles.days}>{ps.created_date}</Text>
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
                                    <Text style={styles.caption}>{ps.post_survey_title}</Text>
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
                                                    <TouchableOpacity onLongPress={() => { setCurrentPostId(ps.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ps.id); setIsPostIdUpdated(true); }} style={styles.row}>
                                                        <VectorIcon
                                                            name="like1"
                                                            type="AntDesign"
                                                            size={25}
                                                            color="blue"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                ) : checkReaction[index].data[0].reaction_id === 2 ? (
                                                    <TouchableOpacity onLongPress={() => { setCurrentPostId(ps.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ps.id); setIsPostIdUpdated(true); }} style={styles.row}>
                                                        <VectorIcon
                                                            name="heart"
                                                            type="AntDesign"
                                                            size={25}
                                                            color="red"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                ) : checkReaction[index].data[0].reaction_id === 3 ? (
                                                    <TouchableOpacity onLongPress={() => { setCurrentPostId(ps.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ps.id); setIsPostIdUpdated(true); }} style={styles.row}>
                                                        <VectorIcon
                                                            name="laugh-squint"
                                                            type="FontAwesome5"
                                                            size={25}
                                                            color="#f7a339"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity onLongPress={() => { setCurrentPostId(ps.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ps.id); setIsPostIdUpdated(true); }} style={styles.row}>
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
                                                <TouchableOpacity onLongPress={() => { setCurrentPostId(ps.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ps.id); setIsPostIdUpdated(true); }} style={styles.row}>
                                                    <VectorIcon
                                                        name="like2"
                                                        type="AntDesign"
                                                        size={25}
                                                        color="#3A3A3A"
                                                    />
                                                    <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                </TouchableOpacity>
                                            )}
                                            < Modal visible={isModalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.modalReaction}>
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
                                            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Comment', { postId: ps.post.id })}>
                                                <VectorIcon
                                                    name="chatbox-outline"
                                                    type="Ionicons"
                                                    size={25}
                                                    color="#3A3A3A"
                                                />
                                                <Text style={styles.reactionCount}>{countPostComment[index]}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Survey detail', {
                                            postId: ps.post.id, firstName: ps.post.account.user.first_name,
                                            lastName: ps.post.account.user.last_name, avatar: ps.post.account.avatar,
                                            postTitle: ps.post_survey_title
                                        })}>
                                            <View>
                                                <VectorIcon
                                                    name="info-circle"
                                                    type="FontAwesome5"
                                                    size={25}
                                                    color="#3A3A3A"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                            </View >
                        </>
                    );
                })}
            </ScrollView>
            {/* {loading && <ActivityIndicator size="large" color="#0000ff" />} */}
            {loading && <HStack space={2} justifyContent="center">
                <Spinner color="indigo.500" accessibilityLabel=" Loading posts" />
                <Heading color="indigo.500" fontSize="lg">
                    Loading
                </Heading>
            </HStack>}
        </>
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
    }
});

export default Survey;