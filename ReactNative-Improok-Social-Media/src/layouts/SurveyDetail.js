import { useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { RadioButton } from 'react-native-paper';
import { CheckBox } from '@rneui/themed';


const SurveyDetail = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const route = useRoute();
    const { postId, firstName, lastName, avatar } = route.params;

    const [userInfo, setUserInfo] = useState();

    const [postSurveyDetail, setPostSurveyDetail] = useState();

    const [selectedOption, setSelectedOption] = useState(null);

    const [checked, setChecked] = useState(true);

    const [checkboxStates, setCheckboxStates] = useState([]);

    const [surveyAnswers, setSurveyAnswers] = useState([]);

    const [selectedOptions, setSelectedOptions] = useState({});

    const sumbitPostSurvey = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).post(endpoints['answer-post-survey'], {
                // "account_id": userInfo?.id,
                // "post_survey": postSurveyDetail.id,
                // "survey_question_list": [
                // {
                //     "question": 1,
                //     "answer_value": "",
                //     "list_survey_question_option_id": [
                //         3
                //     ]
                // },
                //     {
                //         "question": 2,
                //         "answer_value": "",
                //         "list_survey_question_option_id": [
                //             6
                //         ]
                //     },
                //     {
                //         "question": 3,
                //         "answer_value": "Đi ngủ"
                //     }
                // ]
                "account_id": userInfo?.id,
                "post_survey": postSurveyDetail.id,
                "survey_question_list": surveyAnswers
            })
            alert("Câu trả lời của bạn đã được ghi nhận");
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await djangoAuthApi(token).get(endpoints['get-account-by-user'](user.id))
                setUserInfo(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        getCurrentUser();
    }, [])

    const getPostSurveyDetail = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-post-survey-by-post-id'](postId));
            setPostSurveyDetail(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPostSurveyDetail();
    }, []);

    const renderQuestion = (question) => {
        switch (question.survey_question_type) {
            case 1:
                return renderRadioQuestion(question);
            case 2:
                return renderTextInputQuestion(question);
            case 3:
                return renderCheckboxQuestion(question);
            default:
                return null;
        }
    };

    // const handleRadioOptionSelect = (questionId, optionId) => {
    //     setSelectedOptions((prevSelectedOptions) => {
    //         const updatedSelectedOptions = {
    //             ...prevSelectedOptions,
    //             [questionId]: optionId,
    //         };

    //         const selectedOptionsArray = Object.keys(updatedSelectedOptions).map((questionId) => ({
    //             question: parseInt(questionId),
    //             answer_value: "",
    //             list_survey_question_option_id: [updatedSelectedOptions[questionId]],
    //         }));

    //         setSurveyAnswers(selectedOptionsArray);

    //         return updatedSelectedOptions;
    //     });
    // };

    // const renderRadioQuestion = (question) => {
    //     const selectedOption = selectedOptions[question.id];

    //     return (
    //         <View key={question.id}>
    //             <Text>{question.question_content}</Text>
    //             <RadioButton.Group
    //                 onValueChange={(value) => handleRadioOptionSelect(question.id, value)}
    //                 value={selectedOption}
    //                 style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
    //             >
    //                 {question.survey_question_option_list.map((option) => (
    //                     <TouchableOpacity key={option.id} onPress={() => handleRadioOptionSelect(question.id, option.id)}>
    //                         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //                             <RadioButton value={option.id} />
    //                             <Text>{option.question_option_value}</Text>
    //                         </View>
    //                     </TouchableOpacity>
    //                 ))}
    //             </RadioButton.Group>
    //         </View>
    //     );
    // };

    // // const handleCheckboxOptionToggle = (questionId, optionId) => {
    // //     const existingState = checkboxStates.find((state) => state.questionId === questionId && state.optionId === optionId);
    // //     if (existingState) {
    // //         const updatedCheckboxStates = checkboxStates.filter((state) => state !== existingState);
    // //         setCheckboxStates(updatedCheckboxStates);
    // //     } else {
    // //         const updatedCheckboxStates = [...checkboxStates, { questionId, optionId }];
    // //         setCheckboxStates(updatedCheckboxStates);
    // //     }
    // // };

    // const handleCheckboxOptionToggle = (questionId, optionId) => {
    //     const existingState = checkboxStates.find((state) => state.questionId === questionId && state.optionId === optionId);
    //     if (existingState) {
    //         const updatedCheckboxStates = checkboxStates.filter((state) => state !== existingState);
    //         setCheckboxStates(updatedCheckboxStates);
    //     } else {
    //         const updatedCheckboxStates = [...checkboxStates, { questionId, optionId }];
    //         setCheckboxStates(updatedCheckboxStates);
    //     }
    //     const existingAnswerIndex = surveyAnswers.findIndex(
    //         (answer) => answer.question === questionId
    //     );

    //     if (existingAnswerIndex !== -1) {
    //         const existingAnswer = surveyAnswers[existingAnswerIndex];
    //         const updatedOptionIds = existingAnswer.list_survey_question_option_id.includes(optionId)
    //             ? existingAnswer.list_survey_question_option_id.filter((id) => id !== optionId)
    //             : [...existingAnswer.list_survey_question_option_id, optionId];

    //         const updatedAnswer = {
    //             ...existingAnswer,
    //             list_survey_question_option_id: updatedOptionIds,
    //         };

    //         const updatedSurveyAnswers = [...surveyAnswers];
    //         updatedSurveyAnswers[existingAnswerIndex] = updatedAnswer;

    //         setSurveyAnswers(updatedSurveyAnswers);
    //     } else {
    //         const newAnswer = {
    //             question: questionId,
    //             answer_value: "",
    //             list_survey_question_option_id: [optionId],
    //         };

    //         const updatedSurveyAnswers = [...surveyAnswers, newAnswer];
    //         setSurveyAnswers(updatedSurveyAnswers);
    //     }
    // };

    // const renderCheckboxQuestion = (question) => {
    //     return (
    //         <View key={question.id}>
    //             <Text>{question.question_content}</Text>
    //             {question.survey_question_option_list.map((option) => (
    //                 <TouchableOpacity
    //                     key={option.id}
    //                     onPress={() => handleCheckboxOptionToggle(question.id, option.id)}
    //                 >
    //                     <CheckBox
    //                         checked={
    //                             checkboxStates.some(
    //                                 (state) => state.questionId === question.id && state.optionId === option.id
    //                             )
    //                         }
    //                         iconType="material-community"
    //                         checkedIcon="checkbox-outline"
    //                         uncheckedIcon="checkbox-blank-outline"
    //                     />
    //                     <Text>{option.question_option_value}</Text>
    //                 </TouchableOpacity>
    //             ))}
    //         </View>
    //     );
    // };

    // const renderTextInputQuestion = (question) => {
    //     return (
    //         <View key={question.id}>
    //             <Text>{question.question_content}</Text>
    //             <TextInput
    //                 onChangeText={(text) => handleTextInputChange(question.id, text)}
    //                 placeholder="Enter your answer"
    //             />
    //         </View>
    //     );
    // };

    // const handleTextInputChange = (questionId, value) => {
    //     const existingAnswer = surveyAnswers.find((answer) => answer.question === questionId);
    //     if (existingAnswer) {
    //         const updatedAnswers = surveyAnswers.map((answer) => {
    //             if (answer.question === questionId) {
    //                 return {
    //                     ...answer,
    //                     answer_value: value,
    //                 };
    //             }
    //             return answer;
    //         });
    //         setSurveyAnswers(updatedAnswers);
    //     } else {
    //         const newAnswer = {
    //             question: questionId,
    //             answer_value: value
    //         };
    //         const updatedAnswers = [...surveyAnswers, newAnswer];
    //         setSurveyAnswers(updatedAnswers);
    //     }
    // };

    const handleRadioOptionSelect = (questionId, optionId) => {
        const updatedSelectedOptions = {
            ...selectedOptions,
            [questionId]: optionId,
        };
        setSelectedOptions(updatedSelectedOptions);
        updateSurveyAnswers(updatedSelectedOptions);
    };

    const handleCheckboxOptionToggle = (questionId, optionId) => {
        const existingState = checkboxStates.find((state) => state.questionId === questionId && state.optionId === optionId);
        if (existingState) {
            const updatedCheckboxStates = checkboxStates.filter((state) => state !== existingState);
            setCheckboxStates(updatedCheckboxStates);
        } else {
            const updatedCheckboxStates = [...checkboxStates, { questionId, optionId }];
            setCheckboxStates(updatedCheckboxStates);
        }
        const existingAnswerIndex = surveyAnswers.findIndex(
            (answer) => answer.question === questionId
        );

        if (existingAnswerIndex !== -1) {
            const existingAnswer = surveyAnswers[existingAnswerIndex];
            const updatedOptionIds = existingAnswer.list_survey_question_option_id.includes(optionId)
                ? existingAnswer.list_survey_question_option_id.filter((id) => id !== optionId)
                : [...existingAnswer.list_survey_question_option_id, optionId];

            const updatedAnswer = {
                ...existingAnswer,
                list_survey_question_option_id: updatedOptionIds,
            };

            const updatedSurveyAnswers = [...surveyAnswers];
            updatedSurveyAnswers[existingAnswerIndex] = updatedAnswer;

            setSurveyAnswers(updatedSurveyAnswers);
        } else {
            const newAnswer = {
                question: questionId,
                answer_value: "",
                list_survey_question_option_id: [optionId],
            };

            const updatedSurveyAnswers = [...surveyAnswers, newAnswer];
            setSurveyAnswers(updatedSurveyAnswers);
        }
    }

    const handleTextInputChange = (questionId, value) => {
        const existingAnswer = surveyAnswers.find((answer) => answer.question === questionId);

        if (existingAnswer) {
            const updatedAnswers = surveyAnswers.map((answer) => {
                if (answer.question === questionId) {
                    return {
                        ...answer,
                        answer_value: value,
                    };
                }
                return answer;
            });
            setSurveyAnswers(updatedAnswers);
        } else {
            const newAnswer = {
                question: questionId,
                answer_value: value,
                list_survey_question_option_id: [],
            };
            const updatedAnswers = [...surveyAnswers, newAnswer];
            setSurveyAnswers(updatedAnswers);
        }
    };

    const updateSurveyAnswers = (selectedOptionsOrCheckboxStates) => {
        const selectedOptionsArray = Object.keys(selectedOptionsOrCheckboxStates).map(
            (questionId) => ({
                question: parseInt(questionId),
                answer_value: "",
                list_survey_question_option_id: [selectedOptionsOrCheckboxStates[questionId]],
            })
        );

        const updatedSurveyAnswers = [...surveyAnswers];

        selectedOptionsArray.forEach((selectedOption) => {
            const existingAnswerIndex = updatedSurveyAnswers.findIndex(
                (answer) => answer.question === selectedOption.question
            );

            if (existingAnswerIndex !== -1) {
                updatedSurveyAnswers[existingAnswerIndex] = selectedOption;
            } else {
                updatedSurveyAnswers.push(selectedOption);
            }
        });

        setSurveyAnswers(updatedSurveyAnswers);
    };

    const renderRadioQuestion = (question) => {
        const selectedOption = selectedOptions[question.id];

        return (
            <View key={question.id}>
                <Text>{question.question_content}</Text>
                <RadioButton.Group
                    onValueChange={(value) => handleRadioOptionSelect(question.id, value)}
                    value={selectedOption}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                >
                    {question.survey_question_option_list.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            onPress={() => handleRadioOptionSelect(question.id, option.id)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton value={option.id} />
                                <Text>{option.question_option_value}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </RadioButton.Group>
            </View>
        );
    };

    const renderCheckboxQuestion = (question) => {
        return (
            <View key={question.id}>
                <Text>{question.question_content}</Text>
                {question.survey_question_option_list.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        onPress={() => handleCheckboxOptionToggle(question.id, option.id)}
                    >
                        <CheckBox
                            checked={checkboxStates.some(
                                (state) => state.questionId === question.id && state.optionId === option.id
                            )}
                            iconType="material-community"
                            checkedIcon="checkbox-outline"
                            uncheckedIcon="checkbox-blank-outline"
                        />
                        <Text>{option.question_option_value}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderTextInputQuestion = (question) => {
        return (
            <View key={question.id}>
                <Text>{question.question_content}</Text>
                <TextInput
                    onChangeText={(text) => handleTextInputChange(question.id, text)}
                    placeholder="Enter your answer"
                />
            </View>
        );
    };

    const checkAnswer = async () => {
        console.log(surveyAnswers);
    }

    return (
        <>
            <ScrollView>
                <View style={styles.profileContainer}>
                    <Image source={{ uri: avatar }} style={styles.profileStyle} />
                    <View style={styles.inputBox}>
                        <Text style={styles.inputStyle}>{firstName} {lastName}</Text>
                        <Text style={{ fontSize: 14, marginTop: 3 }}>Administrator</Text>
                    </View>
                </View>
                <View>

                </View>
                <View>
                    {postSurveyDetail?.survey_question_list.map((question) => renderQuestion(question))}
                </View>
                <Button title='Submit' onPress={() => sumbitPostSurvey()} />
                <Button title='Check' onPress={() => checkAnswer()} />
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
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
})

export default SurveyDetail;