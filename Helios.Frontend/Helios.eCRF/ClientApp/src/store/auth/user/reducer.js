import {
    LOGIN_USER,
    EDIT_PROFILE,
    LOGOUT_USER
} from "./actionTypes"

const user = {
    token: "",
    name: "",
    lastName:"",
    roles: [],
    isAuthenticated: false,
    exp: '',
    mail: '',
    phoneNumber: '',
    userId: '',
    tenantId: '',
}
const user2 = localStorage.getItem('user');
const getUserFromLocalStorage = () => {
    const user2 = localStorage.getItem('user');
    if (user2) {
        try {
            const aa = JSON.parse(user2);
            user.token = aa[0].token;
            user.name = aa[0].name;
            user.lastName = aa[0].lastName;
            user.roles = aa[0].roles;
            user.isAuthenticated = aa[0].isAuthenticated;
            user.exp = aa[0].exp;
            user.mail = aa[0].email;
            user.phoneNumber = aa[0].phoneNumber;
            user.userId = aa[0].userId;
            user.tenantId = aa[0].tenantId;                               
            
        } catch (error) {
            console.error('Error parsing user data from localStorage', error);
            return null;
        }
    }
    return null;
};
const savedUser = getUserFromLocalStorage();
const userReducer = (state = user, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return state = {
                token: action.payload.user.token,
                name: action.payload.user.name,
                lastName: action.payload.user.lastName,
                roles: action.payload.user.roles,
                isAuthenticated: action.payload.user.isAuthenticated,
                exp: action.payload.user.exp,
                mail: action.payload.user.mail,
                phoneNumber: action.payload.user.phoneNumber,
                userId: action.payload.user.userId,
                tenantId: action.payload.user.tenantId,
            }
        case EDIT_PROFILE:
            return state = {
                token: action.payload.user[0].token,
                name: action.payload.user[0].name,
                lastName: action.payload.user[0].lastName,
                roles: action.payload.user[0].roles,
                isAuthenticated: action.payload.user[0].isAuthenticated,
                exp: action.payload.user[0].exp,
                mail: action.payload.user[0].mail,
                phoneNumber: action.payload.user[0].phoneNumber,
                userId: action.payload.user[0].userId,
                tenantId: action.payload.user[0].tenantId,
            }
        case LOGOUT_USER:
            return state = {
                token: "",
                name: "",
                lastName: "",
                roles: [],
                isAuthenticated: false,
                exp: '',
                mail: '',
                phoneNumber:'',
                userId: '',
                tenantId: '',
            }
        default:
            return state;
    }
};

export default userReducer