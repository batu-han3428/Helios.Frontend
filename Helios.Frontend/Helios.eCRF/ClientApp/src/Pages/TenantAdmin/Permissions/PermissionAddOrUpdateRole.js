import PropTypes from 'prop-types';
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import {
    Label, Input, Form, FormFeedback
} from "reactstrap";
import { useRoleSaveMutation } from '../../../store/services/Permissions';
import { startloading, endloading } from '../../../store/loader/actions';
import { useDispatch } from 'react-redux';


const PermissionAddOrUpdateRole = props => {

    const [roleSave] = useRoleSaveMutation();

    const dispatch = useDispatch();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: props.roleId,
            userid: props.userId,
            tenantid: props.tenantId,
            studyId: props.studyId,
            rolename: props.selectedRole || "",
        },
        validationSchema: Yup.object().shape({
            rolename: Yup.string().required(
                props.t("This field is required")
            ),
        }),
        onSubmit: async (values) => {
            dispatch(startloading());
            const response = await roleSave(values);
            if (response.data.isSuccess) {
                props.onToggleModal();
                props.toast(props.t(response.data.message), true);
                dispatch(endloading());
            } else {
                props.toast(props.t(response.data.message), false);
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
                <div className="mb-3 col-md-12">
                    <Label className="form-label">{props.t("Role name")}</Label>
                    <Input
                        name="rolename"
                        placeholder={props.t("Role name")}
                        type="text"
                        onChange={validationType.handleChange}
                        onBlur={(e) => {
                            validationType.handleBlur(e);
                        }}
                        value={validationType.values.rolename || ""}
                        invalid={
                            validationType.touched.rolename && validationType.errors.rolename ? true : false
                        }
                    />
                    {validationType.touched.rolename && validationType.errors.rolename ? (
                        <FormFeedback type="invalid">{validationType.errors.rolename}</FormFeedback>
                    ) : null}
                </div>
            </div>
        </Form>
    )
}

PermissionAddOrUpdateRole.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(PermissionAddOrUpdateRole);