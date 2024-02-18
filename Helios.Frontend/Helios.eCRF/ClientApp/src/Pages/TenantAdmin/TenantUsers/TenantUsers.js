import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import {
    Row, Col, Card, CardBody, FormFeedback, Label, Input, Form, Button
} from "reactstrap";
import { withTranslation } from "react-i18next";
import {
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane
} from 'mdb-react-ui-kit';
import "./tenantusers.css";
import { useLazyTenantUserListGetQuery, useTenantUserSetMutation } from '../../../store/services/TenantUsers';
import { formatDate } from "../../../helpers/format_date";
import { useSelector, useDispatch } from 'react-redux';
import { startloading, endloading } from '../../../store/loader/actions';
import { MDBDataTable } from "mdbreact";
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import * as Yup from "yup";
import { useFormik } from "formik";
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import { exportToExcel } from '../../../helpers/ExcelDownload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const TenantUsers = props => {

    const toastRef = useRef();

    const modalRef = useRef();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const [liveTableData, setLiveTableData] = useState([]);
    const [demoTableData, setDemoTableData] = useState([]);
    const [basicActive, setBasicActive] = useState('tab1');
    const [excelData, setExcelData] = useState([]);

    const handleBasicClick = (value) => {
        if (value === basicActive) {
            return;
        }

        setBasicActive(value);
    };

    const generateInfoLabel = () => {
        var infoDiv = document.querySelector('.dataTables_info');
        var infoText = infoDiv.innerHTML;
        let words = infoText.split(" ");
        if (words[0] === "Showing") {
            let from = words[1];
            let to = words[3];
            let total = words[5];
            if (words[1] === "0") {
                from = "0";
                to = "0";
                total = "0";
            }
            infoDiv.innerHTML = props.t("Showing entries").replace("{from}", from).replace("{to}", to).replace("{total}", total);
        } else {
            let from = words[2];
            let to = words[4];
            let total = words[0];
            if (words[0] === "0") {
                from = "0";
                to = "0";
                total = "0";
            }
            infoDiv.innerHTML = props.t("Showing entries").replace("{from}", from).replace("{to}", to).replace("{total}", total);
        }
    };

    const getActions = (item) => {
        const actions = (
            <div className="icon-container">
                <div title={props.t("Update")} className="icon icon-update" onClick={() => { updateTenantUser(item) }}></div>
            </div>);
        return actions;
    };

    const liveData = {
        columns: [
            {
                label: props.t("First name"),
                field: "name",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Last name"),
                field: "lastName",
                sort: "asc",
                width: 150
            },
            {
                label: "Email",
                field: "email",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Study name"),
                field: "studyName",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Created on"),
                field: "createdOn",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Last updated on"),
                field: "lastUpdatedOn",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("State"),
                field: "isActive",
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
        rows: liveTableData
    }

    const demoData = {
        columns: [
            {
                label: props.t("First name"),
                field: "name",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Last name"),
                field: "lastName",
                sort: "asc",
                width: 150
            },
            {
                label: "Email",
                field: "email",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Study name"),
                field: "studyName",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Created on"),
                field: "createdOn",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Last updated on"),
                field: "lastUpdatedOn",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("State"),
                field: "isActive",
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
        rows: demoTableData
    }

    const [triggerTenantUsers, resultTenantUsers] = useLazyTenantUserListGetQuery();
    const { data: tenantUsersData, error, isLoading } = resultTenantUsers;

    useEffect(() => {
        if (userInformation.tenantId) {
            triggerTenantUsers(userInformation.tenantId);
        }
    }, [userInformation.tenantId])

    useEffect(() => {
        dispatch(startloading());
        if (tenantUsersData && !isLoading && !error) {
            const updatedTenantUsersData = tenantUsersData.map(item => {
                return {
                    ...item,
                    createdOn: formatDate(item.createdOn),
                    lastUpdatedOn: formatDate(item.lastUpdatedOn),
                    isActive: item.isActive ? props.t("Active") : props.t("Passive"),
                    actions: getActions(item)
                };
            });
            const demoTable = updatedTenantUsersData.filter(item => item.studyDemoLive === true);
            const liveTable = updatedTenantUsersData.filter(item => item.studyDemoLive === false);
            setDemoTableData(demoTable);
            setLiveTableData(liveTable);

            const data = updatedTenantUsersData.map(updatedUser => {
                return [
                    updatedUser.name,
                    updatedUser.lastName,
                    updatedUser.email,
                    updatedUser.studyName,
                    updatedUser.createdOn,
                    updatedUser.lastUpdatedOn,
                    updatedUser.isActive,
                ];
            });

            setExcelData(data);

            const timer = setTimeout(() => {
                generateInfoLabel();
            }, 10)

            dispatch(endloading());

            return () => clearTimeout(timer);
        } else if (!isLoading && error) {
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }, [tenantUsersData, error, isLoading, props.t]);

    const [tenantUserSet] = useTenantUserSetMutation();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            authUserId: "",
            userid: userInformation.userId,
            tenantid: userInformation.tenantId,
            studyId: "",
            name: "",
            lastname: "",
            email: ""
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(
                props.t("This field is required")
            ),
            lastname: Yup.string().required(
                props.t("This field is required")
            ),
            email: Yup.string().required(
                props.t("This field is required")
            ).email(props.t("Invalid email format")),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(startloading());
                const response = await tenantUserSet(values);
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
            } catch (e) {
                dispatch(endloading());
            }
        }
    });

    const updateTenantUser = (item) => {
        validationType.setValues({
            authUserId: item.authUserId,
            userid: userInformation.userId,
            tenantid: userInformation.tenantId,
            studyId: item.studyId,
            name: item.name,
            lastname: item.lastName,
            email: item.email
        });
        modalRef.current.tog_backdrop();
    };

    const resetValue = () => {
        validationType.validateForm().then(errors => {
            validationType.setErrors({});
            validationType.resetForm();
        });
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom: "5px" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t("User list")}</h6>
                            </Col>
                            <Col md="4">
                                <div className="float-end d-none d-md-block">
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={() => exportToExcel({
                                            headers: [
                                                props.t("First name"),
                                                props.t("Last name"),
                                                "Email",
                                                props.t("Study name"),
                                                props.t("Created on"),
                                                props.t("Last updated on"),
                                                props.t("State")
                                            ],
                                            rows: excelData
                                        },
                                        props.t("User list"),
                                        props.t("User list")
                                        )}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-download" /> {props.t("Excel Download")}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>
                                    <MDBTabs className='mb-3'>
                                        <MDBTabsItem>
                                            <MDBTabsLink onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
                                                {props.t("Live studies")}
                                            </MDBTabsLink>
                                        </MDBTabsItem>
                                        <MDBTabsItem>
                                            <MDBTabsLink onClick={() => handleBasicClick('tab2')} active={basicActive === 'tab2'}>
                                                {props.t("Demo studies")}
                                            </MDBTabsLink>
                                        </MDBTabsItem>
                                    </MDBTabs>

                                    <MDBTabsContent>
                                        <MDBTabsPane show={basicActive === 'tab1'}>
                                            <MDBDataTable
                                                paginationLabel={[props.t("Previous"), props.t("Next")]}
                                                entriesLabel={props.t("Show entries")}
                                                searchLabel={props.t("Search")}
                                                noRecordsFoundLabel={props.t("No matching records found")}
                                                hover
                                                responsive
                                                striped
                                                bordered
                                                data={liveData}
                                            />
                                        </MDBTabsPane>
                                        <MDBTabsPane show={basicActive === 'tab2'}>
                                            <MDBDataTable
                                                paginationLabel={[props.t("Previous"), props.t("Next")]}
                                                entriesLabel={props.t("Show entries")}
                                                searchLabel={props.t("Search")}
                                                noRecordsFoundLabel={props.t("No matching records found")}
                                                hover
                                                responsive
                                                striped
                                                bordered
                                                data={demoData}
                                            />
                                        </MDBTabsPane>
                                        </MDBTabsContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalComp
                refs={modalRef}
                title={props.t("Update user")}
                body={
                    <>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            validationType.handleSubmit();
                            return false;
                        }}>
                        <div className="row">
                            <div className="mb-3 col-md-3">
                                <Label className="form-label">{props.t("First name")}</Label>
                                <Input
                                    name="name"
                                    placeholder={props.t("First name")}
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
                            <div className="mb-3 col-md-3">
                                <Label className="form-label">{props.t("Last name")}</Label>
                                <Input
                                    name="lastname"
                                    placeholder={props.t("Last name")}
                                    type="text"
                                    onChange={validationType.handleChange}
                                    onBlur={(e) => {
                                        validationType.handleBlur(e);
                                    }}
                                    value={validationType.values.lastname || ""}
                                    invalid={
                                        validationType.touched.lastname && validationType.errors.lastname ? true : false
                                    }
                                    />
                                    {validationType.touched.lastname && validationType.errors.lastname ? (
                                        <FormFeedback type="invalid">{validationType.errors.lastname}</FormFeedback>
                                    ) : null}
                            </div>
                            <div className="mb-3 col-md-6">
                                <Label className="form-label">{props.t("e-Mail")}</Label>
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
                                {validationType.touched.email && validationType.errors.email ? (
                                        <FormFeedback type="invalid">{validationType.errors.email}</FormFeedback>
                                ) : null}
                            </div>
                        </div>
                    </Form>
                    </>
                }
                resetValue={resetValue}
                handle={() => validationType.handleSubmit()}
                buttonText={props.t("Update")}
            />
            <ToastComp
                ref={toastRef}
            />
        </React.Fragment>
    );
};


TenantUsers.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(TenantUsers);