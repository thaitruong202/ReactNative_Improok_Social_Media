import { useRoute } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MyUserContext } from '../../App';
import VectorIcon from '../utils/VectorIcon';
import { windowWidth } from '../utils/Dimensions';

const Comment = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const route = useRoute();
    const { postId } = route.params
    const [content, setContent] = useState('')

    return (
        <>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text>
                        Đây là bình luận của bài post {postId}
                    </Text>
                </ScrollView>
                <View style={styles.replyArea}>
                    <TouchableOpacity style={{ width: "10%" }}>
                        <VectorIcon
                            name="images"
                            type="Ionicons"
                            size={22}>
                        </VectorIcon>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Viết bình luận..."
                        value={content}
                        onChangeText={(text) => setContent(text)}
                        numberOfLines={1}
                        style={content.length > 0 ? styles.inputComment : styles.emptyInputComment}
                    />
                    {content.length > 0 &&
                        <TouchableOpacity style={{ width: "10%" }}>
                            <VectorIcon
                                name="send"
                                type="Ionicons"
                                size={22} color="blue" />
                        </TouchableOpacity>}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    replyArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f2f2f2',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 1,
        width: windowWidth
    },
    emptyInputComment: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'black',
        width: '90%',
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    inputComment: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'black',
        width: '75%',
        paddingHorizontal: 10,
        paddingVertical: 3
    },
});

export default Comment;