import React, { Fragment, useContext, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import VectorIcon from '../utils/VectorIcon';

const GroupManagement = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [listGroup, setListGroup] = useState([]);

    useEffect(() => {
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
        viewListGroup();
    }, [])
    return (
        <>
            <ScrollView>
                <View>
                    <Text>Danh sách nhóm</Text>
                    {listGroup.map(lg => {
                        return (
                            <Fragment>
                                <View>
                                    <Text style={{ fontSize: 18 }}>{lg.invitation_group_name}</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Thành viên nhóm')}>
                                            <VectorIcon
                                                name="eye"
                                                type="AntDesign"
                                                size={19}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate('Chỉnh sửa nhóm')}>
                                            <VectorIcon
                                                name="mode-edit"
                                                type="MaterialIcons"
                                                size={19}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity>
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

export default GroupManagement;