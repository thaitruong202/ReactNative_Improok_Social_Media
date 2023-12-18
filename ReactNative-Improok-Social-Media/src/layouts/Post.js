import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import VectorIcon from '../utils/VectorIcon';
import { MyUserContext } from '../../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import Like from '../images/like.jpeg';
import Wow from '../images/wow.jpeg';
import Love from '../images/love.jpeg';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';

const Post = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [postHead, setPostHead] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    // const [likedPosts, setLikedPosts] = useState([]);
    const [isPostIdUpdated, setIsPostIdUpdated] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await axios.get(`http://192.168.1.134:8000/users/${user.id}/account/`, {
                    headers: {
                        'Authorization': "Bearer" + " " + token
                    },
                })
                setUserInfo(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getCurrentUser();
        const getPost = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await axios.get(`http://192.168.1.134:8000/accounts/${userInfo?.id}/posts/`, {
                    headers: {
                        'Authorization': "Bearer" + " " + token
                    },
                })
                setPostHead(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        if (userInfo?.id) {
            getPost();
        }
    }, [userInfo?.id])

    useEffect(() => {
        if (isPostIdUpdated) {
            likeReaction();
            setIsPostIdUpdated(false);
        }
    }, [isPostIdUpdated]);

    const likeReaction = async () => {
        try {
            if (isLiked === true) {
                const token = await AsyncStorage.getItem('token');
                let del = await axios.delete(`http://192.168.1.134:8000/post_reactions/1/`, {
                    headers: {
                        'Authorization': "Bearer" + " " + token
                    }
                })
                setIsLiked(false);
                console.log(del.status);
            }
            else {
                const token = await AsyncStorage.getItem('token');
                console.log(currentPostId, userInfo?.id);
                let res = await axios.post(`http://192.168.1.134:8000/post_reactions/`, {
                    "reaction": "1",
                    "post": currentPostId,
                    "account": userInfo?.id
                }, {
                    headers: {
                        'Authorization': "Bearer" + " " + token
                    }
                })
                setIsLiked(true);
                console.log(res.data, res.status)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Fragment>
            {postHead.map(ph => {
                // const momentDate = moment(ph.created_date);
                // const timeAgo = momentDate.fromNow();
                // const formattedDate = momentDate.format('DD/MM/YYYY');

                // const displayDate = momentDate.diff(moment(), 'days') > 10 ? formattedDate : timeAgo;

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
                                        <VectorIcon
                                            name="dots-three-horizontal"
                                            type="Entypo"
                                            size={25}
                                            color="#606770"
                                            style={styles.headerIcons}
                                        />
                                    </View>
                                </View>
                                <Text style={styles.caption}>{ph.post_content}</Text>
                            </View>
                            <View style={styles.postFooterContainer}>
                                <View style={styles.footerReactionSec}>
                                    <View style={styles.row}>
                                        <Image source={Like} style={styles.reactionIcon} />
                                        <Image source={Wow} style={styles.reactionIcon} />
                                        <Image source={Love} style={styles.reactionIcon} />
                                        <Text style={styles.reactionCount}>20</Text>
                                    </View>
                                    <Text style={styles.reactionCount}>10 comments</Text>
                                </View>
                                <View style={styles.userActionSec}>
                                    <View>
                                        <TouchableOpacity onLongPress={() => { setCurrentPostId(ph.id); setModalVisible(true) }} onPress={() => { setCurrentPostId(ph.id), setIsPostIdUpdated(true); }} style={styles.row}>
                                            <VectorIcon
                                                name="like2"
                                                type="AntDesign"
                                                size={25}
                                                color={isLiked ? "blue" : "#3A3A3A"}
                                            />
                                            <Text style={styles.reactionCount}>Like</Text>
                                        </TouchableOpacity>
                                        <Modal visible={isModalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.modalReaction}>
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
                                            <Text style={styles.reactionCount}>Comment</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.row}>
                                        <VectorIcon
                                            name="arrow-redo-outline"
                                            type="Ionicons"
                                            size={25}
                                            color="#3A3A3A"
                                        />
                                        <Text style={styles.reactionCount}>Share</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.divider}></View>
                        </View>
                    </>
                );
            })}
        </Fragment>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
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