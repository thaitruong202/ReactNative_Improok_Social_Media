import React, { useContext, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MyUserContext } from '../../App';
import VectorIcon from '../utils/VectorIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';

const Search = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext)
    const [kw, setKw] = useState('')
    const [listUser, setListUser] = useState([])

    const searchUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            let res = await djangoAuthApi(token).get(endpoints['search-user'](kw))
            console.log(res.data)
            setListUser(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <ScrollView >
                <View style={{ flexDirection: 'row', padding: 15, alignItems: 'center', gap: 15 }}>
                    <View style={{ borderWidth: 1, borderRadius: 10, width: '85%' }}>
                        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, justifyContent: 'space-between' }}>
                            <TextInput
                                style={{ width: '85%' }}
                                placeholder='Search'
                                numberOfLines={1}
                                value={kw}
                                onChangeText={(kw) => setKw(kw)} />
                            <TouchableOpacity onPress={() => setKw('')} style={{ width: '10%' }}>
                                <VectorIcon
                                    name="close"
                                    type="Ionicons"
                                    size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={{ width: '10%' }} onPress={() => searchUser()}>
                        <VectorIcon
                            name="search"
                            type="Ionicons"
                            size={30} />
                    </TouchableOpacity>
                </View>
                {listUser.length === 0 || !kw.trim() ?
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text>Không có kết quả nào!</Text>
                        </View>
                    </> :
                    <>
                        <View style={{ padding: 20 }}>
                            {listUser.map((lu) => {
                                return (
                                    <>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 }}
                                            onPress={() => navigation.navigate(user.id === lu.user?.id ? 'Profile' : 'User profile', { uid: lu.user?.id })}
                                        >
                                            <Image source={lu.avatar === null ? require('../images/user.png') : { uri: lu.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>{lu.user?.last_name}</Text>
                                                <Text>{lu.user?.first_name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                )
                            })}
                        </View>
                    </>}
            </ScrollView>
        </>
    );
};

export default Search;