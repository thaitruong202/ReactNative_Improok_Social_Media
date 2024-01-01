import React, { useContext, useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { MyUserContext } from '../../App';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import VectorIcon from '../utils/VectorIcon';
import Like from '../images/like.jpeg';
import Wow from '../images/wow.jpeg';
import Love from '../images/love.jpeg';

const Survey = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [postSurveyList, setPostSurveyList] = useState([]);
    const [countPostReaction, setCountPostReaction] = useState([]);
    const [countPostComment, setCountPostComment] = useState([]);
    const [checkReaction, setCheckReaction] = useState([]);

    const [postList, setPostList] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

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
        const getPostSurvey = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await djangoAuthApi(token).get(endpoints['get-post-surveys'])
                setPostSurveyList(res.data.results);
                console.log(res.data.results);
                console.log(res.data.results.length);
                const postIds = res.data.results.map(post => post.post);
                const posts = [];
                for (let i = 0; i < res.data.results.length; i++) {
                    let postId = postIds[0];
                    let res = await djangoAuthApi(token).get(endpoints['get-post-by-post-id'](postId))
                    let aPost = res.data;
                    posts.push(aPost);
                }
                setPostList(posts);
                console.log(postIds);
                console.log(posts);
                // const reactionCounts = [];
                // const commentCounts = [];
                // const reactionChecks = [];
                // for (let i = 0; i < res.data.length; i++) {
                //     let postId = postIds[i];
                //     let reactionRes = await djangoAuthApi(token).get(endpoints['count-post-reaction'](postId));
                //     let commentRes = await djangoAuthApi(token).get(endpoints['count-post-comment'](postId));
                //     let resCheck = await djangoAuthApi(token).get(endpoints['check-reacted-to-post'](userInfo?.id, postId));
                //     let reactCount = reactionRes.data
                //     reactionCounts.push(reactCount);
                //     let cmtCounts = commentRes.data
                //     commentCounts.push(cmtCounts);
                //     let reactedCheck = resCheck.data;
                //     reactionChecks.push(reactedCheck);
                // }
                // setCountPostReaction(reactionCounts);
                // setCountPostComment(commentCounts);
                // setCheckReaction(reactionChecks);
                // console.log(res.data);
                // console.log(reactionCounts);
                // console.log(reactionChecks);
            } catch (error) {
                console.log(error)
            }
        }
        getPostSurvey();
    }, [])

    return (
        <>
            <ScrollView>
                {postSurveyList.map((ph, index) => {
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
                                            <TouchableOpacity onPress={() => setOpenModal(true)}>
                                                <VectorIcon
                                                    name="dots-three-horizontal"
                                                    type="Entypo"
                                                    size={25}
                                                    color="#606770"
                                                    style={styles.headerIcons}
                                                />
                                            </TouchableOpacity>
                                            <Modal visible={openModal} animationType="slide" onBackdropPress={() => setOpenModal(false)} style={{ width: windowWidth, height: windowHeight / 2, backgroundColor: 'yellow', position: 'absolute', bottom: 0 }}>
                                                <View>
                                                    <TouchableOpacity>
                                                        <Text>Edit</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Text>Delete</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Text>Cancel</Text>
                                                    </TouchableOpacity>
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
                                                    <TouchableOpacity onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }} style={styles.row}>
                                                        <VectorIcon
                                                            name="like1"
                                                            type="AntDesign"
                                                            size={25}
                                                            color="blue"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                ) : checkReaction[index].data[0].reaction_id === 2 ? (
                                                    <TouchableOpacity onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }} style={styles.row}>
                                                        <VectorIcon
                                                            name="heart"
                                                            type="AntDesign"
                                                            size={25}
                                                            color="red"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                ) : checkReaction[index].data[0].reaction_id === 3 ? (
                                                    <TouchableOpacity onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }} style={styles.row}>
                                                        <VectorIcon
                                                            name="laugh-squint"
                                                            type="FontAwesome5"
                                                            size={25}
                                                            color="#f7a339"
                                                        />
                                                        <Text style={styles.reactionCount}>{countPostReaction[index]}</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }} style={styles.row}>
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
                                                <TouchableOpacity onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ph.id); setIsPostIdUpdated(true); }} style={styles.row}>
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
                            </View >
                        </>
                    );
                })}
            </ScrollView>
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