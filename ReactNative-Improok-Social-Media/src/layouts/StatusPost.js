import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MyUserContext } from '../../App';
import VectorIcon from '../utils/VectorIcon';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { Button } from 'native-base';
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../configs/Firebase';

const StatusPost = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext)
    const [text, setText] = useState('')
    const [userInfo, setUserInfo] = useState()
    const [selectedImages, setSelectedImages] = useState([])

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user?.id))
            setUserInfo(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, [user?.id])

    const createPost = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).post(endpoints['create-post'], {
                "post_content": text,
                "account": userInfo?.id
            })
            console.log(res.data, "Đăng bài thành công!")
            await onSend()
            navigation.goBack()
        } catch (error) {
            console.log(error)
        }
    }

    const openImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (status !== 'granted') {
            console.log('Permission not granted')
            return
        }

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
        };

        const result = await ImagePicker.launchImageLibraryAsync(options)

        if (result.canceled) {
            console.log('User canceled image picker')
        } else {
            const newSelectedImages = result.assets;
            setSelectedImages(prevSelectedImages => [...prevSelectedImages, ...newSelectedImages])
        }
    };

    useEffect(() => {
        console.log("Mảng đã chọn", selectedImages);
        // console.log("Mảng URI", imageUri);
    }, [selectedImages]);

    const createImagePost = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).post(endpoints['create-post'], {
                "post_content": text,
                "account": userInfo?.id
            })
            const postId = res.data?.id

            let form = new FormData()

            for (let i = 0; i < selectedImages.length; i++) {
                const image = selectedImages[i].uri
                const filename = image.split('/').pop()
                const match = /\.(\w+)$/.exec(filename)
                const type = match ? `image/${match[1]}` : 'image'
                form.append('multi_images', { uri: image, name: filename, type })
            }
            form.append('post', postId);

            let img = await djangoAuthApi(token).post(endpoints['send-multi-images'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            await onSend()
            setSelectedImages([])
            console.log(res.data, "Đăng bài thành công!")
            navigation.goBack()
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleDeleteImage = (index) => {
        setSelectedImages((prevSelectedImages) => {
            const updatedSelectedImages = [...prevSelectedImages]
            updatedSelectedImages.splice(index, 1)
            return updatedSelectedImages;
        });
    };

    const onSend = useCallback((messages = []) => {
        // setMessages([...messages, ...messages]);
        const { createAt, content, avatar } = {
            createAt: new Date(),
            content: `${user.last_name} ${user.first_name}` + " posted a new post: " + `${text}` + " ",
            avatar: userInfo?.avatar === null ? "https://res.cloudinary.com/dhwuwy0to/image/upload/v1706324215/dehgk4ybya4iwy4epduw.png" : userInfo?.avatar
        };
        addDoc(collection(database, 'notifications'), {
            createAt,
            content,
            avatar
        });
    }, []);

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileContainer}>
                    <Image source={userInfo?.avatar === null ? require('../images/user.png') : { uri: userInfo?.avatar }}
                        style={styles.profileStyle} />
                    <View style={styles.inputBox}>
                        <Text style={styles.inputStyle}>{user?.last_name} {user?.first_name}</Text>
                    </View>
                </View>
                <View>
                    <TextInput
                        multiline
                        numberOfLines={10}
                        value={text}
                        onChangeText={setText}
                        placeholder="What's on your mind?"
                        style={styles.textInputStyle}
                        blurOnSubmit={true}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
                    <TouchableOpacity style={styles.postOption} onPress={openImagePicker}>
                        <VectorIcon
                            name="images"
                            type="Ionicons"
                            size={22}
                            color="green">
                        </VectorIcon>
                        <Text style={styles.inputStyle}>Photo</Text>
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
                    <TouchableOpacity style={styles.postOption}>
                        <VectorIcon
                            name="videocam"
                            type="Ionicons"
                            size={22}
                            color="orange">
                        </VectorIcon>
                        <Text style={styles.inputStyle}>Livestream</Text>
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
                    <TouchableOpacity style={styles.postOption}>
                        <VectorIcon
                            name="camera"
                            type="Ionicons"
                            size={22}
                            color="blue">
                        </VectorIcon>
                        <Text style={styles.inputStyle}>Camera</Text>
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
                    <TouchableOpacity style={styles.postOption}>
                        <VectorIcon
                            name="happy"
                            type="Ionicons"
                            size={22}
                            color="#FFBA00">
                        </VectorIcon>
                        <Text style={styles.inputStyle}>Feeling</Text>
                    </TouchableOpacity>
                    {userInfo?.role.role_name === "Admin" ?
                        <View>
                            <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
                            <TouchableOpacity style={styles.postOption} onPress={() => navigation.navigate("Create survey")}>
                                <VectorIcon
                                    name="poll"
                                    type="MaterialIcons"
                                    size={22}>
                                </VectorIcon>
                                <Text style={styles.inputStyle}>Survey</Text>
                            </TouchableOpacity>
                        </View>
                        : ""}
                    {userInfo?.role.role_name === "Admin" ?
                        <View>
                            <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }}></View>
                            <TouchableOpacity style={styles.postOption} onPress={() => navigation.navigate("Create event")}>
                                <VectorIcon
                                    name="calendar"
                                    type="Ionicons"
                                    size={22}
                                    color="red">
                                </VectorIcon>
                                <Text style={styles.inputStyle}>Event</Text>
                            </TouchableOpacity>
                        </View>
                        : ""}
                    {selectedImages.length > 0 && (
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row' }}>
                                {selectedImages.map((image, index) => (
                                    <View>
                                        <Image
                                            key={index}
                                            source={{ uri: image.uri }}
                                            style={styles.selectedImageStyle}
                                        />
                                        <TouchableOpacity style={styles.deleteBg} onPress={() => handleDeleteImage(index)}>
                                            <VectorIcon
                                                name="delete"
                                                type="AntDesign"
                                                color="white"
                                                size={18}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    )}
                </View>
                <View>
                    <Button onPress={() => {
                        if (selectedImages.length !== 0) {
                            createImagePost()
                        } else {
                            createPost()
                        }
                    }} variant="subtle" colorScheme="darkBlue" isDisabled={!text.trim()} style={styles.postContainer}>
                        Post
                    </Button>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        marginTop: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontSize: 18
    },
    profileStyle: {
        height: 50,
        width: 50,
        borderRadius: 50,
    },
    inputStyle: {
        fontSize: 18,
        color: '#000000',
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 8,
        borderRadius: 10,
        gap: 8
    },
    inputBox: {
        marginLeft: 5
    },
    postContainer: {
        marginTop: 10,
        // width: '100%',
        // height: windowHeight / 16,
        // backgroundColor: '#2e64e5',
        // padding: 10,
        // alignItems: 'center',
        // justifyContent: 'center',
        // borderRadius: 3,
    },
    tabItemText: {
        fontSize: 20
    },
    postStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    postOption: {
        flexDirection: 'row',
        padding: 10,
        gap: 5,
        alignItems: 'center',
    },
    textInputStyle: {
        // borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 18,
        borderRadius: 10
    },
    selectedImageStyle: {
        width: 110,
        height: 110,
        marginRight: 5,
    },
    deleteBg: {
        backgroundColor: 'rgb(58 59 60)',
        height: 30,
        width: 30,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        position: 'absolute',
        top: 3,
        right: 3
    }
});

export default StatusPost;