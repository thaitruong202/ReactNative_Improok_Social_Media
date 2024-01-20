import React, { useContext, useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import VectorIcon from '../utils/VectorIcon';
import { Button } from 'native-base';

const AccountAccept = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const [listAcceptUser, setListAcceptUser] = useState([])
    const [page, setPage] = useState(1)
    const [hasMorePages, setHasMorePages] = useState(true);

    const getAcceptUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            let e = `${endpoints['get-user-by-status']}` + `?confirm_status_id=1` + `&page=${page}`
            console.log(e)
            let res = await djangoAuthApi(token).get(e)
            setListAcceptUser((prevList) => [...prevList, ...res.data.results]);
            if (res.data.next === null) {
                setHasMorePages(false);
                return;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    }

    useEffect(() => {
        getAcceptUser()
    }, [page])

    return (
        <>
            <ScrollView>
                <View style={{ padding: 15, flexDirection: 'column', gap: 8 }}>
                    {listAcceptUser.length > 0 ? (
                        listAcceptUser.map((lau) => (
                            <View key={lau.id} style={{ borderWidth: 1, borderRadius: 10 }}>
                                <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', gap: 5 }}>
                                        <Text style={{ fontSize: 16 }}>{lau.last_name}</Text>
                                        <Text style={{ fontSize: 16 }}>{lau.first_name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <VectorIcon
                                            name="checkmark-circle"
                                            type="Ionicons"
                                            size={22}
                                            color="green"
                                        />
                                        <TouchableOpacity onPress={() => console.log('Edit button pressed')}>
                                            <VectorIcon
                                                name="create"
                                                type="Ionicons"
                                                size={22}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Chưa có user nào</Text>
                        </View>
                    )}
                    {hasMorePages && (
                        <Button
                            variant='subtle'
                            colorScheme='purple'
                            onPress={fetchNextPage}
                            style={{ alignItems: 'center', padding: 15 }}
                        >
                            More...
                        </Button>

                    )}
                </View>
            </ScrollView>
        </>
    );
};

export default AccountAccept;