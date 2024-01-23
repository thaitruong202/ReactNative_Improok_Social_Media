import axios from "axios";

// const DJANGO_SERVER = "http://192.168.2.123:8000"
// const DJANGO_SERVER = "http://172.16.17.226:8000"
// const DJANGO_SERVER = "http://192.168.2.17:8000"
// const DJANGO_SERVER = "http://10.17.65.36:8000"
// const DJANGO_SERVER = "http://192.168.1.28:8000"
// const DJANGO_SERVER = "http://192.168.1.27:8000"
// const DJANGO_SERVER = "http://10.17.49.217:8000"
// const DJANGO_SERVER = "http://10.17.50.108:8000"
// const DJANGO_SERVER = "http://192.168.5.13:8000"
// const DJANGO_SERVER = "http://192.168.1.26:8000"
// const DJANGO_SERVER = "http://10.17.65.33:8000"
// const DJANGO_SERVER = "http://10.17.49.194:8000"
// const DJANGO_SERVER = "http://10.17.50.206:8000"
// const DJANGO_SERVER = "http://192.168.1.8:8000"
// const DJANGO_SERVER = "http://192.168.1.12:8000"
// const DJANGO_SERVER = "http://192.168.1.35:8000"
// const DJANGO_SERVER = "http://192.168.1.25:8000"

const DJANGO_SERVER = "http://192.168.1.7:8000"
// const DJANGO_SERVER = "http://192.168.1.19:8000"

export const endpoints = {
    "current-user": `${DJANGO_SERVER}/users/current-user/`,
    "account": `${DJANGO_SERVER}/accounts/`,
    "login": `${DJANGO_SERVER}/o/token/`,
    "get-account-by-user": (id) => `${DJANGO_SERVER}/users/${id}/account/`,
    "create-post": `${DJANGO_SERVER}/posts/`,
    "get-all-post": `${DJANGO_SERVER}/posts/`,
    "create-comment": `${DJANGO_SERVER}/comment/`,
    "delete-comment": (id) => `${DJANGO_SERVER}/comment/${id}/`,
    "get-comment-by-post": (id, page) => `${DJANGO_SERVER}/posts/${id}/comments/?page=${page}`,
    "get-post-by-account": (id, page) => `${DJANGO_SERVER}/accounts/${id}/posts/?page=${page}`,
    "count-post-reaction": (id) => `${DJANGO_SERVER}/posts/${id}/count_all_reactions/`,
    "count-post-comment": (id) => `${DJANGO_SERVER}/posts/${id}/count_comments/`,
    "check-reacted-to-post": (accountId, postId) => `${DJANGO_SERVER}/accounts/${accountId}/reacted_to_the_post/?post_id=${postId}`,
    "create-alumni-account": `${DJANGO_SERVER}/alumni_accounts/`,
    "create-user": `${DJANGO_SERVER}/users/`,
    "create-account": `${DJANGO_SERVER}/accounts/`,
    "view-invitation-group": `${DJANGO_SERVER}/invitation_groups/`,
    "create-invitation-group": `${DJANGO_SERVER}/invitation_groups/`,
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
    "send-multi-images": `${DJANGO_SERVER}/post_images/upload_multi_images/`,
    "cache-user": (name) => `${DJANGO_SERVER}/users/search_user_cache/?name=${name}`,
    "survey-result": (id) => `${DJANGO_SERVER}/posts/${id}/get_results_post_survey/`,
    "like-reaction": `${DJANGO_SERVER}/post_reactions/`,
    "delete-like": (id) => `${DJANGO_SERVER}/post_reactions/${id}/`,
    "get-post-reaction": (postId, reactionId, accountId) => `${DJANGO_SERVER}/posts/${postId}/reactions/?reaction_id=${reactionId}&account_id=${accountId}`,
    "lock-comment": (id) => `${DJANGO_SERVER}/posts/${id}/`,
    "delete-account-from-group": (id) => `${DJANGO_SERVER}/invitation_groups/${id}/delete_accounts/`,
    "reaction-on-post": `${DJANGO_SERVER}/post_reactions/`,
    "check-reaction": (postId, accountId) => `${DJANGO_SERVER}/posts/${postId}/reactions/?account_id=${accountId}`,
    "update-post-reaction": (id) => `${DJANGO_SERVER}/post_reactions/${id}/`,
    "delete-post": (id) => `${DJANGO_SERVER}/posts/${id}/`,
    "patch-invitation-group": (id) => `${DJANGO_SERVER}/invitation_groups/${id}/`,
    "create-lecturer-account": `${DJANGO_SERVER}/users/create_lecturer/`,
    "get-user-by-status": `${DJANGO_SERVER}/users/get_user_by_status/`,
    "confirm-user": (id) => `${DJANGO_SERVER}/users/${id}/`,
    "get-post-image": (id) => `${DJANGO_SERVER}/posts/${id}/post-images/`,
    "get-room-by-account": (id) => `${DJANGO_SERVER}/accounts/${id}/rooms/`,
    "get-message-by-room": (id) => `${DJANGO_SERVER}/rooms/${id}/messages/`,
    "send-message": `${DJANGO_SERVER}/messages/`,
    "get-user-by-id": (id) => `${DJANGO_SERVER}/users/${id}/`
}

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