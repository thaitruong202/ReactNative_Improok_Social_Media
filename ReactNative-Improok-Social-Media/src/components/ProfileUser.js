import { MyUserContext } from '../../App';
import { useRoute } from '@react-navigation/native';
import { ScrollView, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import VectorIcon from '../utils/VectorIcon';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import PostUser from '../layouts/PostUser';

const ProfileUser = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const route = useRoute()
    const { uid } = route.params

    const [userInfo, setUserInfo] = useState();

    const [profile, setProfile] = useState()

    const postRef = useRef(null);

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](uid))
            setUserInfo(res.data);
        } catch (err) {
            console.log(err)
        }
    }

    const getUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            let res = await djangoAuthApi(token).get(endpoints['get-user-by-id'](uid))
            console.log(res.data)
            setProfile(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCurrentUser()
        getUser()
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

    return (
        <>
            <ScrollView onScroll={handleProfileScroll}
                scrollEventThrottle={16}>
                <View>
                    <TouchableOpacity
                        onPress={() => setVisible(true)}>
                        <Image
                            source={userInfo?.cover_avatar === null ? require('../images/picture.png') : { uri: userInfo?.cover_avatar }}
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
                                source={userInfo?.cover_avatar === null ? require('../images/picture.png') : { uri: userInfo?.cover_avatar }}
                                style={{ width: '100%', height: windowHeight / 3 }} />
                        </View>
                    </Modal>
                </View>
                <TouchableOpacity style={styles.avatarContainer}
                    onPress={() => setAvatarVisible(true)}>
                    <Image style={styles.avatar}
                        source={userInfo?.avatar === null ? require('../images/user.png') : { uri: userInfo?.avatar }} />
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
                            <Image source={userInfo?.avatar === null ? require('../images/user.png') : { uri: userInfo?.avatar }}
                                style={{ width: '100%', height: windowHeight / 3 }} />
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Text style={styles.name}>{profile?.last_name} {profile?.first_name}</Text>
                <Text style={styles.shortBio}>Trưởng phòng Y Tế Nhà Bè</Text>
                <View style={styles.profileTabsContainer}>
                    <View style={styles.tabContainer}>
                        <View style={styles.tabImageContainer}>
                            <VectorIcon
                                name="plus"
                                type="FontAwesome5"
                                size={20}
                            ></VectorIcon>
                        </View>
                        <Text style={styles.tabText}>Add Story</Text>
                    </View>
                    <View style={styles.tabContainer}>
                        <View style={styles.tabImageContainer}>
                            <VectorIcon
                                name="user"
                                type="FontAwesome5"
                                size={20}
                            ></VectorIcon>
                        </View>
                        <Text style={styles.tabText}>Edit Profile</Text>
                    </View>
                    <View style={styles.tabContainer}>
                        <View style={styles.tabImageContainer}>
                            <VectorIcon
                                name="list"
                                type="FontAwesome5"
                                size={20}
                            ></VectorIcon>
                        </View>
                        <Text style={styles.tabText}>Activity Log</Text>
                    </View>
                    <View style={styles.tabContainer}>
                        <View style={styles.tabImageContainer}>
                            <VectorIcon
                                name="dots-horizontal-circle"
                                type="MaterialCommunityIcons"
                                size={20}
                            ></VectorIcon>
                        </View>
                        <Text style={styles.tabText}>More</Text>
                    </View>
                </View>
                {/* <View style={styles.divider}></View> */}
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
                        Binh Thanh
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
        justifyContent: 'space-around',
    },
    tabContainer: {
        height: 90,
        width: windowWidth / 4.2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabImage: {
        height: 30,
        width: 30,
    },
    tabImageContainer: {
        height: 50,
        width: 50,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 60,
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
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