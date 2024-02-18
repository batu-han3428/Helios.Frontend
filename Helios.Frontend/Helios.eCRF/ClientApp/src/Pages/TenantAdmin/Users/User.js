import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import {
    Row, Col, Button, Card, CardBody, FormFeedback, Label, Input, Form, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useLazyUserListGetQuery, useUserGetQuery, useUserSetMutation, useUserActivePassiveMutation, useUsersActivePassiveMutation, useUserDeleteMutation, useUserResetPasswordMutation } from '../../../store/services/Users';
import { useSelector, useDispatch } from 'react-redux';
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import { startloading, endloading } from '../../../store/loader/actions';
import Swal from 'sweetalert2'
import { formatDate } from "../../../helpers/format_date";
import { MDBDataTable } from "mdbreact";
import Select from "react-select";
import { useLazyRoleListGetQuery } from '../../../store/services/Permissions';
import { useLazySiteListGetQuery } from '../../../store/services/SiteLaboratories';
import makeAnimated from "react-select/animated";
import "./user.css";
import { arraysHaveSameItems } from '../../../helpers/General/index';
import { exportToExcel } from '../../../helpers/ExcelDownload';

const User = props => {

    const toastRef = useRef();

    const modalRef = useRef();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const studyInformation = useSelector(state => state.rootReducer.Study);

    const [tableData, setTableData] = useState([]);
    const [studyUserId, setStudyUserId] = useState(0);
    const [updateItem, setUpdateItem] = useState({});
    const [optionGroupRoles, setOptionGroupRoles] = useState([]);
    const [optionGroupSites, setOptionGroupSites] = useState([]);
    const [optionGroupResponsiblePerson, setOptionGroupResponsiblePerson] = useState([]);
    const [userControl, setUserControl] = useState(true);
    const [skip, setSkip] = useState(true);
    const [isRequired, setIsRequired] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState({});
    const [menu, setMenu] = useState(false);
    const [excelData, setExcelData] = useState([]);

    const animatedComponents = makeAnimated();

    const toggleActions = () => {
        setMenu(!menu);
    };

    const toggle = (userId) => {
        setDropdownOpen(prevState => {
            return {
                ...prevState,
                [userId]: !prevState[userId]
            };
        });
    };

    const dispatch = useDispatch();

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

    const data = {
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
                label: props.t("e-Mail"),
                field: "email",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Study role name"),
                field: "roleName",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Site name"),
                field: "siteName",
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
        rows: tableData
    }

    const getActions = (item) => {
        const actions = (
            <div className="icon-container">
                <div title={props.t("Update")} className="icon icon-update" onClick={() => { updateUser(item) }}></div>
                <div title={props.t("Active or passive")} className="icon icon-lock" onClick={() => { activePassiveUser(item) }}></div>
                <div title={props.t("Delete")} className="icon icon-delete" onClick={() => { deleteUser(item) }}></div>
                <div title={props.t("Send a new password")} className="icon icon-resetpassword" onClick={() => { resetPasswordUser(item) }}></div>
            </div>);
        return actions;
    };

    const getSiteDropdown = (sites, userId) => {
        const siteDropdown = (
            <Dropdown isOpen={dropdownOpen[userId]} toggle={() => toggle(userId)}>
                <DropdownToggle caret>
                    {props.t("Sites")}
                </DropdownToggle>
                <DropdownMenu>
                    {sites.map((item, index) => (
                        <DropdownItem key={index} disabled>{item.siteFullName}</DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        );
        return siteDropdown;
    }
   
    const [trigger, result] = useLazyUserListGetQuery();
    const { data: usersData, error, isLoading } = result;

    const [triggerRoles, resultRoles] = useLazyRoleListGetQuery();
    const { data: rolesData, isLoadingRoles, isErrorRoles } = resultRoles;

    const [triggerSites, resultSites] = useLazySiteListGetQuery();
    const { data: sitesData, isLoadingSites, isErrorSites } = resultSites;

    useEffect(() => {
        if (studyInformation.studyId) {
            trigger(studyInformation.studyId);
            triggerRoles(studyInformation.studyId);
            triggerSites(studyInformation.studyId);
        }
    }, [studyInformation.studyId]) 

    useEffect(() => {
        dispatch(startloading());
        if (usersData && !isLoading && !error) {
            const updatedUsersData = usersData.map(item => {
                return {
                    ...item,
                    siteName: item.sites.length > 0 ? getSiteDropdown(item.sites, item.studyUserId) : "",
                    createdOn: formatDate(item.createdOn),
                    lastUpdatedOn: formatDate(item.lastUpdatedOn),
                    isActive: item.isActive ? props.t("Active") : props.t("Passive"),
                    actions: getActions(item)
                };
            });
            setTableData(updatedUsersData);

            const data = updatedUsersData.map(updatedUser => {
                const matchingUser = usersData.find(user => user.studyUserId === updatedUser.studyUserId);

                return [
                    updatedUser.name,
                    updatedUser.lastName,
                    updatedUser.email,
                    updatedUser.roleName,
                    (matchingUser && matchingUser.sites.map(site => site.siteFullName)).join(', ') || "",
                    updatedUser.createdOn,
                    updatedUser.lastUpdatedOn,
                    updatedUser.isActive,
                ];
            });

            setExcelData(data);

            let option = [{
                label: props.t("Responsible person for this user"),
                options: []
            }]
            const responsiblePersons = usersData.map(item => {
                return {
                    label: item.name + " " + item.lastName,
                    value: item.authUserId
                };
            });
            const allResponsiblePersonIds = usersData.map(item => item.authUserId);
            const selectAllOption = {
                label: "Select All",
                value: ["All", allResponsiblePersonIds]
            };
            responsiblePersons.unshift(selectAllOption);
            option[0].options.push(...responsiblePersons);
            setOptionGroupResponsiblePerson(option);

            const timer = setTimeout(() => {
                generateInfoLabel();
            }, 10)

            dispatch(endloading());

            return () => clearTimeout(timer);
        }
        else if (!isLoading && error) {
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }, [usersData, error, isLoading, props.t, dropdownOpen]);

    useEffect(() => {
        if (rolesData && !isLoadingRoles && !isErrorRoles) {
            let option = [{
                label: "",
                options: []
            }]
            const roles = rolesData.map(item => {
                return {
                    label: item.roleName,
                    value: item.id
                };
            });
            option[0].options.push(...roles);
            setOptionGroupRoles(option);
        } else if (!isLoadingRoles && isErrorRoles) {
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
        }
    }, [rolesData, isErrorRoles, isLoadingRoles]);

    useEffect(() => {
        if (sitesData && !isLoadingSites && !isErrorSites) {
            let option = [{
                label: props.t("Sites"),
                options: []
            }]
            const sites = sitesData.map(item => {
                return {
                    label: item.siteFullName,
                    value: item.id
                };
            });
            const allSiteIds = sitesData.map(item => item.id);
            const selectAllOption = {
                label: "Select All",
                value: ["All", allSiteIds]
            };
            sites.unshift(selectAllOption);
            option[0].options.push(...sites);
            console.log(option)
            setOptionGroupSites(option);
        } else if (!isLoadingSites && isErrorSites) {
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
        }
    }, [sitesData, isErrorSites, isLoadingSites]);

    const resetValue = () => {
        validationType.validateForm().then(errors => {
            validationType.setErrors({});
            validationType.resetForm();
        });
        setUpdateItem({});
        setUserControl(true);
        setIsRequired(false);
        setStudyUserId(0);
    };

    const [userSet] = useUserSetMutation();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            studyUserId: studyUserId,
            authUserId: 0,
            userid: userInformation.userId,
            tenantid: userInformation.tenantId,
            studyId: studyInformation.studyId,
            name: "",
            lastname: "",
            email: "",
            roleid: 0,
            siteIds: [],
            responsiblePersonIds: []
        },
        validationSchema: (values) => {
            return Yup.object().shape({
                name: isRequired ? Yup.string().required(props.t("This field is required")) : Yup.string(),
                lastname: isRequired ? Yup.string().required(props.t("This field is required")) : Yup.string(),
                email: Yup.string().required(props.t("This field is required")).email(props.t("Invalid email format")),
            });
        },
        onSubmit: async (values) => {
            try {
                dispatch(startloading());

                if (values.name !== "") {
                    const response = await userSet({
                        ...values,
                        siteIds: values.siteIds[0] === "All" ? values.siteIds[1][1] : values.siteIds,
                        responsiblePersonIds: values.responsiblePersonIds[0] === "All" ? values.responsiblePersonIds[1][1] : values.responsiblePersonIds,
                        password: "",
                        researchName: studyInformation.studyName,
                        researchLanguage: studyInformation.studyLanguage,
                        firstAddition: false
                    });
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
                } else {
                    setSkip(false);
                }
            } catch (e) {
                dispatch(endloading());
            }
        }
    });

    const updateUser = (item) => {
        dispatch(startloading());
        setStudyUserId(item.studyUserId);
        setUpdateItem(item);
        setUserControl(false);
    };

    useEffect(() => {
        if (studyUserId !== 0 && updateItem.authUserId !== 0) {

            let sites = [];

            if (sitesData.length > 0) {
                const haveSameItems = arraysHaveSameItems(sitesData.map(site => site.id), updateItem.sites.map(site => site.id));

                if (haveSameItems) {
                    sites = ["All", ["All", updateItem.sites.map(site => site.id)]];
                } else {
                    sites = updateItem.sites.map(site => site.id);
                }
            }

            let responsiblePerson = [];

            if (usersData.length > 0) {
                let responsiblePersonData = usersData.map(user => user.authUserId).filter(id => id !== updateItem.authUserId);

                if (responsiblePersonData.length > 0) {
                    const haveSameItemsResponsiblePerson = arraysHaveSameItems(responsiblePersonData, updateItem.responsiblePerson.map(user => user));

                    if (haveSameItemsResponsiblePerson) {
                        responsiblePerson = ["All", ["All", updateItem.responsiblePerson.map(user => user)]];
                    } else {
                        responsiblePerson = updateItem.responsiblePerson.map(user => user);
                    }
                }
            }

            validationType.setValues({
                studyUserId: studyUserId,
                authUserId: updateItem.authUserId,
                userid: userInformation.userId,
                tenantid: userInformation.tenantId,
                studyId: studyInformation.studyId,
                name: updateItem.name,
                lastname: updateItem.lastName,
                email: updateItem.email,
                roleid: updateItem.roleId,
                siteIds: sites,
                responsiblePersonIds: responsiblePerson
            });
            modalRef.current.tog_backdrop();
            dispatch(endloading());
        }
    }, [studyUserId, updateItem]);

    const [userActivePassive] = useUserActivePassiveMutation();

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
                    var activePassiveData = {
                        studyUserId: item.studyUserId,
                        authUserId: item.authUserId,
                        studyId: studyInformation.studyId,
                        userId: userInformation.userId,
                        name: item.name,
                        lastName: item.lastName,
                        isActive: item.isActive,
                        email: item.email,
                        roleId: item.roleId,
                        siteIds: [],
                        password: "",
                        researchName: studyInformation.studyName,
                        researchLanguage: studyInformation.studyLanguage,
                        firstAddition: false,
                        responsiblePersonIds: []
                    };
                    const response = await userActivePassive(activePassiveData);
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

    const [usersActivePassive] = useUsersActivePassiveMutation();

    const activePassiveUsers = () => {
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
                    var activePassiveData = {
                        studyUserId: 0,
                        authUserId: 0,
                        studyId: studyInformation.studyId,
                        userId: userInformation.userId,
                        name: "",
                        lastName: "",
                        isActive: true,
                        email: "",
                        roleId: 0,
                        siteIds: [],
                        password: "",
                        researchName: studyInformation.studyName,
                        researchLanguage: studyInformation.studyLanguage,
                        firstAddition: false,
                        responsiblePersonIds: []
                    };
                    const response = await usersActivePassive(activePassiveData);
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
                            confirmButtonText: props.t("Ok"),
                        });
                    }
                } catch (error) {
                    dispatch(endloading());
                    Swal.fire({
                        title: "",
                        text: props.t("An unexpected error occurred."),
                        icon: "error",
                        confirmButtonText: props.t("OK"),
                    });
                }
            }
        });
    }

    const [userDelete] = useUserDeleteMutation(); 

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
                    var deleteData = {
                        studyUserId: item.studyUserId,
                        authUserId: item.authUserId,
                        studyId: studyInformation.studyId,
                        userId: userInformation.userId,
                        name: item.name,
                        lastName: item.lastName,
                        isActive: item.isActive,
                        email: item.email,
                        roleId: item.roleId,
                        siteIds: [],
                        password: "",
                        researchName: studyInformation.studyName,
                        researchLanguage: studyInformation.studyLanguage,
                        firstAddition: false,
                        responsiblePersonIds: []
                    };
                    const response = await userDelete(deleteData);
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

    const [userResetPassword] = useUserResetPasswordMutation();

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

            var resetPasswordData = {
                studyUserId: item.studyUserId,
                authUserId: item.authUserId,
                studyId: studyInformation.studyId,
                userId: userInformation.userId,
                name: item.name,
                lastName: item.lastName,
                isActive: item.isActive,
                email: item.email,
                roleId: item.roleId,
                siteIds: [],
                password: "",
                researchName: studyInformation.studyName,
                researchLanguage: studyInformation.studyLanguage,
                firstAddition: false,
                responsiblePersonIds: []
            };
            const response = await userResetPassword(resetPasswordData);
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

    const { data: userData, isErrorUser, isLoadingUser } = useUserGetQuery({ email: validationType.values.email, studyId: validationType.values.studyId }, {
        skip
    });

    useEffect(() => {
        if (userData && !isLoadingUser && !isErrorUser) {
            if (userData.isSuccess) {
                if (userData.values.authUserId !== 0) {
                    validationType.setValues({
                        studyUserId: studyUserId,
                        authUserId: userData.values.authUserId,
                        userid: userInformation.userId,
                        tenantid: userInformation.tenantId,
                        studyId: studyInformation.studyId,
                        name: userData.values.name,
                        lastname: userData.values.lastName,
                        email: userData.values.email,
                        roleid: 0,
                        siteIds: [],
                        responsiblePersonIds: []
                    });
                } else {
                    setIsRequired(true);
                }
                setUserControl(false);
                setSkip(true);
                dispatch(endloading());
            } else {
                setSkip(true);
                dispatch(endloading());
                toastRef.current.setToast({
                    message: userData.message,
                    stateToast: false
                });
            }
        } 
    }, [userData, isErrorUser, isLoadingUser]);

    return (
        <React.Fragment>
            <ModalComp
                refs={modalRef}
                title={studyUserId === 0 ? props.t("Add a user") : props.t("Update user")}
                body={
                    <>
                        {userControl ?
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validationType.handleSubmit();
                                    return false;
                                }}>
                                <div className="row">
                                    <div className="mb-3 col-md-12">
                                        <Label className="form-label">{props.t("e-Mail")}</Label>
                                        <Input
                                            name="email"
                                            placeholder="abc@xyz.com"
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
                                    </div>
                                </div>
                            </Form>
                            :
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
                                            disabled={validationType.values.authUserId !== 0 ? true : false}
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
                                            disabled={validationType.values.authUserId !== 0 ? true : false}
                                        />
                                        {validationType.touched.lastname && validationType.errors.lastname ? (
                                            <FormFeedback type="invalid">{validationType.errors.lastname}</FormFeedback>
                                        ) : null}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <Label className="form-label">{props.t("e-Mail")}</Label>
                                        <Input
                                            name="email"
                                            placeholder="abc@xyz.com"
                                            type="text"
                                            onChange={validationType.handleChange}
                                            onBlur={(e) => {
                                                validationType.handleBlur(e);
                                            }}
                                            value={validationType.values.email || ""}
                                            invalid={
                                                validationType.touched.email && validationType.errors.email ? true : false
                                            }
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <Label className="form-label">{props.t("Role name")}</Label>
                                        <Select
                                            value={(optionGroupRoles.length > 0 && optionGroupRoles[0].options.find(option => option.value === validationType.values.roleid)) || ""}
                                            name="roleid"
                                            onChange={(selectedOption) => {
                                                const formattedValue = {
                                                    target: {
                                                        name: 'roleid',
                                                        value: selectedOption.value
                                                    }
                                                };
                                                validationType.handleChange(formattedValue);
                                            }}
                                            options={optionGroupRoles}
                                            classNamePrefix="select2-selection"
                                            placeholder={props.t("Select")}
                                        />
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <Label className="form-label">{props.t("Site name")}</Label>
                                        <Select
                                            value={validationType.values.siteIds[0] === "All" ? { label: "Select All", value: validationType.values.siteIds[1] } : optionGroupSites[0].options.filter(option => validationType.values.siteIds.includes(option.value))}
                                            name="siteIds"
                                            onChange={(selectedOptions) => {
                                                const selectedValues = selectedOptions.map(option => option.value);
                                                const selectAll = selectedValues.find(value => Array.isArray(value));
                                                if (selectAll !== undefined) {
                                                    validationType.setFieldValue('siteIds', ["All", selectAll]);
                                                } else {
                                                    console.log(selectedValues)
                                                    validationType.setFieldValue('siteIds', selectedValues);
                                                }
                                            }}
                                            options={(function () {
                                                if (validationType.values.siteIds.includes("All")) {
                                                    return [];
                                                } else {
                                                    const allOptions = optionGroupSites[0].options;
                                                    const selectedOptions = [];
                                                    for (const option of allOptions) {
                                                        if (option.label !== "Select All") {
                                                            selectedOptions.push(option.value);
                                                        }
                                                    }
                                                    let result = arraysHaveSameItems(selectedOptions, validationType.values.siteIds);
                                                    if (result) {
                                                        return [];
                                                    } else {
                                                        return optionGroupSites[0].options;
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
                                </div>
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <Label className="form-label">{props.t("Responsible person for this user")}</Label>
                                        <Select
                                            value={validationType.values.responsiblePersonIds[0] === "All" ? { label: "Select All", value: validationType.values.responsiblePersonIds[1] } : optionGroupResponsiblePerson[0].options.filter(option => validationType.values.responsiblePersonIds.includes(option.value))}
                                            name="responsiblePersonIds"
                                            onChange={(selectedOptions) => {
                                                const selectedValues = selectedOptions.map(option => option.value);
                                                const selectAll = selectedValues.find(value => Array.isArray(value));
                                                if (selectAll !== undefined) {
                                                    validationType.setFieldValue('responsiblePersonIds', ["All", selectAll]);
                                                } else {
                                                    validationType.setFieldValue('responsiblePersonIds', selectedValues);
                                                }
                                            }}
                                            options={(function () {
                                                if (validationType.values.responsiblePersonIds.includes("All")) {
                                                    return [];
                                                } else {
                                                    const allOptions = optionGroupResponsiblePerson[0].options;
                                                    const selectedOptions = [];
                                                    for (const option of allOptions) {  
                                                        if (option.label !== "Select All" && updateItem.authUserId !== option.value) {
                                                            selectedOptions.push(option.value);
                                                        }
                                                    }
                                                    let result = arraysHaveSameItems(selectedOptions, validationType.values.responsiblePersonIds);
                                                    if (result) {
                                                        return [];
                                                    } else {
                                                        let index = allOptions[0].value[1].indexOf(updateItem.authUserId);
                                                        if (index !== -1) {
                                                            allOptions[0].value[1].splice(index, 1);
                                                        }
                                                        return allOptions.filter(option => option.value !== updateItem.authUserId);
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
                                </div>
                            </Form>
                        }
                    </>
                }
                resetValue={resetValue}
                handle={() => validationType.handleSubmit()}
                buttonText={studyUserId === 0 ? props.t("Save") : props.t("Update")}
            />
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom: "5px" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t("User list")}</h6>
                            </Col>
                            <Col md="4">
                                <div className="float-end d-none d-md-block" style={{marginLeft: "10px"}}>
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={() => modalRef.current.tog_backdrop()}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-plus" /> {props.t("Add a user")}
                                    </Button>
                                </div>
                                <div className="float-end d-none d-md-block">
                                    <Dropdown isOpen={menu} toggle={toggleActions}>
                                        <DropdownToggle color="primary" className="btn btn-primary dropdown-toggle waves-effect waves-light">
                                            {props.t("Actions")}&nbsp;<FontAwesomeIcon icon="fa-solid fa-caret-down" />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => exportToExcel({
                                                headers: [
                                                    props.t("First name"),
                                                    props.t("Last name"),
                                                    "Email",
                                                    props.t("Study role name"),
                                                    props.t("Site name"),
                                                    props.t("Created on"),
                                                    props.t("Last updated on"),
                                                    props.t("State"),
                                                ],
                                                rows: excelData
                                            },
                                            studyInformation.studyName + " - " + props.t("User list"),
                                            studyInformation.studyName + " - " + props.t("User list")
                                            )}>
                                                <FontAwesomeIcon style={{ marginRight: "10px" }} icon="fa-solid fa-download" />
                                                <span>{props.t("Excel Download")}</span>
                                            </DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem onClick={activePassiveUsers}>
                                                <FontAwesomeIcon style={{ marginRight: "10px" }} icon="fa-solid fa-lock" />
                                                {props.t("Passive all users")}
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
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


User.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(User);