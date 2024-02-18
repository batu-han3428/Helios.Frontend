import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { MDBDataTable } from "mdbreact";
import {
    Row, Col, Card, CardBody, Button, Label, Input, Form, FormFeedback, Alert
} from "reactstrap";
import { useLazySiteListGetQuery, useSiteSaveOrUpdateMutation, useSiteGetQuery, useSiteDeleteMutation } from '../../../store/services/SiteLaboratories';
import { useDispatch, useSelector } from "react-redux";
import { startloading, endloading } from '../../../store/loader/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import { useFormik } from "formik";
import * as Yup from "yup";
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import { formatDate } from "../../../helpers/format_date";
import Swal from 'sweetalert2'
import { exportToExcel } from '../../../helpers/ExcelDownload';

const Sites = props => {

    const toastRef = useRef();

    const modalRef = useRef();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const studyInformation = useSelector(state => state.rootReducer.Study);

    const [skip, setSkip] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [siteId, setSiteId] = useState(0);

    const dispatch = useDispatch();

    const { data: apiData, apiError, apiIsLoading } = useSiteGetQuery(siteId, {
        skip, refetchOnMountOrArgChange: true
    });

    const siteUpdate = (id) => {
        dispatch(startloading());
        setSiteId(id);
        setSkip(false);
    };

    const [siteDelete] = useSiteDeleteMutation();

    const siteDeleteHandle = (id) => {
        Swal.fire({
            title: props.t("You will not be able to recover this site!"),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            closeOnConfirm: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    dispatch(startloading());
                    var deleteData = {
                        id: id,
                        userid: userInformation.userId,
                        tenantid: userInformation.tenantId,
                        studyId: studyInformation.studyId,
                        code: '',
                        name: '',
                        countrycode: '',
                        countryname: '',
                        maxenrolmentcount: 0,
                    };
                    const response = await siteDelete(deleteData);
                    if (response.data.isSuccess) {
                        dispatch(endloading());
                        Swal.fire(response.data.message, '', 'success');
                    } else {
                        dispatch(endloading());
                        Swal.fire(response.data.message, '', 'error');
                    }
                } catch (error) {
                    dispatch(endloading());
                    Swal.fire('An error occurred', '', 'error');
                }
            }
        });
    };

    useEffect(() => {
        if (!apiIsLoading && !apiError && apiData) {
            validationType.setValues({
                id: apiData.id,
                userid: userInformation.userId,
                tenantid: userInformation.tenantId,
                studyId: studyInformation.studyId,
                code: apiData.code,
                name: apiData.name,
                countrycode: apiData.countryCode,
                countryname: apiData.countryName,
                maxenrolmentcount: apiData.maxEnrolmentCount,
            });
            setSkip(true);
            modalRef.current.tog_backdrop();
            dispatch(endloading());
        } else if (!apiIsLoading && apiError) {
            dispatch(endloading());
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
        }
    }, [apiData, apiError, apiIsLoading]);

    const getActions = (id) => {
        const actions = (
            <div className="icon-container">
                <div title={props.t("Update")} className="icon icon-update" onClick={() => { siteUpdate(id) }}></div>
                <div title={props.t("Delete")} className="icon icon-delete" onClick={() => { siteDeleteHandle(id) } }></div>
            </div>);
        return actions;
    };

    const data = {
        columns: [
            {
                label: props.t("Site Name"),
                field: "siteFullName",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Site no"),
                field: "code",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Country code"),
                field: "countryCode",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Country"),
                field: "countryName",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Number of subjects that can be added to the center"),
                field: "maxEnrolmentCount",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Last updated on"),
                field: "updatedAt",
                sort: "asc",
                width: 150
            },
            {
                label: props.t('Actions'),
                field: 'actions',
                sort: 'disabled',
                width: 100,
            }
        ],
        rows: tableData
    }

    const [triggerSites, resultSites] = useLazySiteListGetQuery();
    const { data: siteData, error, isLoading } = resultSites;

    useEffect(() => {
        if (studyInformation.studyId) {
            triggerSites(studyInformation.studyId);
        }
    }, [studyInformation.studyId])

    useEffect(() => {
        dispatch(startloading());
        if (!isLoading && !error && siteData) {
            const updatedSiteData = siteData.map(item => {
                return {
                    ...item,
                    updatedAt: formatDate(item.updatedAt),
                    actions: getActions(item.id)
                };
            });
            setTableData(updatedSiteData);
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(endloading());
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
        }else {
            dispatch(endloading());
        }
    }, [siteData, error, isLoading]);

    const [siteSaveOrUpdate] = useSiteSaveOrUpdateMutation();

    const resetValue = () => {
        validationType.validateForm().then(errors => {
            validationType.setErrors({});
            validationType.resetForm();
        });
        setSiteId(0);
    };

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: siteId,
            userid: userInformation.userId,
            tenantid: userInformation.tenantId,
            studyId: studyInformation.studyId,
            code: '',
            name: '',
            countrycode: '',
            countryname: '',
            maxenrolmentcount: 0,
        },
        validationSchema: Yup.object().shape({
            code: Yup.string().required(
                props.t("This field is required")
            ),
            name: Yup.string().required(
                props.t("This field is required")
            ),
        }),
        onSubmit: async (values) => {
            dispatch(startloading());
            const response = await siteSaveOrUpdate(values);
            if (response.data.isSuccess) {
                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: true
                });

                modalRef.current.tog_backdrop();
                dispatch(endloading());
            } else {
                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: false
                });
                dispatch(endloading());
            }
        }
    });

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col md={8}>
                                <h6 className="page-title">{props.t("Site list")}</h6>
                            </Col>

                            <Col md="4">
                                <div className="float-end d-none d-md-block">
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={() => exportToExcel({
                                            headers: [
                                                props.t("Site Name"),
                                                props.t("Site No"),
                                                "Country Code",
                                                props.t("Country"),
                                                props.t("Number of subjects that can be added to the center"),
                                                props.t("Last Updated On"),
                                            ],
                                            rows: tableData.map(item => [
                                                item.siteFullName,
                                                item.code,
                                                item.countryCode,
                                                item.countryName,
                                                item.maxEnrolmentCount,
                                                item.updatedAt,
                                            ])
                                        },
                                        studyInformation.studyName + " - " + props.t("Site list"),
                                        studyInformation.studyName + " - " + props.t("Site list")
                                        )}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-download" /> {props.t("Excel Download")}
                                    </Button>
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={() => modalRef.current.tog_backdrop()}
                                        style={{marginLeft:"10px"} }
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-plus" /> {props.t("Add a site")}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <MDBDataTable
                                        paginationLabel={[props.t("Previous"), props.t("Next")]}
                                        entriesLabel={props.t("Show entries")}
                                        searchLabel={props.t("Search")}
                                        noRecordsFoundLabel={props.t("No matching records found")}
                                        hover responsive striped bordered data={data} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalComp
                refs={modalRef}
                title={siteId === 0 ? props.t("Add a site") : props.t("Update site")}
                body={
                    <>
                        <Alert color="warning">
                            {props.t("If there is no specific subject limit for the site, please enter zero for the subject number. If you have a certain patient limit for the center, please enter numerically.")}
                        </Alert>
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                validationType.handleSubmit();
                                return false;
                            }}>
                            <div className="row">
                                <div className="mb-3 col-md-3">
                                    <Label className="form-label">{props.t("Site no")}</Label>
                                    <Input
                                        name="code"
                                        placeholder=""
                                        type="text"
                                        onChange={validationType.handleChange}
                                        onBlur={(e) => {
                                            validationType.handleBlur(e);
                                        }}
                                        value={validationType.values.code || ""}
                                        invalid={
                                            validationType.touched.code && validationType.errors.code ? true : false
                                        }
                                    />
                                    {validationType.touched.code && validationType.errors.code ? (
                                        <FormFeedback type="invalid">{validationType.errors.code}</FormFeedback>
                                    ) : null}
                                </div>
                                <div className="mb-3 col-md-9">
                                    <Label className="form-label">{props.t("Site name")}</Label>
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
                            </div>
                            <div className="row">
                                <div className="mb-3 col-md-3">
                                    <Label>{props.t("Country code")}</Label>
                                    <Input
                                        name="countrycode"
                                        type="text"
                                        placeholder=""
                                        onChange={validationType.handleChange}
                                        onBlur={(e) => {
                                            validationType.handleBlur(e);
                                        }}
                                        value={validationType.values.countrycode || ""}
                                    />
                                </div>
                                <div className="mb-3 col-md-9">
                                    <Label>{props.t("Country")}</Label>
                                    <Input
                                        name="countryname"
                                        type="text"
                                        placeholder=""
                                        onChange={validationType.handleChange}
                                        onBlur={(e) => {
                                            validationType.handleBlur(e);
                                        }}
                                        value={validationType.values.countryname || ""}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <Label>{props.t("Number of subjects that can be added to the center")}</Label>
                                <Input
                                    name="maxenrolmentcount"
                                    label="Digits"
                                    placeholder=""
                                    type="number"
                                    onChange={validationType.handleChange}
                                    onBlur={validationType.handleBlur}
                                    value={validationType.values.maxenrolmentcount || 0}
                                    invalid={
                                        validationType.touched.maxenrolmentcount && validationType.errors.maxenrolmentcount ? true : false
                                    }
                                />
                                {validationType.touched.maxenrolmentcount && validationType.errors.maxenrolmentcount ? (
                                    <FormFeedback type="invalid">{validationType.errors.maxenrolmentcount}</FormFeedback>
                                ) : null}
                            </div>
                        </Form>
                    </>
                }
                resetValue={resetValue}
                handle={() => validationType.handleSubmit()}
                buttonText={siteId === 0 ? props.t("Save") : props.t("Update") }
            />
            <ToastComp
                ref={toastRef}
            />
        </React.Fragment>
    );
};


Sites.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Sites);