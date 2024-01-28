import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MyUserContext } from '../../App';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';

const GroupMember = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const route = useRoute();
    const { groupId } = route.params

    const [memberList, setMemberList] = useState([]);
    const [groupName, setGroupName] = useState('')

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

    return (
        <>
            <ScrollView>
                <View style={styles.groupMemberContainer}>
                    <Text style={styles.groupMemberHeaderText}>
                        Danh sách thành viên nhóm {groupName}
                    </Text>
                    {memberList.map(ml => {
                        return (
                            <Fragment>
                                <View style={styles.memberItem}>
                                    <Image
                                        source={ml.avatar === null ? require('../images/user.png') : { uri: ml.avatar }}
                                        style={{ width: 40, height: 40, borderRadius: 20 }} />
                                    <Text style={{ fontSize: 18, alignItems: 'center' }}>
                                        {ml.user.last_name} {ml.user.first_name}
                                    </Text>
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
        borderBottomWidth: 1,
        marginBottom: 7,
        borderBottomColor: 'lightgray',
        alignItems: 'center',
        gap: 15
    }
})

export default GroupMember;