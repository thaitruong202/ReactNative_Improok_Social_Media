import AsyncStorage from '@react-native-async-storage/async-storage';

const MyAccountReducer = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            // AsyncStorage.removeItem('token');
            // AsyncStorage.removeItem('user');
            AsyncStorage.clear();
            console.log("Xóa")
            return null;
        case "updateAccount":
            return {
                ...currentState,
                ...action.payload
            };
        default:
            return currentState;
    }
};

export default MyAccountReducer;