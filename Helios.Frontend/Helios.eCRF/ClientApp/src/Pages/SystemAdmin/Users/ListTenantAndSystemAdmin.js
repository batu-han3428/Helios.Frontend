import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next";
import { Row, Col, Button, Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MDBDataTable } from "mdbreact";
import ModalComp from "../../../components/Common/ModalComp/ModalComp";
import AddOrUpdateTenantAndSystemAdmin from "./AddOrUpdateTenantAndSystemAdmin";
import ToastComp from "../../../components/Common/ToastComp/ToastComp";
import { useSelector, useDispatch } from 'react-redux';
import { useSystemAdminResetPasswordMutation } from '../../../store/services/SystemAdmin/SystemAdmin';
import { useLazyUserListGetQuery, useUserActivePassiveMutation } from '../../../store/services/SystemAdmin/Users/SystemUsers';
import { startloading, endloading } from '../../../store/loader/actions';
import Swal from 'sweetalert2';
import { countryNumber } from "../../../helpers/phonenumber_helper";
import DeleteTenantAndSystemAdmin from "./DeleteTenantAndSystemAdmin";
import { createPortal } from 'react-dom'

const ListTenantAndSystemAdmin = props => {

    const toastRef = useRef();

    const modalRef = useRef();

    const modalContentRef = useRef();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");
    const [table, setTable] = useState([]);
    const [modalContent, setModalContent] = useState(null);

    const toastHandle = (message, state) => {
        toastRef.current.setToast({
            message: message,
            stateToast: state
        });
    }

    const addSystemAdmin = () => {
        setModalContent(<AddOrUpdateTenantAndSystemAdmin isAdd={true} userId={userInformation.userId} refs={modalContentRef} toast={toastHandle} />);
        setModalTitle(props.t("Add an admin"));
        setModalButtonText(props.t("Save"));
        modalRef.current.tog_backdrop();
    }

    const updateUser = (item) => {
        if (!item.isActive) {
            toastRef.current.setToast({
                message: props.t("Please activate the account first and then try this process again."),
                stateToast: false
            });
            return;
        }
        setModalContent(<AddOrUpdateTenantAndSystemAdmin isAdd={false} userData={item} userId={userInformation.userId} refs={modalContentRef} toast={toastHandle} />);
        setModalTitle(props.t("Update"));
        setModalButtonText(props.t("Update"));
        modalRef.current.tog_backdrop();
    };

    const getActions = (item) => {
        const actions = (
            <div className="icon-container">
                <div title={props.t("Update")} className="icon icon-update" onClick={() => { updateUser(item) }}></div>
                <div title={props.t("Active or passive")} className="icon icon-lock" onClick={() => { activePassiveUser(item) }}></div>
{/*                <div title={props.t("Delete")} className="icon icon-delete" onClick={() => { deleteOrActivePassiveUser(item, true) }}></div>*/}
                <div title={props.t("Send a new password")} className="icon icon-resetpassword" onClick={() => { resetPasswordUser(item) }}></div>
            </div>);
        return actions;
    };

    const data = {
        columns: [
            {
                label: props.t("Name"),
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
                label: props.t("e-Mail"),
                field: "email",
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
                label: props.t("Phone number"),
                field: "phoneNumber",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Roles"),
                field: "roles",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Tenants"),
                field: "tenants",
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
        rows: table
    }

    const [dropdownOpen, setDropdownOpen] = useState({});

    const toggle = (userId) => {
        setDropdownOpen(prevState => {
            return {
                ...prevState,
                [userId]: !prevState[userId]
            };
        });
    };

    const getRolesDropdown = (roles, userId) => {
        const rolesDropdown = (
            <Dropdown isOpen={dropdownOpen[userId]} toggle={() => toggle(userId)}>
                <DropdownToggle caret>
                    {props.t("Roles")}
                </DropdownToggle>
                <DropdownMenu>
                    {roles.map((item, index) => (
                        <DropdownItem key={index} disabled>{item.roleName}</DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        );
        return rolesDropdown;
    }

    const [dropdownTenantOpen, setDropdownTenantOpen] = useState({});

    const toggleTenant = (userId) => {
        setDropdownTenantOpen(prevState => {
            return {
                ...prevState,
                [userId]: !prevState[userId]
            };
        });
    };

    const getTenantsDropdown = (tenants, userId) => {
        const tenantsDropdown = (
            <Dropdown isOpen={dropdownTenantOpen[userId]} toggle={() => toggleTenant(userId)}>
                <DropdownToggle caret>
                    {props.t("Tenants")}
                </DropdownToggle>
                <DropdownMenu>
                    {tenants.map((item, index) => (
                        <DropdownItem key={index} disabled>{item.name}</DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        );
        return tenantsDropdown;
    }

    const [trigger, { data: usersData, error, isLoading }] = useLazyUserListGetQuery();

    useEffect(() => {
        if (userInformation.userId) {
            trigger(userInformation.userId);
        }
    }, [userInformation.userId]) 

    useEffect(() => {
        dispatch(startloading());
        if (!isLoading && !error && usersData) {
            const updatedUsersData = usersData.map(item => {
                return {
                    ...item,
                    isActive: item.isActive ? props.t("Active") : props.t("Passive"),
                    phoneNumber: item.phoneNumber ? countryNumber(item.phoneNumber) : "",
                    roles: item.roles !== null && item.roles.length > 0 ? getRolesDropdown(item.roles, item.id) : "",
                    tenants: item.tenants !== null && item.tenants.length > 0 ? getTenantsDropdown(item.tenants, item.id) : "",
                    actions: getActions(item)
                };
            });
            setTable(updatedUsersData);

            dispatch(endloading());
        } else if (!isLoading && error) {
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }, [usersData, error, isLoading, dropdownOpen, dropdownTenantOpen]);

    const [systemAdminResetPassword] = useSystemAdminResetPasswordMutation();

    const resetPasswordUser = async (item) => {
        try {
            dispatch(startloading());
            if (!item.isActive) {
                dispatch(endloading());
                toastRef.current.setToast({
                    message: props.t("Please activate the account first and then try this process again."),
                    stateToast: false
                });
                return;
            }
            const response = await systemAdminResetPassword({
                id: item.id,
                userId: userInformation.userId,
                email: item.email,
                language: props.i18n.language
            });
            if (response.data.isSuccess) {
                dispatch(endloading());
                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: true
                });
            } else {
                dispatch(endloading());
                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: false
                });
            }
        } catch (error) {
            dispatch(endloading());
            toastRef.current.setToast({
                message: props.t("An error occurred while processing your request."),
                stateToast: false
            });
        }
    }

    const [userActivePassive] = useUserActivePassiveMutation();

    const activePassiveUser = (item) => {
        console.log(item)
        Swal.fire({
            title: props.t("You will not be able to recover this site!"),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    dispatch(startloading());
                    const response = await userActivePassive({
                        id: item.id,
                        userId: userInformation.userId,
                        roleIds: item.roles.length > 0 ? item.roles.map(x => x.roleId) : [],
                        tenantIds: item.tenants.length > 0 ? item.tenants.map(x=> x.id) : []
                    });
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
    }

    const [swalShown, setSwalShown] = useState({ show: false, value: null, isDropdown: true, isDelete: true })
    const [deleteOrActivePassiveSubmit, setDeleteOrActivePassiveSubmit] = useState(false);

    const deleteOrActivePassiveUser = (item, isDelete) => {

        const newItem = { ...item, userId: userInformation.userId };

        let isDropdown = true;
        if ((newItem.roles && newItem.roles.length === 1 && newItem.roles[0].roleId === 2) || (newItem.roles && newItem.roles.length === 1 && newItem.roles[0].roleId === 3 && newItem.tenants && newItem.tenants.length === 1)) {
            isDropdown = false;
        }

        Swal.fire({
            title: isDropdown ? isDelete ? props.t("Please select which account of the user you want to delete.") : props.t("Please select which account of the user you want to active/passive.") : isDelete ? props.t("You will not be able to recover this user!") : props.t("User active/passive status will be changed."),
            icon: "warning",
            html: '<div id="custom-container"></div>',
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel"),
            didOpen: () => {
                const customContainer = document.getElementById('custom-container');
                if (customContainer) {
                    const swalContainer = document.getElementById('swal2-html-container');
                    if (swalContainer) {
                        swalContainer.style.overflowX = 'hidden';
                    }
                    customContainer.style.display = 'block';
                    setSwalShown({ show: true, value: newItem, isDropdown: isDropdown, isDelete: isDelete });
                }
            },
            didClose: () => {
                setSwalShown({ show: false, value: null, isDropdown: true, isDelete: true });
                setDeleteOrActivePassiveSubmit(false);
            },
            preConfirm: () => {
                setDeleteOrActivePassiveSubmit(true);
                return false;
            },
        });
    }

    const swalClose = (isSuccess, message) => {
        setSwalShown({ show: false, value: null, isDropdown: true, isDelete: true });
        setDeleteOrActivePassiveSubmit(false);
        if (isSuccess) {
            Swal.fire({
                title: "",
                text: message,
                icon: "success",
                confirmButtonText: props.t("Ok"),
            });
        } else {
            dispatch(endloading());
            Swal.fire({
                title: "",
                text: message,
                icon: "error",
                confirmButtonText: props.t("OK"),
            });
        }
    }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom: "5px" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t("Add an admin")}</h6>
                            </Col>
                            <Col md="4">
                                <div className="float-end d-none d-md-block" style={{ marginLeft: "10px" }}>
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={addSystemAdmin}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-plus" /> {props.t("Add an admin")}
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
            <ModalComp
                refs={modalRef}
                title={modalTitle}
                body={modalContent}
                buttonText={modalButtonText}
                isButton={true}
            />
            <ToastComp
                ref={toastRef}
            />
            {swalShown.show &&
                createPortal(
                    <DeleteTenantAndSystemAdmin swalClose={swalClose} swalShown={swalShown} submit={deleteOrActivePassiveSubmit} />
                    , document.getElementById('custom-container') || document.body
                )
            }
        </>
    )
};

ListTenantAndSystemAdmin.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(ListTenantAndSystemAdmin);