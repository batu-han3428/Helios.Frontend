import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { EDIT_PROFILE } from "./actionTypes"
import { profileSuccess, profileError } from "./actions"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
    postFakeProfile,
    postJwtProfile,
} from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

function* editProfile({ payload: { user } }) {
    debugger
    try {
        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const response = yield call(
                fireBaseBackend.editProfileAPI,
                user.name,
                user.lastName,
                user.mail,
                user.phoneNumber,
                user.userId
            )
            yield put(profileSuccess(response))
        } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
            const response = yield call(postJwtProfile, "/post-jwt-profile", {
                name: user.name,
                lastName: user.lastName,
                mail: user.mail,
                phoneNumber: user.phoneNumber,
                idx: user.userId,
            })
            yield put(profileSuccess(response))
        } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
            const response = yield call(postFakeProfile, {
                name: user.name,
                lastName: user.lastName,
                mail: user.mail,
                phoneNumber: user.phoneNumber,
                idx: user.userId,
            })
            yield put(profileSuccess(response))
        }
    } catch (error) {
        yield put(profileError(error))
    }
}
export function* watchProfile() {
    yield takeEvery(EDIT_PROFILE, editProfile)
}

function* ProfileSaga() {
    yield all([fork(watchProfile)])
}

export default ProfileSaga
