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
    const [groupName, setGroupName] = useState('');
    const [selectedMember, setSelectedMember] = useState([]);

    const [input, setInput] = useState('');

    const [filteredAccountList, setFilteredAccountList] = useState([]);

    // const renderItem = ({ item }) => {
    //     const fullName = `${item.user.last_name} ${item.user.first_name}`;
    //     const isMemberSelected = !!selectedMember.find(member => member.fullName === fullName)
    //     const isMemberExists = memberList.some(member => {
    //         const { first_name, last_name } = member.user;
    //         const full_name = `${first_name} ${last_name}`;
    //         return full_name.includes(input);
    //     });

    //     return (
    //         <Pressable
    //             onPress={() => {
    //                 if (!isMemberSelected) {
    //                     const newMember = { id: item.user.id, fullName, avatar: item.avatar, email: item.user.email };
    //                     setSelectedMember([...selectedMember, newMember]);
    //                     setInput('');
    //                     console.log("tồn tại", isMemberExists);
    //                     console.log("đã chọn", isMemberSelected);
    //                 }
    //             }}
    //             style={({ pressed }) => [
    //                 {
    //                     display: 'flex',
    //                     flexDirection: 'row',
    //                     marginVertical: 10,
    //                     paddingHorizontal: 20,
    //                     alignItems: 'center'
    //                 },
    //                 isMemberSelected && isMemberExists && { opacity: 0.5 },
    //             ]}
    //             disabled={isMemberSelected || isMemberExists}
    //             accessibilityState={{ selected: isMemberSelected }}>
    //             <Image
    //                 source={{ uri: item.avatar }}
    //                 style={{ width: 40, height: 40, borderRadius: 20 }} />
    //             <Text style={{ fontSize: 16, marginLeft: 10 }}>{fullName}</Text>
    //         </Pressable>
    //     );
    // };

    const renderItem = ({ item }) => {
        const fullName = `${item.user.last_name} ${item.user.first_name}`;
        const isMemberSelected = !!selectedMember.find(member => member.fullName === fullName);
        const isMemberExists = memberList.some(member => {
            const { first_name, last_name } = member.user;
            const full_name = `${last_name} ${first_name}`;
            return full_name === fullName;
        });

        const handlePress = () => {
            if (!isMemberSelected) {
                const newMember = {
                    id: item.user.id,
                    fullName,
                    avatar: item.avatar,
                    email: item.user.email
                };
                setSelectedMember([...selectedMember, newMember]);
                setInput('');
                console.log("tồn tại", isMemberExists);
                console.log("đã chọn", isMemberSelected);
            }
        };

        return (
            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        marginVertical: 10,
                        paddingHorizontal: 20,
                        alignItems: 'center'
                    },
                    (isMemberSelected || isMemberExists) ? { opacity: 0.5 } : null,
                ]}
                disabled={isMemberSelected || isMemberExists}
                accessibilityState={{ selected: isMemberSelected }}
            >
                <Image
                    source={{ uri: item.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                />
                <Text style={{ fontSize: 16, marginLeft: 10 }}>{fullName}</Text>
            </Pressable>
        );
    };

    const onChangeText = async (text) => {
        setInput(text);
        if (text.length > 0) {
            const token = await AsyncStorage.getItem("token");
            let res = await djangoAuthApi(token).get(endpoints['search-user'](text));
            console.log(res.data);
            setFilteredAccountList(res.data);
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
            const memberList = selectedMember.map(member => member.id)
            const memberAccountId = [];
            for (let i = 0; i < memberList.length; i++) {
                const id = memberList[i];
                let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](id));
                memberAccountId.push(res.data.id);
            }
            let res = await djangoAuthApi(token).post(endpoints['add-account-invitation-group'](groupId), {
                "list_account_id": memberAccountId
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(res.data, res.status);
            setSelectedMember([]);
        } catch (error) {
            console.log(error)
        }
    }

    const removeMember = (index) => {
        const updatedMembers = [...selectedMember];
        updatedMembers.splice(index, 1);
        setSelectedMember(updatedMembers);
    };

    return (
        <>
            <ScrollView>
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
                                            marginHorizontal: 10,
                                            borderWidth: 1,
                                            padding: 10,
                                            borderRadius: 5,
                                            fontSize: 17
                                        }} />
                                    {
                                        input.length > 0 ? <FlatList
                                            data={filteredAccountList}
                                            renderItem={renderItem}
                                            keyExtractor={item => item.id}
                                            nestedScrollEnabled={true}
                                            scrollEnabled={false}
                                            style={{
                                                borderWidth: 1,
                                                marginHorizontal: 20,
                                                paddingHorizontal: 20
                                            }} /> : ""
                                    }
                                    {selectedMember.map((member, index) => (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, marginTop: 10, padding: 8, position: 'relative' }}>
                                            <Image source={{ uri: member.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                                            <Text style={{ marginLeft: 10, fontSize: 16 }}>{member.fullName}</Text>
                                            <TouchableOpacity onPress={() => removeMember(index)} style={{ position: 'absolute', right: 5 }}>
                                                <VectorIcon name="delete" type="MaterialIcons" size={22} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </SafeAreaView>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
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