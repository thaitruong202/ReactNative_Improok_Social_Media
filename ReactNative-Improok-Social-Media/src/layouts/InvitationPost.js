import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MyUserContext } from '../../App';
import DateTimePicker from '@react-native-community/datetimepicker';
import { windowWidth } from '../utils/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';

const InvitationPost = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [eventName, setEvenName] = useState('');

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

    const currentDate = new Date();

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
            console.log(res.data, res.status);
            navigation.navigate('Trang cá nhân');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <ScrollView>
                <View>
                    <TextInput
                        value={eventName}
                        onChangeText={(eventName) => setEvenName(eventName)}
                        placeholder="Tên sự kiện"
                        style={styles.textInputStyle}
                    />
                </View>
                <View>
                    <TouchableOpacity onPress={() => showBeginMode("date")}>
                        <Text style={styles.textInputStyle}>
                            {selectedBeginDate.toISOString().slice(0, 10)}
                        </Text>
                        {showBeginDatePicker && (<DateTimePicker
                            value={selectedBeginDate}
                            mode={beginMode}
                            format="YYYY-MM-DD"
                            minimumDate={currentDate}
                            is24Hour={true}
                            maximumDate={new Date(2100, 0, 1)}
                            onChange={handleBeginDateChange}
                        />)}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showBeginMode("time")}>
                        <Text style={styles.textInputStyle}>
                            {String(selectedBeginTime.getHours()).padStart(2, '0')}:{String(selectedBeginTime.getMinutes()).padStart(2, '0')}
                        </Text>
                        {showBeginTimePicker && (<DateTimePicker
                            value={selectedBeginTime}
                            mode={beginMode}
                            is24Hour={true}
                            onChange={handleBeginTimeChange}
                        />)}
                    </TouchableOpacity>
                    {/* <Text>{selectedDate.toLocaleString()}</Text> */}
                    <Text>{selectedBeginDate.toISOString().slice(0, 10)} {selectedBeginTime.getHours()}:{selectedBeginTime.getMinutes()}</Text>
                    <Text>{utcBeginDateTime}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={() => showEndMode("date")}>
                        <Text style={styles.textInputStyle}>
                            {selectedEndDate.toISOString().slice(0, 10)}
                        </Text>
                        {showEndDatePicker && (<DateTimePicker
                            value={selectedEndDate}
                            mode={endMode}
                            format="YYYY-MM-DD"
                            minimumDate={currentDate}
                            is24Hour={true}
                            maximumDate={new Date(2100, 0, 1)}
                            onChange={handleEndDateChange}
                        />)}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showEndMode("time")}>
                        <Text style={styles.textInputStyle}>
                            {String(selectedEndTime.getHours()).padStart(2, '0')}:{String(selectedEndTime.getMinutes()).padStart(2, '0')}
                        </Text>
                        {showEndTimePicker && (<DateTimePicker
                            value={selectedEndTime}
                            mode={endMode}
                            is24Hour={true}
                            onChange={handleEndTimeChange}
                        />)}
                    </TouchableOpacity>
                    {/* <Text>{selectedDate.toLocaleString()}</Text> */}
                    <Text>{selectedEndDate.toISOString().slice(0, 10)} {selectedEndTime.getHours()}:{selectedEndTime.getMinutes()}</Text>
                    <Text>{utcEndDateTime}</Text>
                </View>
                <View>
                    <TextInput
                        multiline
                        numberOfLines={5}
                        value={postContent}
                        onChangeText={setPostContent}
                        placeholder="Description..."
                        style={styles.postInvitationInputStyle}
                    />
                </View>
            </ScrollView>
            <View>
                <TouchableOpacity style={styles.createEventButt} onPress={() => createPostInvitation()}>
                    <Text>Tạo sự kiện</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    textInputStyle: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 18,
        borderRadius: 10
    },
    createEventButt: {
        padding: 10,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        position: 'absolute',
        bottom: 3,
        width: windowWidth / 2,
        borderWidth: 1
    },
    postInvitationInputStyle: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 18,
        borderRadius: 10
    }
});

export default InvitationPost;