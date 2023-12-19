import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_CONTEXT = "/IMPROOK_CARE";
const SERVER = "http://192.168.1.134";
const DJANGO_SERVER = "http://192.168.1.51:8000"

export const endpoints = {
    "current-user": `${DJANGO_SERVER}/users/current-user/`,
    "account": `${DJANGO_SERVER}/accounts/`,
    "djlogin": `${DJANGO_SERVER}/o/token/`,
    "get-account-by-user": (id) => `${DJANGO_SERVER}/users/${id}/account/`,
    "create-post": `${DJANGO_SERVER}/posts/`,
    "create-comment": `${DJANGO_SERVER}/comment/`,
    "get-comment-by-post": (id) => `${DJANGO_SERVER}/posts/${id}/comments/`,
    "get-post-by-account": (id) => `${DJANGO_SERVER}/accounts/${id}/posts/`,
    "count-post-reaction": (id) => `${DJANGO_SERVER}/posts/${id}/count_all_reactions/`,
    "check-reacted-to-post": (accountId, postId) => `${DJANGO_SERVER}/accounts/${accountId}/reacted_to_the_post/?post_id=${postId}`,
    "create-alumni-account": `${DJANGO_SERVER}/alumni_accounts/`,
    "create-user": `${DJANGO_SERVER}/users/`,
    "create-account": `${DJANGO_SERVER}/accounts/`,
    "view-invitation-group": `${DJANGO_SERVER}/invitation_groups/`
}

// let token;

// const getToken = async () => {
//     token = await AsyncStorage.getItem('token');
// };

// getToken();

export const djangoAuthApi = (token) => {
    return axios.create({
        baseURL: DJANGO_SERVER,
        headers: {
            "Authorization": "Bearer" + " " + token
        }
    })
}

export default axios.create({
    baseURL: DJANGO_SERVER
});