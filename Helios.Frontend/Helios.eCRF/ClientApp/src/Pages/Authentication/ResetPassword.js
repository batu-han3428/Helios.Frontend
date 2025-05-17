﻿import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import { Label, Input, Form, Container, Row, Col, Card, CardBody, FormFeedback, InputGroup, InputGroupText, Button } from "reactstrap";
import { startloading, endloading } from '../../store/loader/actions';
import { loginuser } from "../../store/actions";
import { connect, useDispatch } from "react-redux";
import withRouter from '../../components/Common/withRouter';
import { useParams, Link, useNavigate } from "react-router-dom";
import logoSm from "../../assets/images/logo-sm.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLazyResetPasswordGetQuery, useResetPasswordPostMutation } from '../../store/services/Login';
import { useLoginPostMutation } from '../../store/services/Login';
import { setLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { onLogin } from '../../helpers/Auth/useAuth';
import { showToast } from '../../store/toast/actions';

const ResetPassword = props => {

    const { code, username } = useParams();

    const usernameParams = new URLSearchParams(username);
    const codeParams = new URLSearchParams(code);

    const [loginPost] = useLoginPostMutation();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [triggerResetPassword, { data: resetPasswordData, isLoadingResetPassword, isErrorResetPassword }] = useLazyResetPasswordGetQuery();

    useEffect(() => {
        if (code && username) {
            triggerResetPassword({ code: codeParams.get("code"), username: usernameParams.get("username") });
        }
    }, [code, username])

    useEffect(() => {
        dispatch(startloading());
        if (resetPasswordData && !isLoadingResetPassword && !isErrorResetPassword) {
            dispatch(endloading());
            if (resetPasswordData.isSuccess) {
                validationType.setValues({
                    email: resetPasswordData.values.username,
                    password: "",
                    code: resetPasswordData.values.code,
                });
            } else {
                navigate('/login');
            }
        } else if (isErrorResetPassword && !isLoadingResetPassword) {
            dispatch(endloading());
            navigate('/login');
        }
    }, [resetPasswordData, isErrorResetPassword, isLoadingResetPassword]);

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [resetPasswordPost] = useResetPasswordPostMutation();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
            password: "",
            code: "",
            confirmPassword: ""
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().required(
                props.t("This field is required")
            ).email(
                props.t("Invalid email format")
            ),
            password: Yup.string()
                .required(props.t("This field is required"))
                .min(6, props.t("Password must be minimum 6 and maximum 16 characters."))
                .max(16, props.t("Password must be minimum 6 and maximum 16 characters.")),
            confirmPassword: Yup.string()
                .required(props.t("This field is required"))
                .oneOf([Yup.ref("password"), null], props.t("The entered password and confirmation password do not match. Please try again.")),
        }),
        onSubmit: async (values) => {
            values.language = props.i18n.language;
            try {
                dispatch(startloading());
                const response = await resetPasswordPost(values);
                if (response.data.isSuccess) {
                    const responselogin = await loginPost(values);

                    if (responselogin.data.isSuccess) {
                        setLocalStorage("accessToken", responselogin.data.values.accessToken);
                        let result = onLogin();

                        dispatch(endloading())
                        if (result === false) {
                            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
                        } else {
                            dispatch(loginuser(result));
                            navigate("/");
                        }
                        dispatch(endloading());

                    } else {
                        dispatch(showToast(props.t(responselogin.data.message), true, false));
                        dispatch(endloading());
                    }
                }
                else {
                    dispatch(showToast(props.t(response.data.message), true, false));
                    dispatch(endloading());
                }
            } catch (e) {
                dispatch(endloading());
                dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            }
        }
    });

    return (
        <div className="account-pages my-5 pt-sm-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={4}>
                        <Card className="overflow-hidden">
                            <div className="bg-primary">
                                <div className="text-primary text-center p-4">
                                    <h5 className="text-white font-size-20">
                                        Reset Password
                                    </h5>
                                    <Link to="/" className="logo logo-admin">
                                        <img src={logoSm} height="24" alt="logo" />
                                    </Link>
                                </div>
                            </div>
                            <CardBody className="p-4">
                                <div className="p-3">
                                    <Form
                                        className="mt-4"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validationType.handleSubmit();
                                            return false;
                                        }}>
                                        <div className="row">
                                            <div className="mb-3 col-md-12">
                                                <Label className="form-label">E-mail</Label>
                                                <Input
                                                    name="email"
                                                    placeholder="abc@hotmail.com"
                                                    type="text"
                                                    onChange={validationType.handleChange}
                                                    onBlur={(e) => {
                                                        validationType.handleBlur(e);
                                                    }}
                                                    value={validationType.values.email || ""}
                                                    invalid={
                                                        validationType.touched.email && validationType.errors.email ? true : false
                                                    }
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="userpassword">Password</Label>
                                                <InputGroup>
                                                    <Input
                                                        name="password"
                                                        value={validationType.values.password || ""}
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="userpassword"
                                                        className="form-control"
                                                        placeholder="Enter Password"
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        invalid={
                                                            validationType.touched.password && validationType.errors.password ? true : false
                                                        }
                                                    />
                                                    <InputGroupText onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                                                        {showPassword ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
                                                    </InputGroupText>
                                                    {validationType.touched.password && validationType.errors.password ? (
                                                        <FormFeedback type="invalid">{validationType.errors.password}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="userpassword">Confirm Password</Label>
                                                <InputGroup>
                                                    <Input
                                                        name="confirmPassword"
                                                        value={validationType.values.confirmPassword || ""}
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="confirmPassword"
                                                        className="form-control"
                                                        placeholder="Confirm Password"
                                                        onChange={validationType.handleChange}
                                                        onBlur={validationType.handleBlur}
                                                        invalid={
                                                            validationType.touched.confirmPassword && validationType.errors.confirmPassword ? true : false
                                                        }
                                                    />
                                                    <InputGroupText onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                                                        {showPassword ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
                                                    </InputGroupText>
                                                    {validationType.touched.confirmPassword && validationType.errors.confirmPassword ? (
                                                        <FormFeedback type="invalid">{validationType.errors.confirmPassword}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3">
                                                <Button color="primary" style={{ float: "right" }} type="Submit">
                                                    Kaydet
                                                </Button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
const mapStateToProps = state => {
    const { error } = state.rootReducer.Login;
    return { error };
};

export default withTranslation()(withRouter(
    connect(mapStateToProps, { loginuser })(ResetPassword)
));
ResetPassword.propTypes = {
    error: PropTypes.any,
    history: PropTypes.object,
    loginuser: PropTypes.func,
    t: PropTypes.any
};
