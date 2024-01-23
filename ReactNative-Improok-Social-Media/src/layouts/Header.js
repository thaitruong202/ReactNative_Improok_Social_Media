import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import ImprookLogo from '../images/ip_logo.png'
import VectorIcon from '../utils/VectorIcon.js';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.headerContainer}>
            <Image source={ImprookLogo} style={styles.improokLogoStyle} />
            <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconBg} onPress={() => navigation.navigate('Search')}>
                    <View>
                        <VectorIcon
                            name="search-sharp"
                            type="Ionicons"
                            size={25}
                            color="#3A3A3A"
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBg} onPress={() => navigation.navigate('Chat room')}>
                    <View>
                        <VectorIcon
                            name="chatbubble"
                            type="Ionicons"
                            size={25}
                            color="#3A3A3A"
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    improokLogoStyle: {
        height: 35,
        width: 150,
    },
    iconBg: {
        // backgroundColor: '#EBECF0',
        height: 35,
        width: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    headerContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerIcons: {
        flexDirection: 'row',
    },
});

export default Header;