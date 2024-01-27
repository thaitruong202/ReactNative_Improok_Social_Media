import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AccountAccept from './AccountAccept';
import AccountDeny from './AccountDeny';
import AccountPending from './AccountPending';
import VectorIcon from '../utils/VectorIcon';

const Tab = createBottomTabNavigator()

const AccountConfirm = () => {
    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        paddingBottom: 8
                    }
                }}
            >
                <Tab.Screen name="Accept" component={AccountAccept}
                    options={{
                        headerShown: false,
                        unmountOnBlur: true,
                        tabBarLabelStyle: { color: '#591aaf' },
                        tabBarIcon: ({ focused }) => (
                            <VectorIcon
                                type={focused ? "Ionicons" : "Ionicons"}
                                name={focused ? "checkmark" : "checkmark-outline"}
                                size={focused ? 26 : 26}
                                color={focused ? "#591aaf" : "#000"}
                            />
                        )
                    }} />
                <Tab.Screen name="Deny" component={AccountDeny}
                    options={{
                        headerShown: false,
                        unmountOnBlur: true,
                        tabBarLabelStyle: { color: '#591aaf' },
                        tabBarIcon: ({ focused }) => (
                            <VectorIcon
                                type={focused ? "Ionicons" : "Ionicons"}
                                name={focused ? "close" : "close-outline"}
                                size={focused ? 26 : 26}
                                color={focused ? "#591aaf" : "#000"}
                            />
                        )
                    }} />
                <Tab.Screen name="Pending" component={AccountPending}
                    options={{
                        headerShown: false,
                        unmountOnBlur: true,
                        tabBarLabelStyle: { color: '#591aaf' },
                        tabBarIcon: ({ focused }) => (
                            <VectorIcon
                                type={focused ? "Ionicons" : "Ionicons"}
                                name={focused ? "reload" : "reload-outline"}
                                size={focused ? 26 : 26}
                                color={focused ? "#591aaf" : "#000"}
                            />
                        )
                    }} />
            </Tab.Navigator>
        </>
    );
};

export default AccountConfirm;