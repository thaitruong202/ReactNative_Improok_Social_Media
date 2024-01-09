import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { djangoAuthApi, endpoints } from '../configs/Apis';
import { MyUserContext } from '../../App';
import VectorIcon from '../utils/VectorIcon';
import { windowHeight, windowWidth } from '../utils/Dimensions';

const PostManagement = ({ navigation }) => {
    const [user, dispatch] = useContext(MyUserContext);
    const [userInfo, setUserInfo] = useState();
    const [postSurveyList, setPostSurveyList] = useState([]);
    const [countPostReaction, setCountPostReaction] = useState([]);
    const [countPostComment, setCountPostComment] = useState([]);
    const [checkReaction, setCheckReaction] = useState([]);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [pageSize, setPageSize] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const getPostSurvey = async (pageNumber) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            let res = await djangoAuthApi(token).get(endpoints['get-post-surveys'](pageNumber))
            console.log("-------------------");
            setPostSurveyList((prevPostSurveyList) => [...prevPostSurveyList, ...res.data.results]);
            setPage(pageNumber);
            setPageSize(res.data.count);
            console.log(res.data.results);
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    const handleScroll = async (event) => {
        event.persist();
        const { layoutMeasurement, contentOffset, contentSize } = event?.nativeEvent || {};

        const isEndOfScrollView = layoutMeasurement?.height + contentOffset?.y >= contentSize?.height;
        if (!isEndOfScrollView) return;

        try {
            const hasMoreData = postSurveyList.length > 0 && postSurveyList.length < pageSize;

            if (hasMoreData && !loading) {
                const nextPage = page + 1;
                getPostSurvey(nextPage);
            }
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error(error);
        }
    };

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
        getPostSurvey(1);
    }, [])
    return (
        <>
            <ScrollView onScroll={handleScroll}
                scrollEventThrottle={16}>
                {postSurveyList.map((ps, index) => {
                    return (
                        <>
                            <View key={ps.id}>
                                <View style={styles.postHeaderContainer}>
                                    <View style={styles.postTop}>
                                        <View style={styles.row}>
                                            <Image source={{ uri: ps.post.account.avatar }} style={styles.userProfile} />
                                            <View style={styles.userSection}>
                                                <Text style={styles.username}>{ps.post.account.user.last_name} {ps.post.account.user.first_name}</Text>
                                                <View style={styles.row}>
                                                    <Text style={styles.days}>{ps.created_date}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <TouchableOpacity onPress={() => setOpenModal(true)}>
                                                <VectorIcon
                                                    name="dots-three-horizontal"
                                                    type="Entypo"
                                                    size={25}
                                                    color="#606770"
                                                    style={styles.headerIcons}
                                                />
                                            </TouchableOpacity>
                                            <Modal visible={openModal} animationType="slide" onBackdropPress={() => setOpenModal(false)} style={{ width: windowWidth, height: windowHeight / 2, backgroundColor: 'yellow', position: 'absolute', bottom: 0 }}>
                                                <View>
                                                    <TouchableOpacity>
                                                        <Text>Edit</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Text>Delete</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Text>Cancel</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </Modal>
                                        </View>
                                    </View>
                                    <Text style={styles.caption}>{ps.post_survey_title}</Text>
                                </View>
                                <View style={styles.postFooterContainer}>
                                    <View style={styles.userActionSec}>
                                        <View>
                                            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Thống kê khảo sát', {
                                                postId: ps.post.id, firstName: ps.post.account.user.first_name,
                                                lastName: ps.post.account.user.last_name, avatar: ps.post.account.avatar
                                            })}>
                                                <VectorIcon
                                                    name="stats-chart"
                                                    type="Ionicons"
                                                    size={25}
                                                    color="#3A3A3A"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Chi tiết khảo sát', {
                                            postId: ps.post.id, firstName: ps.post.account.user.first_name,
                                            lastName: ps.post.account.user.last_name, avatar: ps.post.account.avatar
                                        })}>
                                            <View>
                                                <VectorIcon
                                                    name="info-circle"
                                                    type="FontAwesome5"
                                                    size={25}
                                                    color="#3A3A3A"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                            </View >
                        </>
                    );
                })}
            </ScrollView>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </>
    );
};

const styles = StyleSheet.create({
    postHeaderContainer: {
        padding: 16,
        width: windowWidth
    },
    userProfile: {
        height: 40,
        width: 40,
        borderRadius: 50,
    },
    row: {
        flexDirection: 'row',
    },
    postTop: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    username: {
        fontSize: 16,
        color: "#26282b",
        marginBottom: 2,
    },
    userSection: {
        marginLeft: 12,
    },
    days: {
        fontSize: 14,
        color: "#989FA7"
    },
    dot: {
        fontSize: 14,
        color: "#989FA7",
        paddingHorizontal: 8,
    },
    userIcon: {
        marginTop: 3,
    },
    headerIcons: {
        marginRight: 20,
    },
    caption: {
        color: "#3A3A3A",
        fontSize: 15,
        marginTop: 10,
    },
    reactionIcon: {
        height: 20,
        width: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postFooterContainer: {
        padding: 16,
        width: windowWidth
    },
    reactionCount: {
        color: "#3A3A3A",
        fontSize: 14,
        paddingLeft: 5,
    },
    footerReactionSec: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF0",
        paddingBottom: 15,
    },
    userActionSec: {
        marginTop: 15,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    divider: {
        height: 1,
        width: windowWidth,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15
    },
    modalReaction: {
        width: 0.7 * windowWidth,
        height: 0.4 * windowHeight
    },
    modalContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20
    },
    reactionAction: {
        width: 50,
        height: 50
    }
});

export default PostManagement;