import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hideToast } from "../../../store/toast/actions";

const ToastComp = () => {

    const dispatch = useDispatch();

    const toastState = useSelector(state => state.rootReducer.Toast);

    useEffect(() => {
        if (toastState.visible) {
            if (toastState.stateToast) {
                toast.success(toastState.message, { autoClose: toastState.autoHide ? 3000 : false });
            } else {
                toast.error(toastState.message, { autoClose: toastState.autoHide ? 3000 : false });
            }
            dispatch(hideToast());
        }
    }, [toastState, dispatch]);

    return (
        <ToastContainer zIndex={9999} />
    );
};

export default ToastComp;