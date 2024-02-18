import {
    LOGIN_USER,
    LOGOUT_USER
} from "./actionTypes"

const user = {
    token: "",
    name: "",
    roles: [],
    isAuthenticated: false,
    exp: '',
    mail: '',
    userId: '',
    tenantId: '',
}

const userReducer = (state = user, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return state = {
                token: action.payload.user.token,
                name: action.payload.user.name,
                roles: action.payload.user.roles,
                isAuthenticated: action.payload.user.isAuthenticated,
                exp: action.payload.user.exp,
                mail: action.payload.user.mail,
                userId: action.payload.user.userId,
                tenantId: action.payload.user.tenantId,
            }
        case LOGOUT_USER:
            return state = {
                token: "",
                name: "",
                roles: [],
                isAuthenticated: false,
                exp: '',
                mail: '',
                userId: '',
                tenantId: '',
            }
        default:
            return state;
    }
};

export default userReducer