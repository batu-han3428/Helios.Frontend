import PropTypes from 'prop-types';
import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import { startloading, endloading } from '../../../store/loader/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, CardBody, Label, Input, Form, FormFeedback } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from "react-select";
import { useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import Dropzone from "react-dropzone";
import timezones from 'timezones-list';
import { useTenantSetMutation, useLazyTenantGetQuery } from '../../../store/services/Tenants';
import { base64ToFile } from '../../../helpers/base64_helper';
import ToastComp from '../../../components/Common/ToastComp/ToastComp';


const AddOrUpdateTenant = props => {

    const toastRef = useRef();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [allOptions, setAllOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        setAllOptions(timezones.map((e, i) => ({ value: e.tzCode, label: e.label })));
    }, [timezones])

    const groupedOptions = [
        {
            label: props.t("Currently selected time zone"),
            options: selectedOption ? [{ value: selectedOption, label: allOptions.find(x => x.value === selectedOption).label }] : [],
        },
        {
            label: props.t("All other time zones"),
            options: allOptions.filter(option => option.value !== selectedOption),
        },
    ];

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [u, setU] = useState(false);

    function handleAcceptedFiles(files, u = false) {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        );
        setSelectedFiles(files);
        validationType.setFieldValue("tenantLogo", files[0])
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    useEffect(() => {
        if (!u) {
            validationType.submitForm();
        } else {
            setU(false);
        }
    }, [selectedFiles])

    const [tenantSet] = useTenantSetMutation();

    const validationType = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            id: 0,
            userId: userInformation.userId,
            tenantName: "",
            timeZone: "",
            studyLimit: "",
            userLimit: "",
            tenantLogo: null
        },
        validationSchema: Yup.object().shape({
            tenantName: Yup.string().required(
                props.t("This field is required")
            )
        }),
        onSubmit: async (values) => {
            try {
                dispatch(startloading());

                const formData = new FormData();

                formData.append('Id', values.id);
                formData.append('UserId', values.userId);
                formData.append('TenantName', values.tenantName);
                formData.append('TimeZone', values.timeZone);
                formData.append('StudyLimit', values.studyLimit);
                formData.append('UserLimit', values.userLimit);
                formData.append('TenantLogo', values.tenantLogo);

                const response = await tenantSet(formData);

                if (response.data.isSuccess) {
                    dispatch(endloading());
                    toastRef.current.setToast({
                        message: props.t(response.data.message),
                        stateToast: true
                    });
                    if (validationType.values.id === 0) {
                        validationType.setFieldValue("id", response.data.values.id);
                    }
                } else {
                    dispatch(endloading());
                    toastRef.current.setToast({
                        message: response.data.values.hasOwnProperty("change") ? props.t(response.data.message).replace(/@Change/g, response.data.values.change) : props.t(response.data.message),
                        stateToast: false
                    });
                }
            } catch (e) {
                dispatch(endloading());
            }
        }
    });

    const [triggerUpdate, { data: tenantData, isLoading, isError }] = useLazyTenantGetQuery();

    const { tenantId } = useParams();

    useEffect(() => {
        if (tenantId) {
            dispatch(startloading());
            triggerUpdate({ tenantId: tenantId });
        }
    }, [tenantId]);

    useEffect(() => {
        if (tenantData && !isLoading && !isError) {
            validationType.setValues({
                id: tenantId,
                userId: userInformation.userId,
                tenantName: tenantData.name,
                timeZone: tenantData.timeZone,
                studyLimit: tenantData.studyLimit,
                userLimit: tenantData.userLimit,
                tenantLogo: null
            });

            setSelectedOption(tenantData.timeZone); 

            if (tenantData.path !== null) {
                const path = tenantData.path.split('/')[1];
                const file = base64ToFile(tenantData.logo, path);
                file.path = path;
                setU(true);
                handleAcceptedFiles([file]);
            }

            dispatch(endloading());
        } else if (isError && !isLoading) {
            dispatch(endloading());
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
        }
    }, [tenantData, isError, isLoading]);

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={8}>
                                <h6 className="page-title"><FontAwesomeIcon style={{ marginRight: "10px", cursor: "pointer", position: "relative", top: "0.5px" }} icon="fa-solid fa-left-long" onClick={() => navigate('/tenants')} />{props.t("Tenant information")}</h6>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <Card style={{ width: "50%", backgroundColor: "#f8f8fa", boxShadow: "unset", margin: "0 auto" }}>
                                <CardBody>
                                    <Form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validationType.handleSubmit();
                                            return false;
                                        }}>
                                        <div className="mb-3">
                                            <Label className="form-label">{props.t("Tenant name")}</Label>
                                            <Input
                                                name="tenantName"
                                                placeholder=""
                                                type="text"
                                                onChange={validationType.handleChange}
                                                onBlur={(e) => {
                                                    validationType.handleBlur(e);
                                                    validationType.submitForm();
                                                }}
                                                value={validationType.values.tenantName || ""}
                                                invalid={
                                                    validationType.touched.tenantName && validationType.errors.tenantName ? true : false
                                                }
                                            />
                                            {validationType.touched.tenantName && validationType.errors.tenantName ? (
                                                <FormFeedback type="invalid">{validationType.errors.tenantName}</FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="mb-3">
                                            <Label className="form-label">{props.t("Time zone")}</Label>
                                            <Select
                                                value={(selectedOption && allOptions.find(option => option.value === validationType.values.timeZone)) || null}
                                                name="timeZone"
                                                onChange={(selectedOption) => {
                                                    const formattedValue = {
                                                        target: {
                                                            name: 'timeZone',
                                                            value: selectedOption.value
                                                        }
                                                    };
                                                    validationType.handleChange(formattedValue);
                                                    if (selectedOption.length === 0) {
                                                        setSelectedOption(null);
                                                    } else {
                                                        setSelectedOption(selectedOption.value);
                                                    }
                                                    validationType.submitForm();
                                                }}
                                                options={groupedOptions}
                                                classNamePrefix="select2-selection"
                                                placeholder={props.t("Select")}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <Label className="form-label">{props.t("Study limit that can be added")}</Label>
                                            <Input
                                                name="studyLimit"
                                                placeholder=""
                                                type="number"
                                                onChange={validationType.handleChange}
                                                onBlur={(e) => {
                                                    validationType.handleBlur(e);
                                                    validationType.submitForm();
                                                }}
                                                value={validationType.values.studyLimit || ""}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <Label className="form-label">{props.t("User limit that can be added")}</Label>
                                            <Input
                                                name="userLimit"
                                                placeholder=""
                                                type="number"
                                                onChange={validationType.handleChange}
                                                onBlur={(e) => {
                                                    validationType.handleBlur(e);
                                                    validationType.submitForm();
                                                }}
                                                value={validationType.values.userLimit || ""}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <Label className="form-label">{props.t("Tenant logo")}</Label>
                                            <Dropzone
                                                onDrop={acceptedFiles => {
                                                    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
                                                    handleAcceptedFiles(imageFiles);
                                                }}
                                            >
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone">
                                                        <div
                                                            className="dz-message needsclick"
                                                            {...getRootProps()}
                                                        >
                                                            <input {...getInputProps()} />
                                                            <div className="mb-3">
                                                                <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                                                            </div>
                                                            <h4>{props.t("Drop photo here or click to upload")}</h4>
                                                        </div>
                                                    </div>
                                                )}
                                            </Dropzone>
                                            <div className="dropzone-previews mt-3" id="file-previews">
                                                {selectedFiles.map((f, i) => {
                                                    return (
                                                        <Card
                                                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                            key={i + "-file"}
                                                        >
                                                            <div className="p-2">
                                                                <Row className="align-items-center">
                                                                    <Col className="col-auto">
                                                                        <img
                                                                            data-dz-thumbnail=""
                                                                            height="80"
                                                                            className="avatar-sm rounded bg-light"
                                                                            alt={f.name}
                                                                            src={f.preview}
                                                                        />
                                                                    </Col>
                                                                    <Col>
                                                                        <Link
                                                                            to="#"
                                                                            className="text-muted font-weight-bold"
                                                                        >
                                                                            {f.name}
                                                                        </Link>
                                                                        <p className="mb-0">
                                                                            <strong>{f.formattedSize}</strong>
                                                                        </p>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <ToastComp
                ref={toastRef}
            />
        </>
    )
}


AddOrUpdateTenant.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddOrUpdateTenant);
