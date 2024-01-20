import { ScrollView, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { MyUserContext } from '../../App';
import VectorIcon from '../utils/VectorIcon';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import CreatePost from '../layouts/CreatePost';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Post from '../layouts/Post';
import { SPSheet } from 'react-native-popup-confirm-toast';
import Modal from "react-native-modal";

const Profile = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();

    const [image, setImage] = useState();

    const postRef = useRef(null);

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user.id))
            setUserInfo(res.data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, [userInfo])

    const [isVisible, setVisible] = useState(false);
    const [isAvatarVisible, setAvatarVisible] = useState(false);

    // const changeAvatar = async () => {
    //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    //     if (status !== 'granted') {
    //         console.log('Permission not granted');
    //         return;
    //     }

    //     const options = {
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsMultipleSelection: true,
    //     };

    //     const result = await ImagePicker.launchImageLibraryAsync(options);

    //     if (result.cancelled) {
    //         console.log('User cancelled image picker');
    //     } else {
    //         const selectedImages = result.assets[0];
    //         const localUri = selectedImages.uri;
    //         console.log('Đường dẫn:', localUri);
    //         setImage(localUri);

    //         const token = await AsyncStorage.getItem('token');
    //         let form = new FormData();
    //         const filename = localUri.split('/').pop();
    //         const match = /\.(\w+)$/.exec(filename);
    //         const type = match ? `image/${match[1]}` : 'image';
    //         form.append('avatar', { uri: localUri, name: filename, type });
    //         let res = await djangoAuthApi(token).patch(endpoints['avatar-change'](userInfo?.id), form, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             }
    //         })
    //         console.log("Cái gì dậy?", res.data, res.status);
    //     }
    // }

    const changeAvatar = async (spSheet) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            console.log('Permission not granted');
            return;
        }

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1]
        };

        const result = await ImagePicker.launchImageLibraryAsync(options);

        if (result.canceled) {
            console.log('User cancelled image picker');
        } else {
            const selectedImages = result.assets[0];
            const localUri = selectedImages.uri;
            console.log('Đường dẫn:', localUri);
            setImage(localUri);
            const token = await AsyncStorage.getItem('token');
            let form = new FormData();
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image';
            form.append('avatar', { uri: localUri, name: filename, type });
            let res = await djangoAuthApi(token).patch(endpoints['avatar-change'](userInfo?.id), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            console.log("Thông tin", localUri, filename, type);
            console.log("Cái gì dậy?", res.data, res.status);
            // setUserInfo(prevState => ({ ...prevState, avatar: image }));
            getCurrentUser();
            spSheet.hide()
        }
    }

    const changeCoverAvatar = async (spSheet) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            console.log('Permission not granted');
            return;
        }

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        };

        const result = await ImagePicker.launchImageLibraryAsync(options);

        if (result.canceled) {
            console.log('User cancelled image picker');
        } else {
            const selectedImages = result.assets[0];
            const localUri = selectedImages.uri;
            console.log('Đường dẫn:', localUri);
            setImage(localUri);
            const token = await AsyncStorage.getItem('token');
            let form = new FormData();
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image';
            form.append('cover_avatar', { uri: localUri, name: filename, type });
            let res = await djangoAuthApi(token).patch(endpoints['avatar-change'](userInfo?.id), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            console.log("Thông tin", localUri, filename, type);
            console.log("Thành công nha", res.data, res.status);
            // setUserInfo(prevState => ({ ...prevState, cover_avatar: image }));
            getCurrentUser();
            spSheet.hide()
        }
    }

    const handleProfileScroll = (event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const isEndOfScroll = contentOffset.y >= (contentSize.height - layoutMeasurement.height);

        if (isEndOfScroll) {
            postRef.current.handleScroll(event);
        }
    };

    const avtarOption = (props) => {
        return (
            <Fragment>
                <View style={{ padding: 20, flexDirection: 'column', gap: 15 }}>
                    <TouchableOpacity onPress={() => { setAvatarVisible(true), props.spSheet.hide() }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <VectorIcon
                                name="user-circle"
                                type="FontAwesome5"
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
                            <Text>Xem ảnh đại diện</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeAvatar(props.spSheet)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <VectorIcon
                                name="images"
                                type="FontAwesome5"
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
                            <Text>Chọn ảnh đại diện</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Fragment>
        );
    };

    const coverOption = (props) => {
        return (
            <Fragment>
                <View style={{ padding: 20, flexDirection: 'column', gap: 15 }}>
                    <TouchableOpacity onPress={() => { setVisible(true), props.spSheet.hide() }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <VectorIcon
                                name="image"
                                type="FontAwesome5"
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
                            <Text>Xem ảnh bìa</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeCoverAvatar(props.spSheet)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <VectorIcon
                                name="upload"
                                type="FontAwesome5"
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
                            <Text>Chọn ảnh bìa</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Fragment>
        );
    };

    return (
        <>
            <ScrollView onScroll={handleProfileScroll}
                scrollEventThrottle={16}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            const spSheet = SPSheet;
                            spSheet.show({
                                component: () => coverOption({ ...this.props, spSheet }),
                                dragFromTopOnly: true,
                                height: 0.2 * windowHeight
                            });
                        }}>
                        <Image
                            source={userInfo?.cover_avatar === null ? require('../images/picture.png') : { uri: userInfo?.cover_avatar }}
                            style={styles.coverPhoto} />
                        <TouchableOpacity style={styles.coverAvatarChange}
                            onPress={() => {
                                const spSheet = SPSheet;
                                spSheet.show({
                                    component: () => coverOption({ ...this.props, spSheet }),
                                    dragFromTopOnly: true,
                                    height: 0.25 * windowHeight
                                });
                            }}
                        >
                            <VectorIcon
                                name="camera"
                                type="FontAwesome5"
                                size={20}
                            ></VectorIcon>
                        </TouchableOpacity>
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
                    onPress={() => {
                        const spSheet = SPSheet;
                        spSheet.show({
                            component: () => avtarOption({ ...this.props, spSheet }),
                            dragFromTopOnly: true,
                            height: 0.21 * windowHeight
                        });
                    }}>
                    <Image style={styles.avatar}
                        source={userInfo?.avatar === null ? require('../images/user.png') : { uri: userInfo?.avatar }} />
                    <TouchableOpacity style={styles.avatarChange}
                        onPress={() => {
                            const spSheet = SPSheet;
                            spSheet.show({
                                component: () => avtarOption({ ...this.props, spSheet }),
                                dragFromTopOnly: true,
                                height: 0.21 * windowHeight
                            });
                        }}>
                        <VectorIcon
                            name="camera"
                            type="FontAwesome5"
                            size={20}
                        ></VectorIcon>
                    </TouchableOpacity>
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
                <Text style={styles.name}>{user.last_name} {user.first_name}</Text>
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
                <CreatePost navigation={navigation} />
                <Post ref={postRef} />
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
    avatarChange: {
        height: 40,
        width: 40,
        backgroundColor: 'lightgray',
        borderRadius: 30,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 5,
        bottom: 5
    },
    coverAvatarChange: {
        height: 40,
        width: 40,
        backgroundColor: 'lightgray',
        borderRadius: 30,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 15,
        bottom: 10
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
    },
});

export default Profile;