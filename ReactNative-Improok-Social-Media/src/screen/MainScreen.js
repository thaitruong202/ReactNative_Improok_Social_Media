import React, { Fragment } from 'react';
import PersonalScreen from './PersonalScreen';
import NotificationScreen from './NotificationScreen';
import StatusPost from '../layouts/StatusPost';
import MessageScreen from './MessageScreen';
import HomeScreen from './HomeScreen';
import VectorIcon from '../utils/VectorIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Touchable, TouchableOpacity, View } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const MainScreen = () => {
    return (
        <Fragment>
            <Tab.Navigator
                activeColor='#591aaf'
                screenOptions={{
                    tabBarStyle: {
                        paddingBottom: 8
                    }
                }}>
                <Tab.Screen name='Home' component={HomeScreen} options={{
                    headerShown: false,
                    tabBarLabelStyle: { color: '#591aaf' },
                    tabBarIcon: ({ focused }) => (
                        <VectorIcon
                            type={focused ? "Ionicons" : "Ionicons"}
                            name={focused ? "home" : "home-outline"}
                            size={focused ? 26 : 26}
                            color={focused ? "#591aaf" : "#000"}
                        />
                    )
                }} />
                <Tab.Screen name='Message' component={MessageScreen} options={{
                    tabBarLabelStyle: { color: '#591aaf' },
                    tabBarIcon: ({ focused }) => (
                        <VectorIcon
                            type={focused ? "Ionicons" : "Ionicons"}
                            name={focused ? "chatbox" : "chatbox-outline"}
                            size={focused ? 26 : 26}
                            color={focused ? "#591aaf" : "#000"}
                        />)
                }} />
                <Tab.Screen name='Post' component={StatusPost}
                    options={{
                        tabBarLabelStyle: { color: '#591aaf' },
                        tabBarIcon: ({ focused }) => (
                            <VectorIcon
                                type={focused ? "Ionicons" : "Ionicons"}
                                name={focused ? "add-circle" : "add-circle-outline"}
                                size={focused ? 26 : 26}
                                color={focused ? "#591aaf" : "#000"}
                            />
                        )
                    }} />
                <Tab.Screen name='Notification' component={NotificationScreen}
                    options={{
                        tabBarLabelStyle: { color: '#591aaf' },
                        tabBarIcon: ({ focused }) => (
                            <VectorIcon
                                type={focused ? "Ionicons" : "Ionicons"}
                                name={focused ? "notifications" : "notifications-outline"}
                                size={focused ? 26 : 26}
                                color={focused ? "#591aaf" : "#000"}
                            />
                        ),
                        tabBarBadge: "7"
                    }} />
                <Tab.Screen name='Personal' component={PersonalScreen}
                    options={{
                        headerTitle: 'Menu',
                        tabBarLabelStyle: { color: '#591aaf' },
                        tabBarIcon: ({ focused }) => (
                            <VectorIcon
                                type={focused ? "Ionicons" : "Ionicons"}
                                name={focused ? "menu" : "menu-outline"}
                                size={focused ? 26 : 26}
                                color={focused ? "#591aaf" : "#000"}
                            />
                        ),
                        headerRight: () => {
                            return (
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <TouchableOpacity>
                                        <FontAwesome5Icon.Button
                                            name="cog"
                                            size={20}
                                            backgroundColor="#fff"
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <FontAwesome5Icon.Button
                                            name="search"
                                            size={20}
                                            backgroundColor="#fff"
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        },
                    }} />
            </Tab.Navigator>
        </Fragment>
    );
};

export default MainScreen;