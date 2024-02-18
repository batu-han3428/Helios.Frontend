import React, { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastComp = forwardRef((props, ref) => {

    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [autoHide, setAutoHide] = useState(true);
    const [stateToast, setStateToast] = useState(true);

    const setToast = useCallback((toast) => {
        if (toast.message !== undefined) {
            setMessage(toast.message);
        }
        if (toast.autoHide !== undefined) {
            setAutoHide(toast.autoHide);
        }
        if (toast.stateToast !== undefined) {
            setStateToast(toast.stateToast);
        }

        setShowToast(true);
    }, []);

    useImperativeHandle(ref, () => ({
        setToast: setToast
    }), [setToast]);

    useEffect(() => {
        if (showToast) {
            if (stateToast) {
                toast.success(message, {
                    autoClose: autoHide
                });
            } else {
                toast.error(message, {
                    autoClose: autoHide
                });
            }
            setShowToast(false);
        }
    }, [showToast, stateToast, message, autoHide]);


    return (
        <ToastContainer />
    );
});

export default ToastComp;