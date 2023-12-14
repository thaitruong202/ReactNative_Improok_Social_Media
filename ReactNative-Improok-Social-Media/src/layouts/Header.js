import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import ImprookLogo from '../images/ip_logo.png'
import VectorIcon from '../utils/VectorIcon.js';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Image source={ImprookLogo} style={styles.improokLogoStyle} />
            <View style={styles.headerIcons}>
                <View style={styles.iconBg}>
                    <VectorIcon
                        name="add-circle"
                        type="MaterialIcons"
                        size={19}
                        color="#3A3A3A"
                    />
                </View>
                <View style={styles.iconBg}>
                    <VectorIcon
                        name="search"
                        type="FontAwesome5"
                        size={19}
                        color="#3A3A3A"
                    />
                </View>
                <View style={styles.iconBg}>
                    <VectorIcon
                        name="messenger"
                        type="Fontisto"
                        size={22}
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
        backgroundColor: '#EBECF0',
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