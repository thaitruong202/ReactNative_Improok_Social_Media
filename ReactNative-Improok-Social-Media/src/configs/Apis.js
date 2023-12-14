import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_CONTEXT = "/IMPROOK_CARE";
const SERVER = "http://192.168.1.134";
const DJANGO_SERVER = "http://192.168.1.134:8000"

export const endpoints = {
    "login": `${SERVER_CONTEXT}/api/public/login/`,
    "current-user": `${SERVER_CONTEXT}/api/auth/current-user/`,
    "account": `${DJANGO_SERVER}/accounts/`,
    'djlogin': `${DJANGO_SERVER}/o/token/`
}

let token;

const getToken = async () => {
    token = await AsyncStorage.getItem('token');
};

getToken();

export const authApi = (token) => {
    return axios.create({
        baseURL: SERVER,
        headers: {
            "Authorization": token
        }
    })
}

export const djangoAuthApi = () => {
    return axios.create({
        baseURL: SERVER,
        headers: {
            "Authorization": 'Bearer fXy4beXpTi7MIWUj4UbDAKivROtfSF'
        }
    })
}

export default axios.create({
    baseURL: SERVER
});