import PropTypes from 'prop-types';
import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Input } from 'antd';
import { Form, Label } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { startloading, endloading } from '../../../../store/loader/actions';
import { useAddSubjectMutation } from '../../../../store/services/Subject';
import { showToast } from '../../../../store/toast/actions';

const AddSubjectComp = props => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [addingSubject] = useAddSubjectMutation();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            studyid: props.studyId,
            siteid: props.studyUserSiteData.sites.length === 1 ? props.studyUserSiteData.sites[0].id : null,
            initialname: "",
        },
        validationSchema: Yup.object().shape({
            siteid: Yup.number()
                .typeError(props.t("Must be a number"))
                .required(props.t("This field is required")),
            initialname: Yup.string(),
        }),
        validate: (values) => {
            const errors = {};
            if (props.AskSubjectInitial && !values.initialname) {
                errors.initialname = props.t("This field is required");
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                dispatch(startloading());
                values.id = 0;
                values.firstPageId = 0;
                values.subjectNumber = "";
                values.updatedAt = new Date();
                values.createdAt = new Date();
                values.country = "";
                values.siteName = "";
                values.randomData = "";
                values.addedByName = "";
                const response = await addingSubject(values);
                var retVal = response.data.values;
                if (response.data.isSuccess) {
                    let message = props.t(response.data.message).replace("{SubjectNo}", retVal.subjectNumber);
                    if (retVal.addedById > 0) message = message.replace("{n}", retVal.addedById);
                    dispatch(showToast(message, true, true));
                    props.refs.current.tog_backdrop();
                    navigate(`/subject-detail/${retVal.studyId}/${retVal.firstPageId}/${retVal.id}/${retVal.subjectNumber}/${false}/${0}`);
                } else {
                    Swal.fire({
                        title: "",
                        text: response.data.message,
                        icon: "error",
                        confirmButtonText: props.t("Ok"),
                    });
                }
                dispatch(endloading());
            }
            catch (e){
                Swal.fire({
                    title: "",
                    text: props.t("An error occurred while processing your request."),
                    icon: "error",
                    confirmButtonText: props.t("OK"),
                });
            }
        }
    });

    useEffect(() => {
        if (props.refs.current) {
            props.refs.current = { ...props.refs.current, submitForm: validationType.handleSubmit };
        }
    }, [validationType.handleSubmit, props]);

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                validationType.handleSubmit();
                return false;
            }}>

            {props.selectSites.length > 1 && props.studyUserSiteData.sites.length > 1 &&
                <div className="mb-12" style={{ marginBottom: "15px" }}>
                    <Label className="form-label"> {props.t('Site')}</Label>
                    <Select
                        name='siteid'
                        id='siteid'
                        onChange={(selectedOptions) => {
                            const selectedValues = selectedOptions.id;
                            validationType.setFieldValue('siteid', selectedValues);
                        }}
                        onBlur={validationType.handleBlur}
                        options={props.studyUserSiteData.sites}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        placeholder={props.t("Select")}
                        classNamePrefix="select2-selection" />
                    {validationType.touched.siteid && validationType.errors.siteid ? (
                        <div className="invalid-feedback" style={{ display: "block" }}>{validationType.errors.siteid}</div>
                    ) : null}
                </div>
            }
            {props.AskSubjectInitial &&
                <div className="mb-12" >
                    <Label className="control-label">
                        {props.t('Subject initial')}
                    </Label>
                    <Input className='form-control' type='text' name='initialname' id='initialname' onChange={validationType.handleChange}
                        onBlur={validationType.handleBlur} />
                    {validationType.touched.initialname && validationType.errors.initialname ? (
                        <div className="invalid-feedback" style={{ display: "block" }}>{validationType.errors.initialname}</div>
                    ) : null}
                </div>
            }
        </Form>
    )
}

AddSubjectComp.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddSubjectComp);