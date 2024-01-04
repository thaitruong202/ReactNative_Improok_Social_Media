import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable, TouchableWithoutFeedback, FlatList, Image, Keyboard, Button } from 'react-native';
import { MyUserContext } from '../../App';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { windowWidth } from '../utils/Dimensions';
import Collapsible from 'react-native-collapsible';
import AntDesign from 'react-native-vector-icons/AntDesign';
import VectorIcon from '../utils/VectorIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

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

    const [input, setInput] = useState('');

    const [selectedMember, setSelectedMember] = useState([]);

    const [filteredAccountList, setFilteredAccountList] = useState([]);

    const renderItem = ({ item }) => {
        const fullName = `${item.user.last_name} ${item.user.first_name}`;
        const isMemberSelected = !!selectedMember.find(member => member.fullName === fullName);

        return (
            <Pressable
                onPress={() => {
                    if (!isMemberSelected) {
                        const newMember = { id: item.user.id, fullName, avatar: item.avatar, email: item.user.email };
                        setSelectedMember([...selectedMember, newMember]);
                        setInput('');
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
                    isMemberSelected && { opacity: 0.5 },
                ]}
                disabled={isMemberSelected}
                accessibilityState={{ selected: isMemberSelected }}>
                <Image
                    source={{ uri: item.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20 }} />
                <Text style={{ fontSize: 16, marginLeft: 10 }}>{fullName}</Text>
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
            console.log(res.data);
            setFilteredAccountList(res.data);
            //console.log(filteredList);
        } else {
            setFilteredAccountList([]);
        }
    };

    const currentDate = new Date();

    const toggleAdd = () => {
        setAddExpanded(!addExpanded);
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
            console.log(memberAccountId);
            const postInvitationId = res.data.id;
            let member = await djangoAuthApi(token).post(endpoints['invitation-posts-accounts'](postInvitationId), {
                "list_account_id": memberAccountId
            })
            console.log(member.status);
            const recipientList = selectedMember.map(member => member.email);
            let mail = await djangoAuthApi(token).post(endpoints['send-email'], {
                "subject": "Thư mời đến sự kiện" + " " + eventName,
                "message": "Mời các bạn đến dự sự kiện của trường nha",
                "recipient_list": recipientList
            })
            console.log(mail.status, "Gửi mail nè");
            console.log(res.data, res.status);
            navigation.navigate('Trang cá nhân');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <ScrollView style={styles.scrollView}>
                <View style={styles.profileContainer}>
                    <Image source={{ uri: userInfo?.avatar }} style={styles.profileStyle} />
                    <View style={styles.inputBox}>
                        <Text style={styles.inputStyle}>{user.first_name} {user.last_name}</Text>
                        <Text style={{ fontSize: 14, marginTop: 3 }}>Host - Administrator</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={eventName}
                        onChangeText={(eventName) => setEventName(eventName)}
                        placeholder="Event Name..."
                        style={[styles.textInputStyle, { fontSize: 17 }]} />
                </View>
                <View style={styles.dateTimeContainer}>
                    <View style={[styles.textInputStyle, { marginRight: 8 }]}>
                        <Text style={{ fontSize: 13, marginBottom: 8 }}>Ngày bắt đầu</Text>
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
                    </View>
                    <View style={[styles.textInputStyle, { marginLeft: 8 }]}>
                        <Text style={{ fontSize: 13, marginBottom: 8 }}>Giờ bắt đầu</Text>
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
                    </View>
                </View>
                <View style={styles.dateTimeContainer}>
                    <View style={[styles.textInputStyle, { marginRight: 8 }]}>
                        <Text style={{ fontSize: 13, marginBottom: 8 }}>Ngày kết thúc</Text>
                        <TouchableOpacity onPress={() => showEndMode("date")}>
                            <Text style={{ fontSize: 17 }}><Text style={{ fontSize: 17 }}>{`${String(selectedBeginDate.getDate()).padStart(2, '0')}/${String(selectedBeginDate.getMonth() + 1).padStart(2, '0')}/${selectedBeginDate.getFullYear()}`}</Text></Text>
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
                    </View>
                    <View style={[styles.textInputStyle, { marginLeft: 8 }]}>
                        <Text style={{ fontSize: 13, marginBottom: 8 }}>Giờ kết thúc</Text>
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
                                type="MaterialIcons"
                                size={22} />
                            <Text style={styles.collapsibleSubItemHeaderText}>Thêm khách mời</Text>
                            <AntDesign
                                name={addExpanded ? 'up' : 'down'}
                                size={19}
                                color="black"
                                style={{ position: 'absolute', right: 5 }} />
                        </View>
                    </TouchableOpacity>
                    <Collapsible collapsed={!addExpanded}>
                        <View style={styles.collapsibleSubItem}>
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
                    </Collapsible>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.createEventButton} onPress={() => createPostInvitation()}>
                        <Text style={styles.buttonText}>Tạo sự kiện</Text>
                    </TouchableOpacity>
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
        alignItems: 'center'
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