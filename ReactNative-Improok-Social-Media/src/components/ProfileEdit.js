import React, { useContext, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MyAccountContext, MyUserContext } from "../../App";
import { windowHeight, windowWidth } from "../utils/Dimensions";
import VectorIcon from "../utils/VectorIcon";
// import { DateTimePicker } from "@react-native-community/datetimepicker";
import { Button } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { djangoAuthApi, endpoints } from "../configs/Apis";

const ProfileEdit = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext)
    const [account, accountDispatch] = useContext(MyAccountContext)
    const [userInfo, setUserInfo] = useState({
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email,
        "doB": account.date_of_birth,
        "phoneNumber": account.phone_number
    })

    const change = (e, field) => {
        setUserInfo(current => {
            const value = e.trim() !== "" ? e : "";
            return { ...current, [field]: value };
        });
    };

    const updateUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            let res = await djangoAuthApi(token).patch(endpoints['update-user'](user.id), {
                "first_name": userInfo.firstName,
                "last_name": userInfo.lastName,
                "email": userInfo.email,
            })
            console.log(res.data)
            dispatch({
                "type": "updateUser",
                "payload": res.data
            })
            navigation.goBack()
        } catch (error) {
            console.log(error)
        }
    }

    const updateAccount = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            let form = new FormData()
            form.append("phone_number", userInfo.phoneNumber)
            form.append("date_of_birth", userInfo.doB)
            let res = await djangoAuthApi(token).patch(endpoints['update-account'](account.id), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            dispatch({
                "type": "updateAccount",
                "payload": res.data
            })
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <ScrollView>
                <View style={{ paddingHorizontal: 5, paddingVertical: 10, gap: 10 }}>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Profile avatar</Text>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 16, color: '#591aaf' }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 20 }}>
                            <Image source={account?.avatar === null ? require('../images/user.png') : { uri: account?.avatar }} style={{ width: windowWidth / 2, height: windowWidth / 2, borderRadius: windowWidth / 4 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Cover avatar</Text>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 16, color: '#591aaf' }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ alignItems: 'center', paddingVertical: 20 }}>
                            <Image source={account?.cover_avatar === null ? require('../images/picture.png') : { uri: account?.cover_avatar }} style={{ width: '100%', height: windowHeight / 3, borderRadius: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Profile info</Text>
                        <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
                            <View style={styles.inputView}>
                                <VectorIcon
                                    type="Ionicons"
                                    name="person"
                                    size={22}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    value={userInfo.lastName}
                                    onChangeText={(e) => change(e, "lastName")}
                                    placeholder="Enter lastname"
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
                                    value={userInfo.firstName}
                                    onChangeText={(e) => change(e, "firstName")}
                                    placeholder="Enter firstname"
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
                                    value={userInfo.email}
                                    onChangeText={(e) => change(e, "email")}
                                    placeholder="Enter email"
                                    style={styles.inputText}
                                />
                            </View>
                            <View style={styles.inputView}>
                                <VectorIcon
                                    type="Ionicons"
                                    name="calendar"
                                    size={22}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    value={userInfo.doB}
                                    onChangeText={(e) => change(e, "doB")}
                                    placeholder="Enter date of birth"
                                    style={styles.inputText}
                                />
                                {/* <DateTimePicker
                                    value={userInfo.doB}
                                    mode="date"
                                    format="YYYY-MM-DD"
                                    maximumDate={new Date(2100, 0, 1)}
                                /> */}
                            </View>
                            <View style={styles.inputView}>
                                <VectorIcon
                                    type="Ionicons"
                                    name="call"
                                    size={22}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    value={userInfo.phoneNumber}
                                    onChangeText={(e) => change(e, "phoneNumber")}
                                    placeholder="Enter phone number"
                                    style={styles.inputText}
                                />
                            </View>
                        </View>
                        <Button
                            style={{ marginTop: 10 }}
                            variant="subtle"
                            colorScheme="purple"
                            isDisabled={
                                userInfo.firstName.trim() === '' ||
                                userInfo.lastName.trim() === '' ||
                                userInfo.email.trim() === '' ||
                                userInfo.doB.trim() === '' ||
                                userInfo.phoneNumber.trim() === ''
                            }
                            onPress={() => { updateUser(), updateAccount() }}
                        >
                            Save
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    inputText: {
        padding: 8,
        flex: 1,
        fontSize: 16,
        color: '#333',
        justifyContent: 'center',
        alignItems: 'center'
    },
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
    }
})

export default ProfileEdit;