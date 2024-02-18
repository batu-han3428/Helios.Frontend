import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import {
    Row, Col, Button
} from "reactstrap";
import { withTranslation } from "react-i18next";
import permissionItems from './PermissionItems';
import "./Permission.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import { useLazyRolePermissionListGetQuery, useSetPermissionMutation, useRoleDeleteMutation } from '../../../store/services/Permissions';
import { useSelector, useDispatch } from 'react-redux';
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import { startloading, endloading } from '../../../store/loader/actions';
import Swal from 'sweetalert2'
import PermissionAddOrUpdateRole from './PermissionAddOrUpdateRole';
import PermissionShowUsersRole from './PermissionShowUsersRole';

const Permission = props => {

    const toastRef = useRef();

    const modalRef = useRef();

    const modalContentRef = useRef();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const studyInformation = useSelector(state => state.rootReducer.Study);

    const dispatch = useDispatch();

    const [openSections, setOpenSections] = useState({});
    const [roles, setRoles] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [modalButton, setModalButton] = useState(true);
    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");

    const modalToast = (message, state) => {
        toastRef.current.setToast({
            message: message,
            stateToast: state
        });
    }

    const toggleAccordion = (key) => {
        setOpenSections(prevOpenSections => ({
            ...prevOpenSections,
            [key]: !prevOpenSections[key]
        }));
    };

    const [trigger, { data: resultData, isLoading, isError }] = useLazyRolePermissionListGetQuery();

    useEffect(() => {
        dispatch(startloading());
        if (studyInformation.studyId) {
            trigger(studyInformation.studyId);
        }
    }, [studyInformation.studyId]) 

    useEffect(() => {
        if (!isLoading && !isError && resultData) {
            setRoles(resultData);
            dispatch(endloading());
        } else if (isError && !isLoading) {
            dispatch(endloading());
            Swal.fire({
                title: "",
                text: props.t("An unexpected error occurred."),
                icon: "error",
                confirmButtonText: props.t("OK"),
            });
        }
    }, [resultData, isError, isLoading]);

    const [setPermission] = useSetPermissionMutation();

    const updatePermission = async (id, name, value) => {
        dispatch(startloading());
        let model = {
            userid: userInformation.userId,
            id: id,
            permissionName: name,
            value: value,
        };
        const response = await setPermission(model);
        if (response.data.isSuccess) {
            toastRef.current.setToast({
                message: props.t(response.data.message),
                stateToast: true
            });
            dispatch(endloading());
        } else {
            toastRef.current.setToast({
                message: props.t(response.data.message),
                stateToast: false
            });
            dispatch(endloading());
        }
    }

    const updateRole = (id, name) => {
        setModalButton(true);
        setModalContent(<PermissionAddOrUpdateRole toast={modalToast} refs={modalContentRef} studyId={studyInformation.studyId} tenantId={userInformation.tenantId} userId={userInformation.userId} roleId={id} selectedRole={name} />);
        setModalTitle(props.t("Update role"));
        setModalButtonText(props.t("Update"));
        modalRef.current.tog_backdrop();
    };

    const addRole = () => {
        setModalButton(true);
        setModalContent(<PermissionAddOrUpdateRole toast={modalToast} refs={modalContentRef} studyId={studyInformation.studyId} tenantId={userInformation.tenantId} userId={userInformation.userId} />);
        setModalTitle(props.t("Add a role"));
        setModalButtonText(props.t("Save"));
        modalRef.current.tog_backdrop();
    };

    const showUsersRole = (id) => {
        setModalButton(false);
        setModalTitle(props.t("Users"));
        setModalContent(<PermissionShowUsersRole toast={modalToast} refs={modalContentRef} id={id} />);
        modalRef.current.tog_backdrop();
    };

    const [roleDelete] = useRoleDeleteMutation();

    const deleteRole = (id, name) => {
        Swal.fire({
            title: props.t("You will not be able to recover this user role!"),
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
                        id: id,
                        userid: userInformation.userId,
                        tenantid: userInformation.tenantId,
                        studyId: studyInformation.studyId,
                        roleName: name,
                    };
                    const response = await roleDelete(deleteData);
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
                            text: props.t(response.data.message),
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
    };

    return (      
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom:"5px" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t("Permission list")}</h6>
                            </Col>
                            <Col md="4">
                                <div className="float-end d-none d-md-block">
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={addRole}
                                    >
                                    <FontAwesomeIcon icon="fa-solid fa-plus" /> {props.t("Add a role")}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <div className="" id="" datenow="" style={{paddingTop: "28px"}}>
                                <table className="table-header-rotated">
                                    <thead>
                                        <tr>
                                            <th className="rotate">
                                                <div style={{ float: "right" }} >
                                                    <div className="span2">
                                                        <span style={{padding: "3px 0px"}}>&nbsp;</span>
                                                    </div>
                                                </div>
                                            </th>

                                            {roles.map((item, index) => (
                                                <th key={index} className="rotate">
                                                    <div>
                                                        <div className="span2">
                                                            <span>
                                                                <label className={item.roleName.length > 35 ? "lbl-permision tooltip2" : "lbl-permision"} title={item.roleName}>
                                                                    {item.roleName}
                                                                </label>
                                                                <a title={props.t("Page permissions") } className="tooltip2 btn-permision" >
                                                                    <FontAwesomeIcon icon="fa-solid fa-file-pen" style={{ fontSize: "16px", verticalAlign: "middle" }} />
                                                                </a>
                                                                <a onClick={() => { showUsersRole(item.id) }} style={{ margin: "5px" }} title={ props.t("Show users") } className="tooltip2 btn-permision">
                                                                    <FontAwesomeIcon icon="fa-solid fa-person" style={{ fontSize: "16px", verticalAlign: "middle" }} />
                                                                </a>
                                                                <a onClick={() => { updateRole(item.id, item.roleName) }} style={{ margin: "5px" }} className="tooltip2 btn-permision" title={ props.t("Update") }>
                                                                    <FontAwesomeIcon icon="fa-solid fa-marker" style={{ fontSize: "16px", verticalAlign: "middle" }} />
                                                                </a>
                                                                <a onClick={() => { deleteRole(item.id, item.roleName) }} style={{ margin: "5px" }} className="tooltip2 btn-permision" title={ props.t("Delete") }>
                                                                    <FontAwesomeIcon icon="fa-solid fa-trash-can" style={{ fontSize: "16px", verticalAlign: "middle" }} />
                                                                </a>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </th>
                                            ))}
                                            <th style={{ width: "140px" }} ></th>
                                        </tr>
                                    </thead>

                                    {Object.keys(permissionItems).map(key => {
                                        return (
                                            <React.Fragment key={key}>
                                                <tbody>
                                                    <tr>
                                                        <td className="rowgroup" style={{ width: "300px" }} >
                                                            <label className="ttlLi floatl hd-tgl" onClick={() => toggleAccordion(key)} data-id="0"><i className={`fa ${openSections[key] ? 'fa-minus sign-hd' : 'fa-plus sign-hd'}`} ></i> {props.t(key)}</label>
                                                            <input type="checkbox" data-toggle="toggle" /><span className="floatr">
                                                                <a data-name="@HeliosResource.js_Tmf" data-lock="false" /*onclick="lock(this)"*/ style={{ color: "#6D6E70" }}>
                                                                    <i className=" icon-locked "></i>
                                                                </a><a data-name="@HeliosResource.js_Tmf" data-lock="true" /*onclick="lock(this)"*/ style={{ color: "#6D6E70" }} hidden><i className="fa fa-unlock-alt"></i></a>
                                                            </span>
                                                        </td>
                                                        {roles.map((item, index) => (
                                                            <td key={`${key}_${item.id}`} className="rowgroup">{String.fromCharCode(8203)}</td> 
                                                        ))}
                                                    </tr>
                                                </tbody>
                                                {openSections[key] && (
                                                    <tbody className="hide hide-hd">
                                                        {permissionItems[key].map(item => {
                                                            return (
                                                                <tr key={`${key}_${item.name}`}>
                                                                    <td className="tdname">{props.t(item.label)}</td>
                                                                    {roles.map((role, index) => { 
                                                                        const isPermissionEnabled = role[item.name];
                                                                            return (
                                                                                <td key={`${item.name}_${role.id}`} className="subjectPers">
                                                                                    <input type="checkbox" className="checkbox chck-permision" name="Add" data-userpermissionid="Add_@Model.UserPermissions[i].Id" onChange={(e) => { updatePermission(role.id, item.name, e.target.checked); }} checked={isPermissionEnabled} />
                                                                            </td>
                                                                        )
                                                                     })}
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                )}

                                            </React.Fragment>
                                        );
                                    })}
                                </table>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalComp
                refs={modalRef}
                title={modalTitle}
                body={modalContent}
                buttonText={modalButtonText}
                isButton={modalButton}
            />
            <ToastComp
                ref={toastRef}
            />
        </React.Fragment>
    );
};


Permission.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Permission);