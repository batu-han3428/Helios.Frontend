import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import PhoneInput from 'react-phone-input-2';
import {
    Container,
    Row,
    Col,
    Card,
    Alert,
    CardBody,
    Button,
    Form,
    FormFeedback,
    Label,
    Input
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { useUserProfileEditMutation, useUserProfileChangePasswordMutation } from '../../../store/services/Users';
import { startloading, endloading } from '../../../store/loader/actions';
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
/*import { userReducer } from '../../../store/auth/user/reducer';*/
import { onLogin } from '../../../helpers/Auth/useAuth';
import cloneDeep from 'lodash/cloneDeep';

import { useLocation, useParams } from "react-router-dom";
import { withTranslation } from "react-i18next";

// Redux
import { connect, useDispatch, useSelector } from "react-redux";
import withRouter from '../../../components/Common/withRouter';

//Import Breadcrumb
import Breadcrumb from "../../../components/Common/Breadcrumb";

import { MDBTabs, MDBTabsItem, MDBTabsLink, MDBTabsContent } from 'mdb-react-ui-kit';

import { showToast } from '../../../store/toast/actions';

// actions
import { editProfile, resetProfileFlag, showSidebar } from "../../../store/actions";
const UserProfile = props => {
    const dispatch = useDispatch();
    const toastRef = useRef();
    const userInformation = useSelector(state => state.rootReducer.Login);
    const updatedUserInformation = cloneDeep(userInformation);
    const [userEdit] = useUserProfileEditMutation();
    const [userChangePassword] = useUserProfileChangePasswordMutation();
    const studyInformation = useSelector(state => state.rootReducer.Study);

    const [email, setemail] = useState("");
    const [name, setname] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setphoneNumber] = useState("");
    const [idx, setidx] = useState(1);

    useEffect(() => {
        if (userInformation) {
            setname(updatedUserInformation.name);
            setemail(updatedUserInformation.mail);
            setLastName(updatedUserInformation.lastName);
            setphoneNumber(updatedUserInformation.phoneNumber);
            setidx(updatedUserInformation.userId || 1);
            //setTimeout(() => {
            //    props.resetProfileFlag();
            //}, 3000);
        }

    }, [props.success, userInformation]);

    //profile resim ayarlarý
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 75;
    canvas.height = 75;
    // Arka plan rengini ve metni stilize et
    context.fillStyle = '#0089ff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = '40px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(props.avatar, canvas.width / 2, canvas.height / 2);
    const dataURI = canvas.toDataURL();
    const [basicActive, setBasicActive] = useState('tab1');

    const handleBasicClick = (value) => {
        if (value === basicActive) {
            return;
        }

        setBasicActive(value);
    };

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');   
    const handleSubmit = async (e) => {
        e.preventDefault();       

        try {
            dispatch(startloading());
            const response = await userChangePassword({
                AuthUserId: props.authUserId,
                Password: currentPassword,
                NewPassword: newPassword,
                ConfirmPassword: confirmNewPassword,
            });
            if (response.data.isSuccess) {
                dispatch(showToast(props.t(response.data.message), true, true));      
                dispatch(endloading());
            } else {
                if (response.data.message === "cod0") {
                    dispatch(showToast(props.t("Invalid password"), true, false));      
                }
                else if (response.data.message === "cod1") {
                    dispatch(showToast(props.t("Password cannot be empty"), true, false));      
                }
                else if (response.data.message === "cod2") {
                    dispatch(showToast(props.t("Your new password cannot be the same as the previous one"), true, false));      
                }
                else if (response.data.message === "cod3") {
                    dispatch(showToast(props.t("The new passwords entered are not compatible with each other, please try again"), true, false));                          
                }
                else if (response.data.message === "cod4") {
                    dispatch(showToast(props.t("Password must be minimum 6 and maximum 16 characters."), true, false));                 
                }
                else {
                    dispatch(showToast(props.t(response.data.message), true, false));      
                }               
                dispatch(endloading());
            }
        } catch (error) {
            setMessage("Þifre güncellenirken bir hata oluþtu.");
        }
    };

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            name: name || '',
            lastName: lastName || '',
            mail: email || '',
            phoneNumber: phoneNumber || '',
            userId: idx || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required(props.t("Please Enter First Name")),
            lastName: Yup.string().required(props.t("Please Enter Last Name")),
            mail: Yup.string().required(props.t("Please Enter Email")),
            phoneNumber: Yup.string().required(props.t("Please Enter Phone Number"))

        }),
        onSubmit: async (values) => {
            dispatch(startloading());
            const response = await userEdit({
                ...values,
                name: values.name,
                lastName: values.lastName,
                email: values.mail,
                phoneNumber: phoneNumber,
                id: values.userId
            });
            if (response.data.isSuccess) {
                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: true
                });
                dispatch(endloading());
            } else {
                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: false
                });
                dispatch(endloading());
            }
            let payload = [{
                name: values.name,
                lastName: values.lastName,
                email: values.mail,
                phoneNumber: phoneNumber,
                userId: values.userId,
                token: userInformation.token,
                roles: userInformation.roles,
                exp: userInformation.exp,
                tenantId: userInformation.tenantId,
                isAuthenticated: userInformation.isAuthenticated
            }]
            dispatch(editProfile(payload));
        }
    });

 
    document.title = props.t('My profile');;


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumb */}
                    {/*    <Breadcrumb title="Veltrix" breadcrumbItem="Profile" />*/}

                    <Row>
                        <Col lg="12">
                            {props.error && props.error ? (
                                <Alert color="danger">{props.error}</Alert>
                            ) : null}
                            {props.success ? (
                                <Alert color="success">{props.success}</Alert>
                            ) : null}

                            <Card>
                                <CardBody>
                                    <div className="d-flex">
                                        <div className="mx-3">
                                            <img src={dataURI} alt="Profile Avatar" style={{ borderRadius: '50%' }} />
                                        </div>
                                        <div className="align-self-center flex-1">
                                            <div className="text-muted">
                                                {/*<h5>{name}</h5>*/}
                                                {/*<p className="mb-1">{email}</p>*/}
                                                {/*<p className="mb-0">Id no: #{idx}</p>*/}
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <MDBTabs className='mb-3'>
                                        <MDBTabsItem>
                                            <MDBTabsLink onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
                                                {props.t("Profile")}
                                            </MDBTabsLink>
                                        </MDBTabsItem>
                                        <MDBTabsItem>
                                            <MDBTabsLink onClick={() => handleBasicClick('tab2')} active={basicActive === 'tab2'}>
                                                {props.t("Change password")}
                                            </MDBTabsLink>
                                        </MDBTabsItem>
                                    </MDBTabs>

                                    <MDBTabsContent>
                                        {basicActive === 'tab1' &&
                                            <Card>
                                                <CardBody>
                                                    <Form
                                                        className="form-horizontal"
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            validation.handleSubmit();
                                                            return false;
                                                        }}
                                                    >
                                                        <div className="form-group">
                                                            <div className="mb-3">
                                                                <Label className="form-label"> {props.t("First name")}</Label>
                                                                <Input
                                                                    name="name"
                                                                    className="form-control"
                                                                    placeholder={props.t("Enter first name")}
                                                                    type="text"
                                                                    onChange={(e) => setname(e.target.value)}
                                                                    onBlur={(e) => {
                                                                        validation.handleBlur(e);
                                                                    }}
                                                                    value={validation.values.name || ""}
                                                                    invalid={
                                                                        validation.touched.name && validation.errors.name ? true : false
                                                                    }
                                                                />
                                                                {validation.touched.name && validation.errors.name ? (
                                                                    <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                                                                ) : null}
                                                                <Input name="userId" value={idx} type="hidden" />
                                                            </div>

                                                            <div className="mb-3">
                                                                <Label className="form-label"> {props.t("Last name")}</Label>
                                                                <Input
                                                                    name="lastName"
                                                                    className="form-control"
                                                                    placeholder={props.t("Enter last name")}
                                                                    type="text"
                                                                    onChange={(e) => setLastName(e.target.value)}
                                                                    onBlur={(e) => {
                                                                        validation.handleBlur(e);
                                                                    }}
                                                                    value={validation.values.lastName || ""}
                                                                    invalid={
                                                                        validation.touched.lastName && validation.errors.lastName ? true : false
                                                                    }
                                                                />
                                                                {validation.touched.lastName && validation.errors.lastName ? (
                                                                    <FormFeedback type="invalid">{validation.errors.lastName}</FormFeedback>
                                                                ) : null}
                                                                <Input name="userId" value={idx} type="hidden" />
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label className="form-label"> {props.t("Email")}</Label>
                                                                <Input
                                                                    name="mail"
                                                                    className="form-control"
                                                                    placeholder={props.t("Enter email")}
                                                                    type="email"
                                                                    disabled={true}
                                                                    style={{
                                                                        backgroundColor: '#f0f0f0',
                                                                        color: '#a0a0a0',
                                                                        border: '1px solid #ccc',
                                                                    }}
                                                                    value={validation.values.mail || ""}
                                                                    invalid={
                                                                        validation.touched.mail && validation.errors.mail ? true : false
                                                                    }
                                                                />
                                                                {validation.touched.mail && validation.errors.mail ? (
                                                                    <FormFeedback type="invalid">{validation.errors.mail}</FormFeedback>
                                                                ) : null}
                                                                <Input name="userId" value={idx} type="hidden" />
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label className="form-label"> {props.t("Phone number")}</Label>
                                                                <PhoneInput
                                                                    name="phoneNumber"
                                                                    className="form-control"
                                                                    placeholder={props.t("Enter phone number")}
                                                                    type="text"
                                                                    specialLabel=""
                                                                    onChange={setphoneNumber}
                                                                    onBlur={(e) => {
                                                                        validation.handleBlur(e);
                                                                    }}
                                                                    value={validation.values.phoneNumber || ""}
                                                                    invalid={
                                                                        validation.touched.phoneNumber && validation.errors.phoneNumber ? true : false
                                                                    }
                                                                    inputStyle={{
                                                                        border: '0px solid #ccc',
                                                                        paddingLeft: '0px'
                                                                    }}
                                                                    inputProps={{
                                                                        name: "phoneNumber",
                                                                        id: "phoneNumber",
                                                                    }}

                                                                />
                                                                {validation.touched.phoneNumber && validation.errors.phoneNumber ? (
                                                                    <FormFeedback type="invalid">{validation.errors.phoneNumber}</FormFeedback>
                                                                ) : null}
                                                                <Input name="userId" value={idx} type="hidden" />
                                                            </div>
                                                        </div>
                                                        <div className="text-center mt-4">
                                                            <Button type="submit" color="danger">
                                                                {props.t("Edit")}
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                </CardBody>
                                            </Card>}
                                        {basicActive === 'tab2' &&
                                            <Card>
                                                <CardBody>
                                                    <Form
                                                        className="form-horizontal"
                                                        onSubmit={handleSubmit}
                                                    >
                                                        <div className="form-group">
                                                            <div className="mb-3">
                                                                <Label className="form-label"> {props.t("Old password")}</Label>
                                                                <Input
                                                                    name="password"
                                                                    className="form-control"
                                                                    placeholder={props.t("Enter old password")}
                                                                    type="password"
                                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                                    invalid={
                                                                        validation.touched.currentPassword && validation.errors.currentPassword ? true : false
                                                                    }
                                                                />
                                                                <Input name="userId" value={idx} type="hidden" />
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label className="form-label"> {props.t("New password")}</Label>
                                                                <Input
                                                                    name="newPassword"
                                                                    className="form-control"
                                                                    placeholder={props.t("Enter new password")}
                                                                    type="password"
                                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                                    invalid={
                                                                        validation.touched.newPassword && validation.errors.newPassword ? true : false
                                                                    }
                                                                />
                                                                <Input name="userId" value={idx} type="hidden" />
                                                            </div>
                                                            <div className="mb-3">
                                                                <Label className="form-label"> {props.t("Re-enter the new password")}</Label>
                                                                <Input
                                                                    name="confirmPassword"
                                                                    className="form-control"
                                                                    placeholder={props.t("Re-enter the new password")}
                                                                    type="password"
                                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                                    onBlur={(e) => {
                                                                        validation.handleBlur(e);
                                                                    }}
                                                                    invalid={
                                                                        validation.touched.confirmNewPassword && validation.errors.confirmNewPassword ? true : false
                                                                    }
                                                                />
                                                                <Input name="userId" value={idx} type="hidden" />
                                                            </div>
                                                            {message && <p style={{ color: 'red' }}>{message}</p>}
                                                            <div className="text-center mt-4">
                                                                <Button type="submit" color="danger">
                                                                    {props.t("Edit")}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Form>

                                                </CardBody>
                                            </Card>}
                                    </MDBTabsContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <ToastComp
                ref={toastRef}
            />
        </React.Fragment>
    );
};

UserProfile.propTypes = {
    editProfile: PropTypes.func,
    error: PropTypes.any,
    success: PropTypes.any,
    t: PropTypes.any
};

const mapStatetoProps = state => {
    const authUserId = state.rootReducer.Login.userId;
    const avatar = state.rootReducer.Login.name.charAt(0).toUpperCase() + state.rootReducer.Login.lastName.charAt(0).toUpperCase();
    const { error, success } = state.rootReducer.Profile;
    return { error, success, avatar, authUserId };
};

export default withRouter(
    connect(mapStatetoProps, { editProfile, resetProfileFlag })(withTranslation()(UserProfile))
);
