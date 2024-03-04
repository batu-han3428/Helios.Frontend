import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import VerticalLayout from "../../components/VerticalLayout";
import SSOLayout from "../../components/SSOLayout";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { addStudy, loginuser, resetStudy } from "../../store/actions";
import { layoutTypes } from "../../constants/layout";
import { onLogin } from "../../helpers/Auth/useAuth";
import { userRoutes } from "../allRoutes";
import { API_BASE_URL } from "../../constants/endpoints";

const AuthMiddleware = (props) => {
    const dispatch = useDispatch();
    const user = getLocalStorage("accessToken");
    const { path: Path, element: Element, roles } = props;
    let matchedRoute = null;
    let pageType = null;
    let Layout = null;
    const { studyId } = useParams();
    const [error, setError] = useState(false);
    var result = null;

    const updateJwt = (token, studyId) => {
        const apiUrl = API_BASE_URL+`Account/UpdateJwt`;
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ studyId: studyId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setLocalStorage("accessToken", data.values.accessToken);
            result = onLogin();
            dispatch(loginuser(result));
            if (studyId !== 0) getStudy({ token: data.values.accessToken });
        })
        .catch(error => {
            setError(true);
        });
    };

    const getStudy = async (result) => {
        const apiUrl = API_BASE_URL+`Study/GetStudy`;
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${result.token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            dispatch(addStudy(data));
        })
        .catch(error => {
            setError(true);
        });
    };

    const fetchData = async (result) => {
        if (result.studyId !== studyId) {
            updateJwt(result.token, studyId);
        } else {
            getStudy(result);
        }
    };

    useEffect(() => {
        if (user) {
            dispatch(loginuser(result));
        }
    }, [dispatch, user, result]);

    if (!user) {
        return (
            <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
        );
    }
    else {
        result = onLogin();

        if (result === false) {
            removeLocalStorage("accessToken");
            return (
                <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
            );
        } else {
            pageType = userRoutes.find(route => route.roles && route.roles.some(role => result.roles.includes(role)) && route.path === Path)?.menuType ?? 'common';
            Layout = pageType === layoutTypes.SSO ? SSOLayout : VerticalLayout;
            if (Path !== "/" && roles && !roles.some(role => result.roles.includes(role))) {
                return (
                    <Navigate to={{ pathname: "/AccessDenied", state: { from: props.location } }} />
                );
            }
            if (Path === "/") {
                if (Array.isArray(result.tenantId) && Array.isArray(result.studyId) && ((result.tenantId.length > 1 || result.studyId.length > 1) || (result.tenantId.length > 0 && result.studyId.length > 0))) {
                    matchedRoute = "/SSO-tenants-or-studies";
                } else {
                    const matchedRoute1 = userRoutes.find(route => route.roles && route.roles.some(role => result.roles.includes(role)) && route.path === "/");
                    if (matchedRoute1) {
                        matchedRoute = matchedRoute1.redirect;
                    }
                }
                if (pageType !== "study" && result.studyId !== "") {
                    updateJwt(user, 0);
                }
            }
            if (pageType === "study") {
                fetchData(result);
                if (error) {
                    return (
                        <Navigate to={{ pathname: "/AccessDenied", state: { from: props.location } }} />
                    );
                }
            } else {
                Promise.resolve().then(() => {
                    dispatch(resetStudy());
                });
            }
        }
    }
    
    return (
        <Layout pageType={pageType}>
            {Path !== "/" ? Element : <Navigate to={matchedRoute || '/ContactUs'} />}
        </Layout>
    );
};

export default AuthMiddleware;