import React, { Fragment, useContext, useEffect, useState } from 'react';
import { FlatList, Image, Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { MyUserContext } from '../../App';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import VectorIcon from '../utils/VectorIcon';
import { windowWidth } from '../utils/Dimensions';

const GroupEdit = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const route = useRoute();
    const { groupId } = route.params

    const [memberList, setMemberList] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [selectedMember, setSelectedMember] = useState([]);

    const [input, setInput] = useState('');

    const [filteredAccountList, setFilteredAccountList] = useState([]);

    const [edit, setEdit] = useState(false)
    const [tempGroupName, setTempGroupName] = useState("")

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
        // const isMemberSelected = !!selectedMember.find(member => member.fullName === fullName);
        // const isMemberExists = memberList.some(member => {
        //     const { first_name, last_name } = member.user;
        //     const full_name = `${last_name} ${first_name}`;
        //     return full_name === fullName;
        // });

        const memberId = `${item.user?.id}`;
        const isMemberSelected = !!selectedMember.find(member => member.id == memberId);
        const isMemberExists = memberList.some(member => {
            const { id } = member;
            const idMember = `${id}`;
            return idMember === memberId;
        })

        const handlePress = () => {
            if (!isMemberSelected) {
                const newMember = {
                    id: item.user?.id,
                    fullName,
                    avatar: item.avatar,
                    email: item.user?.email
                };
                setSelectedMember([...selectedMember, newMember]);
                setInput('');
                console.log("tồn tại", isMemberExists);
                console.log("đã chọn", isMemberSelected);
                console.log(memberList);
                console.log(selectedMember);
                console.log(item.user?.id, memberId);
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
                    source={item.avatar === null ? require('../images/user.png') : { uri: item.avatar }}
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

    useEffect(() => {
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
            getMemberList();
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

    const deleteMember = async (memberId) => {
        try {
            console.info(memberId);
            const token = await AsyncStorage.getItem("token");
            let res = await djangoAuthApi(token).post(endpoints['delete-account-from-group'](groupId), {
                "list_account_id": [
                    memberId
                ]
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log('Sau khi xóa')
            getMemberList();
        } catch (error) {
            getMemberList();
            console.error(error)
        }
    }

    const handleEdit = () => {
        setTempGroupName(groupName); // Lưu trữ giá trị ban đầu trong biến tạm
        setEdit(true);
    };

    const handleCancel = () => {
        setGroupName(tempGroupName); // Khôi phục giá trị ban đầu từ biến tạm
        setEdit(false);
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            let res = await djangoAuthApi(token).patch(endpoints['patch-invitation-group'](groupId), {
                "invitation_group_name": groupName
            })
            console.log(res.data)
            setEdit(false);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <ScrollView>
                <SafeAreaView>
                    <View style={styles.groupMemberContainer}>
                        {edit === false ? <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text style={styles.groupMemberHeaderText}>
                                    {groupName}
                                </Text>
                                <TouchableOpacity onPress={() => handleEdit(true)}>
                                    <VectorIcon
                                        name="create-outline"
                                        type="Ionicons"
                                        size={23}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View> : <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderRadius: 5, alignItems: 'center' }}>
                            <TextInput
                                value={groupName}
                                onChangeText={(newgroupName) => setGroupName(newgroupName)}
                                style={{
                                    height: 40,
                                    marginHorizontal: 10,
                                    padding: 10,
                                    borderRadius: 5,
                                    fontSize: 18,
                                    width: '70%'
                                }}
                            />
                            <TouchableOpacity onPress={() => handleSave()} style={{ width: '14%' }}>
                                <VectorIcon
                                    name="checkmark-circle-outline"
                                    type="Ionicons"
                                    size={23}
                                    color="green"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleCancel()} style={{ width: '14%' }}>
                                <VectorIcon
                                    name="close-circle-outline"
                                    type="Ionicons"
                                    size={23}
                                    color="red"
                                />
                            </TouchableOpacity>
                        </View>}
                        <View style={{ marginVertical: 15 }}>
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <TextInput
                                    placeholder='Enter accounts...'
                                    value={input}
                                    onChangeText={(input) => onChangeText(input)}
                                    style={{
                                        height: 40,
                                        marginHorizontal: 10,
                                        borderBottomWidth: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        fontSize: 17,
                                        width: '80%'
                                    }} />
                                <TouchableOpacity style={styles.addMemberButt} onPress={() => addAccount()}>
                                    <VectorIcon
                                        name="add-circle"
                                        type="Ionicons"
                                        size={22}>
                                    </VectorIcon>
                                </TouchableOpacity>
                            </View>
                            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                <SafeAreaView>
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
                                            <Image
                                                source={member.avatar === null ? require('../images/user.png') : { uri: member.avatar }}
                                                style={{ width: 40, height: 40, borderRadius: 20 }} />
                                            <Text style={{ marginLeft: 10, fontSize: 16 }}>{member.fullName}</Text>
                                            <TouchableOpacity onPress={() => removeMember(index)} style={{ position: 'absolute', right: 5 }}>
                                                <VectorIcon name="remove-circle" type="Ionicons" size={22} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </SafeAreaView>
                            </TouchableWithoutFeedback>
                        </View>
                        {memberList.map(ml => {
                            return (
                                <Fragment>
                                    <View style={styles.memberItem}>
                                        <Image
                                            source={ml.avatar === null ? require('../images/user.png') : { uri: ml.avatar }}
                                            style={{ width: 40, height: 40, borderRadius: 20 }} />
                                        <Text style={{ fontSize: 18, width: '75%', alignItems: 'center' }}>
                                            {ml.user.last_name} {ml.user.first_name}
                                        </Text>
                                        <TouchableOpacity style={{ width: "10%" }} onPress={() => deleteMember(ml.id)}>
                                            <VectorIcon
                                                name="trash"
                                                type="Ionicons"
                                                size={22}>
                                            </VectorIcon>
                                        </TouchableOpacity>
                                    </View>
                                </Fragment>
                            )
                        })}
                    </View>
                </SafeAreaView>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    groupMemberContainer: {
        padding: 10,
        marginTop: 5,
    },
    groupMemberHeaderText: {
        textAlign: 'center',
        fontSize: 19,
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
        borderBottomWidth: 1,
        marginBottom: 7,
        borderBottomColor: 'lightgray',
        alignItems: 'center',
        gap: 10
    },
    addMemberButt: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default GroupEdit;