import {
    LOGIN_USER,
    LOGOUT_USER
} from "./actionTypes"

export const loginuser = (user) => ({
    type: LOGIN_USER,
    payload: { user }
})

export const logoutuser = () => ({
    type: LOGOUT_USER
})