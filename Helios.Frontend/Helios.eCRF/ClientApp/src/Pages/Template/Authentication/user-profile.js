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
import { useUserProfileEditMutation } from '../../../store/services/Users';
import { startloading, endloading } from '../../../store/loader/actions';
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
/*import { userReducer } from '../../../store/auth/user/reducer';*/
import { onLogin } from '../../../helpers/Auth/useAuth';
import cloneDeep from 'lodash/cloneDeep';

import { withTranslation } from "react-i18next";

// Redux
import { connect, useDispatch, useSelector } from "react-redux";
import withRouter from '../../../components/Common/withRouter';

//Import Breadcrumb
import Breadcrumb from "../../../components/Common/Breadcrumb";

// actions
import { editProfile, resetProfileFlag } from "../../../store/actions";
const UserProfile = props => {
    const dispatch = useDispatch();
    const toastRef = useRef();
    const userInformation = useSelector(state => state.rootReducer.Login);
    const updatedUserInformation = cloneDeep(userInformation);
    const [userEdit] = useUserProfileEditMutation();
    const studyInformation = useSelector(state => state.rootReducer.Study);

    const [email, setemail] = useState("");
    const [name, setname] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setphoneNumber] = useState("");
    const [idx, setidx] = useState(1);

    useEffect(() => {        
        setname(updatedUserInformation.name);
        setemail(updatedUserInformation.mail);
        setLastName(updatedUserInformation.lastName);
        setphoneNumber(updatedUserInformation.phoneNumber);
        setidx(updatedUserInformation.userId || 1);
        //setTimeout(() => {
        //    props.resetProfileFlag();
        //}, 3000);

    }, [props.success]);

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

 
    document.title = "Profile | Veltrix - React Admin & Dashboard Template";
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
                                                validation.submitForm();
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
                                                validation.submitForm();
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
                                                validation.submitForm();
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
                                {/*<div className="text-center mt-4">*/}
                                {/*    <Button type="submit" color="danger">*/}
                                {/*        {props.t("Edit")}*/}
                                {/*    </Button>*/}
                                {/*</div>*/}
                            </Form>
                        </CardBody>
                    </Card>
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
    const avatar = state.rootReducer.Login.name.charAt(0).toUpperCase() + state.rootReducer.Login.lastName.charAt(0).toUpperCase();
    const { error, success } = state.rootReducer.Profile;
    return { error, success, avatar };
};

export default withRouter(
    connect(mapStatetoProps, { editProfile, resetProfileFlag })(withTranslation()(UserProfile))
);
