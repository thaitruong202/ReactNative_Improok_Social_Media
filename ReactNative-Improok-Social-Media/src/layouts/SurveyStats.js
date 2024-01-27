import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MyUserContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { useRoute } from '@react-navigation/native';
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import { windowHeight, windowWidth } from '../utils/Dimensions';
import { VictoryBar, VictoryChart, VictoryPie, VictoryTheme } from 'victory-native';

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
                const token = await AsyncStorage.getItem('token')
                let res = await djangoAuthApi(token).get(endpoints['survey-result'](postId))
                setPostResult(res.data)
                console.log(res.data)
                if (res.data['Tổng số người đã trả lời vào bài Post này'][0] !== undefined) {
                    setResponse(res.data['Tổng số người đã trả lời vào bài Post này'][0].so_nguoi_phan_hoi)
                }
                else {
                    setResponse()
                }
                console.log(res.data['Tổng số người đã trả lời vào bài Post này'][0].so_nguoi_phan_hoi)
                console.log("Dùng cái này", res.data["survey_question_list"][0]["survey_question_option_list"])

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
        // const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        // return randomColor;
        let color = '';
        while (color.length < 6) {
            color += Math.floor(Math.random() * 16).toString(16);
        }
        return `#${color}`;
    };

    const generateChartData = (questionType, optionList) => {
        let data = [];
        if (questionType === 1 && optionList) {
            total = optionList.reduce((sum, option) => sum + option['Số lượt chọn option này'], 0);
            data = optionList.map((option, index) => ({
                name: option.question_option_value,
                population: option['Số lượt chọn option này'],
                color: getRandomColor(),
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
            }));
            // data = optionList.map((option, index) => {
            //     return { x: option.question_option_value, y: option['Số lượt chọn option này'] }
            // })
        } else if (questionType === 3 && optionList) {
            data = {
                labels: optionList.map(option => option.question_option_value),
                datasets: [
                    {
                        data: optionList.map(option => option["Số lượt chọn option này"]),
                        // backgroundColor: optionList.map(() => getRandomColor()),
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 12,
                    }
                ]
            };
            // data = optionList.map((option, index) => {
            //     return { x: option.question_option_value, y: option["Số lượt chọn option này"] };
            // });
        }
        return data;
    };

    // const combinedEndDateTime = new Date(
    //     postResult.end_time.getFullYear(),
    //     postResult.end_time.getMonth(),
    //     postResult.end_time.getDate(),
    //     postResult.end_time.getHours(),
    //     postResult.end_time.getMinutes()
    // );

    const pendTime = postResult?.end_time

    // Chuyển đổi UTC string thành đối tượng Date
    const endDate = new Date(pendTime);

    // Chuyển đổi múi giờ sang +7
    endDate.setHours(endDate.getHours() + 7);

    // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
    const dayEnd = String(endDate.getDate()).padStart(2, '0');
    const monthEnd = String(endDate.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript được đánh số từ 0 đến 11
    const yearEnd = endDate.getFullYear();
    const hoursEnd = endDate.getHours();
    const minutesEnd = endDate.getMinutes();
    const secondsEnd = endDate.getSeconds();

    // Định dạng kết quả theo yêu cầu 'ngày-tháng-năm, giờ-phút-giây'
    const endTime = `${dayEnd}-${monthEnd}-${yearEnd}, ${hoursEnd}:${minutesEnd}:${secondsEnd}`;

    const pstartTime = postResult?.start_time

    // Chuyển đổi UTC string thành đối tượng Date
    const startDate = new Date(pstartTime);

    // Chuyển đổi múi giờ sang +7
    startDate.setHours(startDate.getHours() + 7);

    // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
    const dayStart = String(startDate.getDate()).padStart(2, '0');
    const monthStart = String(startDate.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript được đánh số từ 0 đến 11
    const yearStart = startDate.getFullYear();
    const hoursStart = startDate.getHours();
    const minutesStart = startDate.getMinutes();
    const secondsStart = startDate.getSeconds();

    // Định dạng kết quả theo yêu cầu 'ngày-tháng-năm, giờ-phút-giây'
    const startTime = `${dayStart}-${monthStart}-${yearStart}, ${hoursStart}:${minutesStart}:${secondsStart}`;

    return (
        <>
            <ScrollView>
                <View style={{ padding: 15 }}>
                    <View>
                        {/* <Text>Kết quả khảo sát {postId}</Text> */}
                        {/* {postResult && (
                            <>
                                <View style={{ alignItems: 'center', flexDirection: 'column', gap: 5 }}>
                                    <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{postResult.post_survey_title}</Text>
                                    <Text>Thời gian bắt đầu: {postResult.start_time}</Text>
                                    <Text>Thời gian kết thúc: {postResult.end_time}</Text>
                                    <Text>Số lượt phản hồi: {response}</Text>
                                </View>
                            </>
                        )} */}
                        {response !== undefined ? (
                            <View style={{ alignItems: 'center', flexDirection: 'column', gap: 5 }}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{postResult.post_survey_title}</Text>
                                <Text>Start time: {startTime}</Text>
                                <Text>End time: {endTime}</Text>
                                <Text>Responses: {response}</Text>
                            </View>
                        ) : (
                            <View style={{ alignItems: 'center', flexDirection: 'column', gap: 5 }}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Chưa có kết quả khảo sát</Text>
                            </View>
                        )}
                    </View>
                    {response !== undefined ?
                        <View style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 10 }}>
                            {postResult &&
                                postResult["survey_question_list"] &&
                                postResult["survey_question_list"].map((pr) => (
                                    <View key={pr.id}>
                                        {/* <Text>{pr.question_order}. {pr.question_content}</Text> */}
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
                                                <View style={{ backgroundColor: 'white', borderRadius: 15 }}>
                                                    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{pr.question_order}. {pr.question_content}</Text>
                                                        {/* {pr["survey_question_option_list"].map((ps, index) => (
                                                    <Text key={ps.id}>{ps.question_option_value}</Text>
                                                ))} */}
                                                        {/* <PieChart
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
                                            /> */}
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
                                                        />
                                                        {/* <View style={styles.legendContainer}>
                                                {generateChartData(pr.survey_question_type, pr["survey_question_option_list"]).map((item) => (
                                                    <View key={item.name} style={styles.legendItem}>
                                                        <View style={[styles.colorMarker, { backgroundColor: item.color }]} />
                                                        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
                                                            {item.name}
                                                        </Text>
                                                        <Text style={styles.value}>{item.population}%</Text>
                                                    </View>
                                                ))}
                                            </View> */}
                                                        {/* <VictoryPie
                                                colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
                                                data={generateChartData(pr.survey_question_type, pr["survey_question_option_list"])}
                                                labelIndicator
                                                labelIndicatorOuterOffset={5}
                                                width={windowWidth / 1.2}
                                            /> */}
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                        {pr.survey_question_type === 2 && pr["Số lượt trả lời vào câu hỏi này"] && (
                                            <>
                                                <View style={{ backgroundColor: 'white', borderRadius: 15 }}>
                                                    <View style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{pr.question_order}. {pr.question_content}</Text>
                                                        {pr["Số lượt trả lời vào câu hỏi này"].map((ps) => (
                                                            <View key={ps.id} style={{ backgroundColor: 'whitesmoke', borderRadius: 15 }}>
                                                                <Text style={{ fontSize: 15, padding: 10 }}>{ps.answer_value}</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                        {pr.survey_question_type === 3 && pr["survey_question_option_list"] && (
                                            <>
                                                <View style={{ backgroundColor: 'white', borderRadius: 15 }}>
                                                    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{pr.question_order}. {pr.question_content}</Text>
                                                        {/* {pr["survey_question_option_list"].map((ps) => (
                                                    <Text key={ps.id}>{ps.question_option_value}</Text>
                                                ))} */}
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
                                                        <BarChart
                                                            data={generateChartData(pr.survey_question_type, pr["survey_question_option_list"])}
                                                            width={windowWidth / 1.2}
                                                            height={windowHeight / 2}
                                                            chartConfig={{
                                                                backgroundColor: 'white',
                                                                backgroundGradientFrom: 'white',
                                                                backgroundGradientTo: 'white',
                                                                color: (opacity = 1) => `rgba(148, 0, 211, ${opacity})`,
                                                                strokeWidth: 2,
                                                                barPercentage: 0.8,
                                                                useShadowColorFromDataset: false,
                                                                style: {
                                                                    borderRadius: 20
                                                                }
                                                            }}
                                                            verticalLabelRotation={45}
                                                            showBarTops={false}
                                                            showValuesOnTopOfBars={true}
                                                            fromZero={true}
                                                            style={{
                                                                marginVertical: 8,
                                                                borderRadius: 16
                                                            }}
                                                        />
                                                        {/* <VictoryChart
                                                theme={VictoryTheme.material}
                                                domainPadding={30}
                                            >
                                                <VictoryBar horizontal
                                                    style={{ data: { fill: "#c43a31" }, labels: { fontSize: 12 } }}
                                                    data={generateChartData(pr.survey_question_type, pr["survey_question_option_list"])}
                                                />
                                            </VictoryChart> */}
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                ))}
                        </View>
                        :
                        ""}
                </View>
            </ScrollView >
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    colorMarker: {
        width: 12,
        height: 12,
        marginRight: 4,
    },
    label: {
        flex: 1,
        fontSize: 14,
        marginRight: 4,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    value: {
        fontSize: 14,
    },
});

export default SurveyStats;