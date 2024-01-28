import React, { useEffect, useState, useContext } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import VectorIcon from '../utils/VectorIcon';
import { MyUserContext } from "../../App";
import { windowWidth } from '../utils/Dimensions';
import Collapsible from 'react-native-collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';

const PersonalScreen = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const logout = () => {
        dispatch({
            "type": "logout"
        })
        navigation.navigate('Login')
    }

    const [helpExpanded, setHelpExpanded] = useState(false);
    const [settingExpanded, setSettingExpanded] = useState(false);
    const [manageExpanded, setManageExpanded] = useState(false);

    const toggleHelp = () => {
        setHelpExpanded(!helpExpanded);
    };

    const toggleSetting = () => {
        setSettingExpanded(!settingExpanded);
    };

    const toggleManage = () => {
        setManageExpanded(!manageExpanded);
    }

    const [userInfo, setUserInfo] = useState();

    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user.id))
            setUserInfo(res.data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, [])

    return (
        <>
            <ScrollView>
                {/* <View style={styles.personalContainer}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Menu</Text>
                    <View style={styles.headerIcons}>
                        <View style={styles.iconBg}>
                            <VectorIcon
                                name="settings"
                                type="MaterialIcons"
                                size={18}
                            />
                        </View>
                        <View style={styles.iconBg}>
                            <VectorIcon
                                name="search"
                                type="FontAwesome5"
                                size={18}
                            />
                        </View>
                    </View>
                </View> */}
                <View style={{ height: 10, backgroundColor: 'transparent' }}></View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileContainer}>
                        <Image
                            source={userInfo?.avatar === null ? require('../images/user.png') : { uri: userInfo?.avatar }}
                            style={styles.profileStyle} />
                        <View style={styles.inputBox}>
                            <Text style={styles.profileNameText}>{user?.last_name} {user?.first_name}</Text>
                        </View>
                        <TouchableOpacity style={styles.profileExpandIcon}>
                            <VectorIcon
                                name="chevron-down"
                                type="Ionicons"
                                size={19}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                <View style={styles.utilTab}>
                    <View style={styles.utilTabRow}>
                        <TouchableOpacity style={styles.tabItemContainer}>
                            <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10 }}>
                                <VectorIcon
                                    name="newspaper"
                                    type="Ionicons"
                                    size={21}>
                                </VectorIcon>
                                <Text style={styles.tabItemText}>Feeds</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabItemContainer}>
                            <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10 }}>
                                <VectorIcon
                                    name="people"
                                    type="Ionicons"
                                    size={21}>
                                </VectorIcon>
                                <Text style={styles.tabItemText}>Groups</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.utilTabRow}>
                        <TouchableOpacity style={styles.tabItemContainer} onPress={() => navigation.navigate('Chat room')}>
                            <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10 }}>
                                <VectorIcon
                                    name="chatbubble"
                                    type="Ionicons"
                                    size={21}>
                                </VectorIcon>
                                <Text style={styles.tabItemText}>Messages</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabItemContainer}>
                            <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10 }}>
                                <VectorIcon
                                    name="youtube-tv"
                                    type="MaterialCommunityIcons"
                                    size={21}>
                                </VectorIcon>
                                <Text style={styles.tabItemText}>Video</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.utilTabRow}>
                        <TouchableOpacity style={styles.tabItemContainer} onPress={() => navigation.navigate("Event")}>
                            <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10 }}>
                                <VectorIcon
                                    name="calendar"
                                    type="Ionicons"
                                    size={21}>
                                </VectorIcon>
                                <Text style={styles.tabItemText}>Events</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabItemContainer} onPress={() => navigation.navigate("Survey")}>
                            <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10 }}>
                                <VectorIcon
                                    name="poll"
                                    type="MaterialIcons"
                                    size={21}>
                                </VectorIcon>
                                <Text style={styles.tabItemText}>Surveys</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.collapsibleContainer}>
                    <View>
                        <TouchableOpacity onPress={toggleHelp}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <VectorIcon
                                    name="help-circle"
                                    type="Ionicons"
                                    size={21}
                                />
                                <Text style={styles.collapsibleSubItemHeaderText}>Help & support</Text>
                                <VectorIcon
                                    name={helpExpanded ? 'chevron-up' : 'chevron-down'}
                                    type="Ionicons"
                                    size={19}
                                    style={{ position: 'absolute', right: 5 }}
                                />
                            </View>
                        </TouchableOpacity>
                        <Collapsible collapsed={!helpExpanded}>
                            <View style={styles.collapsibleSubItem}>
                                <VectorIcon
                                    name="person-circle"
                                    type="Ionicons"
                                    size={20}
                                />
                                <Text style={styles.collapsibleSubItemBodyText}>Settings</Text>
                            </View>
                            <View style={styles.collapsibleSubItem}>
                                <VectorIcon
                                    name="moon"
                                    type="Ionicons"
                                    size={20}
                                />
                                <Text style={styles.collapsibleSubItemBodyText}>Dark mode</Text>
                            </View>
                        </Collapsible>
                    </View>
                    <View style={styles.divider}></View>
                    <View>
                        <TouchableOpacity onPress={toggleSetting}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <VectorIcon
                                    name="settings"
                                    type="Ionicons"
                                    size={21}
                                />
                                <Text style={styles.collapsibleSubItemHeaderText}>Settings & privacy</Text>
                                <VectorIcon
                                    name={helpExpanded ? 'chevron-up' : 'chevron-down'}
                                    type="Ionicons"
                                    size={19}
                                    style={{ position: 'absolute', right: 5 }}
                                />
                            </View>
                        </TouchableOpacity>
                        <Collapsible collapsed={!settingExpanded}>
                            <View style={styles.collapsibleSubItem}>
                                <VectorIcon
                                    name="help-buoy"
                                    type="Ionicons"
                                    size={20}
                                />
                                <Text style={styles.collapsibleSubItemBodyText}>Help Center</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => alert("We are I'MPROOK Group")} style={styles.collapsibleSubItem}>
                                    <VectorIcon
                                        name="information-circle"
                                        type="Ionicons"
                                        size={20}
                                    />
                                    <Text style={styles.collapsibleSubItemBodyText}>About</Text>
                                </TouchableOpacity>
                            </View>
                        </Collapsible>
                    </View>
                    <View style={styles.divider}></View>
                    {userInfo?.role.role_name === "Admin" ?
                        <>
                            <View>
                                <TouchableOpacity onPress={toggleManage}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <VectorIcon
                                            name="cogs"
                                            type="FontAwesome5"
                                            size={21}
                                        />
                                        <Text style={styles.collapsibleSubItemHeaderText}>System Management</Text>
                                        <VectorIcon
                                            name={helpExpanded ? 'chevron-up' : 'chevron-down'}
                                            type="Ionicons"
                                            size={19}
                                            style={{ position: 'absolute', right: 5 }}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <Collapsible collapsed={!manageExpanded}>
                                    {/* <View>
                                        <TouchableOpacity style={styles.collapsibleSubItem}>
                                            <VectorIcon
                                                name="users-cog"
                                                type="FontAwesome5"
                                                size={19}
                                            />
                                            <Text style={styles.collapsibleSubItemBodyText}>Quản lý hệ thống</Text>
                                        </TouchableOpacity>
                                    </View> */}
                                    <View>
                                        <TouchableOpacity style={styles.collapsibleSubItem} onPress={() => navigation.navigate("Account management")}>
                                            <VectorIcon
                                                name="person-circle"
                                                type="Ionicons"
                                                size={20}
                                            />
                                            <Text style={styles.collapsibleSubItemBodyText}>Accounts Management</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={styles.collapsibleSubItem} onPress={() => navigation.navigate("Group management")}>
                                            <VectorIcon
                                                name="people-circle"
                                                type="Ionicons"
                                                size={20} />
                                            <Text style={styles.collapsibleSubItemBodyText}>Groups Management</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={styles.collapsibleSubItem} onPress={() => navigation.navigate("Post management")}>
                                            <VectorIcon
                                                name="post"
                                                type="MaterialCommunityIcons"
                                                size={20} />
                                            <Text style={styles.collapsibleSubItemBodyText}>Posts Management</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Collapsible>
                            </View>
                            <View style={styles.divider}></View>
                        </> : ""}
                </View>
                <View >
                    <TouchableOpacity style={styles.logoutContainer} onPress={() => logout()}>
                        <Text style={styles.inputStyle}>Log out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    iconBg: {
        height: 35,
        width: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    profileExpandIcon: {
        height: 35,
        width: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        backgroundColor: '#EBECF0',
        position: 'absolute',
        right: 15
    },
    personalContainer: {
        padding: 8,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    profileStyle: {
        height: 42,
        width: 42,
        borderRadius: 50,
    },
    inputStyle: {
        fontSize: 16,
        color: '#3A3A3A',
    },
    profileNameText: {
        fontSize: 18,
        color: '#3A3A3A',
        marginLeft: 15
    },
    profileContainer: {
        flexDirection: 'row',
        padding: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 10
    },
    logoutContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 18,
        marginTop: 10,
        backgroundColor: '#E8E8E8',
        alignItems: 'center',
    },
    utilTab: {
        display: 'flex',
        marginTop: 10,
        marginLeft: 8,
        marginRight: 8
    },
    utilTabRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    tabItemContainer: {
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: {
            width: 8,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        width: windowWidth / 2.12
    },
    tabItemText: {
        marginTop: 4,
        fontSize: 18
    },
    collapsibleSubItem: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#DCDCDC',
        alignItems: 'center',
        marginTop: 5,
        gap: 5,
        marginBottom: 5,
        borderRadius: 10
    },
    collapsibleContainer: {
        marginTop: 10,
        marginLeft: 8,
        marginRight: 8
    },
    collapsibleSubItemHeaderText: {
        marginLeft: 5,
        fontSize: 18
    },
    collapsibleSubItemBodyText: {
        marginLeft: 3,
        fontSize: 18
    },
    divider: {
        height: 1,
        width: '95%',
        backgroundColor: 'lightgray',
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 15
    }
});

export default PersonalScreen;