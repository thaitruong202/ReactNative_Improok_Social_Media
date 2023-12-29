import React, { useState } from 'react';
import { View, TextInput, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';

const MyForm = () => {
    const [questions, setQuestions] = useState([]); //Danh sách các câu hỏi của bài khảo sát
    const [newQuestion, setNewQuestion] = useState(''); //Câu hỏi mới thêm vào
    const [newOptions, setNewOptions] = useState([]); //Danh sách các lựa chọn của một câu hỏi nếu loại câu hỏi là Text Input thì newOptions là []

    const [editedTitle, setEditedTitle] = useState(''); //Câu hỏi ở trạng thái chỉnh sửa
    const [editedOptions, setEditedOptions] = useState([]); //Các lựa chọn ở trạng thái chỉnh sửa
    const [editedQuestionIndex, setEditedQuestionIndex] = useState(-1); //Lưu index của câu hỏi đang được chỉnh sửa hiện tại

    const [currentQuestionType, setCurrentQuestionType] = useState('Multiple-Choice'); //Loại câu hỏi hiện tại người dùng đã chọn, mặc định là Multiple-Choice

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
            const newOption = { question_option_value: '', isAdded: true };
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
                        ...option,
                        isAdded: false,
                        isDeleted: false,
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
                    style={{ marginBottom: 10 }}
                    placeholder="Enter question..."
                    value={questionTitle}
                    onChangeText={(value) => handleEditQuestionTitle(value)}
                />
                <TouchableOpacity onPress={toggleEditingMode}>
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
        <View>
            <FlatList
                data={questions}
                renderItem={renderQuestion}
                keyExtractor={(question, index) => index.toString()}
            />
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
    );
};

export default MyForm;