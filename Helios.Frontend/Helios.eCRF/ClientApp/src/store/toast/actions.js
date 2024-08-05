import { SHOW_TOAST, HIDE_TOAST } from "./actionTypes";

export const showToast = (message, autoHide, stateToast) => ({
    type: SHOW_TOAST,
    payload: {
        message,
        autoHide,
        stateToast
    }
});

export const hideToast = () => {
    return {
        type: HIDE_TOAST
    };
};