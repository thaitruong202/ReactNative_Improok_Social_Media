import React, { useContext, useEffect, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { useRoute } from '@react-navigation/native';
import { PieChart, LineChart } from "react-native-chart-kit";
import { windowWidth } from '../utils/Dimensions';

// const SurveyStats = () => {
//     const [user, dispatch] = useContext(MyUserContext);
//     const route = useRoute();
//     const { postId, firstName, lastName, avatar } = route.params;
//     const [postResult, setPostResult] = useState([]);
//     const [startDate, setStartDate] = useState();
//     const [startTime, setStartTime] = useState();
//     const [endDate, setEndDate] = useState();
//     const [endTime, setEndTime] = useState();

//     const [response, setResponse] = useState('');

//     const getSurveyResult = async () => {
//         try {
//             const token = await AsyncStorage.getItem('token');
//             let res = await djangoAuthApi(token).get(endpoints['survey-result'](postId))
//             setPostResult(res.data);
//             console.log(res.data);
//             setResponse(res.data['Tổng số người đã trả lời vào bài Post này'][0].so_nguoi_phan_hoi)
//             console.log(res.data['survey_question_list'][0]['survey_question_type'])
//             console.log("Gì dậy má", res.data["survey_question_list"][0]["survey_question_option_list"])
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     useEffect(() => {
//         getSurveyResult();
//         console.log("Gì dậy", postResult["survey_question_list"][0]["survey_question_option_list"])
//         //console.log("Là sao dậy?", postResult['Tổng số người đã trả lời vào bài Post này'][0].post_survey_id);
//     }, [])

//     return (
//         <>
//             <ScrollView>
//                 <View>
//                     <Text>Kết quả khảo sát {postId}</Text>
//                     <Text>{postResult.post_survey_title}</Text>
//                     <Text>Thời gian bắt đầu {postResult.start_time}</Text>
//                     <Text>Thời gian kết thúc {postResult.end_time}</Text>
//                     <Text>Số lượt phản hồi {response}</Text>
//                 </View>
//                 <View>
//                     {postResult["survey_question_list"].map(pr => {
//                         return (
//                             <>
//                                 <Text>{pr.question_content}</Text>
//                                 {pr.survey_question_type === 1 ? <>
//                                     {pr["survey_question_option_list"].map(ps, index => {
//                                         { ps[index].question_option_value }
//                                     })}
//                                 </> : <></>}
//                             </>
//                         )
//                     })}
//                 </View>
//             </ScrollView>
//         </>
//     );
// };

// export default SurveyStats;

const SurveyStats = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const route = useRoute();
    const { postId, firstName, lastName, avatar } = route.params;
    const [postResult, setPostResult] = useState([]);
    const [response, setResponse] = useState('');

    const getSurveyResult = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['survey-result'](postId));
            setPostResult(res.data);
            console.log(res.data);
            setResponse(res.data['Tổng số người đã trả lời vào bài Post này'][0].so_nguoi_phan_hoi);
            console.log("Dùng cái này", res.data["survey_question_list"][0]["survey_question_option_list"])
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getSurveyResult();
        console.log("Ngộ ha", postResult.survey_question_list)
    }, []);

    const getRandomColor = () => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        return randomColor;
    };

    // const data = [
    //     {
    //         name: "Seoul",
    //         population: 21500000,
    //         color: "rgba(131, 167, 234, 1)",
    //         legendFontColor: "#7F7F7F",
    //         legendFontSize: 15
    //     },
    //     {
    //         name: "Toronto",
    //         population: 2800000,
    //         color: "#F00",
    //         legendFontColor: "#7F7F7F",
    //         legendFontSize: 15
    //     },
    //     {
    //         name: "Beijing",
    //         population: 527612,
    //         color: "red",
    //         legendFontColor: "#7F7F7F",
    //         legendFontSize: 15
    //     },
    //     {
    //         name: "New York",
    //         population: 8538000,
    //         color: "#ffffff",
    //         legendFontColor: "#7F7F7F",
    //         legendFontSize: 15
    //     },
    //     {
    //         name: "Moscow",
    //         population: 11920000,
    //         color: "rgb(0, 0, 255)",
    //         legendFontColor: "#7F7F7F",
    //         legendFontSize: 15
    //     }
    // ];

    // const data = [
    //     {
    //         name: '10 củ',
    //         population: 0,
    //         color: '#FF6384' // Màu sắc cho lựa chọn "10 củ"
    //     },
    //     {
    //         name: '20 củ',
    //         population: 0,
    //         color: '#36A2EB' // Màu sắc cho lựa chọn "20 củ"
    //     },
    //     {
    //         name: '30 củ',
    //         population: 1,
    //         color: '#FFCE56' // Màu sắc cho lựa chọn "30 củ"
    //     },
    // ];

    // const data = [
    //     {
    //         name: postResult["survey_question_list"][0]["survey_question_option_list"][0].question_option_value,
    //         population: postResult["survey_question_list"][0]["survey_question_option_list"][0]["Số lượt chọn option này"],
    //         color: '#FF6384' // Màu sắc cho lựa chọn "10 củ"
    //     },
    //     {
    //         name: postResult["survey_question_list"][0]["survey_question_option_list"][1].question_option_value,
    //         population: postResult["survey_question_list"][0]["survey_question_option_list"][1]["Số lượt chọn option này"],
    //         color: '#36A2EB' // Màu sắc cho lựa chọn "20 củ"
    //     },
    //     {
    //         name: postResult["survey_question_list"][0]["survey_question_option_list"][2].question_option_value,
    //         population: postResult["survey_question_list"][0]["survey_question_option_list"][2]["Số lượt chọn option này"],
    //         color: '#FFCE56' // Màu sắc cho lựa chọn "30 củ"
    //     },
    // ];

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

    let data = [];
    const [dataResult, setDataResult] = useState();

    const checkBox = async () => {
        console.log("Là sao vậy", postResult.survey_question_list);
        data = [
            {
                name: postResult["survey_question_list"][0]["survey_question_option_list"][0].question_option_value,
                population: postResult["survey_question_list"][0]["survey_question_option_list"][0]["Số lượt chọn option này"],
                color: '#FF6384' // Màu sắc cho lựa chọn "10 củ"
            },
            {
                name: postResult["survey_question_list"][0]["survey_question_option_list"][1].question_option_value,
                population: postResult["survey_question_list"][0]["survey_question_option_list"][1]["Số lượt chọn option này"],
                color: '#36A2EB' // Màu sắc cho lựa chọn "20 củ"
            },
            {
                name: postResult["survey_question_list"][0]["survey_question_option_list"][2].question_option_value,
                population: postResult["survey_question_list"][0]["survey_question_option_list"][2]["Số lượt chọn option này"],
                color: '#FFCE56' // Màu sắc cho lựa chọn "30 củ"
            },
        ];
        setDataResult(data);
    }

    return (
        <>
            <ScrollView>
                <Button title="Check" onPress={() => checkBox()} />
                <View>
                    <Text>Kết quả khảo sát {postId}</Text>
                    {postResult && (
                        <>
                            <Text>{postResult.post_survey_title}</Text>
                            <Text>Thời gian bắt đầu {postResult.start_time}</Text>
                            <Text>Thời gian kết thúc {postResult.end_time}</Text>
                            <Text>Số lượt phản hồi {response}</Text>
                        </>
                    )}
                </View>
                <View>
                    {postResult &&
                        postResult["survey_question_list"] &&
                        postResult["survey_question_list"].map((pr) => (
                            <View key={pr.id}>
                                <Text>{pr.question_content}</Text>
                                {pr.survey_question_type === 1 && pr["survey_question_option_list"] &&
                                    (
                                        <>
                                            {pr["survey_question_option_list"].map((ps, index) => (
                                                <Text key={ps.id}>{ps.question_option_value}</Text>
                                            ))}
                                            {/* <PieChart
                                            data={data}
                                            width={200}
                                            height={200}
                                            chartConfig={{
                                                backgroundColor: '#ffffff',
                                                backgroundGradientFrom: '#ffffff',
                                                backgroundGradientTo: '#ffffff',
                                                decimalPlaces: 0,
                                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            }}
                                            accessor="population"
                                            backgroundColor="transparent"
                                            paddingLeft="15"
                                            absolute
                                        /> */}
                                            {dataResult && <PieChart
                                                data={dataResult}
                                                width={windowWidth}
                                                height={200}
                                                chartConfig={{
                                                    backgroundColor: '#ffffff',
                                                    backgroundGradientFrom: '#ffffff',
                                                    backgroundGradientTo: '#ffffff',
                                                    decimalPlaces: 0,
                                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                                }}
                                                accessor="population"
                                                backgroundColor="transparent"
                                                paddingLeft="15"
                                                absolute
                                            />}
                                        </>
                                    )}
                                {pr.survey_question_type === 2 && pr["Số lượt trả lời vào câu hỏi này"] && (
                                    <>
                                        {pr["Số lượt trả lời vào câu hỏi này"].map((ps) => (
                                            <Text key={ps.id}>{ps.answer_value}</Text>
                                        ))}
                                    </>
                                )}
                                {pr.survey_question_type === 3 && pr["survey_question_option_list"] && (
                                    <>
                                        {pr["survey_question_option_list"].map((ps) => (
                                            <Text key={ps.id}>{ps.question_option_value}</Text>
                                        ))}
                                    </>
                                )}
                            </View>
                        ))}
                </View>
            </ScrollView >
        </>
    );
};

export default SurveyStats;