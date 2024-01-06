import axios from "axios";

// const DJANGO_SERVER = "http://192.168.2.123:8000"
// const DJANGO_SERVER = "http://172.16.17.226:8000"
// const DJANGO_SERVER = "http://192.168.2.17:8000"
// const DJANGO_SERVER = "http://10.17.65.36:8000"
const DJANGO_SERVER = "http://192.168.1.28:8000"

// const DJANGO_SERVER = "http://192.168.1.27:8000"

export const endpoints = {
    "current-user": `${DJANGO_SERVER}/users/current-user/`,
    "account": `${DJANGO_SERVER}/accounts/`,
    "login": `${DJANGO_SERVER}/o/token/`,
    "get-account-by-user": (id) => `${DJANGO_SERVER}/users/${id}/account/`,
    "create-post": `${DJANGO_SERVER}/posts/`,
    "get-all-post": `${DJANGO_SERVER}/posts/`,
    "create-comment": `${DJANGO_SERVER}/comment/`,
    "delete-comment": (id) => `${DJANGO_SERVER}/comment/${id}/`,
    "get-comment-by-post": (id) => `${DJANGO_SERVER}/posts/${id}/comments/`,
    "get-post-by-account": (id) => `${DJANGO_SERVER}/accounts/${id}/posts/`,
    "count-post-reaction": (id) => `${DJANGO_SERVER}/posts/${id}/count_all_reactions/`,
    "count-post-comment": (id) => `${DJANGO_SERVER}/posts/${id}/count_comments/`,
    "check-reacted-to-post": (accountId, postId) => `${DJANGO_SERVER}/accounts/${accountId}/reacted_to_the_post/?post_id=${postId}`,
    "create-alumni-account": `${DJANGO_SERVER}/alumni_accounts/`,
    "create-user": `${DJANGO_SERVER}/users/`,
    "create-account": `${DJANGO_SERVER}/accounts/`,
    "view-invitation-group": `${DJANGO_SERVER}/invitation_groups/`,
    "view-member-by-invitation-group": (id) => `${DJANGO_SERVER}/invitation_groups/${id}/`,
    "create-alumni": `${DJANGO_SERVER}/users/create_alumni/`,
    "add-account-invitation-group": (id) => `${DJANGO_SERVER}/invitation_groups/${id}/add_or_update_accounts/`,
    "delete-invitation-group": (id) => `${DJANGO_SERVER}/invitation_groups/${id}/`,
    "create-post-invitation": `${DJANGO_SERVER}/posts/create_post_invitation/`,
    "create-post-survey": `${DJANGO_SERVER}/posts/create_post_survey/`,
    "send-email": `${DJANGO_SERVER}/send-email/`,
    "invitation-posts-accounts": (id) => `${DJANGO_SERVER}/post_invitations/${id}/add_or_update_accounts/`,
    "avatar-change": (id) => `${DJANGO_SERVER}/accounts/${id}/`,
    "cover-avatar-change": (id) => `${DJANGO_SERVER}/accounts/${id}/`,
    "get-post-surveys": (page) => `${DJANGO_SERVER}/post_surveys/?page=${page}`,
    "get-post-by-post-id": (id) => `${DJANGO_SERVER}/posts/${id}/`,
    "get-post-survey-by-post-id": (id) => `${DJANGO_SERVER}/posts/${id}/post_survey/`,
    "answer-post-survey": `${DJANGO_SERVER}/posts/answer_post_survey/`,
    "search-user": (name) => `${DJANGO_SERVER}/users/search_user/?name=${name}`,
    "create-post-images": `${DJANGO_SERVER}/post_images/`,
    "send-multi-images": `${DJANGO_SERVER}/post_images/test_mutil_images/`
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