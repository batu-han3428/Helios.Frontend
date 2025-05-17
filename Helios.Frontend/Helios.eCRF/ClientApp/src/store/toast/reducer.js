import { SHOW_TOAST, HIDE_TOAST } from "./actionTypes"

const initialState = {
    visible: false,
    message: "",
    autoHide: false,
    stateToast: false
};

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_TOAST:
            return {
                ...state,
                visible: true,
                message: action.payload.message,
                autoHide: action.payload.autoHide,
                stateToast: action.payload.stateToast
            };
        case HIDE_TOAST:
            return initialState;
        default:
            return state;
    }
};

export default toastReducer