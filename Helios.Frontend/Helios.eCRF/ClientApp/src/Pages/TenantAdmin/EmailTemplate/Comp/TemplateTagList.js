import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader, FormFeedback, Label, Input, Form, CardTitle, ListGroup, ListGroupItem } from "reactstrap";
import { withTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLazyEmailTemplateTagListGetQuery, useAddEmailTemplateTagMutation, useDeleteEmailTemplateTagMutation } from '../../../../store/services/EmailTemplate';
import { useDispatch } from 'react-redux';
import { startloading, endloading } from '../../../../store/loader/actions';
import * as Yup from "yup";
import { useFormik } from "formik";
import ModalComp from '../../../../components/Common/ModalComp/ModalComp';
import Select from "react-select";
import Swal from 'sweetalert2';
import "./templateTagList.css";


const TemplateTagList = props => {

    const modalRef = useRef();

    const dispatch = useDispatch();

    const [list, setList] = useState([]);

    const [trigger, { data: emailTemplateTagData, isLoading, isError }] = useLazyEmailTemplateTagListGetQuery();

    useEffect(() => {
        if (props.tenantId && props.templateType) {
            dispatch(startloading());
            trigger({ tenantId: props.tenantId, templateType: props.templateType });
        }
    }, [props.tenantId, props.templateType])

    useEffect(() => {
        if (emailTemplateTagData && !isLoading && !isError) {
            setList(emailTemplateTagData);
            dispatch(endloading());
        } else if (isError && !isLoading) {
            dispatch(endloading());
            props.toast(props.t("An unexpected error occurred."), false);
        }
    }, [emailTemplateTagData, isError, isLoading]);

    const [deleteEmailTemplateTag] = useDeleteEmailTemplateTagMutation();

    const deleteTag = (id) => {
        Swal.fire({
            title: props.t("This tag will be deleted."),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel"),
            closeOnConfirm: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    dispatch(startloading());
                    const response = await deleteEmailTemplateTag({
                        id: id,
                        userid: props.userId,
                        tenantid: props.tenantId,
                        tag: "",
                        templateType: 0,
                    });
                    if (response.data.isSuccess) {
                        dispatch(endloading());
                        Swal.fire({
                            title: "",
                            text: props.t(response.data.message),
                            icon: "success",
                            confirmButtonText: props.t("Ok"),
                        });
                    } else {
                        dispatch(endloading());
                        Swal.fire({
                            title: "",
                            text: response.data.message,
                            icon: "error",
                            confirmButtonText: props.t("OK"),
                        });
                    }
                } catch (error) {
                    dispatch(endloading());
                    Swal.fire({
                        title: "",
                        text: props.t("An error occurred while processing your request."),
                        icon: "error",
                        confirmButtonText: props.t("OK"),
                    });
                }
            }
        });
    };

    const optionGroupTemplateType = [
        {
            label: props.t("Type"),
            options: [
                { label: props.t("Form created"), value: 1 },
                { label: props.t("Form deleted"), value: 2 },
            ]
        }
    ];

    const resetValue = () => {
        validationType.validateForm().then(errors => {
            validationType.setErrors({});
            validationType.resetForm();
        });
    };

    const [addEmailTemplateTag] = useAddEmailTemplateTagMutation();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: 0,
            userid: props.userId,
            tenantid: props.tenantId,
            tag: "",
            templateType: 0,
        },
        validationSchema: Yup.object().shape({
            tag: Yup.string().required(
                props.t("This value is required")
            ),
            templateType: Yup.string().required(
                props.t("This value is required")
            ),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(startloading());
                const response = await addEmailTemplateTag(values);
                if (response.data.isSuccess) {
                    modalRef.current.tog_backdrop();
                    dispatch(endloading());
                    props.toast(props.t(response.data.message), true);
                } else {
                    dispatch(endloading());
                    props.toast(props.t(response.data.message), false);
                }
            } catch (e) {
                dispatch(endloading());
            }
        }
    });

    const CopyTag = (e) => {
        const clickedElement = e.target;
        const textToCopy = clickedElement.innerText;

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                props.toast(props.t("Tag copied") + " " + textToCopy, true);
            })
            .catch((err) => {
                props.toast(props.t("An error occurred while copying the tag."), false);
            });
    }

    return (
        <>
            <Card className="mb-3">
                <CardHeader style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", borderBottom: "1px solid #e9ecef" }}>
                    <CardTitle>{props.t("Template Tag list")}</CardTitle>
                    <FontAwesomeIcon style={{ cursor: "pointer" }} onClick={() => modalRef.current.tog_backdrop()} icon="fa-solid fa-plus" />
                </CardHeader>
                <CardBody>
                    <ListGroup>
                        {list.map((item, index) => (
                            <ListGroupItem key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Label onClick={CopyTag} style={{ cursor: "pointer", margin: "0"}}>
                                    {item.tag}
                                </Label>
                                <FontAwesomeIcon style={{ cursor: "pointer" }} icon="fa-solid fa-x" onClick={() => deleteTag(item.id)} />
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </CardBody>
            </Card>
            <ModalComp
                refs={modalRef}
                title="Add tag"
                body={
                    <>
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                validationType.handleSubmit();
                                return false;
                            }}>
                            <div className="row">
                                <div className="mb-3 col-md-12">
                                    <Label>{props.t("Template type")}</Label>
                                    <Select
                                        value={optionGroupTemplateType[0].options.find(option => option.value === validationType.values.templateType)}
                                        name="templateType"
                                        onChange={(selectedOption) => {
                                            const formattedValue = {
                                                target: {
                                                    name: 'templateType',
                                                    value: selectedOption.value
                                                }
                                            };
                                            validationType.handleChange(formattedValue);
                                        }}
                                        options={optionGroupTemplateType}
                                        classNamePrefix="select2-selection"
                                        placeholder={props.t("Select")}
                                        invalid={
                                            validationType.touched.templateType && validationType.errors.templateType ? true : false
                                        }
                                    />
                                    {validationType.touched.templateType && validationType.errors.templateType ? (
                                        <FormFeedback type="invalid">{validationType.errors.templateType}</FormFeedback>
                                    ) : null}
                                </div>
                                <div className="mb-3 col-md-12">
                                    <Label className="form-label">{props.t("e-Mail tag")}</Label>
                                    <Input
                                        name="tag"
                                        placeholder=""
                                        type="text"
                                        onChange={validationType.handleChange}
                                        onBlur={(e) => {
                                            validationType.handleBlur(e);
                                        }}
                                        value={validationType.values.tag || ""}
                                        invalid={
                                            validationType.touched.tag && validationType.errors.tag ? true : false
                                        }
                                    />
                                    {validationType.touched.tag && validationType.errors.tag ? (
                                        <FormFeedback type="invalid">{validationType.errors.tag}</FormFeedback>
                                    ) : null}
                                </div>
                            </div>
                        </Form>
                    </>
                }
                resetValue={resetValue}
                handle={() => validationType.handleSubmit()}
                buttonText={props.t("Save")}
                size="md"
            />
        </>
    );
};


TemplateTagList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(TemplateTagList);