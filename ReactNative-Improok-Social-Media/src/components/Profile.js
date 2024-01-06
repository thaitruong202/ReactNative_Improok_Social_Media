import { ScrollView, Image, StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { MyUserContext } from '../../App';
import VectorIcon from '../utils/VectorIcon';
import { windowHeight, windowWidth } from '../utils/Dimensions';
import CreatePost from '../layouts/CreatePost';
import Timeline from '../layouts/Timeline';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const Profile = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();

    const [image, setImage] = useState();

    const [showModal, setShowModal] = useState(false);

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

    const changeAvatar = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            console.log('Permission not granted');
            return;
        }

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
        };

        const result = await ImagePicker.launchImageLibraryAsync(options);

        if (result.canceled) {
            console.log('User cancelled image picker');
        } else {
            const selectedImages = result.assets[0];
            const localUri = selectedImages.uri;
            console.log('Đường dẫn:', localUri);
            setImage(localUri);
            setShowModal(true);
        }
    }

    const saveAvatar = async () => {
        setShowModal(false);
        const token = await AsyncStorage.getItem('token');
        let form = new FormData();
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        form.append('avatar', { uri: image, name: filename, type });
        let res = await djangoAuthApi(token).patch(endpoints['avatar-change'](userInfo?.id), form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        console.log("Thông tin", image, filename, type);
        console.log("Cái gì dậy?", res.data, res.status);
        setUserInfo(prevState => ({ ...prevState, avatar: image }));
        getCurrentUser();
        setShowModal(false);
    }

    const saveCoverAvatar = async () => {
        const token = await AsyncStorage.getItem('token');
        let form = new FormData();
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        form.append('cover_avatar', { uri: image, name: filename, type });
        let res = await djangoAuthApi(token).patch(endpoints['cover-avatar-change'](userInfo?.id), form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        console.log("Thành công nha", res.data, res.status);
        setUserInfo(prevState => ({ ...prevState, cover_avatar: image }));
        getCurrentUser();
        setShowModal(false);
    }

    const cancelAvatar = () => {
        setShowModal(false);
        setImage(null);
    }

    return (
        <>
            <ScrollView>
                <View>
                    <Image source={{ uri: userInfo?.cover_avatar }} style={styles.coverPhoto} />
                    <TouchableOpacity style={styles.avatarChange} onPress={() => changeAvatar()}>
                        <View>
                            <TouchableOpacity>
                                <VectorIcon
                                    name="camera"
                                    type="FontAwesome5"
                                    size={20}
                                ></VectorIcon>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatar} source={{ uri: userInfo?.avatar }} />
                    <TouchableOpacity style={styles.avatarChange} onPress={() => changeAvatar()}>
                        <View>
                            <VectorIcon
                                name="camera"
                                type="FontAwesome5"
                                size={20}
                            ></VectorIcon>
                        </View>
                    </TouchableOpacity>
                </View>
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
                <Timeline />
            </ScrollView>
            <Modal visible={showModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Image source={{ uri: image }} style={styles.modalImage} />
                    <View style={styles.modalButtons}>
                        <Button title="Lưu" onPress={saveAvatar} />
                        <Button title="Hủy" onPress={cancelAvatar} />
                    </View>
                </View>
            </Modal>
            <Modal visible={showModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Image source={{ uri: image }} style={styles.modalImage} />
                    <View style={styles.modalButtons}>
                        <Button title="Lưu" onPress={saveCoverAvatar} />
                        <Button title="Hủy" onPress={cancelAvatar} />
                    </View>
                </View>
            </Modal>
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
        backgroundColor: 'blue',
        position: 'absolute',
        alignSelf: 'left',
        marginTop: windowHeight / 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    avatar: {
        height: '90%',
        width: '90%',
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
        right: 0,
        bottom: 0
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