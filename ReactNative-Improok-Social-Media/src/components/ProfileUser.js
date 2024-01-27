import { MyUserContext } from '../../App';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import VectorIcon from '../utils/VectorIcon';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import Apis, { djangoAuthApi, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import PostUser from '../layouts/PostUser';

const ProfileUser = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const route = useRoute()
    const { uid } = route.params

    const [userInfo, setUserInfo] = useState()
    const [profileInfo, setProfileInfo] = useState()

    const [profile, setProfile] = useState()

    const postRef = useRef(null);
    const navigation = useNavigation()

    const getCurrentProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](uid))
            setProfileInfo(res.data);
        } catch (err) {
            console.log(err)
        }
    }

    const getProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            let res = await djangoAuthApi(token).get(endpoints['get-user-by-id'](uid))
            console.log(res.data)
            setProfile(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user.id))
            setUserInfo(res.data);
        } catch (error) {
            consolelog(error)
        }
    }

    useEffect(() => {
        getCurrentProfile()
        getProfile()
        getCurrentUser()
    }, [])

    const [isVisible, setVisible] = useState(false);
    const [isAvatarVisible, setAvatarVisible] = useState(false);

    const handleProfileScroll = (event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const isEndOfScroll = contentOffset.y >= (contentSize.height - layoutMeasurement.height);

        if (isEndOfScroll) {
            postRef.current.handleScroll(event);
        }
    };

    // const createRoom = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem('token')
    //         console.log("", user.id, profile.id)
    //         let res = await djangoAuthApi(token).post(endpoints['create-room'], {
    //             "first_user": user.id,
    //             "second_user": profile.id
    //         })
    //         console.log(res.data)
    //     } catch (error) {
    //         const token = await AsyncStorage.getItem('token')
    //         console.log(error.response.data.error)
    //         console.log("first_user:", user.id, "second_user:", profile.id)
    //         try {
    //             if (error.response.data.error === "Room already exists.") {
    //                 let res = await Apis.get(endpoints['find-room'], {
    //                     "first_user": user.id,
    //                     "second_user": profile.id
    //                 });
    //                 console.log("Phòng", res.data.results[0])
    //                 const roomInfo = res.data.results[0]
    //                 if (roomInfo.first_user.id === user.id) {
    //                     navigation.navigate('Message', {
    //                         roomId: roomInfo.id,
    //                         firstName: roomInfo.second_user?.user?.first_name,
    //                         lastName: roomInfo.second_user?.user?.last_name,
    //                         avatar: roomInfo.second_user?.avatar,
    //                     });
    //                     console.log(roomInfo.id, roomInfo.second_user?.user?.first_name, roomInfo.second_user?.user?.last_name, roomInfo.second_user?.avatar)
    //                 } else {
    //                     navigation.navigate('Message', {
    //                         roomId: roomInfo.id,
    //                         firstName: roomInfo.first_user?.user?.first_name,
    //                         lastName: roomInfo.first_user?.user?.last_name,
    //                         avatar: roomInfo.first_user?.avatar,
    //                     });
    //                     console.log(roomInfo.id, roomInfo.first_user?.user?.first_name, roomInfo.first_user?.user?.last_name, roomInfo.first_user?.avatar)
    //                 }
    //             }
    //         } catch (error) {
    //             console.log(error.response.data.error)
    //         }
    //     }
    // }

    const createRoom = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            console.log(user.id, profile.id)
            let res = await djangoAuthApi(token).post(endpoints['create-room'], {
                "first_user": userInfo?.id,
                "second_user": profileInfo?.id
            })
            console.log(res.data)
            let nav = await Apis.post(endpoints['find-room'], {
                "first_user": userInfo?.id,
                "second_user": profileInfo?.id
            });
            console.log("Phòng", nav.data[0])
            const roomInfo = nav.data[0]
            if (roomInfo.first_user.id === user.id) {
                navigation.navigate('Message', {
                    roomId: roomInfo.id,
                    firstName: roomInfo.second_user?.user?.first_name,
                    lastName: roomInfo.second_user?.user?.last_name,
                    avatar: roomInfo.second_user?.avatar,
                });
                // console.log(roomInfo.id, roomInfo.second_user?.user?.first_name, roomInfo.second_user?.user?.last_name, roomInfo.second_user?.avatar)
            } else {
                navigation.navigate('Message', {
                    roomId: roomInfo.id,
                    firstName: roomInfo.first_user?.user?.first_name,
                    lastName: roomInfo.first_user?.user?.last_name,
                    avatar: roomInfo.first_user?.avatar,
                });
                // console.log(roomInfo.id, roomInfo.first_user?.user?.first_name, roomInfo.first_user?.user?.last_name, roomInfo.first_user?.avatar)
            }
        } catch (error) {
            const token = await AsyncStorage.getItem('token')
            console.log(error.response.data.error)
            console.log("first_user:", user.id, "second_user:", profile.id)
            try {
                if (error.response.data.error === "Room already exists.") {
                    let res = await Apis.post(endpoints['find-room'], {
                        "first_user": userInfo?.id,
                        "second_user": profileInfo?.id
                    });
                    console.log("Phòng", res.data[0])
                    const roomInfo = res.data[0]
                    if (roomInfo.first_user.id === user.id) {
                        navigation.navigate('Message', {
                            roomId: roomInfo.id,
                            firstName: roomInfo.second_user?.user?.first_name,
                            lastName: roomInfo.second_user?.user?.last_name,
                            avatar: roomInfo.second_user?.avatar,
                        });
                        // console.log(roomInfo.id, roomInfo.second_user?.user?.first_name, roomInfo.second_user?.user?.last_name, roomInfo.second_user?.avatar)
                    } else {
                        navigation.navigate('Message', {
                            roomId: roomInfo.id,
                            firstName: roomInfo.first_user?.user?.first_name,
                            lastName: roomInfo.first_user?.user?.last_name,
                            avatar: roomInfo.first_user?.avatar,
                        });
                        // console.log(roomInfo.id, roomInfo.first_user?.user?.first_name, roomInfo.first_user?.user?.last_name, roomInfo.first_user?.avatar)
                    }
                }
            } catch (error) {
                console.log(error.response.data.error)
            }
        }
    }

    // const checkvar = async () => {
    //     try {
    //         let res = await Apis.get(endpoints['find-room'], {
    //             "first_user": 1,
    //             "second_user": 2
    //         }, {
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         });
    //         console.log(res.data.results)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    return (
        <>
            <ScrollView onScroll={handleProfileScroll}
                scrollEventThrottle={16}>
                <View>
                    <TouchableOpacity
                        onPress={() => setVisible(true)}>
                        <Image
                            source={profileInfo?.cover_avatar === null ? require('../images/picture.png') : { uri: profileInfo?.cover_avatar }}
                            style={styles.coverPhoto} />
                    </TouchableOpacity>
                    <Modal
                        isVisible={isVisible}
                        animationIn={'slideInUp'}
                        animationInTiming={150}
                        animationOut={'slideOutDown'}
                        backdropColor='black'
                        backdropOpacity={1}
                        animationOutTiming={150}
                        swipeDirection='down'
                        onSwipeComplete={() => {
                            setVisible(false)
                        }}
                        onBackdropPress={() => {
                            setVisible(false)
                        }}
                    >
                        <View style={{ width: windowWidth }}>
                            <Image
                                source={profileInfo?.cover_avatar === null ? require('../images/picture.png') : { uri: profileInfo?.cover_avatar }}
                                style={{ width: '100%', height: windowHeight / 3 }} />
                        </View>
                    </Modal>
                </View>
                <TouchableOpacity style={styles.avatarContainer}
                    onPress={() => setAvatarVisible(true)}>
                    <Image style={styles.avatar}
                        source={profileInfo?.avatar === null ? require('../images/user.png') : { uri: profileInfo?.avatar }} />
                    <Modal
                        isVisible={isAvatarVisible}
                        animationIn={'slideInUp'}
                        animationInTiming={150}
                        animationOut={'slideOutDown'}
                        backdropColor='black'
                        backdropOpacity={1}
                        animationOutTiming={150}
                        swipeDirection='down'
                        onBackdropPress={() => {
                            setAvatarVisible(false)
                        }}
                        onSwipeComplete={() => {
                            setAvatarVisible(false)
                        }}
                    >
                        <View style={{ width: windowWidth }}>
                            <Image source={profileInfo?.avatar === null ? require('../images/user.png') : { uri: profileInfo?.avatar }}
                                style={{ width: '100%', height: windowHeight / 3 }} />
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Text style={styles.name}>{profile?.last_name} {profile?.first_name}</Text>
                <Text style={styles.shortBio}>Trưởng phòng Y Tế Nhà Bè</Text>
                <View style={styles.profileTabsContainer}>
                    <TouchableOpacity style={[styles.tabContainer, { backgroundColor: '#591aaf' }]}
                        onPress={() => createRoom()}>
                        <VectorIcon
                            name="chatbubble-ellipses-outline"
                            type="Ionicons"
                            size={22}
                            color='white'
                        ></VectorIcon>
                        <Text style={[styles.tabText, { color: 'white' }]}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabContainer, { backgroundColor: 'lightgray' }]}>
                        <VectorIcon
                            name="information-circle-outline"
                            type="Ionicons"
                            size={22}
                            color='black'
                        ></VectorIcon>
                        <Text style={[styles.tabText, { color: 'black' }]}>Information</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.aboutheadingContainer}>
                    <Text style={styles.aboutText}>About</Text>
                    <Text style={styles.seeAllText}>See All</Text>
                </View>
                <View style={styles.workContainer}>
                    <VectorIcon></VectorIcon>
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>Founder at</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 5 }}>
                        House Raft
                    </Text>
                </View>
                <View style={styles.workContainer}>
                    <VectorIcon
                    ></VectorIcon>
                    <Text style={{ fontSize: 18, marginLeft: 10 }}>Lives in</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 5 }}>
                        Hau Giang
                    </Text>
                </View>
                <View style={styles.divider}></View>
                <PostUser ref={postRef} userId={uid} />
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    coverPhoto: {
        width: windowWidth,
        height: windowHeight / 4.5,
    },
    avatarContainer: {
        height: 160,
        width: 160,
        borderRadius: 200,
        backgroundColor: 'white',
        position: 'absolute',
        alignSelf: 'left',
        marginTop: windowHeight / 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    avatar: {
        height: '95%',
        width: '95%',
        borderRadius: 72
    },
    name: {
        alignSelf: 'flex-start',
        marginTop: 80,
        fontWeight: 'bold',
        fontSize: 30,
        marginLeft: 10
    },
    shortBio: {
        alignSelf: 'flex-start',
        fontSize: 18,
        color: 'gray',
        marginLeft: 10,
        marginTop: 10
    },
    profileTabsContainer: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    tabContainer: {
        height: 40,
        width: windowWidth / 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        gap: 8
    },
    tabImage: {
        height: 30,
        width: 30,
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        alignItems: 'center'
    },
    divider: {
        height: 2,
        width: '95%',
        backgroundColor: 'lightgray',
        alignSelf: 'center',
        marginTop: 10,
    },
    aboutheadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 10,
    },
    aboutText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    seeAllText: {
        color: 'blue',
        fontSize: 18,
    },
    workContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 15,
    },
    workIcon: {
        height: 25,
        width: 25,
        tintColor: 'lightgray',
    },
    editButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        backgroundColor: 'blue',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    }
});

export default ProfileUser;