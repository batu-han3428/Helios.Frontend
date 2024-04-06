import React, { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastComp = forwardRef((props, ref) => {
    const [toastMessages, setToastMessages] = useState([]);

    useEffect(() => {
        if (toastMessages.length > 0) {
            toastMessages.forEach((toastMessage) => {
                if (toastMessage.stateToast) {
                    toast.success(toastMessage.message, { autoClose: toastMessage.autoHide });
                } else {
                    toast.error(toastMessage.message, { autoClose: toastMessage.autoHide });
                }
            });
            setToastMessages([]);
        }
    }, [toastMessages]);

    const setToast = useCallback((toast) => {
        setToastMessages(prevToastMessages => [...prevToastMessages, toast]);
    }, []);

    useImperativeHandle(ref, () => ({
        setToast: setToast
    }), [setToast]);

    return (
        <ToastContainer />
    );
});

export default ToastComp;