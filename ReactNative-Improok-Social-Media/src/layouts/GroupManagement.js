import React, { Fragment, useContext, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import VectorIcon from '../utils/VectorIcon';
import { StyleSheet } from 'react-native';

const GroupManagement = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext)
    const [listGroup, setListGroup] = useState([])
    const [viewAddGroup, setViewAddGroup] = useState(false)
    const [groupName, setGroupName] = useState('')

    useEffect(() => {
        viewListGroup();
    }, [])

    const viewListGroup = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['view-invitation-group']);
            setListGroup(res.data.results);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteGroup = async (groupId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).delete(endpoints['delete-invitation-group'](groupId))
            console.log(res.data, res.status);
            viewListGroup()
        } catch (error) {
            console.log(error);
        }
    }

    const createGroup = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            let res = await djangoAuthApi(token).post(endpoints['create-invitation-group'], {
                "invitation_group_name": groupName
            })
            setViewAddGroup(false)
            setGroupName('')
            viewListGroup()
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <ScrollView>
                <View style={styles.groupManagementContainer}>
                    <Text style={styles.groupManagementHeaderText}>Danh sách nhóm</Text>
                    <View>
                        <TouchableOpacity onPress={() => setViewAddGroup(true)} style={{}}>
                            <VectorIcon
                                name="group-add"
                                type="MaterialIcons"
                                size={19}
                            />
                            <Text>
                                Tạo nhóm mới
                            </Text>
                        </TouchableOpacity>
                        {viewAddGroup && <View>
                            <TextInput
                                value={groupName}
                                placeholder='Nhập tên nhóm...'
                                onChangeText={(groupName) => setGroupName(groupName)}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => createGroup()}>
                                    <Text>Thêm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setViewAddGroup(false)}>
                                    <Text>Hủy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>}
                    </View>
                    {listGroup.map(lg => {
                        return (
                            <Fragment>
                                <View style={styles.groupItem}>
                                    <Text style={{ fontSize: 18, flex: 7.5 }}>{lg.invitation_group_name}</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 2.5 }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Thành viên nhóm', { groupId: lg.id })}>
                                            <VectorIcon
                                                name="eye"
                                                type="AntDesign"
                                                size={19}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate('Chỉnh sửa nhóm', { groupId: lg.id })}>
                                            <VectorIcon
                                                name="mode-edit"
                                                type="MaterialIcons"
                                                size={19}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => deleteGroup(lg.id)}>
                                            <VectorIcon
                                                name="delete"
                                                type="MaterialCommunityIcons"
                                                size={19}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Fragment>
                        )
                    })}
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    groupManagementContainer: {
        padding: 8,
        marginTop: 5
    },
    groupManagementHeaderText: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 10
    },
    groupItem: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 7
    }
})

export default GroupManagement;