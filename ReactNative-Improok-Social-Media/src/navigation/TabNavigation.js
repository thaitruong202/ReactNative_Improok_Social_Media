import StatusPost from '../layouts/StatusPost.js';
import HomeScreen from '../screen/HomeScreen.js'
import MessageScreen from '../screen/MessageScreen.js';
import NotificationScreen from '../screen/NotificationScreen.js';
import PersonalScreen from '../screen/PersonalScreen.js';

export const TabNavigation = [
    {
        id: 1,
        route: HomeScreen,
        name: 'Home',
        activeIconName: 'home',
        activeiconType: 'Entypo',
        inactiveIconName: 'home-outline',
        inactiveIconType: 'MaterialCommunityIcons',
        size: 25,
        unFocusSize: 25,
    },
    {
        id: 2,
        route: MessageScreen,
        name: 'Message',
        activeIconName: 'facebook-messenger',
        activeiconType: 'MaterialCommunityIcons',
        inactiveIconName: 'home-outline',
        inactiveIconType: 'MaterialCommunityIcons',
        size: 25,
        unFocusSize: 25,
    },
    {
        id: 3,
        route: StatusPost,
        name: 'Post',
        activeIconName: 'home',
        activeiconType: 'Entypo',
        inactiveIconName: 'home-outline',
        inactiveIconType: 'MaterialCommunityIcons',
        size: 25,
        unFocusSize: 25,
    },
    {
        id: 4,
        route: NotificationScreen,
        name: 'Notification',
        activeIconName: 'notifications',
        activeiconType: 'Ionicons',
        inactiveIconName: 'notifications-outline',
        inactiveIconType: 'Ionicons',
        size: 25,
        unFocusSize: 25,
    },
    {
        id: 5,
        route: PersonalScreen,
        name: 'Personal',
        activeIconName: 'menu',
        activeiconType: 'Ionicons',
        inactiveIconName: 'menu-outline',
        inactiveIconType: 'Ionicons',
        size: 25,
        unFocusSize: 25,
    },
];