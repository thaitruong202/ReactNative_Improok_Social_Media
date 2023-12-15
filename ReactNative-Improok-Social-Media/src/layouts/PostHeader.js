import { View, Image, StyleSheet, Text } from 'react-native';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import VectorIcon from '../utils/VectorIcon';
import { MyUserContext } from '../../App';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { windowWidth } from '../utils/Dimensions';

const PostHeader = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [postHead, setPostHead] = useState([]);

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

    return (
        <Fragment>
            {postHead.map(ph => {
                // const momentDate = moment(ph.created_date);
                // const timeAgo = momentDate.fromNow();
                // const formattedDate = momentDate.format('DD/MM/YYYY');

                // const displayDate = momentDate.diff(moment(), 'days') > 10 ? formattedDate : timeAgo;

                return (
                    <View style={styles.postHeaderContainer}>
                        <View style={styles.postTop}>
                            <View style={styles.row}>
                                <Image source={{ uri: userInfo?.avatar }} style={styles.userProfile} />
                                <View style={styles.userSection}>
                                    <Text style={styles.username}>{user.last_name} {user.first_name}</Text>
                                    <View style={styles.row}>
                                        <Text style={styles.days}>{ph.created_date}</Text>
                                        {/* <Text style={styles.dot}>•</Text>
                                        <VectorIcon
                                            name="user-friends"
                                            type="FontAwesome5"
                                            size={13}
                                            color="#606770"
                                            style={styles.userIcon}
                                        /> */}
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
});

export default PostHeader;