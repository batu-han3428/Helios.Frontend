import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

//Calendar
import calendar from "./calendar/reducer"

import Login from './auth/user/reducer'

import Loader from './loader/reducer'

import Study from './study/reducer'

export const rootReducer = combineReducers({
    // public
    Layout,
    Login,
    Account,
    ForgetPassword,
    Profile,
    calendar,
    Loader,
    Study,
});