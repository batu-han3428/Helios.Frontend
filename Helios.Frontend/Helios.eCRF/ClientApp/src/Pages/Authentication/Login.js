import PropTypes from 'prop-types';
import React, { useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Row, Col, CardBody, Card, Container, Label, Form, Input, Alert } from "reactstrap";
import { connect, useDispatch } from "react-redux";
import withRouter from '../../components/Common/withRouter';
import { apiError, loginuser } from "../../store/actions";
import { startloading, endloading } from '../../store/loader/actions';
import { useLoginPostMutation } from '../../store/services/Login';
import { onLogin } from '../../helpers/Auth/useAuth';
import { setLocalStorage, getLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { useEffect } from 'react';
import ModalComp from '../../components/Common/ModalComp/ModalComp';
import ForgotPassword from './ForgotPassword';
import LanguageDropdown from '../../components/CommonForBoth/TopbarDropdown/LanguageDropdown';
import { withTranslation } from "react-i18next";
import logoheliossmImg from "../../assets/images/helios-sm-logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./Login.css";
import { showToast } from '../../store/toast/actions';

const Login = props => {

    const modalRef = useRef();

    const ssoRef = useRef();

    const [loading, setLoading] = useState(true);
        
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = getLocalStorage("accessToken");
        if (storedUser) {
            navigate("/");
        }
        setLoading(false);
    }, [navigate])

    const [alertMessage, setAlertMessage] = useState("");

    const location = useLocation();
    const { state } = location;

    useEffect(() => {
        if (state && state.email) {
            setFormData(prevFormData => ({
                ...prevFormData,
                Email: state.email
            }));
        }

        if (state && state.message) {
            setAlertMessage(state.message);
        }
    }, [state]);

    const dispatch = useDispatch();
    const [loginPost, { isLoading }] = useLoginPostMutation();
    const [formData, setFormData] = useState({ Email: '', Password: '', Language: props.i18n.language });

  

  
    const [errors, setErrors] = useState({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const handleSubmit = async (e) => {
        try {
            let formErrors = {};
            if (!formData.Password) {
                formErrors.password = 'Password is required';
                setErrors(formErrors);
            } else {
                dispatch(startloading());
                const response = await loginPost(formData);

                if (response.data.isSuccess) {
                    setLocalStorage("accessToken", response.data.values.accessToken);
                    let result = onLogin();

                    dispatch(endloading())
                    if (result === false) {
                        dispatch(showToast(props.t("An unexpected error occurred."), false, false));
                    } else {
                        dispatch(loginuser(result));
                        navigate("/");
                    }
                }  
                else if (response.data.values.hasOwnProperty("hasUser")) {
                    navigate("/SSO-notfoundpage");
                    dispatch(endloading());
                }
                else {
                    dispatch(endloading());
                    if (response.data.values !== null && response.data.values.change !== "5") {
                        if (response.data.values.hasOwnProperty("redirect")) {
                            navigate(response.data.values.redirect);
                        }
                        else {
                            dispatch(showToast(response.data.values.hasOwnProperty("change") ? props.t(response.data.message).replace(/@Change/g, response.data.values.change) : props.t(response.data.message), true, false));
                        }
                    } else {
                        dispatch(showToast(props.t(response.data.message), false, false));
                        if (response.data.values.change==="5") {
                            setTimeout(() => {
                                dispatch(showToast(props.t("To create a new password, please click on the 'Forgot your password ?' text on the screen and create a new password with the help of the e-mail you receive."), false, false));
                            }, 100);
                        }
                      
                        dispatch(endloading());
                    }
                }
            }
           
        } catch (error) {
            dispatch(endloading());
        }
    };

    const forgotPassword = (e) => {
        e.preventDefault();
        modalRef.current.tog_backdrop();
    };

    const handleFocus = (field) => {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    };


    document.title = props.t('Login page');
    return (
        loading 
        ||
        <>
            <div className="home-btn">
                <LanguageDropdown />
            </div>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={4}>
                            <Card className="overflow-hidden">
                                <div className="bg-primary">
                                    <div className="text-primary text-center p-4">
                                        <h5 className="text-white font-size-20">
                                            HELIOS
                                        </h5>
                                        <Link to="/" className="logo logo-admin">
                                            <img src={logoheliossmImg} height="24" alt="logo" />
                                        </Link>
                                    </div>
                                </div>

                                <CardBody className="p-4">
                                    <div className="p-3">
                                        {alertMessage !== "" ?
                                            <Alert color="warning" className="mt-4">
                                                {props.t(alertMessage)}
                                            </Alert>
                                            :
                                            null
                                        }
                                        <Form className="mt-4"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSubmit();
                                                return false;
                                            }}
                                            action="#">

                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="username">{props.t("e-Mail")}</Label>
                                                <Input
                                                    name="email"
                                                    className="form-control"
                                                    placeholder=""
                                                    type="email"
                                                    id="username"
                                                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                                    value={formData.Email}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="userpassword">{props.t("Password")}</Label>
                                                <Input
                                                    name="password"
                                                  
                                                    type={isPasswordVisible ? 'text' : 'password'}
                                                    className={errors.password ? 'form-control error-border' : 'form-control'}
                                                    onFocus={() => handleFocus('password')}
                                                    placeholder=""
                                                    onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                                                />
                                               
                                                <span className="toggle-visibility" onClick={togglePasswordVisibility}>
                                                    {isPasswordVisible ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
                                                </span>
                                                {errors.password && <span className="error-message">{props.t("This field is required")}</span>}
                                            </div>

                                            <div className="mb-3 row">
                                                <div className="col-sm-6">
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input" id="customControlInline" />
                                                        <label className="form-check-label" htmlFor="customControlInline">{props.t("Remember me")}</label>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 text-end">
                                                    <button className="btn btn-primary w-md waves-effect waves-light" type="submit">{props.t("Login")}</button>
                                                </div>
                                            </div>

                                            <div className="mt-2 mb-0 row">
                                                <div className="col-12 mt-4">
                                                    <Link to="/forgot-password" onClick={forgotPassword}><i className="mdi mdi-lock"></i> {props.t("Forgot your password?")}</Link>
                                                </div>
                                                <div className="col-12 mt-1">
                                                    <Link to="/ContactUs"><FontAwesomeIcon icon="fa-solid fa-envelope" /> {props.t("Contact us")}</Link>
                                                </div>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                            <div className="mt-5 text-center">
                                <p>
                                    {props.t("© 2017 Helios - V3.0 prepared by MedCase")}
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <ModalComp
                refs={modalRef}
                title={props.t("Forgot your password?")}
                body={<ForgotPassword refs={ssoRef} email={formData.Email} />}
                buttonText={props.t("Send new password")}
                size="md"
            />
        </>       
  );
};

const mapStateToProps = state => {
  const { error } = state.rootReducer.Login;
  return { error };
};

export default withTranslation()(withRouter(
  connect(mapStateToProps, { loginuser, apiError })(Login)
));

Login.propTypes = {
  error: PropTypes.any,
  history: PropTypes.object,
  loginuser: PropTypes.func,
  t: PropTypes.any
};