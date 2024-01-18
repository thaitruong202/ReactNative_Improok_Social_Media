// import React from 'react';
// import VectorIcon from '../utils/VectorIcon';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import HomeScreen from '../screen/HomeScreen.js';
// import MessageScreen from '../screen/MessageScreen.js';
// import StatusPost from './StatusPost.js';
// import NotificationScreen from '../screen/NotificationScreen.js';
// import PersonalScreen from '../screen/PersonalScreen.js';

// const Tab = createMaterialBottomTabNavigator();

// const TopTabBar = () => {
//     return (
//         <>
//             {/* <Tab.Navigator
//                 screenOptions={() => ({
//                     tabBarShowLabel: false,
//                     tabBarActiveTintColor: '#591aaf',
//                     tabBarInactiveTintColor: '#3A3A3A',
//                     tabBarIndicatorStyle: {
//                         backgroundColor: '#591aaf',
//                         height: 2
//                     }
//                 })}
//                 tabBarOptions={{
//                     activeTintColor: '#591aaf',
//                     inactiveTintColor: '#3A3A3A',
//                     indicatorStyle: {
//                         backgroundColor: '#591aaf',
//                         height: 2,
//                     },
//                     // tabBarShowLabel: ({ focused }) => focused ? true : false,
//                     tabBarShowLabel: false,
//                 }}
//             >
//                 {TabNavigation.map(tab => (
//                     <Tab.Screen
//                         key={tab.id}
//                         name={tab.name}
//                         component={tab.route}
//                         options={{
//                             tabBarIcon: ({ color, focused }) => (
//                                 <VectorIcon
//                                     type={focused ? tab.activeiconType : tab.inactiveIconType}
//                                     name={focused ? tab.activeIconName : tab.inactiveIconName}
//                                     size={focused ? tab.size : tab.unFocusSize}
//                                     color={color}
//                                     style={{ padding: 0 }}
//                                 />
//                             ),
//                         }}
//                     />
//                 ))}
//             </Tab.Navigator> */}
//             <Tab.Navigator
//                 activeColor='#591aaf'
//                 barStyle={{ backgroundColor: 'white', borderTopWidth: 1, borderTopColor: 'grey' }}
//             >
//                 <Tab.Screen name='Home' component={HomeScreen} options={{
//                     tabBarIcon: ({ focused }) => (
//                         <VectorIcon
//                             type={focused ? "Ionicons" : "Ionicons"}
//                             name={focused ? "home" : "home-outline"}
//                             size={focused ? 25 : 25}
//                             color={focused ? "#591aaf" : "black"}
//                         />
//                     )
//                 }} />
//                 <Tab.Screen name='Message' component={MessageScreen} options={{
//                     tabBarIcon: ({ focused }) => (
//                         <VectorIcon
//                             type={focused ? "Ionicons" : "Ionicons"}
//                             name={focused ? "chatbox" : "chatbox-outline"}
//                             size={focused ? 25 : 25}
//                             color={focused ? "#591aaf" : "black"}
//                         />
//                     )
//                 }} />
//                 <Tab.Screen name='Post' component={StatusPost}
//                     options={{
//                         tabBarIcon: ({ focused }) => (
//                             <VectorIcon
//                                 type={focused ? "Ionicons" : "Ionicons"}
//                                 name={focused ? "add-circle" : "add-circle-outline"}
//                                 size={focused ? 25 : 25}
//                                 color={focused ? "#591aaf" : "black"}
//                             />
//                         )
//                     }}
//                 />
//                 <Tab.Screen name='Notification' component={NotificationScreen}
//                     options={{
//                         tabBarIcon: ({ focused }) => (
//                             <VectorIcon
//                                 type={focused ? "Ionicons" : "Ionicons"}
//                                 name={focused ? "notifications" : "notifications-outline"}
//                                 size={focused ? 25 : 25}
//                                 color={focused ? "#591aaf" : "black"}
//                             />
//                         ),
//                         tabBarBadge: "7"
//                     }}
//                 />
//                 <Tab.Screen name='Personal' component={PersonalScreen}
//                     options={{
//                         tabBarIcon: ({ focused }) => (
//                             <VectorIcon
//                                 type={focused ? "Ionicons" : "Ionicons"}
//                                 name={focused ? "menu" : "menu-outline"}
//                                 size={focused ? 25 : 25}
//                                 color={focused ? "#591aaf" : "black"}
//                             />
//                         )
//                     }}
//                 />
//             </Tab.Navigator>
//         </>
//     );
// };

// export default TopTabBar;