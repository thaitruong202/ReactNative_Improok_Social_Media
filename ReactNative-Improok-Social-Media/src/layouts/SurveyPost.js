import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { MyUserContext } from '../../App';
import DateTimePicker from '@react-native-community/datetimepicker';
import { windowWidth } from '../utils/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { RadioButton } from 'react-native-paper';
import { Button } from '@rneui/themed';
import VectorIcon from '../utils/VectorIcon';

const SurveyPost = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [surveyName, setSurveyName] = useState("");

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

    const [postContent, setPostContent] = useState("");

    const [questions, setQuestions] = useState([]); //Danh sách các câu hỏi của bài khảo sát
    const [newQuestion, setNewQuestion] = useState(""); //Câu hỏi mới thêm vào
    const [newOptions, setNewOptions] = useState([]); //Danh sách các lựa chọn của một câu hỏi nếu loại câu hỏi là Text Input thì newOptions là []

    const [editedTitle, setEditedTitle] = useState(''); //Câu hỏi ở trạng thái chỉnh sửa
    const [editedOptions, setEditedOptions] = useState([]); //Các lựa chọn ở trạng thái chỉnh sửa
    const [editedQuestionIndex, setEditedQuestionIndex] = useState(-1); //Lưu index của câu hỏi đang được chỉnh sửa hiện tại

    const [currentQuestionType, setCurrentQuestionType] = useState('Multiple-Choice'); //Loại câu hỏi hiện tại người dùng đã chọn, mặc định là Multiple-Choice

    const [isEditingEnabled, setIsEditingEnabled] = useState(true);
    const buttonBackgroundColor = isEditingEnabled ? 'yellow' : 'transparent';

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

    const createPostSurvey = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).post(endpoints['create-post-survey'],
                {
                    "post_content": postContent,
                    "account_id": userInfo?.id,
                    "start_time": utcBeginDateTime,
                    "end_time": utcEndDateTime,
                    "post_survey_title": surveyName,
                    "survey_question_list": questions
                }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(res.data, res.status);
            console.log('Tạo khảo sát thành công')
            navigation.navigate('Trang cá nhân');
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddOption = () => {
        setNewOptions(prevOptions => [...prevOptions, { question_option_value: '', question_option_order: 0 }]);
    }; //Thêm một lựa chọn mới với giá trị là '' vào danh sách các lựa chọn

    const handleOptionChange = (index, value) => {
        setNewOptions(prevOptions => {
            if (index >= 0 && index < prevOptions.length) {
                const updatedOptions = [...prevOptions];
                updatedOptions[index] = {
                    ...updatedOptions[index],
                    question_option_value: value
                };
                return updatedOptions;
            }
            return prevOptions;
        });
    }; //Cập nhật lại giá trị của một lựa chọn

    const handleRemoveOption = (index) => {
        setNewOptions(prevOptions => {
            const updatedOptions = [...prevOptions];
            updatedOptions.splice(index, 1);
            return updatedOptions;
        });
    }; //Xóa 1 lựa chọn tại vị trí index

    const handleAddQuestion = () => {
        if (editedQuestionIndex !== -1) {
            if (editedTitle.trim() === '') {
                return;
            }

            setQuestions(prevQuestions => {
                const updatedQuestions = [...prevQuestions];
                const editedQuestion = updatedQuestions[editedQuestionIndex];
                editedQuestion.question_content = editedTitle;
                editedQuestion.survey_question_option_list = editedOptions;
                return updatedQuestions;
            });

            setEditedQuestionIndex(-1);
            setEditedTitle('');
            setEditedOptions([]);
        } else {
            if (newQuestion.trim() === '') {
                return;
            }

            const getQuestionTypeId = (questionType) => {
                switch (questionType) {
                    case 'Multiple-Choice':
                        return 1;
                    case 'Text Input':
                        return 2;
                    case 'CheckBox':
                        return 3;
                    default:
                        return 0;
                }
            }; // Lấy loại câu hỏi mà người dùng đã chọn

            const newQuestionItem = {
                survey_question_type_id: getQuestionTypeId(currentQuestionType),
                question_content: newQuestion,
                question_order: questions.length,
                is_required: true,
                survey_question_option_list: newOptions
            }; // Tạo một đối tượng câu hỏi mới

            if (currentQuestionType === 'Text Input') {
                newQuestionItem.survey_question_option_list = [];
            } // Nếu loại câu hỏi là Text Input thì danh sách survey_question_option_list là rỗng

            setQuestions(prevQuestions => [...prevQuestions, newQuestionItem]);
            setNewQuestion('');
            setNewOptions([]);
            console.log(questions);
        }
    }; //Thêm mới một câu hỏi

    const createSurvey = () => {
        console.log(questions);
    }

    const renderOption = ({ item, index }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
                style={{ flex: 1, marginRight: 10 }}
                placeholder="Enter option..."
                value={item.question_option_value}
                onChangeText={(value) => handleOptionChange(index, value)}
            />
            <TouchableOpacity onPress={() => handleRemoveOption(index)}>
                <Text style={{ color: 'red' }}>Remove</Text>
            </TouchableOpacity>
        </View>
    );

    const renderQuestion = ({ item, index }) => {
        const isEditing = index === editedQuestionIndex;
        const questionTitle = isEditing ? editedTitle : item.question_content;
        const questionOptions = isEditing ? editedOptions : item.survey_question_option_list;

        const handleEditQuestionTitle = (title) => {
            setEditedTitle(title);
        };

        const handleOptionChange = (optionIndex, value) => {
            const updatedOptions = [...questionOptions];
            updatedOptions[optionIndex].question_option_value = value;
            setEditedOptions(updatedOptions);
        };

        const handleRemoveOptionFromQuestion = (optionIndex) => {
            const updatedOptions = [...questionOptions];
            updatedOptions[optionIndex].isDeleted = true;
            setEditedOptions(updatedOptions);
        };

        const handleAddOptionToQuestion = () => {
            const newOption = { question_option_value: '', question_option_order: 0 };
            const updatedOptions = [...questionOptions, newOption];
            setEditedOptions(updatedOptions);
        };

        const handleRemoveQuestion = () => {
            setQuestions((prevQuestions) => {
                const updatedQuestions = [...prevQuestions];
                updatedQuestions.splice(index, 1);
                return updatedQuestions;
            });
        };

        const toggleEditingMode = () => {
            if (isEditing) {
                setEditedQuestionIndex(null);
                setEditedTitle('');
                setEditedOptions([]);
            } else {
                setEditedQuestionIndex(index);
                setEditedTitle(item.question_content);
                setEditedOptions(item.survey_question_option_list);
            }
        };

        const saveChanges = () => {
            const updatedQuestions = [...questions];
            const updatedQuestion = { ...updatedQuestions[index] };

            updatedQuestion.question_content = editedTitle;

            const updatedOptions = questionOptions.map((option) => {
                if (option.isAdded || option.isDeleted) {
                    return {
                        ...option
                    };
                }
                return option;
            });

            updatedQuestion.survey_question_option_list = updatedOptions;
            updatedQuestions[index] = updatedQuestion;

            setQuestions(updatedQuestions);
            setEditedQuestionIndex(null);
            setEditedTitle('');
            setEditedOptions([]);
        };

        return (
            <View style={{ marginBottom: 20 }}>
                <TextInput
                    style={[styles.textInputStyle, { fontSize: 16 }]}
                    placeholder="Enter question..."
                    value={questionTitle}
                    onChangeText={(value) => handleEditQuestionTitle(value)}
                    editable={isEditing}
                />
                <TouchableOpacity onPress={toggleEditingMode} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f83d3', padding: 5, width: windowWidth / 2.5, justifyContent: 'space-around', borderRadius: 15 }}>
                    <VectorIcon
                        name="edit"
                        type="Feather"
                        size={25}
                        color='white'
                    />
                    <Text style={{ fontSize: 14, color: 'white' }}>Chỉnh sửa</Text>
                </TouchableOpacity>
                {questionOptions.map((option, optionIndex) => {
                    if (option.isDeleted) {
                        return null;
                    }
                    return (
                        <View key={optionIndex} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                style={[styles.textInputStyle, { flex: 1, marginRight: 10 }]}
                                placeholder="Enter option..."
                                value={option.question_option_value}
                                onChangeText={(value) => handleOptionChange(optionIndex, value)}
                                editable={isEditing}
                            />
                            {isEditing && (
                                <TouchableOpacity onPress={() => handleRemoveOptionFromQuestion(optionIndex)}>
                                    <VectorIcon
                                        name="remove-circle"
                                        type="Ionicons"
                                        size={21}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
                {isEditing && (
                    <TouchableOpacity onPress={handleAddOptionToQuestion} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f83d3', padding: 5, width: windowWidth / 2.5, justifyContent: 'space-around', borderRadius: 15 }}>
                        <VectorIcon
                            name="add-circle"
                            type="MaterialIcons"
                            size={25}
                            color="white"
                        />
                        <Text style={{ fontSize: 14, color: 'white' }}>Add Option</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleRemoveQuestion} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'red', padding: 5, width: windowWidth / 2.5, justifyContent: 'space-around', borderRadius: 15 }}>
                    <VectorIcon
                        name="delete"
                        type="MaterialCommunityIcons"
                        size={25}
                        color='white'
                    />
                    <Text style={{ fontSize: 14, color: 'white' }}>Remove Question</Text>
                </TouchableOpacity>
                {isEditing && (
                    <TouchableOpacity onPress={saveChanges} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'black', padding: 5, width: windowWidth / 2.5, justifyContent: 'space-around', borderRadius: 15 }}>
                        <VectorIcon
                            name="save"
                            type="Entypo"
                            size={25}
                            color='white'
                        />
                        <Text style={{ fontSize: 14, color: 'white' }}>Save Changes</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <>
            <ScrollView>
                <View style={styles.profileContainer}>
                    <Image
                        source={userInfo?.avatar === null ? require('../images/user.png') : { uri: userInfo?.avatar }}
                        style={styles.profileStyle} />
                    <View style={styles.inputBox}>
                        <Text style={styles.inputStyle}>{user.first_name} {user.last_name}</Text>
                        <Text style={{ fontSize: 14, marginTop: 3 }}>Host - Administrator</Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={surveyName}
                        onChangeText={(surveyName) => setSurveyName(surveyName)}
                        placeholder="Survey Name..."
                        style={[styles.textInputStyle, { fontSize: 17 }]}
                    />
                </View>
                <View style={styles.dateTimeContainer}>
                    <View style={[styles.textInputStyle, { marginRight: 8 }]}>
                        <Text style={{ fontSize: 13, marginBottom: 8 }}>Ngày bắt đầu</Text>
                        <TouchableOpacity onPress={() => showBeginMode("date")}>
                            <Text style={{ fontSize: 17 }}>
                                <Text style={{ fontSize: 17 }}>{`${String(selectedBeginDate.getDate()).padStart(2, '0')}/${String(selectedBeginDate.getMonth() + 1).padStart(2, '0')}/${selectedBeginDate.getFullYear()}`}</Text>
                            </Text>
                            {showBeginDatePicker && (
                                <DateTimePicker
                                    value={selectedBeginDate}
                                    mode={beginMode}
                                    format="YYYY-MM-DD"
                                    minimumDate={currentDate}
                                    is24Hour={true}
                                    maximumDate={new Date(2100, 0, 1)}
                                    onChange={handleBeginDateChange}
                                />
                            )}
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
                                    onChange={handleBeginTimeChange}
                                />
                            )}
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
                                    onChange={handleEndDateChange}
                                />
                            )}
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
                                    onChange={handleEndTimeChange}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        multiline
                        numberOfLines={3}
                        value={postContent}
                        onChangeText={setPostContent}
                        placeholder="Description..."
                        style={styles.postInvitationInputStyle}
                    />
                </View>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 600 }}>Tạo khảo sát</Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={{ marginTop: 20 }}>
                        <TextInput
                            value={newQuestion}
                            onChangeText={text => setNewQuestion(text)}
                            placeholder="Enter question..."
                            style={[styles.textInputStyle, { fontSize: 17 }]}
                        />
                        <View>
                            <Text style={{ fontSize: 13, marginBottom: 10, marginTop: 10 }}>Chọn loại câu hỏi</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value="Multiple-Choice"
                                    status={currentQuestionType === 'Multiple-Choice' ? 'checked' : 'unchecked'}
                                    onPress={() => setCurrentQuestionType('Multiple-Choice')}
                                />
                                <Text style={{ fontSize: 16 }}>Multiple Choice</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value="Text Input"
                                    status={currentQuestionType === 'Text Input' ? 'checked' : 'unchecked'}
                                    onPress={() => setCurrentQuestionType('Text Input')}
                                />
                                <Text style={{ fontSize: 16 }}>Text Input</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    value="CheckBox"
                                    status={currentQuestionType === 'CheckBox' ? 'checked' : 'unchecked'}
                                    onPress={() => setCurrentQuestionType('CheckBox')}
                                />
                                <Text style={{ fontSize: 16 }}>CheckBox</Text>
                            </View>
                        </View>
                        {/* {currentQuestionType !== 'Text Input' && (
                            <View>
                                <Text>Options:</Text>
                                <FlatList
                                    data={newOptions}
                                    renderItem={renderOption}
                                    keyExtractor={(option, index) => index.toString()}
                                />
                                
                                <Button title="Add Option" onPress={handleAddOption} />
                            </View>
                        )} */}
                        {currentQuestionType !== 'Text Input' && (
                            <View>
                                <Text style={{ marginVertical: 8 }}>Thêm lựa chọn</Text>
                                {newOptions.map((item, index) => (
                                    <View key={index} style={[styles.textInputStyle, { flexDirection: 'row', alignItems: 'center', borderWidth: 1, marginVertical: 3 }]}>
                                        <TextInput
                                            style={{ flex: 1, marginRight: 10, fontSize: 17 }}
                                            placeholder="Enter option..."
                                            value={item.question_option_value}
                                            onChangeText={(value) => handleOptionChange(index, value)}
                                        />
                                        <TouchableOpacity onPress={() => handleRemoveOption(index)}>
                                            <VectorIcon
                                                name="delete"
                                                type="MaterialCommunityIcons"
                                                size={22}>
                                            </VectorIcon>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                <Button
                                    title="Add Option"
                                    buttonStyle={{
                                        backgroundColor: 'rgba(78, 116, 289, 1)',
                                        borderRadius: 3,
                                        flex: 1,
                                        marginVertical: 10
                                    }}
                                    onPress={handleAddOption}
                                />
                            </View>
                        )}
                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-around" }}>
                            <View style={{ width: "46%" }}>
                                <Button
                                    title="Add Question"
                                    icon={{
                                        name: 'question-circle',
                                        type: 'font-awesome',
                                        size: 16,
                                        color: 'white'
                                    }}
                                    iconContainerStyle={{ marginRight: 10 }}
                                    titleStyle={{ fontWeight: '700' }}
                                    buttonStyle={{
                                        backgroundColor: 'rgba(90, 154, 230, 1)',
                                        borderColor: 'transparent',
                                        borderWidth: 0,
                                        borderRadius: 30,
                                    }}
                                    containerStyle={{
                                        width: "100%",
                                        // marginHorizontal: 10,
                                        marginRight: 10,
                                        marginVertical: 5,
                                    }}
                                    onPress={handleAddQuestion}
                                />
                            </View>
                            <View style={{ width: "46%" }}>
                                <Button
                                    title="Create Survey"
                                    icon={{
                                        name: 'create',
                                        type: 'ionicons',
                                        size: 16,
                                        color: 'white',
                                    }}
                                    iconContainerStyle={{ marginRight: 10 }}
                                    titleStyle={{ fontWeight: '700' }}
                                    buttonStyle={{
                                        backgroundColor: 'rgba(90, 154, 230, 1)',
                                        borderColor: 'transparent',
                                        borderWidth: 0,
                                        borderRadius: 30,
                                    }}
                                    containerStyle={{
                                        width: "100%",
                                        // marginLeft: 10,
                                        // marginHorizontal: 10,
                                        marginVertical: 5,
                                    }}
                                    onPress={createSurvey}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <Button
                        title="Tạo khảo sát"
                        loading={false}
                        loadingProps={{ size: 'small', color: 'white' }}
                        buttonStyle={{
                            backgroundColor: 'rgba(111, 202, 186, 1)',
                            borderRadius: 5,
                        }}
                        titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
                        containerStyle={{
                            marginHorizontal: 50,
                            height: 50,
                            width: 200,
                            marginVertical: 10,
                        }}
                        onPress={() => createPostSurvey()}
                    />
                </View>
            </ScrollView>
            <FlatList
                data={questions}
                renderItem={renderQuestion}
                keyExtractor={(question, index) => index.toString()}
                nestedScrollEnabled={true}
            />
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
        // position: 'absolute',
        // bottom: 3,
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
    },
    container: {
        flex: 1,
        padding: 16,
    },
    questionContainer: {
        marginBottom: 16,
    },
    deleteButton: {
        color: 'red',
        marginBottom: 8,
    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    optionText: {
        marginLeft: 8,
    },
    newQuestionContainer: {
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    typeLabel: {
        marginRight: 8,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    radioButtonLabel: {
        marginLeft: 8,
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    radioButton: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    radioButtonSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black',
    },
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

export default SurveyPost;