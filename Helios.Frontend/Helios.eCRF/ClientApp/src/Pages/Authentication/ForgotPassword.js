import PropTypes from 'prop-types';
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import {
    Label, Input, Form
} from "reactstrap";
import { useForgotPasswordPostMutation } from '../../store/services/Login';
import { startloading, endloading } from '../../store/loader/actions';
import { useDispatch } from 'react-redux';


const ForgotPassword = props => {

    const [forgotPasswordPost] = useForgotPasswordPostMutation();

    const dispatch = useDispatch();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
            language: props.i18n.language
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().required(
                props.t("This field is required")
            )
            .email(
                props.t("Invalid email format")
            )
        }),
        onSubmit: async (values) => {
            try {
                dispatch(startloading());
                const response = await forgotPasswordPost(values);
                if (response.data.isSuccess) {
                    props.onToggleModal();
                    props.toast(props.t(response.data.message), true);
                    dispatch(endloading());
                } else {
                    props.toast(props.t(response.data.message), false);
                    dispatch(endloading());
                }
            } catch (e) {
                dispatch(endloading());
            }
        }
    });

    useImperativeHandle(props.refs, () => ({
        submitForm: validationType.handleSubmit
    }), [validationType, props]);

    return (
        <>
            <Form
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
                        />
                    </div>
                </div>
            </Form>
        </>
    )
}

ForgotPassword.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(ForgotPassword);