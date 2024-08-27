import PropTypes from 'prop-types';
import React, { useImperativeHandle, useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import { Label, Input, Form, FormFeedback } from "reactstrap";
import { startloading, endloading } from '../../../store/loader/actions';
import { useDispatch } from 'react-redux';
import { useSystemAdminSetMutation } from '../../../store/services/SystemAdmin/SystemAdmin';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInput from 'react-phone-number-input';
import "../../../assets/css/PhoneInput.css";
import { showToast } from '../../../store/toast/actions';
import {useUserGetQuery} from '../../../store/services/Users';

const AddOrUpdateSystemAdmin = props => {

    const dispatch = useDispatch();

    const [systemAdminSet] = useSystemAdminSetMutation();
    const [skip, setSkip] = useState(true);
    const [userControl, setUserControl] = useState(props.userControl);
    const [isRequired, setIsRequired] = useState(false);
  
    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: props.userData ? props.userData.id : 0,
            userid: props.userId,
            language: props.i18n.language,
            isAdd: props.isAdd,
            name: props.userData ? props.userData.name : "",
            lastName: props.userData ? props.userData.lastName : "",
            email: props.userData ? props.userData.email : "",
            phoneNumber: props.userData ? props.userData.phoneNumber : "",
        },
        validationSchema: Yup.object().shape({
            name: isRequired ? Yup.string().required(props.t("This field is required")) : Yup.string(),
            lastName: isRequired ? Yup.string().required(props.t("This field is required")) : Yup.string(),
            email: Yup.string().required(props.t("This field is required")).email(props.t("Invalid email format")),
            //phoneNumber:isRequired ? Yup.string()
            //    .required(props.t("This field is required"))
            //    .test('is-valid-phone-number', props.t('Invalid phone number format'), (value) => {
            //        return isValidPhoneNumber(value);
            //    }) : Yup.string(),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(startloading());
                if (values.name !== "") {
                    if (!props.isAdd) {
                        const formHasChanges = Object.keys(values).some(
                            (key) => values[key] !== validationType.initialValues[key]
                        );

                        if (!formHasChanges) {
                            dispatch(showToast(props.t("It is not possible to update without making changes."), true, false));
                            dispatch(endloading());
                            return false;
                        }
                    } 

                    const response = await systemAdminSet(values);
                    dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
                    dispatch(endloading());
                    if (response.data.isSuccess) props.onToggleModal();
                } else {
                    setSkip(false);
                }
            } catch (e) {
                dispatch(showToast(props.t("An unexpected error occurred."), true, false));
                dispatch(endloading());
            }
        }
    });


    const { data: userData, isErrorUser, isLoadingUser } = useUserGetQuery({ email: validationType.values.email, studyId: "0" }, {
        skip
    });
    useEffect(() => {
        if (userData && !isLoadingUser && !isErrorUser) {
            if (userData.isSuccess) {
                if (userData.values.authUserId !== 0) {
                    validationType.setValues({
                        id:0,
                        userid: userData.values.authUserId,
                        language: props.i18n.language,
                        isAdd: props.isAdd,
                        name: userData.values.name,
                        lastName: userData.values.lastName,
                        email: userData.values.email,
                        phoneNumber: userData.values.phoneNumber
                    });
                } 
                setIsRequired(true);
                setUserControl(false);
                dispatch(endloading());
            } else {
                dispatch(endloading());
                dispatch(showToast(props.t(userData.message), true, false));
            }
        }
    }, [userData, isErrorUser, isLoadingUser]);

    useImperativeHandle(props.refs, () => ({
        submitForm: validationType.handleSubmit
    }), [validationType, props]);

    return (
        <>
            {userControl ?
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validationType.handleSubmit();
                        return false;
                    }}>
                    <div className="row">
                        <div className="mb-3 col-md-12">
                            <Label className="form-label">{props.t("e-Mail")}</Label>
                            <Input
                                name="email"
                                placeholder="abc@xyz.com"
                                type="text"
                                onChange={validationType.handleChange}
                                onBlur={(e) => {
                                    validationType.handleBlur(e);
                                }}
                                value={validationType.values.email || ""}
                                invalid={
                                    validationType.touched.email && validationType.errors.email ? true : false
                                }
                            />
                        </div>
                    </div>
                </Form>
                :
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validationType.handleSubmit();
                        return false;
                    }}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <Label className="form-label">{props.t("First name")}</Label>
                            <Input
                                name="name"
                                placeholder=""
                                type="text"
                                onChange={validationType.handleChange}
                                onBlur={(e) => {
                                    validationType.handleBlur(e);
                                }}
                                value={validationType.values.name || ""}
                                invalid={
                                    validationType.touched.name && validationType.errors.name ? true : false
                                }
                                autoComplete="off"
                            />
                            {validationType.touched.name && validationType.errors.name ? (
                                <FormFeedback type="invalid">{validationType.errors.name}</FormFeedback>
                            ) : null}
                        </div>
                        <div className="mb-3 col-md-6">
                            <Label className="form-label">{props.t("Last name")}</Label>
                            <Input
                                name="lastName"
                                placeholder=""
                                type="text"
                                onChange={validationType.handleChange}
                                onBlur={(e) => {
                                    validationType.handleBlur(e);
                                }}
                                value={validationType.values.lastName || ""}
                                invalid={
                                    validationType.touched.lastName && validationType.errors.lastName ? true : false
                                }
                                autoComplete="off"
                            />
                            {validationType.touched.lastName && validationType.errors.lastName ? (
                                <FormFeedback type="invalid">{validationType.errors.lastName}</FormFeedback>
                            ) : null}
                        </div>
                        <div className="mb-3 col-md-6">
                            <Label className="form-label">{props.t("e-Mail")}</Label>
                            <Input
                                name="email"
                                placeholder=""
                                type="text"
                                onChange={validationType.handleChange}
                                onBlur={(e) => {
                                    validationType.handleBlur(e);
                                }}
                                value={validationType.values.email || ""}
                                invalid={
                                    validationType.touched.email && validationType.errors.email ? true : false
                                }
                                autoComplete="off"
                            />
                            {validationType.touched.email && validationType.errors.email ? (
                                <FormFeedback type="invalid">{validationType.errors.email}</FormFeedback>
                            ) : null}
                        </div>
                        <div className="mb-3 col-md-6">
                            <Label className="form-label">{props.t("Phone number")}</Label>
                            <PhoneInput
                                id="phonenumber"
                                name="phoneNumber"
                                placeholder="Enter phone number"
                                value={validationType.values.phoneNumber}
                                onChange={(value) => validationType.setFieldValue('phoneNumber', value)}
                                onBlur={validationType.handleBlur}                              
                                limitMaxLength
                                defaultCountry="TR"
                                international={false} 
                               
                            />
                            {validationType.touched.phoneNumber && validationType.errors.phoneNumber ? (
                                <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{validationType.errors.phoneNumber}</div>
                            ) : null}
                        </div>
                    </div>
                </Form>
            }
        </>
    )
}

AddOrUpdateSystemAdmin.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddOrUpdateSystemAdmin);