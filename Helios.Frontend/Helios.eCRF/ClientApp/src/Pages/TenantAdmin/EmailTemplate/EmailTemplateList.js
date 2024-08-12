import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { withTranslation } from "react-i18next";
import { formatDate } from "../../../helpers/format_date";
import { useSelector, useDispatch } from 'react-redux';
import { startloading, endloading } from '../../../store/loader/actions';
import { Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from "react-router-dom";
import { useLazyEmailTemplateListGetQuery, useEmailTemplateDeleteMutation } from '../../../store/services/EmailTemplate';
import Swal from 'sweetalert2';
import templateTypeItems from './TemplateTypeItems';
import { showToast } from '../../../store/toast/actions';


const EmailTemplateList = props => {

    const location = useLocation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (location.state !== null) {
            dispatch(showToast(location.state.message, true, location.state.state));
        }
    }, []);

    const userInformation = useSelector(state => state.rootReducer.Login);

    const studyInformation = useSelector(state => state.rootReducer.Study);

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
                title: props.t('Template header'),
                dataIndex: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Template type'),
                dataIndex: 'templateType',
                sorter: (a, b) => a.templateType.localeCompare(b.templateType),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Created on'),
                dataIndex: 'createdAt',
                sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Last updated on'),
                dataIndex: 'updatedAt',
                sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Actions'),
                dataIndex: 'actions',
                width: "170px",
            },
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
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
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
                                   
                                    <Table
                                        dataSource={data.rows.map(item => ({ ...item, key: item.id }))}
                                        columns={data.columns}
                                        pagination={true}
                                        scroll={{ x: 'max-content' }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};


EmailTemplateList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(EmailTemplateList);