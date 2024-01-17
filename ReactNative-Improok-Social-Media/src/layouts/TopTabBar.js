import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VectorIcon from '../utils/VectorIcon';
import { TabNavigation } from '../navigation/TabNavigation.js';

const Tab = createMaterialTopTabNavigator();

const TopTabBar = () => {
    return (
        <>
            <Tab.Navigator
                screenOptions={() => ({
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#591aaf',
                    tabBarInactiveTintColor: '#3A3A3A',
                    tabBarIndicatorStyle: {
                        backgroundColor: '#591aaf',
                        height: 2
                    }
                })}
            // tabBarOptions={{
            //     activeTintColor: '#591aaf',
            //     inactiveTintColor: '#3A3A3A',
            //     indicatorStyle: {
            //         backgroundColor: '#591aaf',
            //         height: 2,
            //     },
            //     // tabBarShowLabel: ({ focused }) => focused ? true : false,
            //     tabBarShowLabel: false,
            // }}
            >
                {TabNavigation.map(tab => (
                    <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        component={tab.route}
                        options={{
                            tabBarIcon: ({ color, focused }) => (
                                <VectorIcon
                                    type={focused ? tab.activeiconType : tab.inactiveIconType}
                                    name={focused ? tab.activeIconName : tab.inactiveIconName}
                                    size={focused ? tab.size : tab.unFocusSize}
                                    color={color}
                                    style={{ padding: 0 }}
                                />
                            ),
                        }}
                    />
                ))}
            </Tab.Navigator>
        </>
    );
};

export default TopTabBar;