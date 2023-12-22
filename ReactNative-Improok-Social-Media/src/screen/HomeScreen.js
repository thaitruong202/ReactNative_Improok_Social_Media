import React, { useState, Fragment, useEffect } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SubHeader from "../layouts/SubHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { windowHeight, windowWidth } from "../utils/Dimensions";
import VectorIcon from "../utils/VectorIcon";
import { djangoAuthApi, endpoints } from "../configs/Apis";

const HomeScreen = ({ navigation }) => {
    const [postList, setPostList] = useState([]);
    useEffect(() => {
        const getPostList = async () => {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-all-post'])
            setPostList(res.data.results);
        }
        getPostList();
    }, [])

    const deletePost = async (postId) => {
        try {
            console.log(postId);
            const token = await AsyncStorage.getItem("token");
            let res = await axios.delete(`http://192.168.1.134:8000/posts/${postId}/`, {
                headers: {
                    'Authorization': "Bearer" + " " + token,
                }
            });
            console.log(res.status);
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <Fragment>
            <ScrollView>
                <SubHeader />
                {postList.map((ph, index) => {
                    return (
                        <>
                            <View key={ph.id}>
                                <View style={styles.postHeaderContainer}>
                                    <View style={styles.postTop}>
                                        <View style={styles.row}>
                                            <Image source={{ uri: ph.account.avatar }} style={styles.userProfile} />
                                            <View style={styles.userSection}>
                                                <Text style={styles.username}>{ph.account.user.last_name} {ph.account.user.first_name}</Text>
                                                <View style={styles.row}>
                                                    <Text style={styles.days}>{ph.created_date}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <TouchableOpacity onPress={() => deletePost(ph.id)}>
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
                                    <Text style={styles.caption}>{ph.post_content}</Text>
                                </View>
                                <View style={styles.postFooterContainer}>
                                    <View style={styles.footerReactionSec}>
                                    </View>
                                    <View style={styles.userActionSec}>
                                        <View>
                                            <TouchableOpacity style={styles.row}>
                                                <VectorIcon
                                                    name="like2"
                                                    type="AntDesign"
                                                    size={25}
                                                    color="#3A3A3A"
                                                />
                                                <Text style={styles.reactionCount}>10</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Bình luận', { postId: ph.id })}>
                                                <VectorIcon
                                                    name="chatbox-outline"
                                                    type="Ionicons"
                                                    size={25}
                                                    color="#3A3A3A"
                                                />
                                                {/* <Text style={styles.reactionCount}>Comment</Text> */}
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
                            </View >
                        </>
                    );
                })}
            </ScrollView>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    homeContainer: {
        backgroundColor: "#c9ccd1",
    },
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

export default HomeScreen;