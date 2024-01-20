import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { useRoute } from '@react-navigation/native';
import { PieChart } from "react-native-chart-kit";
import { windowWidth } from '../utils/Dimensions';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';

const SurveyStats = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const route = useRoute();
    const { postId, firstName, lastName, avatar } = route.params;
    const [postResult, setPostResult] = useState([]);
    const [response, setResponse] = useState('');

    // const getSurveyResult = async () => {
    //     try {
    //         const token = await AsyncStorage.getItem('token');
    //         let res = await djangoAuthApi(token).get(endpoints['survey-result'](postId));
    //         setPostResult(res.data);
    //         console.log(res.data);
    //         setResponse(res.data['Tổng số người đã trả lời vào bài Post này'][0].so_nguoi_phan_hoi);
    //         console.log("Dùng cái này", res.data["survey_question_list"][0]["survey_question_option_list"])
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    useEffect(() => {
        const getSurveyResult = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                let res = await djangoAuthApi(token).get(endpoints['survey-result'](postId));
                setPostResult(res.data);
                console.log(res.data);
                setResponse(res.data['Tổng số người đã trả lời vào bài Post này'][0].so_nguoi_phan_hoi);
                console.log("Dùng cái này", res.data["survey_question_list"][0]["survey_question_option_list"]);

                // if (res.data["survey_question_list"] && res.data["survey_question_list"].length > 0) {
                //     let data = [
                //         {
                //             name: res.data["survey_question_list"][0]["survey_question_option_list"][0].question_option_value,
                //             population: res.data["survey_question_list"][0]["survey_question_option_list"][0]["Số lượt chọn option này"],
                //             color: '#FF6384' // Màu sắc cho lựa chọn "10 củ"
                //         },
                //         {
                //             name: res.data["survey_question_list"][0]["survey_question_option_list"][1].question_option_value,
                //             population: res.data["survey_question_list"][0]["survey_question_option_list"][1]["Số lượt chọn option này"],
                //             color: '#36A2EB' // Màu sắc cho lựa chọn "20 củ"
                //         },
                //         {
                //             name: res.data["survey_question_list"][0]["survey_question_option_list"][2].question_option_value,
                //             population: res.data["survey_question_list"][0]["survey_question_option_list"][2]["Số lượt chọn option này"],
                //             color: '#FFCE56' // Màu sắc cho lựa chọn "30 củ"
                //         },
                //     ];
                //     console.log("Đây là post Result", res.data);
                //     setDataResult(data);
                // }
            } catch (error) {
                console.log(error);
            }
        };
        getSurveyResult();
    }, []);

    const getRandomColor = () => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        return randomColor;
    };

    const generateChartData = (questionType, optionList) => {
        let data = [];
        let total = 0;
        if (questionType === 1 && optionList) {
            total = optionList.reduce((sum, option) => sum + option['Số lượt chọn option này'], 0);
            data = optionList.map((option, index) => ({
                name: option.question_option_value,
                population: option['Số lượt chọn option này'],
                color: getRandomColor(),
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
            }));
        } else if (questionType === 3 && optionList) {
            // data = {
            //     labels: optionList.map(option => option.question_option_value),
            //     datasets: [
            //         {
            //             data: optionList.map(option => option["Số lượt chọn option này"]),
            //             // backgroundColor: optionList.map(() => getRandomColor()),
            //             legendFontColor: '#7F7F7F',
            //             legendFontSize: 12,
            //         }
            //     ]
            // };
            data = optionList.map((option, index) => {
                return { x: option.question_option_value, y: option["Số lượt chọn option này"] };
            });
        }
        return data;
    };

    return (
        <>
            <ScrollView>
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
                                {/* {pr.survey_question_type === 1 && pr["survey_question_option_list"] &&
                                    (
                                        <>
                                            {pr["survey_question_option_list"].map((ps, index) => (
                                                <Text key={ps.id}>{ps.question_option_value}</Text>
                                            ))}
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
                                )} */}
                                {pr.survey_question_type === 1 && pr["survey_question_option_list"] && (
                                    <>
                                        {pr["survey_question_option_list"].map((ps, index) => (
                                            <Text key={ps.id}>{ps.question_option_value}</Text>
                                        ))}
                                        <PieChart
                                            data={generateChartData(pr.survey_question_type, pr["survey_question_option_list"])}
                                            width={windowWidth}
                                            height={200}
                                            chartConfig={{
                                                // backgroundColor: '#ffffff',
                                                // backgroundGradientFrom: '#ffffff',
                                                // backgroundGradientTo: '#ffffff',
                                                // decimalPlaces: 0,
                                                // color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                                backgroundGradientFrom: "#1E2923",
                                                backgroundGradientFromOpacity: 0,
                                                backgroundGradientTo: "#08130D",
                                                backgroundGradientToOpacity: 0.5,
                                                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                                                strokeWidth: 2, // optional, default 3
                                                barPercentage: 0.5,
                                                useShadowColorFromDataset: false, // optional
                                                renderLabel: (label, value) => `${label} ${(value / total * 100).toFixed(2)}%`, // Hiển thị nhãn với phần trăm
                                            }}
                                            accessor="population"
                                            backgroundColor="transparent"
                                            paddingLeft="15"
                                            absolute
                                            showBarTops="true"
                                        />
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
                                        {/* <BarChart
                                            data={generateChartData(pr.survey_question_type, pr["survey_question_option_list"])}
                                            width={windowWidth}
                                            height={220}
                                            // yAxisLabel="$"
                                            chartConfig={{
                                                backgroundColor: 'transparent',
                                                backgroundGradientFrom: '#ffffff',
                                                backgroundGradientTo: '#ffffff',
                                                // decimalPlaces: 0,
                                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                                // backgroundGradientFrom: "#1E2923",
                                                // backgroundGradientFromOpacity: 0,
                                                // backgroundGradientTo: "#08130D",
                                                // backgroundGradientToOpacity: 0.5,
                                                // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                                strokeWidth: 2, // optional, default 3
                                                // barPercentage: 0.5,
                                                useShadowColorFromDataset: false // optional
                                            }}
                                            verticalLabelRotation={0}
                                            showBarTops={true}
                                            showValuesOnTopOfBars={true}
                                        /> */}
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            domainPadding={30}
                                        >
                                            <VictoryBar horizontal
                                                style={{ data: { fill: "#c43a31" }, labels: { fontSize: 12 } }}
                                                data={generateChartData(pr.survey_question_type, pr["survey_question_option_list"])}
                                            />
                                        </VictoryChart>
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