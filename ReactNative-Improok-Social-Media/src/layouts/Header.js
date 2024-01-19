import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import ImprookLogo from '../images/ip_logo.png'
import VectorIcon from '../utils/VectorIcon.js';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Image source={ImprookLogo} style={styles.improokLogoStyle} />
            <View style={styles.headerIcons}>
                {/* <View style={styles.iconBg}>
                    <VectorIcon
                        name="add-circle"
                        type="Ionicons"
                        size={25}
                        color="#3A3A3A"
                    />
                </View> */}
                <View style={styles.iconBg}>
                    <VectorIcon
                        name="search-sharp"
                        type="Ionicons"
                        size={25}
                        color="#3A3A3A"
                    />
                </View>
                <View style={styles.iconBg}>
                    <VectorIcon
                        name="facebook-messenger"
                        type="MaterialCommunityIcons"
                        size={25}
                        color="#3A3A3A"
                    />
                </View>
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