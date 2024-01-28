import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable, TouchableWithoutFeedback, FlatList, Image, Keyboard } from 'react-native';
import { MyUserContext } from '../../App';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { windowWidth } from '../utils/Dimensions';
import Collapsible from 'react-native-collapsible';
import VectorIcon from '../utils/VectorIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'native-base';

const InvitationPost = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [eventName, setEventName] = useState('');

    const [selectedBeginDate, setSelectedBeginDate] = useState(new Date());
    const [selectedBeginTime, setSelectedBeginTime] = useState(new Date());
    const [showBeginDatePicker, setShowBeginDatePicker] = useState(false);
    const [showBeginTimePicker, setShowBeginTimePicker] = useState(false);
    const [beginMode, setBeginMode] = useState('date');

    const [selectedEndDate, setSelectedEndDate] = useState(new Date());
    const [selectedEndTime, setSelectedEndTime] = useState(new Date());
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [endMode, setEndMode] = useState('date');

    const [postContent, setPostContent] = useState('');

    const [addExpanded, setAddExpanded] = useState(false);
    const [addExpanded1, setAddExpanded1] = useState(false)

    const [input, setInput] = useState('');
    const [groupInput, setGroupInput] = useState('')

    const [selectedMember, setSelectedMember] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([])

    const [filteredAccountList, setFilteredAccountList] = useState([]);
    const [filteredGroupList, setFilteredGroupList] = useState([]);

    const [mailList, setMailList] = useState([])

    const renderItem = ({ item }) => {
        const fullName = `${item.user?.last_name} ${item.user?.first_name}`;
        // const isMemberSelected = !!selectedMember.find(member => member.fullName === fullName);

        const memberId = item.user?.id;
        const isMemberSelected = !!selectedMember.find(member => member.id === memberId);

        return (
            <Pressable
                onPress={() => {
                    if (!isMemberSelected) {
                        const newMember = { id: item.user?.id, fullName, avatar: item.avatar, email: item.user?.email };
                        setSelectedMember([...selectedMember, newMember]);
                        setInput('');
                    }
                }}
                style={({ pressed }) => [
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        marginVertical: 15,
                        paddingHorizontal: 25,
                        alignItems: 'center'
                    },
                    isMemberSelected && { opacity: 0.5 },
                ]}
                disabled={isMemberSelected}
                accessibilityState={{ selected: isMemberSelected }}>
                <Image
                    source={item.avatar === null ? require('../images/user.png') : { uri: item.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20 }} />
                <Text style={{ fontSize: 16, marginLeft: 10 }}>{fullName}</Text>
            </Pressable>
        );
    };

    const renderGroup = ({ item }) => {
        // const fullName = `${item.user?.last_name} ${item.user?.first_name}`;
        // const isMemberSelected = !!selectedMember.find(member => member.fullName === fullName);

        // const memberId = item.user?.id;
        // const isMemberSelected = !!selectedMember.find(member => member.id === memberId);

        return (
            <Pressable
                onPress={() => {
                    {
                        const newGroup = item.accounts;
                        if (newGroup.length !== 0) {
                            setSelectedGroup([...selectedGroup, ...newGroup]);
                            setGroupInput('');
                            for (let i = 0; i < item.accounts_info.length; i++) {
                                const isValidEmail = emailRegex.test(item.accounts_info[i]?.user.email)
                                if (isValidEmail) {
                                    console.log(item.accounts_info[i]?.user.email)
                                    setMailList((mailList) => [...mailList, item.accounts_info[i]?.user.email])
                                }
                            }
                            console.log("Group mới", newGroup)
                        }
                    }
                }}
                style={({ pressed }) => [
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        marginVertical: 10,
                        paddingHorizontal: 20,
                        alignItems: 'center'
                    },
                    // isMemberSelected && { opacity: 0.5 },
                ]}
            // disabled={isMemberSelected}
            // accessibilityState={{ selected: isMemberSelected }}
            >
                <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.invitation_group_name}</Text>
            </Pressable>
        );
    };

    // const onChangeText = async (text) => {
    //     setInput(text);
    //     if (text.length > 0) {
    //         const token = await AsyncStorage.getItem("token");
    //         let res = await djangoAuthApi(token).get(endpoints['account']);
    //         const accountData = res.data;
    //         console.log(res.data);
    //         setAccountList(accountData);
    //         const filteredList = accountData.filter((item) => {
    //             const fullName = `${item.user.first_name} ${item.user.last_name}`;
    //             return fullName.toLowerCase().includes(text.toLowerCase());
    //         });
    //         setFilteredAccountList(filteredList);
    //         console.log(filteredList);
    //     } else {
    //         setFilteredAccountList([]);
    //     }
    // };

    const onChangeText = async (text) => {
        setInput(text);
        if (text.length > 0) {
            const token = await AsyncStorage.getItem("token");
            let res = await djangoAuthApi(token).get(endpoints['search-user'](text));
            // let res = await djangoAuthApi(token).get(endpoints['cache-user'](text));
            console.log("Đây là cache API", res.data);
            setFilteredAccountList(res.data);
        } else {
            setFilteredAccountList([]);
        }
    };

    const onGroupText = async (text) => {
        setGroupInput(text)
        if (text.length > 0) {
            const token = await AsyncStorage.getItem("token")
            let res = await djangoAuthApi(token).get(endpoints['search-group'](text))
            console.log("Đây là các group", res.data)
            setFilteredGroupList(res.data)
        } else {
            setFilteredGroupList([]);
        }
    }

    const currentDate = new Date();

    const toggleAdd = () => {
        setAddExpanded(!addExpanded);
    };

    const toggleAdd1 = () => {
        setAddExpanded1(!addExpanded1);
    };

    const handleBeginDateChange = (event, date) => {
        setShowBeginDatePicker(false);
        setSelectedBeginDate(date || selectedBeginDate);
    };

    const handleBeginTimeChange = (event, time) => {
        setShowBeginTimePicker(false);
        setSelectedBeginTime(time || selectedBeginTime);
    };

    const showBeginMode = (modeToShow) => {
        if (modeToShow === 'date') {
            setShowBeginDatePicker(true);
            setShowBeginTimePicker(false);
            setBeginMode('date');
        } else if (modeToShow === 'time') {
            setShowBeginDatePicker(false);
            setShowBeginTimePicker(true);
            setBeginMode('time');
        }
        console.log(selectedBeginDate.toISOString().slice(0, 10), selectedBeginTime.getHours(), selectedBeginTime.getMinutes())
    };

    useEffect(() => {
        console.log("Đây là list các group", selectedGroup)
        console.log("Đây là list các mail", mailList)
    }, [selectedGroup])

    const combinedBeginDateTime = new Date(
        selectedBeginDate.getFullYear(),
        selectedBeginDate.getMonth(),
        selectedBeginDate.getDate(),
        selectedBeginTime.getHours(),
        selectedBeginTime.getMinutes()
    );

    const utcBeginDateTime = combinedBeginDateTime.toISOString();

    const handleEndDateChange = (event, date) => {
        setShowEndDatePicker(false);
        setSelectedEndDate(date || selectedEndDate);
    };

    const handleEndTimeChange = (event, time) => {
        setShowEndTimePicker(false);
        setSelectedEndTime(time || selectedEndTime);
    };

    const showEndMode = (modeToShow) => {
        if (modeToShow === 'date') {
            setShowEndDatePicker(true);
            setShowEndTimePicker(false);
            setEndMode('date');
        } else if (modeToShow === 'time') {
            setShowEndDatePicker(false);
            setShowEndTimePicker(true);
            setEndMode('time');
        }
        console.log(selectedEndDate.toISOString().slice(0, 10), selectedEndTime.getHours(), selectedEndTime.getMinutes())
    };

    const combinedEndDateTime = new Date(
        selectedEndDate.getFullYear(),
        selectedEndDate.getMonth(),
        selectedEndDate.getDate(),
        selectedEndTime.getHours(),
        selectedEndTime.getMinutes()
    );

    const utcEndDateTime = combinedEndDateTime.toISOString();

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const removeMember = (index) => {
        const updatedMembers = [...selectedMember];
        updatedMembers.splice(index, 1);
        setSelectedMember(updatedMembers);
    };

    const createPostInvitation = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).post(endpoints['create-post-invitation'],
                {
                    "account_id": userInfo?.id,
                    "post_content": postContent,
                    "event_name": eventName,
                    "start_time": utcBeginDateTime,
                    "end_time": utcEndDateTime
                }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const memberList = selectedMember.map(member => member.id)
            const memberAccountId = [];
            for (let i = 0; i < memberList.length; i++) {
                const id = memberList[i];
                let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](id));
                memberAccountId.push(res.data.id);
            }
            console.log("Danh sách member", memberAccountId);
            console.log("Member từ group", selectedGroup)
            const postInvitationId = res.data.id;
            let member = await djangoAuthApi(token).post(endpoints['invitation-posts-accounts'](postInvitationId), {
                "list_account_id": memberAccountId.length === 0 ? selectedGroup : memberAccountId
            })
            console.log(member.status);
            const recipientList = selectedMember.map(member => member.email);
            console.log("Danh sách mail", recipientList)
            let mail = await djangoAuthApi(token).post(endpoints['send-email'], {
                "subject": "Thư mời đến sự kiện" + " " + "[" + eventName + "]",
                "message": "Trân trọng mới các bạn đến tham dự sự kiện" + "\n" +
                    postContent + " " + "vào lúc" + " " + `${String(selectedBeginDate.getDate()).padStart(2, '0')}/${String(selectedBeginDate.getMonth() + 1).padStart(2, '0')}/${selectedBeginDate.getFullYear()}`,
                "recipient_list": recipientList.length === 0 ? mailList : recipientList
            })
            console.log(mail.status, "Gửi mail nè");
            console.log(res.data, res.status);
            navigation.navigate('Profile');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <ScrollView style={styles.scrollView}>
                <View style={styles.profileContainer}>
                    <Image source={userInfo?.avatar === null ? require('../images/user.png') : { uri: userInfo?.avatar }}
                        style={styles.profileStyle} />
                    <View style={styles.inputBox}>
                        <Text style={styles.inputStyle}>{user?.first_name} {user?.last_name}</Text>
                        <Text style={{ fontSize: 14, marginTop: 3 }}>Host - Administrator</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={eventName}
                        onChangeText={(eventName) => setEventName(eventName)}
                        placeholder="Event name"
                        style={[styles.textInputStyle, { fontSize: 17 }]} />
                </View>
                <View style={styles.dateTimeContainer}>
                    <View style={[styles.textInputStyle, { marginRight: 8 }]}>
                        <Text style={{ fontSize: 13, marginBottom: 8 }}>Start date</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => showBeginMode("date")}>
                                {/* <Text style={{ fontSize: 17 }}>{selectedBeginDate.toISOString().slice(0, 10)}</Text> */}
                                <Text style={{ fontSize: 17 }}>{`${String(selectedBeginDate.getDate()).padStart(2, '0')}/${String(selectedBeginDate.getMonth() + 1).padStart(2, '0')}/${selectedBeginDate.getFullYear()}`}</Text>
                                {showBeginDatePicker && (
                                    <DateTimePicker
                                        value={selectedBeginDate}
                                        mode={beginMode}
                                        format="YYYY-MM-DD"
                                        minimumDate={currentDate}
                                        is24Hour={true}
                                        maximumDate={new Date(2100, 0, 1)}
                                        onChange={handleBeginDateChange} />)}
                            </TouchableOpacity>
                            <VectorIcon
                                name="calendar"
                                type="AntDesign"
                                size={17} />
                        </View>
                    </View>
                    <View style={[styles.textInputStyle, { marginLeft: 8 }]}>
                        <Text style={{ fontSize: 13, marginBottom: 8 }}>Start time</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => showBeginMode("time")}>
                                <Text style={{ fontSize: 17 }}>
                                    {String(selectedBeginTime.getHours()).padStart(2, '0')}:
                                    {String(selectedBeginTime.getMinutes()).padStart(2, '0')}
                                </Text>
                                {showBeginTimePicker && (
                                    <DateTimePicker
                                        value={selectedBeginTime}
                                        mode={beginMode}
                                        is24Hour={true}
                                        onChange={handleBeginTimeChange} />)}
                            </TouchableOpacity>
                            <VectorIcon
                                name="clockcircleo"
                                type="AntDesign"
                                size={17} />
                        </View>
                    </View>
                </View>
                <View style={styles.dateTimeContainer}>
                    <View style={[styles.textInputStyle, { marginRight: 8 }]}>
                        <Text style={{ fontSize: 13, marginBottom: 8 }}>End date</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => showEndMode("date")}>
                                <Text style={{ fontSize: 17 }}><Text style={{ fontSize: 17 }}>{`${String(selectedEndDate.getDate()).padStart(2, '0')}/${String(selectedEndDate.getMonth() + 1).padStart(2, '0')}/${selectedEndDate.getFullYear()}`}</Text></Text>
                                {showEndDatePicker && (
                                    <DateTimePicker
                                        value={selectedEndDate}
                                        mode={endMode}
                                        format="YYYY-MM-DD"
                                        minimumDate={currentDate}
                                        is24Hour={true}
                                        maximumDate={new Date(2100, 0, 1)}
                                        onChange={handleEndDateChange} />)}
                            </TouchableOpacity>
                            <VectorIcon
                                name="calendar"
                                type="AntDesign"
                                size={17}
                            />
                        </View>
                    </View>
                    <View style={[styles.textInputStyle, { marginLeft: 8 }]}>
                        <Text style={{ fontSize: 13, marginBottom: 8 }}>End time</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => showEndMode("time")}>
                                <Text style={{ fontSize: 17 }}>
                                    {String(selectedEndTime.getHours()).padStart(2, '0')}:
                                    {String(selectedEndTime.getMinutes()).padStart(2, '0')}
                                </Text>
                                {showEndTimePicker && (
                                    <DateTimePicker
                                        value={selectedEndTime}
                                        mode={endMode}
                                        is24Hour={true}
                                        onChange={handleEndTimeChange} />)}
                            </TouchableOpacity>
                            <VectorIcon
                                name="clockcircleo"
                                type="AntDesign"
                                size={17} />
                        </View>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        multiline
                        numberOfLines={5}
                        value={postContent}
                        onChangeText={setPostContent}
                        placeholder="Description..."
                        style={styles.postInvitationInputStyle} />
                </View>
                <View style={styles.collapsibleContainer}>
                    <TouchableOpacity onPress={toggleAdd}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <VectorIcon
                                name="add-circle"
                                type="Ionicons"
                                size={22} />
                            <Text style={styles.collapsibleSubItemHeaderText}>Add guests</Text>
                            <VectorIcon
                                name={addExpanded ? 'chevron-up' : 'chevron-down'}
                                type="Ionicons"
                                size={19}
                                style={{ position: 'absolute', right: 5 }} />
                        </View>
                    </TouchableOpacity>
                    <Collapsible collapsed={!addExpanded}>
                        <View style={styles.collapsibleSubItem}>
                            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                <SafeAreaView>
                                    <TextInput
                                        placeholder='Enter account...'
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
                                            <Image
                                                source={member.avatar === null ? require('../images/user.png') : { uri: member.avatar }}
                                                style={{ width: 40, height: 40, borderRadius: 20 }} />
                                            <Text style={{ marginLeft: 10, fontSize: 16 }}>{member.fullName}</Text>
                                            <TouchableOpacity onPress={() => removeMember(index)} style={{ position: 'absolute', right: 5 }}>
                                                <VectorIcon name="delete" type="MaterialIcons" size={22} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </SafeAreaView>
                            </TouchableWithoutFeedback>
                        </View>
                    </Collapsible>
                </View>
                <View style={styles.collapsibleContainer}>
                    <TouchableOpacity onPress={toggleAdd1}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <VectorIcon
                                name="people"
                                type="Ionicons"
                                size={22} />
                            <Text style={styles.collapsibleSubItemHeaderText}>Add groups</Text>
                            <VectorIcon
                                name={addExpanded1 ? 'chevron-up' : 'chevron-down'}
                                type="Ionicons"
                                size={19}
                                style={{ position: 'absolute', right: 5 }} />
                        </View>
                    </TouchableOpacity>
                    <Collapsible collapsed={!addExpanded1}>
                        <View style={styles.collapsibleSubItem}>
                            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                <SafeAreaView>
                                    <TextInput
                                        placeholder='Enter group...'
                                        value={groupInput}
                                        onChangeText={(groupInput) => onGroupText(groupInput)}
                                        style={{
                                            height: 40,
                                            marginHorizontal: 10,
                                            borderWidth: 1,
                                            padding: 10,
                                            borderRadius: 5,
                                            fontSize: 17
                                        }} />
                                    {
                                        groupInput.length > 0 ? <FlatList
                                            data={filteredGroupList}
                                            renderItem={renderGroup}
                                            keyExtractor={item => item.id}
                                            nestedScrollEnabled={true}
                                            scrollEnabled={false}
                                            style={{
                                                borderWidth: 1,
                                                marginHorizontal: 20,
                                                paddingHorizontal: 20
                                            }} /> : ""
                                    }
                                    {/* {selectedMember.map((member, index) => (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, marginTop: 10, padding: 8, position: 'relative' }}>
                                            <Image
                                                source={member.avatar === null ? require('../images/user.png') : { uri: member.avatar }}
                                                style={{ width: 40, height: 40, borderRadius: 20 }} />
                                            <Text style={{ marginLeft: 10, fontSize: 16 }}>{member.fullName}</Text>
                                            <TouchableOpacity onPress={() => removeMember(index)} style={{ position: 'absolute', right: 5 }}>
                                                <VectorIcon name="delete" type="MaterialIcons" size={22} />
                                            </TouchableOpacity>
                                        </View>
                                    ))} */}
                                </SafeAreaView>
                            </TouchableWithoutFeedback>
                        </View>
                    </Collapsible>
                </View>
                <View style={styles.buttonContainer}>
                    {/* <TouchableOpacity style={styles.createEventButton} onPress={() => createPostInvitation()}>
                        <Text style={styles.buttonText}>Tạo sự kiện</Text>
                    </TouchableOpacity> */}
                    <Button onPress={() => createPostInvitation()}
                        variant="subtle" colorScheme="darkBlue" style={{ marginHorizontal: 20 }}
                        isDisabled={!postContent.trim() || !eventName.trim()}
                    >
                        Create event
                    </Button>
                </View>
            </ScrollView >
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    inputContainer: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    textInputStyle: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        flex: 1,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    dateTimeSelectedText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    dateTimeUtcText: {
        fontSize: 12,
        color: 'gray',
    },
    postInvitationInputStyle: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        height: 100,
        textAlignVertical: 'top',
        fontSize: 17
    },
    buttonContainer: {
        marginTop: 20,
        marginVertical: 10
    },
    createEventButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: windowWidth - 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    collapsibleContainer: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    collapsibleSubItemHeaderText: {
        marginLeft: 5,
        fontSize: 17
    },
    profileStyle: {
        height: 50,
        width: 50,
        borderRadius: 50,
    },
    inputStyle: {
        fontSize: 18,
        color: '#000000',
        fontWeight: '600'
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    inputBox: {
        marginLeft: 10
    }
});

export default InvitationPost;