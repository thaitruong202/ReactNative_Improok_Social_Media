import { Fragment, useState } from "react";
import { Image, StyleSheet, TextInput, TouchableOpacity, Button, Text, View } from "react-native";
import { windowHeight, windowWidth } from "../utils/Dimensions";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { endpoints } from "../configs/Apis";

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alumniCode, setAlumniCode] = useState('');

    // const createAlumniAccount = async () => {
    //     try {
    //         let userRes = await Apis.post(endpoints['create-user'], {
    //             'username': username,
    //             'password': password,
    //             'first_name': firstName,
    //             'last_name': lastName,
    //             'email': email
    //         })
    //         console.log(userRes.data);

    //         console.log(userRes.data.id);

    //         let form = new FormData();
    //         form.append('user', userRes.data.id);
    //         let accRes = await Apis.post(endpoints['create-account'], form, {
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         console.log(accRes.data);

    //         let alumRes = await Apis.post(endpoints['create-alumni-account'], {
    //             'alumni_account_code': alumniCode,
    //             'account': accRes.data.id
    //         });
    //         console.log(alumRes.data);

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // const createAlumniAccount = async () => {
    //     try {
    //         let res = await Apis.post(endpoints['create-alumni'], {
    //             'username': username,
    //             'password': password,
    //             'email': email,
    //             'first_name': firstName,
    //             'last_name': lastName,
    //             'alumni_account_code': alumniCode
    //         })
    //         console.log(res.data);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const createAlumniAccount = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                let res = await Apis.post(endpoints['create-alumni'], {
                    'username': username,
                    'password': password,
                    'email': email,
                    'first_name': firstName,
                    'last_name': lastName,
                    'alumni_account_code': alumniCode
                })
                console.log(res.data);
            } catch (error) {
                console.log(error)
            }
        }
        if (password === confirmPassword)
            process();
        else
            console.log("Mật khẩu không khớp!")
    }

    return (
        <Fragment>
            <View style={styles.registerContainer}>
                <Image source={require('../images/IMPROOK.png')} style={styles.improokLogo} />
                <Text style={styles.text}>TẠO TÀI KHOẢN MỚI</Text>
                <View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="person" size={17} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} value={username} onChangeText={(text) => setUsername(text)} placeholder="Tên người dùng" numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="person" size={17} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} value={lastName} onChangeText={(text) => setLastName(text)} placeholder="Họ" numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="person" size={17} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} value={firstName} onChangeText={(text) => setFirstName(text)} placeholder="Tên" numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="person" size={17} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} value={email} onChangeText={(text) => setEmail(text)} placeholder="Địa chỉ email" numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="person" size={17} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} value={alumniCode} onChangeText={(text) => setAlumniCode(text)} placeholder="Mã số sinh viên" numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="https" size={17} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} value={password} onChangeText={(text) => setPassword(text)} placeholder="Mật khẩu" numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="https" size={17} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} placeholder="Xác nhận mật khẩu" numberOfLines={1} />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.buttonRegister} onPress={(evt) => createAlumniAccount(evt)}>
                            <Text style={styles.buttonRegisterText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textPrivate}>
                        <Text style={styles.colorTextPrivate}>
                            Bằng việc đăng ký, bạn đã đồng ý với IMPROOK về{' '}
                        </Text>
                        <TouchableOpacity onPress={() => alert('Điều khoản dịch vụ')}>
                            <Text style={[styles.colorTextPrivate, { color: '#e88832' }]}>
                                Điều khoản dịch vụ
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.colorTextPrivate}> & </Text>
                        <TouchableOpacity onPress={() => alert('Chính sách bảo mật')}>
                            <Text style={[styles.colorTextPrivate, { color: '#e88832' }]}>
                                Chính sách bảo mật
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.registered}>
                        <Text style={styles.registeredText}>Bạn đã có tài khoản ư?</Text>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate('Đăng nhập')}>
                            <Text style={styles.buttonLoginText}>Đăng nhập ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    registerContainer: {
        flex: 1,
        marginTop: 15,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    improokLogo: {
        height: 75,
        width: 75,
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
        height: windowHeight / 21,
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
    registered: {
        marginVertical: 20,
    },
    registeredText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
        textAlign: 'center'
    },
    buttonRegisterText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    buttonRegister: {
        marginTop: 10,
        width: '100%',
        height: windowHeight / 20,
        backgroundColor: '#2e64e5',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    buttonLogin: {
        marginBottom: 20,
        width: '100%',
        height: windowHeight / 20,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#2e64e5'
    },
    buttonLoginText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2e64e5',
        textAlign: 'center'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 15,
        justifyContent: 'center',
    },
    colorTextPrivate: {
        fontSize: 13,
        fontWeight: '400',
        color: 'grey',
    },
});

export default Register;