import { Fragment, useState } from "react";
import { Image, StyleSheet, TextInput, TouchableOpacity, Button, Text, View, ScrollView } from "react-native";
import { windowHeight } from "../utils/Dimensions";
import Apis, { endpoints } from "../configs/Apis";
import Toast from "react-native-toast-message";
import VectorIcon from "../utils/VectorIcon";

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
        if (password === confirmPassword) {
            process();
            navigation.goBack();
            Toast.show({
                type: "info",
                text1: "Đăng ký thành công. Vui lòng chờ xét duyệt!"
            })
        }
        else
            Toast.show({
                type: "error",
                text1: "Mật khẩu không khớp"
            })
        console.log("Mật khẩu không khớp!");
    }

    return (
        <Fragment>
            <ScrollView>
                <View style={styles.registerContainer}>
                    <Image source={require('../images/IMPROOK.png')} style={styles.improokLogo} />
                    <Text style={styles.text}>CREATE NEW ACCOUNT</Text>
                    <View>
                        <View style={styles.inputView}>
                            <VectorIcon name="person" type="Ionicons" size={17} color="black" style={styles.inputIcon} />
                            <TextInput style={styles.input} value={username} onChangeText={(text) => setUsername(text)} placeholder="Username" numberOfLines={1} />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon name="person" size={17} type="Ionicons" color="black" style={styles.inputIcon} />
                            <TextInput style={styles.input} value={lastName} onChangeText={(text) => setLastName(text)} placeholder="Last name" numberOfLines={1} />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon name="person" size={17} type="Ionicons" color="black" style={styles.inputIcon} />
                            <TextInput style={styles.input} value={firstName} onChangeText={(text) => setFirstName(text)} placeholder="First name" numberOfLines={1} />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon name="mail" size={17} type="Ionicons" color="black" style={styles.inputIcon} />
                            <TextInput style={styles.input} value={email} onChangeText={(text) => setEmail(text)} placeholder="Email" numberOfLines={1} />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon name="person" size={17} type="Ionicons" color="black" style={styles.inputIcon} />
                            <TextInput style={styles.input} value={alumniCode} onChangeText={(text) => setAlumniCode(text)} placeholder="Alumni code" numberOfLines={1} />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon name="lock-closed" size={17} type="Ionicons" color="black" style={styles.inputIcon} />
                            <TextInput style={styles.input} value={password} onChangeText={(text) => setPassword(text)} placeholder="Password" numberOfLines={1} secureTextEntry />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon name="lock-closed" size={17} type="Ionicons" color="black" style={styles.inputIcon} />
                            <TextInput style={styles.input} value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} placeholder="Confirm password" numberOfLines={1} secureTextEntry />
                        </View>
                        <View>
                            <TouchableOpacity style={styles.buttonRegister} onPress={(evt) => createAlumniAccount(evt)}>
                                <Text style={styles.buttonRegisterText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textPrivate}>
                            <Text style={styles.colorTextPrivate}>
                                By signing up, you agree to IMPROOK's{' '}
                            </Text>
                            <TouchableOpacity onPress={() => alert('Term of Service')}>
                                <Text style={[styles.colorTextPrivate, { color: '#e88832' }]}>
                                    Term of Service
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.colorTextPrivate}> & </Text>
                            <TouchableOpacity onPress={() => alert('Privacy Policy')}>
                                <Text style={[styles.colorTextPrivate, { color: '#e88832' }]}>
                                    Privacy Policy
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.registered}>
                            <Text style={styles.registeredText}>Have an account?</Text>
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.buttonLoginText}>Log in now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
        width: 50
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
        fontSize: 17,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    buttonRegister: {
        marginTop: 10,
        width: '100%',
        height: windowHeight / 16,
        backgroundColor: '#2e64e5',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    buttonLogin: {
        marginBottom: 20,
        width: '100%',
        height: windowHeight / 16,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#2e64e5'
    },
    buttonLoginText: {
        fontSize: 17,
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