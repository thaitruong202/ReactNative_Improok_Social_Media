import React, { Fragment, useContext, useState } from 'react';
import { Image, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { windowHeight } from '../utils/Dimensions'
import { MyAccountContext, MyUserContext } from '../../App';
import Apis, { djangoAuthApi, endpoints } from "../configs/Apis";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import VectorIcon from '../utils/VectorIcon';

const Login = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [account, accountDispatch] = useContext(MyAccountContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [currentUser, setCurrentUser] = useState();

    const nav = useNavigation();

    const login = async () => {
        try {
            let form = new FormData();
            form.append("username", username)
            form.append("password", password)

            let res = await Apis.post(endpoints['login'], form, {
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
            const account = await djangoAuthApi(res.data.access_token).get(endpoints['get-account-by-user'](data.data.id))
            await AsyncStorage.setItem('user', JSON.stringify(data));
            await AsyncStorage.setItem('account', JSON.stringify(account))
            console.log("Lưu current user")
            console.log(data.data)
            console.log(account.data)
            setCurrentUser(data.data)

            if (data.data?.confirm_status === 3) {
                // alert("Tài khoản của bạn chưa được xét duyệt!. Vui lòng thử lại sau");
                Toast.show({
                    type: 'success',
                    text1: data.data?.last_name + " " + data.data?.first_name + " " + "đã bị ban acc!",
                    text2: "Đóng 100k để mở"
                });
                return;
            } else {
                dispatch({
                    "type": "login",
                    "payload": data.data
                });
                accountDispatch({
                    "type": "login",
                    "payload": account.data
                })

                if (res.status === 200) {
                    console.log('Đăng nhập thành công');
                    // navigation.navigate('Homepage');
                    nav.reset({
                        index: 0,
                        routes: [{ name: 'Homepage' }],
                    });
                    setUsername('');
                    setPassword('');
                } else {
                    Toast.show({
                        type: "error",
                        text1: "Đăng nhập thất bại. Sai tài khoản hoặc mật khẩu!",
                        visibilityTime: 2500,
                        position: 'bottom',
                    })
                    console.log('Đăng nhập thất bại');
                }
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Đăng nhập thất bại. Sai tài khoản hoặc mật khẩu!"
            })
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
                        <VectorIcon name="person" type="Ionicons" size={22} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <VectorIcon name="lock-closed" type="Ionicons" size={22} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            numberOfLines={1}
                            secureTextEntry />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.buttonLogin} onPress={login}>
                            <Text style={styles.buttonLoginText}>Log in</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.forgotButton} onPress={() => Linking.openURL('mailto:support@improok.com?subject=ForgotPassword&body=Description')}>
                        <Text style={styles.forgotButtonText}>Forgot password?</Text>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.buttonRegisterText}>Create new account</Text>
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