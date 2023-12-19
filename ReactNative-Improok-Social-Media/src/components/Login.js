import React, { Fragment, useContext, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { windowWidth, windowHeight } from '../utils/Dimensions'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MyUserContext } from '../../App';
import Apis, { djangoAuthApi, endpoints } from "../configs/Apis";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            let form = new FormData();
            form.append("username", username)
            form.append("password", password)
            form.append('client_id', 'zDnklZ6ztQVU0X4DOQEymwV96MfWhW3Hk2VHq3D9')
            form.append('client_secret', 'Wo2j1Qn6UKI691i30hmc4gZ7JCTazZ18KXNne7n2IYihCYoEw3PozWTtPc0CkiKZHtMBxOFTWISj83R5cSODQbCh9uTmNb5eefA4W9TwZmzI0D0smpz6bBf8CgSNnYDj')
            form.append('grant_type', 'password')


            let res = await Apis.post(endpoints['djlogin'], form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            console.log(res.data);

            await AsyncStorage.setItem('token', res.data.access_token);
            console.log("Lưu token")
            const data = await Apis.get(endpoints['current-user'], {
                headers: {
                    'Authorization': res.data.token_type + " " + res.data.access_token,
                }
            });
            await AsyncStorage.setItem('user', JSON.stringify(data));
            console.log("Lưu current user")

            console.log(data.data)

            dispatch({
                "type": "login",
                "payload": data.data
            });

            if (res.status === 200) {
                console.log('Đăng nhập thành công');
                navigation.navigate('Trang chủ');
                setUsername('');
                setPassword('');
            } else {
                console.log('Đăng nhập thất bại');
            }
        } catch (error) {
            console.log('Lỗi mạng', error);
        }
    };

    return (
        <Fragment>
            <View style={styles.loginContainer}>
                <Image source={require('../images/IMPROOK.png')} style={styles.improokLogo} />
                <Text style={styles.text}>IM'PROOK SOCIAL APP</Text>
                <View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="person" size={24} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input}
                            placeholder="Tên người dùng"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="https" size={24} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input}
                            placeholder="Mật khẩu"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            numberOfLines={1}
                            secureTextEntry />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.buttonLogin} onPress={login}>
                            <Text style={styles.buttonLoginText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.forgotButton}>
                        <Text style={styles.forgotButtonText}>Bạn quên mật khẩu ư?</Text>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('Đăng ký')}>
                            <Text style={styles.buttonRegisterText}>Đăng ký tài khoản mới</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Fragment >
    );
};

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        marginTop: 25,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    improokLogo: {
        height: 150,
        width: 150,
        resizeMode: 'stretch',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
    },
    inputView: {
        marginTop: 5,
        marginBottom: 10,
        width: '100%',
        height: windowHeight / 17,
        borderColor: '#ccc',
        borderRadius: 15,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    input: {
        padding: 10,
        flex: 1,
        fontSize: 16,
        color: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputIcon: {
        padding: 10,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: '#ccc',
        borderRightWidth: 1,
        width: 50,
    },
    text: {
        fontSize: 28,
        marginBottom: 10,
        color: '#051d5f',
        textAlign: 'center'
    },
    forgotButton: {
        marginVertical: 25,
    },
    forgotButtonText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
        textAlign: 'center'
    },
    buttonLoginText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    buttonLogin: {
        marginTop: 10,
        width: '100%',
        height: windowHeight / 16,
        backgroundColor: '#2e64e5',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    buttonRegister: {
        marginTop: 20,
        width: '100%',
        height: windowHeight / 16,
        backgroundColor: 'white',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#2e64e5'
    },
    buttonRegisterText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
        textAlign: 'center'
    }
});

export default Login;