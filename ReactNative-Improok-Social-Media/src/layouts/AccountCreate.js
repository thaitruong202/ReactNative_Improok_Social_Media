import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import VectorIcon from '../utils/VectorIcon';
import { windowHeight } from '../utils/Dimensions';
import { Button } from 'native-base';

const AccountCreate = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const [lecturer, setLecturer] = useState({
        username: "",
        email: "",
        firstname: "",
        lastname: ""
    })

    const createLecturerAccount = async () => {
        try {
            const token = await AsyncStorage.getItem("token")
            console.log(lecturer.username, lecturer.email, lecturer.firstname, lecturer.lastname)
            let res = await djangoAuthApi(token).post(endpoints['create-lecturer-account'], {
                "username": lecturer.username,
                "email": lecturer.email,
                "first_name": lecturer.firstname,
                "last_name": lecturer.lastname
            })
            setLecturer({
                username: "",
                email: "",
                firstname: "",
                lastname: ""
            })
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    // const checkVar = async () => {
    //     console.log(lecturer.username, lecturer.email, lecturer.firstname, lecturer.lastname)
    // }

    const change = (e, field) => {
        setLecturer(current => {
            return { ...current, [field]: e }
        })
    }

    return (
        <>
            <ScrollView>
                <View style={{ padding: 10 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                        <Text style={{ fontSize: 20 }}>Create new account</Text>
                    </View>
                    <View>
                        <View style={styles.inputView}>
                            <VectorIcon
                                type="Ionicons"
                                name="person"
                                size={22}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.inputText}
                                value={lecturer.username}
                                onChangeText={(e) => change(e, "username")}
                                placeholder='Username'
                                numberOfLines={1}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon
                                type="Ionicons"
                                name="lock-closed"
                                size={22}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                value='ou@123'
                                editable={false}
                                style={styles.inputText}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon
                                type="Ionicons"
                                name="mail"
                                size={22}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                value={lecturer.email}
                                onChangeText={(e) => change(e, "email")}
                                placeholder='Email'
                                style={styles.inputText}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon
                                type="Ionicons"
                                name="person"
                                size={22}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                value={lecturer.firstname}
                                onChangeText={(e) => change(e, "firstname")}
                                placeholder='First name'
                                style={styles.inputText}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <VectorIcon
                                type="Ionicons"
                                name="person"
                                size={22}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                value={lecturer.lastname}
                                onChangeText={(e) => change(e, "lastname")}
                                placeholder='Last name'
                                style={styles.inputText}
                            />
                        </View>
                        <Button style={{ marginTop: 10 }} variant="subtle"
                            colorScheme='purple'
                            onPress={() => createLecturerAccount()}
                            isDisabled={lecturer.email === '' || lecturer.firstname === '' || lecturer.lastname === '' || lecturer.username === ''}>
                            Create
                        </Button>
                        {/* <Button title='Submit' onPress={() => createLecturerAccount()} /> */}
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    inputView: {
        marginTop: 5,
        marginBottom: 10,
        width: '100%',
        height: windowHeight / 18,
        borderColor: '#ccc',
        borderRadius: 15,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    inputIcon: {
        padding: 8,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightColor: '#ccc',
        borderRightWidth: 1,
        width: 45
    },
    inputText: {
        padding: 8,
        flex: 1,
        fontSize: 16,
        color: '#333',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AccountCreate;