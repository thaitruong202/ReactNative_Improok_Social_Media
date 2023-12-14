import { Fragment } from "react";
import { Image, StyleSheet, TextInput, TouchableOpacity, Button, Text, View } from "react-native";
import { windowHeight, windowWidth } from "../utils/Dimensions";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Register = ({ navigation }) => {
    return (
        <Fragment>
            <View style={styles.registerContainer}>
                <Image source={require('../images/IMPROOK.png')} style={styles.improokLogo} />
                <Text style={styles.text}>TẠO TÀI KHOẢN MỚI</Text>
                <View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="person" size={24} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="Tên người dùng" numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="person" size={24} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="Mã số sinh viên" numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="https" size={24} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="Mật khẩu" numberOfLines={1} />
                    </View>
                    <View style={styles.inputView}>
                        <MaterialIcons name="https" size={24} color="black" style={styles.inputIcon} />
                        <TextInput style={styles.input} placeholder="Xác nhận mật khẩu" numberOfLines={1} />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.buttonRegister}>
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