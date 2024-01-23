import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import AccountCreate from './AccountCreate';
import AccountConfirm from './AccountConfirm';

const Tab = createMaterialTopTabNavigator();

const AccountManagement = () => {
    return (
        <>
            <Tab.Navigator
                screenOptions={() => ({
                    tabBarActiveTintColor: '#591aaf',
                    tabBarInactiveTintColor: '#3A3A3A',
                    tabBarIndicatorStyle: {
                        backgroundColor: '#591aaf',
                        height: 2
                    }
                })}>
                <Tab.Screen name='Create account' component={AccountCreate} />
                <Tab.Screen name='Confirm account' component={AccountConfirm} />
            </Tab.Navigator>
        </>
    );
};

export default AccountManagement;