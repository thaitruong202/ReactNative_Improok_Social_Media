import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { RadioButton, Checkbox } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';

const SurveyForm = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('Multiple-Choice');
    const [newOption, setNewOption] = useState('');
    const [newOptions, setNewOptions] = useState([]);
    const [option, setOption] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [textAnswer, setTextAnswer] = useState('');

    const addQuestion = () => {
        if (newQuestion.trim() !== '') {
            const question = {
                content: newQuestion.trim(),
                type: newQuestionType,
                options: newOptions,
            };
            setQuestions([...questions, question]);
            setNewQuestion('');
            setNewQuestionType('Multiple-Choice');
            setNewOptions([]);
        }
    };

    const addBoxQuestion = () => {
        if (newQuestion.trim() !== '') {
            const question = {
                content: newQuestion.trim(),
                type: newQuestionType,
                options: options,
            };
            setQuestions([...questions, question]);
            setNewQuestion('');
            setNewQuestionType('Multiple-Choice');
            setOptions([]);
        }
    };

    const addOption = () => {
        if (newOption.trim() !== '') {
            setNewOptions([...newOptions, newOption.trim()]);
            setNewOption('');
        }
    };

    const deleteOption = (index) => {
        const updatedOptions = [...newOptions];
        updatedOptions.splice(index, 1);
        setNewOptions(updatedOptions);
    };

    const addBoxOption = () => {
        if (option.trim() !== '') {
            setOptions([...options, option.trim()]);
            setOption('');
        }
    };

    const deleteBoxOption = (index) => {
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1);
        setOptions(updatedOptions);
    };

    const deleteQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    const renderAnswerInput = () => {
        if (newQuestionType === 'Multiple-Choice') {
            return (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter option..."
                        value={newOption}
                        onChangeText={(text) => setNewOption(text)}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addOption}>
                        <Text style={styles.buttonText}>Add option</Text>
                    </TouchableOpacity>
                    {newOptions.map((option, index) => (
                        <View key={index} style={styles.optionContainer}>
                            <RadioButton.Android
                                value={option}
                                status="unchecked"
                                onPress={() => setSelectedOption(option)}
                            />
                            <Text style={styles.optionText}>{option}</Text>
                            <TouchableOpacity onPress={() => deleteOption(index)}>
                                <Text style={styles.deleteButton}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            );
        } else if (newQuestionType === 'Checkbox') {
            return (
                <View>
                    {options.map((option, index) => (
                        <View key={index} style={styles.optionContainer}>
                            <CheckBox
                                checked={selectedOptions.includes(option)}
                                onPress={() => toggleCheckbox(option)}
                            />
                            <Text style={styles.optionText}>{option}</Text>
                            <TouchableOpacity onPress={() => deleteBoxOption(index)}>
                                <Text style={styles.deleteButton}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={styles.optionContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new option"
                            value={option}
                            onChangeText={text => setOption(text)}
                        />
                        <Button title="Add Option" onPress={addBoxOption} />
                    </View>
                </View>
            );
        } else if (newQuestionType === 'Text Input') {
            return (
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Short text answer"
                        value={textAnswer}
                        onChangeText={(text) => setTextAnswer(text)}
                    />
                </View>
            );
        }
        return null;
    };

    const [selectedOptions, setSelectedOptions] = useState([]);

    const toggleCheckbox = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    return (
        <View style={styles.container}>
            {questions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                    <TouchableOpacity onPress={() => deleteQuestion(index)}>
                        <Text style={styles.deleteButton}>Delete</Text>
                    </TouchableOpacity>
                    <Text style={styles.questionText}>{question.content}</Text>
                    {question.type === 'Multiple-Choice' && (
                        <View>
                            {question.options.map((option, optionIndex) => (
                                <View key={optionIndex} style={styles.optionContainer}>
                                    <TouchableOpacity onPress={() => setSelectedOption(option)}>
                                        <View style={styles.radioButton}>
                                            {selectedOption === option && <View style={styles.radioButtonSelected} />}
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.optionText}>{option}</Text>
                                    <TouchableOpacity onPress={() => deleteOption(optionIndex)}>
                                        <Text style={styles.deleteButton}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                    {question.type === 'Checkbox' && (
                        <View>
                            {question.options.map((option, optionIndex) => (
                                <View key={optionIndex} style={styles.optionContainer}>
                                    <CheckBox
                                        checked={selectedOptions.includes(option)}
                                        onPress={() => toggleCheckbox(option)}
                                    />
                                    <Text style={styles.optionText}>{option}</Text>
                                    <TouchableOpacity onPress={() => deleteOption(optionIndex)}>
                                        <Text style={styles.deleteButton}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                    {question.type === 'Text Input' && (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Short text answer"
                                value={textAnswer}
                                onChangeText={(text) => setTextAnswer(text)}
                            />
                        </View>
                    )}
                </View>
            ))}
            <View style={styles.newQuestionContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter a new question..."
                    value={newQuestion}
                    onChangeText={(text) => setNewQuestion(text)}
                />
                <View style={styles.typeContainer}>
                    <Text style={styles.typeLabel}>Question Type:</Text>
                    <RadioButton.Group
                        value={newQuestionType}
                        onValueChange={(value) => setNewQuestionType(value)}
                    >
                        <View style={styles.radioButtonContainer}>
                            <RadioButton.Android value="Multiple-Choice" />
                            <Text style={styles.radioButtonLabel}>Multiple Choice</Text>
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton.Android value="Checkbox" />
                            <Text style={styles.radioButtonLabel}>Checkbox</Text>
                        </View>
                        <View style={styles.radioButtonContainer}>
                            <RadioButton.Android value="Text Input" />
                            <Text style={styles.radioButtonLabel}>Text Input</Text>
                        </View>
                    </RadioButton.Group>
                </View>
                {renderAnswerInput()}
                <TouchableOpacity style={styles.addButton} onPress={() => {
                    if (newQuestionType === 'Multiple-Choice' || newQuestionType === 'Text Input') {
                        addQuestion();
                    } else if (newQuestionType === 'Checkbox') {
                        addBoxQuestion();
                    }
                }}>
                    <Text style={styles.buttonText}>Add question</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default SurveyForm;