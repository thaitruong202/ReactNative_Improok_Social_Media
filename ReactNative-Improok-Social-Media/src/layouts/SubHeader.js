import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import CameraRoll from '../images/cameraroll.png';
import * as ImagePicker from 'expo-image-picker';
// import ImagePicker from 'react-native-image-picker';
import { MyUserContext } from "../../App";
import { djangoAuthApi, endpoints } from '../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubHeader = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [selectedImages, setSelectedImages] = useState([]);

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user.id))
            setUserInfo(res.data);
            console.log(res.data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, [])

    const openImagePicker = async () => {
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
            console.log('Hủy chọn ảnh');
        } else {
            const selectedImages = result.assets;
            // Xử lý các ảnh đã chọn ở đây
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: userInfo?.avatar }} style={styles.avatarStyle} />
            <View style={styles.inputBox}>
                <Text style={styles.inputStyle}>What's on your mind, {user.first_name}?</Text>
            </View>
            <TouchableOpacity onPress={openImagePicker}>
                <Image source={CameraRoll} style={styles.cameraRoll} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    avatarStyle: {
        height: 40,
        width: 40,
        borderRadius: 50,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#BEBEBE',
        borderRadius: 30,
        paddingHorizontal: 20,
        width: '70%',
        paddingVertical: 8,
    },
    inputStyle: {
        fontSize: 16,
        color: '#3A3A3A'
    },
});

export default SubHeader;