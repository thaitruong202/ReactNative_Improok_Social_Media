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
                    <Text style={styles.groupManagementHeaderText}>List group</Text>
                    <View style={{ marginVertical: 20 }}>
                        <TouchableOpacity onPress={() => setViewAddGroup(true)} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, gap: 10 }}>
                            <VectorIcon
                                name="people-circle"
                                type="Ionicons"
                                size={23}
                            />
                            <Text style={{ fontSize: 18 }}>
                                Create new group
                            </Text>
                        </TouchableOpacity>
                        {viewAddGroup && <View style={{ flexDirection: 'row', marginHorizontal: 15, gap: 10 }}>
                            <TextInput
                                value={groupName}
                                placeholder='Enter group name...'
                                onChangeText={(groupName) => setGroupName(groupName)}
                                style={{ borderBottomWidth: 1, width: '80%', fontSize: 17, height: 40 }}
                            />
                            <View style={{ flexDirection: 'row', width: '20%', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                                <TouchableOpacity onPress={() => createGroup()} style={{ width: '48%' }}>
                                    <VectorIcon
                                        name="checkmark-circle-outline"
                                        type="Ionicons"
                                        size={23}
                                        color="green"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setViewAddGroup(false)} style={{ width: '48%' }}>
                                    <VectorIcon
                                        name="close-circle-outline"
                                        type="Ionicons"
                                        size={23}
                                        color="red"
                                    />
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
                                        <TouchableOpacity onPress={() => navigation.navigate('Group member', { groupId: lg.id })}>
                                            <VectorIcon
                                                name="eye"
                                                type="Ionicons"
                                                size={19}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate('Alter group', { groupId: lg.id })}>
                                            <VectorIcon
                                                name="create"
                                                type="Ionicons"
                                                size={19}
                                                color="green"
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => deleteGroup(lg.id)}>
                                            <VectorIcon
                                                name="trash"
                                                type="Ionicons"
                                                size={19}
                                                color="red"
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
        borderBottomWidth: 1,
        marginBottom: 7,
        borderBottomColor: 'lightgray'
    }
})

export default GroupManagement;