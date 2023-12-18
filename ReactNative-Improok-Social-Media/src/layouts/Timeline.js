import React from 'react';
import { Text, View } from 'react-native';
import Post from './Post';

const Timeline = () => {
    return (
        <>
            <View>
                <Text>
                    <Post />
                </Text>
            </View>
        </>
    );
};

export default Timeline;