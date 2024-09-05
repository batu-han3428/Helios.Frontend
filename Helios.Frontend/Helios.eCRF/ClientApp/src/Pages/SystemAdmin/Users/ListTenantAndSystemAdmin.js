import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next";
import { Row, Col, Button, Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table,Input } from 'antd';
import ModalComp from "../../../components/Common/ModalComp/ModalComp";
import AddOrUpdateTenantAdmin from "./AddOrUpdateTenantAdmin";
import { useSelector, useDispatch } from 'react-redux';
import { useSystemAdminResetPasswordMutation } from '../../../store/services/SystemAdmin/SystemAdmin';
import { useLazyUserTenantAdminListGetQuery, useTenantAdminActivePassiveMutation } from '../../../store/services/SystemAdmin/Users/SystemUsers';
import { startloading, endloading } from '../../../store/loader/actions';
import Swal from 'sweetalert2';
import { countryNumber } from "../../../helpers/phonenumber_helper";
import DeleteTenantAndSystemAdmin from "./DeleteTenantAndSystemAdmin";
import { createPortal } from 'react-dom'
import { showToast } from "../../../store/toast/actions";
import { SearchOutlined } from '@ant-design/icons';

const ListTenantAndSystemAdmin = props => {

    const modalRef = useRef();

    const modalContentRef = useRef();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");
    const [table, setTable] = useState([]);
    const [modalContent, setModalContent] = useState(null);

    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);

    };


    const addSystemAdmin = () => {
        setModalContent(<AddOrUpdateTenantAdmin isAdd={true} userControl={true} userId={userInformation.userId} refs={modalContentRef} />);
        setModalTitle(props.t("Add an admin"));
        setModalButtonText(props.t("Save"));
        modalRef.current.tog_backdrop();
    }

    const updateUser = (item) => {
        if (!item.isActive) {
            dispatch(showToast(props.t("Please activate the account first and then try this process again."), true, false));
            return;
        }
        setModalContent(<AddOrUpdateTenantAdmin isAdd={false} userControl={false} userData={item} userId={userInformation.userId} refs={modalContentRef} />);
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
    const [searchname, setSearchname] = useState('');
    const [searchLastname, setSearchLastname] = useState('');
    const [searchemail, setSearchemail] = useState('');
    const [rolesNames, setRolesNames] = React.useState([]);
    const [tenantsNames, setTenantsNames] = React.useState([]);
    const uniqueRolesNames = Array.from(new Set(rolesNames));
    const uniqueTenantsNames = Array.from(new Set(tenantsNames));
    const data = {
        columns: [
            {
                title: props.t('Name'),
                dataIndex: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['ascend', 'descend'],
                filteredValue: [searchname],
                onFilter: (value, record) => String(record.name).toLowerCase().includes(value.toLowerCase()),
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                    return (
                        <div style={{ padding: 8 }}>
                            <Input.Search
                                placeholder="Search name"
                                value={selectedKeys[0]}
                                onChange={(e) => setSearchname(e.target.value)}
                            />
                        </div>
                    );
                },
                filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            },
            {
                title: props.t('Last name'),
                dataIndex: 'lastName',
                sorter: (a, b) => a.lastName.localeCompare(b.lastName),
                sortDirections: ['ascend', 'descend'],
                filteredValue: [searchLastname],
                onFilter: (value, record) => String(record.lastName).toLowerCase().includes(value.toLowerCase()),
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                    return (
                        <div style={{ padding: 8 }}>
                            <Input.Search
                                placeholder="Search lastname"
                                value={selectedKeys[0]}
                                onChange={(e) => setSearchLastname(e.target.value)}
                            />
                        </div>
                    );
                },
                filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            },
            {
                title: props.t('e-Mail'),
                dataIndex: 'email',
                sorter: (a, b) => a.email.localeCompare(b.email),
                sortDirections: ['ascend', 'descend'],
                filteredValue: [searchemail],
                onFilter: (value, record) => String(record.email).toLowerCase().includes(value.toLowerCase()),
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                    return (
                        <div style={{ padding: 8 }}>
                            <Input.Search
                                placeholder="Search email"
                                value={selectedKeys[0]}
                                onChange={(e) => setSearchemail(e.target.value)}
                            />
                        </div>
                    );
                },
                filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
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
                title: props.t('Roles'),
                dataIndex: 'roles',
                sorter: (a, b) => a.userRoles.map(role => role).join(', ').localeCompare(b.userRoles.map(role => role).join(', ')),
                sortDirections: ['ascend', 'descend'],
                filteredValue: filteredInfo.roles || null,
                filters: [{ text: 'Empty', value: [] }, ...uniqueRolesNames.map(item => ({ text: item, value: item }))],                          
                onFilter: (value, record) => {                   
                    const roles = Array.isArray(record.userRoles) ? record.userRoles : [];
                    if (Array.isArray(value) && value.length === 0) {
                        return roles.length === 0;
                    }
                    return roles.some(role => role === value);
                },
            },
            {
                title: props.t('Tenants'),
                dataIndex: 'tenants',
                sorter: (a, b) => a.userTenants.map(tenant => tenant).join(', ').localeCompare(b.userTenants.map(tenant => tenant).join(', ')),
                sortDirections: ['ascend', 'descend'],
                filteredValue: filteredInfo.tenants || null,
                filters: [{ text: 'Empty', value: [] }, ...uniqueTenantsNames.map(item => ({ ...item, text: item, value: item }))],             
                onFilter: (value, record) => {
                    const tenants = Array.isArray(record.userTenants) ? record.userTenants : [];
                    if (Array.isArray(value) && value.length === 0) {
                        return tenants.length === 0;
                    }
                    return tenants.some(tenant => tenant === value);
                },
            },
            {
                title: props.t('Actions'),
                dataIndex: 'actions',
                width: "170px",
            },
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

    const [trigger, { data: usersData, error, isLoading }] = useLazyUserTenantAdminListGetQuery();

    useEffect(() => {
        if (userInformation.userId) {
            trigger(userInformation.userId);
        }
    }, [userInformation.userId]) 
  
    useEffect(() => {
        dispatch(startloading());
        if (!isLoading && !error && usersData) {          
            const updatedUsersData = usersData.map(item => {
                const userRoles = item.roles !== null && item.roles.length > 0
                    ? item.roles.map(role => role.roleName)
                    : [];
                const userTenants = item.tenants !== null && item.tenants.length > 0
                    ? item.tenants.map(tenant => tenant.name)
                    : [];
                return {
                    ...item,
                    isActive: item.isActive ? props.t("Active") : props.t("Passive"),
                    phoneNumber: item.phoneNumber ? countryNumber(item.phoneNumber) : "",
                    roles: item.roles !== null && item.roles.length > 0 ? getRolesDropdown(item.roles, item.id) : "",
                    tenants: item.tenants !== null && item.tenants.length > 0 ? getTenantsDropdown(item.tenants, item.id) : "",
                    actions: getActions(item),
                    userRoles, 
                    userTenants 
                };
            });

            const allRolesNames = updatedUsersData.flatMap(user => user.userRoles);
            const allTenantsNames = updatedUsersData.flatMap(user => user.userTenants);
            setRolesNames(allRolesNames);
            setTenantsNames(allTenantsNames);

            setTable(updatedUsersData);

            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }, [usersData, error, isLoading, dropdownOpen, dropdownTenantOpen]);

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

    const [userActivePassive] = useTenantAdminActivePassiveMutation();

    const activePassiveUser = (item) => {
        Swal.fire({
            title: props.t("The user to be active or passive."),
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
                                <h6 className="page-title">{props.t("Add a tenant admin")}</h6>
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
                                 
                                    <Table
                                        dataSource={data.rows.map(item => ({ ...item, key: item.id }))}
                                        columns={data.columns}
                                        pagination={true}
                                        scroll={{ x: 'max-content' }}
                                        onChange={handleChange}
                                        filteredInfo={filteredInfo}
                                        sortedInfo={sortedInfo}
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