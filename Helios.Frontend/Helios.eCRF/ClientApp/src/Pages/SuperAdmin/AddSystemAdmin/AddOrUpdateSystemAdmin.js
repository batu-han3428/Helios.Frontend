import PropTypes from 'prop-types';
import React, { useImperativeHandle } from "react";
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

const AddOrUpdateSystemAdmin = props => {

    const dispatch = useDispatch();

    const [systemAdminSet] = useSystemAdminSetMutation();

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
            phonenumber: props.userData ? props.userData.phoneNumber : "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(props.t("This field is required")),
            lastName: Yup.string().required(props.t("This field is required")),
            email: Yup.string().required(props.t("This field is required")).email(props.t("Invalid email format")),
            phonenumber: Yup.string()
                .required(props.t("This field is required"))
                .test('is-valid-phone-number', props.t('Invalid phone number format'), (value) => {
                    return isValidPhoneNumber(value);
                }),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(startloading());

                if (!props.isAdd) {
                    const formHasChanges = Object.keys(values).some(
                        (key) => values[key] !== validationType.initialValues[key]
                    );

                    if (!formHasChanges) {
                        props.toast(props.t("It is not possible to update without making changes."), false);
                        dispatch(endloading());
                        return false;
                    }
                }

                const response = await systemAdminSet(values);
                if (response.data.isSuccess) {
                    props.onToggleModal();
                    props.toast(props.t(response.data.message), true);
                    dispatch(endloading());
                } else {
                    props.toast(props.t(response.data.message), false);
                    dispatch(endloading());
                }
            } catch (e) {
                props.toast(props.t("An unexpected error occurred."), false);
                dispatch(endloading());
            }
        }
    });

    useImperativeHandle(props.refs, () => ({
        submitForm: validationType.handleSubmit
    }), [validationType, props]);

    return (
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
                        name="phonenumber"
                        placeholder="Enter phone number"
                        value={validationType.values.phonenumber}
                        onChange={(value) => validationType.setFieldValue('phonenumber', value)}
                        onBlur={validationType.handleBlur}
                        limitMaxLength
                        defaultCountry="TR"
                    />
                    {validationType.touched.phonenumber && validationType.errors.phonenumber ? (
                        <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{validationType.errors.phonenumber}</div>
                    ) : null}
                </div>
            </div>
        </Form>
    )
}

AddOrUpdateSystemAdmin.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddOrUpdateSystemAdmin);