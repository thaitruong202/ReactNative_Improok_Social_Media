import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Button, FlatList } from 'react-native';
import { MyUserContext } from '../../App';
import DateTimePicker from '@react-native-community/datetimepicker';
import { windowWidth } from '../utils/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { RadioButton } from 'react-native-paper';

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
        // console.log("Chào đây là list các câu hỏi chào cưng" + " " + questions.map(question => question.survey_question_option_list[0].question_option_value))
        // if (questions.length > 0) {
        //     console.log("Chào đây là list các câu hỏi chào chị" + " " + questions[0].survey_question_option_list.map(survey_question_option_list => survey_question_option_list.question_option_value))
        // }
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
                    case 'CheckBox':
                        return 2;
                    case 'Text Input':
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
                setIsEditingEnabled(false);
                setEditedQuestionIndex(null);
                setEditedTitle('');
                setEditedOptions([]);
            } else {
                setIsEditingEnabled(false);
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
            setIsEditingEnabled(true);
        };

        return (
            <View style={{ marginBottom: 20 }}>
                <TextInput
                    style={{ marginBottom: 10 }}
                    placeholder="Enter question..."
                    value={questionTitle}
                    onChangeText={(value) => handleEditQuestionTitle(value)}
                />
                <TouchableOpacity onPress={toggleEditingMode} disabled={!isEditingEnabled} style={{ backgroundColor: buttonBackgroundColor }}>
                    <Text>Chỉnh sửa</Text>
                </TouchableOpacity>
                {questionOptions.map((option, optionIndex) => {
                    if (option.isDeleted) {
                        return null;
                    }
                    return (
                        <View key={optionIndex} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                style={{ flex: 1, marginRight: 10 }}
                                placeholder="Enter option..."
                                value={option.question_option_value}
                                onChangeText={(value) => handleOptionChange(optionIndex, value)}
                            />
                            {isEditing && (
                                <TouchableOpacity onPress={() => handleRemoveOptionFromQuestion(optionIndex)}>
                                    <Text style={{ color: 'red' }}>Remove</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
                {isEditing && (
                    <TouchableOpacity onPress={handleAddOptionToQuestion}>
                        <Text>Add Option</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleRemoveQuestion}>
                    <Text style={{ color: 'red' }}>Remove Question</Text>
                </TouchableOpacity>
                {isEditing && (
                    <TouchableOpacity onPress={saveChanges}>
                        <Text>Save Changes</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <>
            <ScrollView>
                <View>
                    <TextInput
                        value={surveyName}
                        onChangeText={(surveyName) => setSurveyName(surveyName)}
                        placeholder="Tên khảo sát"
                        style={styles.textInputStyle}
                    />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
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
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
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
                </View>
                <View>
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
                <View>
                    <View style={{ marginTop: 20 }}>
                        <Text>New Question:</Text>
                        <TextInput
                            value={newQuestion}
                            onChangeText={text => setNewQuestion(text)}
                            placeholder="Enter question title"
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <RadioButton
                                value="Multiple-Choice"
                                status={currentQuestionType === 'Multiple-Choice' ? 'checked' : 'unchecked'}
                                onPress={() => setCurrentQuestionType('Multiple-Choice')}
                            />
                            <Text>Multiple Choice</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <RadioButton
                                value="CheckBox"
                                status={currentQuestionType === 'CheckBox' ? 'checked' : 'unchecked'}
                                onPress={() => setCurrentQuestionType('CheckBox')}
                            />
                            <Text>CheckBox</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <RadioButton
                                value="Text Input"
                                status={currentQuestionType === 'Text Input' ? 'checked' : 'unchecked'}
                                onPress={() => setCurrentQuestionType('Text Input')}
                            />
                            <Text>Text Input</Text>
                        </View>
                        {currentQuestionType !== 'Text Input' && (
                            <View>
                                <Text>Options:</Text>
                                <FlatList
                                    data={newOptions}
                                    renderItem={renderOption}
                                    keyExtractor={(option, index) => index.toString()}
                                />
                                <Button title="Add Option" onPress={handleAddOption} />
                            </View>
                        )}
                        <Button title="Add Question" onPress={handleAddQuestion} />
                        <Button title="Create Survey" onPress={createSurvey} />
                    </View>
                </View>
                <View>
                    <TouchableOpacity style={styles.createEventButt} onPress={() => createPostSurvey()}>
                        <Text>Tạo khảo sát</Text>
                    </TouchableOpacity>
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
});

export default SurveyPost;