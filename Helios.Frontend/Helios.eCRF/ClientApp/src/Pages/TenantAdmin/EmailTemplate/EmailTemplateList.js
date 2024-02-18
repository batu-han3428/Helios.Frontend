import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { withTranslation } from "react-i18next";
import { formatDate } from "../../../helpers/format_date";
import { useSelector, useDispatch } from 'react-redux';
import { startloading, endloading } from '../../../store/loader/actions';
import { MDBDataTable } from "mdbreact";
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from "react-router-dom";
import { useLazyEmailTemplateListGetQuery, useEmailTemplateDeleteMutation } from '../../../store/services/EmailTemplate';
import Swal from 'sweetalert2';
import templateTypeItems from './TemplateTypeItems';


const EmailTemplateList = props => {

    const toastRef = useRef();

    const location = useLocation();

    useEffect(() => {
        if (location.state !== null) {
            toastRef.current.setToast({
                message: location.state.message,
                stateToast: location.state.state
            });
        }
    }, []);

    const userInformation = useSelector(state => state.rootReducer.Login);

    const studyInformation = useSelector(state => state.rootReducer.Study);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [tableData, setTableData] = useState([]);
    
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
                <div title={props.t("Update")} className="icon icon-update" onClick={() => addOrUpdateTemplate(item.id)}></div>
                <div title={props.t("Delete")} className="icon icon-delete" onClick={() => deleteTemplate(item.id)}></div>
            </div>);
        return actions;
    };

    const data = {
        columns: [
            {
                label: props.t("Template header"),
                field: "name",
                sort: "asc",
                width: 500
            },
            {
                label: props.t("Template type"),
                field: "templateType",
                sort: "asc",
                width: 50
            },
            {
                label: props.t("Created on"),
                field: "createdAt",
                sort: "asc",
                width: 50
            },
            {
                label: props.t("Last updated on"),
                field: "updatedAt",
                sort: "asc",
                width: 50
            },
            {
                label: props.t('Actions'),
                field: 'actions',
                sort: 'disabled',
                width: 50
            }
        ],
        rows: tableData
    }

    const [trigger, { data: emailTemplateData, isLoading, isError }] = useLazyEmailTemplateListGetQuery();

    useEffect(() => {
        if (studyInformation.studyId) {
            trigger(studyInformation.studyId);
        }
    }, [studyInformation.studyId]) 

    useEffect(() => {
        dispatch(startloading());
        if (emailTemplateData && !isLoading && !isError) {
            const updatedEmailTemplateData = emailTemplateData.map(item => {
                return {
                    ...item,
                    templateType: props.t(templateTypeItems.find(e => e.value === item.templateType).label) || "",
                    createdAt: formatDate(item.createdAt),
                    updatedAt: formatDate(item.updatedAt),
                    actions: getActions(item)
                };
            });

            setTableData(updatedEmailTemplateData);

            const timer = setTimeout(() => {
                generateInfoLabel();
            }, 10)

            dispatch(endloading());

            return () => clearTimeout(timer);
        } else if (isError && !isLoading) {
            dispatch(endloading());
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
        }
    }, [emailTemplateData, isError, isLoading, props.t]);

    const addOrUpdateTemplate = (templateId = "") => {
        if (templateId !== "") {
            navigate(`/set-email-templates/${studyInformation.studyId}/${templateId}`);
        } else {
            navigate(`/set-email-templates/${studyInformation.studyId}`);
        }
    }

    const [emailTemplateDelete] = useEmailTemplateDeleteMutation();

    const deleteTemplate = (id) => {
        Swal.fire({
            title: props.t("This template will be deleted."),
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
                    const response = await emailTemplateDelete({
                        id: id,
                        userId: userInformation.userId,
                        tenantId: userInformation.tenantId
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
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom: "5px" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t("Template list")}</h6>
                            </Col>
                            <Col md="4">
                                <div className="float-end d-none d-md-block">
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={()=>addOrUpdateTemplate()}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-plus" /> {props.t("Add a template")}
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
                                        hover
                                        responsive
                                        striped
                                        bordered
                                        data={data}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <ToastComp
                ref={toastRef}
            />
        </React.Fragment>
    );
};


EmailTemplateList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(EmailTemplateList);