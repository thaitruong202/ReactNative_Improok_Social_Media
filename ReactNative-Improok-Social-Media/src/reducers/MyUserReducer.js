import AsyncStorage from '@react-native-async-storage/async-storage';

const MyUserReducer = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            // AsyncStorage.removeItem('token');
            // AsyncStorage.removeItem('user');
            AsyncStorage.clear();
            console.log("Xóa")
            return null;
        case "updateUser":
            return {
                ...currentState,
                ...action.payload
            };
        default:
            return currentState;
    }
};

export default MyUserReducer;