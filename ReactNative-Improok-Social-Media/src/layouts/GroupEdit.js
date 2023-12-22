import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FlatList, Image, Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { MyUserContext } from '../../App';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import VectorIcon from '../utils/VectorIcon';
import { windowHeight, windowWidth } from '../utils/Dimensions';

const GroupEdit = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const route = useRoute();
    const { groupId } = route.params

    const [memberList, setMemberList] = useState([]);
    const [accountList, setAccountList] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);

    const [input, setInput] = useState('');

    const [filteredAccountList, setFilteredAccountList] = useState([]);

    const renderItem = ({ item }) => (
        <Pressable onPress={() => { setInput(`${item.user.last_name} ${item.user.first_name}`), setSelectedMember(item.id) }} style={{ display: 'flex', flexDirection: 'row' }}>
            <Image source={{ uri: item.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            <Text style={{ fontSize: 14 }}>{item.user.last_name} {item.user.first_name}</Text>
        </Pressable>
    );

    const onChangeText = async (text) => {
        setInput(text);
        if (text.length > 0) {
            const token = await AsyncStorage.getItem("token");
            let res = await djangoAuthApi(token).get(endpoints['account']);
            const accountData = res.data.results;
            setAccountList(accountData);
            const filteredList = accountData.filter((item) => {
                const fullName = `${item.user.first_name} ${item.user.last_name}`;
                return fullName.toLowerCase().includes(text.toLowerCase());
            });
            setFilteredAccountList(filteredList);
            console.log(filteredList);
        } else {
            setFilteredAccountList([]);
        }
    };

    useEffect(() => {
        const getMemberList = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                let res = await djangoAuthApi(token).get(endpoints['view-member-by-invitation-group'](groupId))
                setMemberList(res.data.accounts);
                setGroupName(res.data.invitation_group_name);
                console.log(res.data.accounts);
            } catch (error) {
                console.log(error);
            }
        }
        getMemberList();
    }, [])

    const addAccount = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).post(endpoints['add-account-invitation-group'](groupId), {
                "list_account_id": [
                    selectedMember
                ]
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(res.data, res.status)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <SafeAreaView>
                <View style={styles.groupMemberContainer}>
                    <Text style={styles.groupMemberHeaderText}>
                        Danh sách thành viên nhóm {groupName}
                    </Text>
                    {memberList.map(ml => {
                        return (
                            <Fragment>
                                <View style={styles.memberItem}>
                                    <Image source={{ uri: ml.avatar }} style={{ width: 50, height: 50, borderRadius: 25, flex: 1.5 }} />
                                    <Text style={{ fontSize: 18, flex: 7.5, alignItems: 'center' }}>
                                        {ml.user.last_name} {ml.user.first_name}
                                    </Text>
                                    <TouchableOpacity style={{ flex: 1 }}>
                                        <VectorIcon
                                            name="delete"
                                            type="MaterialCommunityIcons"
                                            size={22}>
                                        </VectorIcon>
                                    </TouchableOpacity>
                                </View>
                            </Fragment>
                        )
                    })}
                    <View>
                        <TouchableOpacity style={styles.addMemberButt} onPress={() => addAccount()}>
                            <VectorIcon
                                name="person-add"
                                type="Ionicons"
                                size={22}>
                            </VectorIcon>
                            <Text>
                                Thêm thành viên mới
                            </Text>
                        </TouchableOpacity>
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <SafeAreaView>
                                <TextInput
                                    placeholder='Nhập tài khoản...'
                                    value={input}
                                    onChangeText={(input) => onChangeText(input)}
                                    style={{
                                        height: 40,
                                        marginHorizontal: 12,
                                        borderWidth: 1,
                                        paddingHorizontal: 10,
                                        borderRadius: 5
                                    }}
                                />
                                <FlatList
                                    data={filteredAccountList}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            </SafeAreaView>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    groupMemberContainer: {
        padding: 8,
        marginTop: 5
    },
    groupMemberHeaderText: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 10
    },
    memberItem: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 7
    },
    addMemberButt: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 1,
        width: windowWidth / 2,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 15
    }
})

export default GroupEdit;