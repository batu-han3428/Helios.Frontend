import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next";
import { Row, Col, Button, Card, CardBody } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from 'antd';
import ModalComp from "../../../components/Common/ModalComp/ModalComp";
import AddOrUpdateSystemAdmin from "./AddOrUpdateSystemAdmin";
import { useSelector, useDispatch } from 'react-redux';
import { useSystemAdminListGetQuery, useSystemAdminActivePassiveMutation, useSystemAdminResetPasswordMutation, useSystemAdminDeleteMutation } from '../../../store/services/SystemAdmin/SystemAdmin';
import { startloading, endloading } from '../../../store/loader/actions';
import Swal from 'sweetalert2';
import { countryNumber } from "../../../helpers/phonenumber_helper";
import { showToast } from "../../../store/toast/actions";


const ListSystemAdmin = props => {

    const modalRef = useRef();

    const modalContentRef = useRef();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");
    const [modalContent, setModalContent] = useState(null);
    const [table, setTable] = useState([]);


    const addSystemAdmin = () => {
        setModalContent(<AddOrUpdateSystemAdmin isAdd={true} userId={userInformation.userId} userControl={true} refs={modalContentRef} />);
        setModalTitle(props.t("Add a system admin"));
        setModalButtonText(props.t("Save"));
        modalRef.current.tog_backdrop();
    }

    const updateSystemAdmin = (item) => {
        if (!item.isActive) {
            dispatch(showToast(props.t("Please activate the account first and then try this process again."), true, false));
            return;
        }
        setModalContent(<AddOrUpdateSystemAdmin isAdd={false} userData={item} userId={userInformation.userId} userControl={false} refs={modalContentRef} />);
        setModalTitle(props.t("Update"));
        setModalButtonText(props.t("Update"));
        modalRef.current.tog_backdrop();
    };

    const getActions = (item) => {
        const actions = (
            <div className="icon-container">
                <div title={props.t("Update")} className="icon icon-update" onClick={() => { updateSystemAdmin(item) }}></div>
                <div title={props.t("Active or passive")} className="icon icon-lock" onClick={() => { activePassiveUser(item) }}></div>
      {/*          <div title={props.t("Delete")} className="icon icon-delete" onClick={() => { deleteUser(item) }}></div>*/}
                <div title={props.t("Send a new password")} className="icon icon-resetpassword" onClick={() => { resetPasswordUser(item) }}></div>
            </div>);
        return actions;
    };

    const data = {
        columns: [
            {
                title: props.t('Name'),
                dataIndex: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Last Name'),
                dataIndex: 'lastName',
                sorter: (a, b) => a.lastName.localeCompare(b.lastName),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('e-Mail'),
                dataIndex: 'email',
                sorter: (a, b) => a.email.localeCompare(b.email),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('State'),
                dataIndex: 'isActive',
                sorter: (a, b) => a.isActive.localeCompare(b.isActive),
                sortDirections: ['ascend', 'descend'],
                render: (text, record) => (
                    <span style={{ color: record.isActive === props.t("Active") ? 'green' : 'red' }}>
                        {record.isActive}
                    </span>
                ),
            },
            {
                title: props.t('Phone number'),
                dataIndex: 'phoneNumber',
                sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Actions'),
                dataIndex: 'actions',
                width: "170px",
            },
        ],
        rows: table
    }  

    const { data: usersData, error, isLoading } = useSystemAdminListGetQuery();

    useEffect(() => {
        dispatch(startloading());
        if (!isLoading && !error && usersData) {
            const updatedUsersData = usersData.map(item => {
                return {
                    ...item,
                    isActive: item.isActive ? props.t("Active") : props.t("Passive"),
                    phoneNumber: item.phoneNumber ? countryNumber(item.phoneNumber) : "",
                    actions: getActions(item)
                };
            });
            setTable(updatedUsersData);

            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }, [usersData, error, isLoading]);

    const [systemAdminActivePassive] = useSystemAdminActivePassiveMutation();

    const activePassiveUser = (item) => {
        Swal.fire({
            title: props.t("User active/passive status will be changed."),
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
                    const response = await systemAdminActivePassive({
                        id: item.id,
                        userId: userInformation.userId,
                        email: item.email
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

    const [systemAdminResetPassword] = useSystemAdminResetPasswordMutation(); 

    const resetPasswordUser = async (item) => {
        try {
            dispatch(startloading());
            if (!item.isActive) {
                dispatch(endloading());
                dispatch(showToast(props.t("Please activate the account first and then try this process again."), true, false));
                return;
            }
            const response = await systemAdminResetPassword({
                id: item.id,
                userId: userInformation.userId,
                email: item.email,
                language: props.i18n.language
            });
            dispatch(endloading());
            dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
        } catch (error) {
            dispatch(endloading());
            dispatch(showToast(props.t("An error occurred while processing your request."), true, false));
        }
    }

    const [systemAdminDelete] = useSystemAdminDeleteMutation();

    const deleteUser = (item) => {
        Swal.fire({
            title: props.t("You will not be able to recover this user!"),
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
                    const response = await systemAdminDelete({
                        id: item.id,
                        userId: userInformation.userId,
                        email: item.email
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
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom: "5px" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t("Add system admin")}</h6>
                            </Col>
                            <Col md="4">
                                <div className="float-end d-none d-md-block" style={{ marginLeft: "10px" }}>
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={addSystemAdmin}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-plus" /> {props.t("Add a system admin")}
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
            <ModalComp
                refs={modalRef}
                title={modalTitle}
                body={modalContent}
                buttonText={modalButtonText}
                isButton={true}
                size="lg"
            />
        </>
    )
};

ListSystemAdmin.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(ListSystemAdmin);