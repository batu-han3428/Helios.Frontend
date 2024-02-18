import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { Card, Label, Input, Form, Button, FormFeedback } from "reactstrap";
import { withTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { startloading, endloading } from '../../../../store/loader/actions';
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import makeAnimated from "react-select/animated";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import "./editor.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useLazyRoleListGetQuery } from '../../../../store/services/Permissions';
import { arraysHaveSameItems } from '../../../../helpers/General/index';
import { useEmailTemplateSetMutation, useLazyEmailTemplateGetQuery } from '../../../../store/services/EmailTemplate';
import 'draft-js-image-plugin/lib/plugin.css';
import htmlToDraft from 'html-to-draftjs';
import templateTypeItems from '../TemplateTypeItems';


const TemplateForm = props => {

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    const [trigger, { data: rolesData, isLoading, isError }] = useLazyRoleListGetQuery();

    useEffect(() => {
        if (props.studyId) {
            dispatch(startloading());
            trigger(props.studyId);
        }
    }, [props.studyId])

    useEffect(() => {
        if (rolesData && !isLoading && !isError) {
            let option = [{
                label: props.t("Roles"),
                options: []
            }]
            const roles = rolesData.map(item => {
                return {
                    label: item.roleName,
                    value: item.id
                };
            });
            const allRoleIds = rolesData.map(item => item.id);
            const selectAllOption = {
                label: props.t("Select all"),
                value: ["All", allRoleIds]
            };
            roles.unshift(selectAllOption);
            option[0].options.push(...roles);
            setOptionGroupRoles(option);
            dispatch(endloading());
        } else if (isError && !isLoading) {
            dispatch(endloading());
            props.toast(props.t("An unexpected error occurred."), false);
        } else {
            dispatch(endloading());
        }
    }, [rolesData, isError, isLoading]);

    const [triggerUpdate, { data: mailTemplateData, isLoadingUpdate, isErrorUpdate }] = useLazyEmailTemplateGetQuery();

    useEffect(() => {
        if (props.templateId && rolesData) {
            dispatch(startloading());
            triggerUpdate(props.templateId);
        }
    }, [props.templateId, rolesData])

    useEffect(() => {
        if (mailTemplateData && !isLoadingUpdate && !isErrorUpdate) {

            let roles = [];

            if (rolesData.length > 0) {
                const haveSameItems = arraysHaveSameItems(rolesData.map(role => role.id), mailTemplateData.roles);

                if (haveSameItems) {
                    roles = ["All", ["All", mailTemplateData.roles]];
                } else {
                    roles = mailTemplateData.roles;
                }
            }

            validationType.setValues({
                id: mailTemplateData.id,
                userid: props.userId,
                tenantid: mailTemplateData.tenantId,
                studyId: mailTemplateData.studyId,
                name: mailTemplateData.name,
                templateType: mailTemplateData.templateType,
                externalMails: mailTemplateData.externalMails,
                roles: roles,
                editor: mailTemplateData.templateBody
            });

            const blocksFromHTML = htmlToDraft(mailTemplateData.templateBody);
            const state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );
            const newEditorState = EditorState.createWithContent(state);
            setEditorState(newEditorState);

            props.setTemplateType(mailTemplateData.templateType);

            dispatch(endloading());

        } else if (isErrorUpdate && !isLoadingUpdate) {
            dispatch(endloading());
        } else {
            dispatch(endloading());
        }
    }, [mailTemplateData, isErrorUpdate, isLoadingUpdate]);


    const dispatch = useDispatch();

    const navigate = useNavigate();

    const optionGroupTemplateType = [
        {
            label: props.t("Type"),
            options: templateTypeItems.map((e, i) => {
                return { label: props.t(e.label), value: e.value }
            })
        }
    ];
    
    const validateTag = (tag) => {
        const isDuplicate = validationType.values.externalMails.includes(tag);
        return !isDuplicate;
    };

    const animatedComponents = makeAnimated();

    const [optionGroupRoles, setOptionGroupRoles] = useState([{
        label: props.t("Select all"),
        options: []
    }]);

    const [emailTemplateSet] = useEmailTemplateSetMutation();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: 0,
            userid: props.userId,
            tenantid: props.tenantId,
            studyId: props.studyId,
            name: "",
            templateType: 0,
            externalMails: [],
            roles: [],
            editor: null
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(
                props.t("This field is required")
            ),
            templateType: Yup.number().transform((value, originalValue) => originalValue === 0 ? undefined : value)
                .nullable(true)
                .required(props.t("This field is required")),
            editor: Yup.mixed().nullable(true).required(props.t("This field is required")),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(startloading());

                const response = await emailTemplateSet({
                    ...values,
                    roles: values.roles[0] === "All" ? values.roles[1][1] : values.roles
                });

                if (response.data.isSuccess) {
                    dispatch(endloading());
                    navigate(`/email-templates/${props.studyId}`, { state: { message: response.data.message, state: true } });
                } else {
                    dispatch(endloading());
                    props.toast(response.data.message, false);
                }
            } catch (e) {
                dispatch(endloading());
            }
        }
    });

    const handleImageUpload = (file) => {
        return new Promise(
            (resolve, reject) => {
                if (file) {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({ data: { link: e.target.result } })
                    };
                    reader.readAsDataURL(file);
                }
            }
        );
    };

    const formClearAll = () => {
        validationType.setValues({
            id: 0,
            userid: props.userId,
            tenantid: props.tenantId,
            studyId: props.studyId,
            name: "",
            templateType: 0,
            externalMails: [],
            roles: [],
            editor: null
        });
        setEditorState(EditorState.createEmpty());
        props.setTemplateType(-1);
    }

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                return false;
            }}>
            <div className="mb-3">
                <Label className="form-label">{props.t("Template header")}</Label>
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
                />
                {validationType.touched.name && validationType.errors.name ? (
                    <FormFeedback type="invalid">{validationType.errors.name}</FormFeedback>
                ) : null}
            </div>
            <div className="mb-3" style={{ position: "relative", zIndex: "112313" }}>
                <Label>{props.t("Template type")}</Label>
                <Select
                    value={(() => {
                        const selectedValue = optionGroupTemplateType[0].options.find(option => option.value === validationType.values.templateType);
                        if (selectedValue === undefined) return null;
                        return selectedValue;
                    })()}
                    name="templateType"
                    onChange={(selectedOption) => {
                        props.setTemplateType(selectedOption.value);
                        validationType.setFieldValue('templateType', selectedOption.value);
                    }}
                    options={optionGroupTemplateType}
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Select")}
                    invalid={
                        validationType.touched.templateType && validationType.errors.templateType ? true : false
                    }
                />
                {validationType.touched.templateType && validationType.errors.templateType ? (
                    <div type="invalid" className="invalid-feedback" style={{display:"block"}}>{props.t("This field is required")}</div>
                ) : null}
               
            </div>
            <div className="mb-3">
                <Label>{props.t("External e-mails")}</Label>
                <TagsInput
                    value={validationType.values.externalMails}
                    onChange={(tags) => validationType.setFieldValue('externalMails', tags)}
                    validate={validateTag}
                    addOnBlur="true"
                />
            </div>
            <div className="mb-3" style={{ position: "relative", zIndex: "112312" }}>
                <Label className="form-label">{props.t("Roles")}</Label>
                <Select
                    value={validationType.values.roles[0] === "All" ? { label: props.t("Select all"), value: validationType.values.roles[1] } : optionGroupRoles[0].options.filter(option => validationType.values.roles.includes(option.value))}
                    name="roles"
                    onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions.map(option => option.value);
                        const selectAll = selectedValues.find(value => Array.isArray(value));
                        if (selectAll !== undefined) {
                            validationType.setFieldValue('roles', ["All", selectAll]);
                        } else {
                            validationType.setFieldValue('roles', selectedValues);
                        }
                    }}
                    options={(function () {
                        if (validationType.values.roles.includes("All")) {
                            return [];
                        } else {
                            const allOptions = optionGroupRoles[0].options;
                            const selectedOptions = [];
                            for (const option of allOptions) {
                                if (option.label !== props.t("Select all")) {
                                    selectedOptions.push(option.value);
                                }
                            }
                            let result = arraysHaveSameItems(selectedOptions, validationType.values.roles);
                            if (result) {
                                return [];
                            } else {
                                return optionGroupRoles[0].options;
                            }
                        }
                    })()}
                    classNamePrefix="select2-selection"
                    placeholder={props.t("Select")}
                    isMulti={true}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                />
            </div>
            <div className="mb-3">
                <Card>
                    <Editor
                        editorState={editorState} 
                        toolbarClassName="custom-toolbar-class"
                        wrapperClassName="wrapperClassName"
                        editorClassName="custom-editor-class"
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                            inline: {
                                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
                            },
                            list: {
                                options: ['unordered', 'ordered'],
                            },
                            textAlign: {
                                options: ['left', 'center', 'right'],
                            },
                            image: {
                                uploadEnabled: true,
                                uploadCallback: handleImageUpload,
                                alt: { present: false, mandatory: false },
                                previewImage: true,
                                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                defaultSize: {
                                    height: 'auto',
                                    width: 'auto',
                                },
                            },
                        }}
                        onEditorStateChange={(data) => {                         
                            setEditorState(data);
                            const contentState = data.getCurrentContent();
                            const contentStateRaw = convertToRaw(contentState);
                            const htmlContent = draftToHtml(contentStateRaw);
                            validationType.setFieldValue('editor', contentState.hasText() ? htmlContent : null);
                        }}
                        editorStyle={{ resize: 'vertical' }}
                    />
                </Card>
                {validationType.touched.editor && validationType.errors.editor ? (
                    <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{props.t("This field is required")}</div>
                ) : null}
            </div>
            <div className="mb-3" style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={()=>formClearAll()} style={{ backgroundColor: "#fff", color: "grey" }} color="light">
                    {props.t('Clear All')}
                </Button>{' '}
                <Button color="primary" style={{ marginLeft: "15px" }} onClick={()=>validationType.handleSubmit()}>
                    {props.t('Save')}
                </Button>
            </div>
        </Form>
    );
};


TemplateForm.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(TemplateForm);