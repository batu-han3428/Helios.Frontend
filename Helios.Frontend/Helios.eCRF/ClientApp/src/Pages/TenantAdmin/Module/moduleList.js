import React, { useState, useEffect, useRef } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Modal,
    Container,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Button,
} from "reactstrap";

import { MDBDataTable } from "mdbreact";
import './module.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { startloading, endloading } from '../../../store/loader/actions';
import { formatDate } from "../../../helpers/format_date";
import { useDispatch, useSelector } from "react-redux";
import { decodeToken } from "../../../helpers/Util/tokenUtil";
import { getLocalStorage } from '../../../helpers/local-storage/localStorageProcess';
import { withTranslation } from "react-i18next";
import Swal from 'sweetalert2'

function ModuleList(props) {
    let token = getLocalStorage("accessToken");
    var auth = decodeToken(token);
    const userInformation = useSelector(state => state.rootReducer.Login);
    const toastRef = useRef();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const baseUrl = "http://localhost:3300";

    const [Name, setName] = useState('');
    const [Id, setId] = useState(0);
    const [NameClass, setNameClass] = useState('form-control');
    const [RequiredError, setRequiredError] = useState('This value is required');
    const [modal_large, setmodal_large] = useState(false);
    const [tableData, setTableData] = useState([]);

    const removeBodyCss = () => {
        document.body.classList.add("no_padding");
    };

    const getActions = (id) => {
        const actions = (
            <div className="icon-container">
                <div className="icon icon-update" onClick={e => tog_large(e, id)}></div>
                <div className="icon icon-delete" onClick={() => { deleteModule(id) }}></div>
                <div className="icon icon-demo" onClick={() => { navigateToFormBuilder(id) }}></div>
            </div>);
        return actions;
    };

    const navigateToFormBuilder = (id) => {
        navigate(`/formBuilder/${id}`);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const tog_large = (e, id) => {
        if (id != "" && id != undefined) {
            setId(id);
            fetch(baseUrl + '/Module/GetModule?id=' + id, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    setName(data.name);
                    setNameClass("form-control");
                })
                .catch(error => {
                    //console.error('Error:', error);
                });
        }
        else {
            setName('');
        }

        setmodal_large(!modal_large);
        removeBodyCss();
    };

    const handleSubmit = (e) => {
        if (Name == "") {
            setNameClass("is-invalid form-control");
            e.preventDefault();
        }
        else {
            fetch(baseUrl + '/Module/SaveModule', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Id: Id,
                    TenantId: auth.tenantId,
                    Name: Name,
                    UserId: userInformation.userId
                })

            })
                .then(response => response.json())
                .then(data => {
                    tog_large();
                    window.location.reload();
                    // Handle response from the controller
                })
                .catch(error => {
                    //console.error('Error:', error);
                });
        }
    };

    const deleteModule = (event) => {
        Swal.fire({
            title: props.t("You will not be able to recover this element"),
            text: props.t("Do you confirm"),
            icon: props.t("Warning"),
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel"),
            closeOnConfirm: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    dispatch(startloading());
                    fetch(baseUrl + '/Module/DeleteModule', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Id: event,
                            TenantId: auth.tenantId,
                            Name: Name,
                            UserId: userInformation.userId
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            //if (data.isSuccess) {
                            //    toastRef.current.setToast({
                            //        message: data.message,
                            //        stateToast: true
                            //    });
                            //} else {
                            //    toastRef.current.setToast({
                            //        message: data.message,
                            //        stateToast: false
                            //    });
                            //}
                            dispatch(endloading());
                            window.location.reload();
                        })
                        .catch(error => {
                            //console.error('Error:', error);
                        });
                } catch (error) {
                    dispatch(endloading());
                    Swal.fire('An error occurred', '', 'error');
                }
            }
        })
    }

    const data = {
        columns: [
            {
                label: "Module Name",
                field: "name",
                sort: "asc",
                width: 150
            },
            {
                label: 'Actions',
                field: 'actions',
                sort: 'disabled',
                width: 100,
            }
        ],
        rows: tableData
    }

    const fetchData = () => {
        let token = getLocalStorage("accessToken");
        fetch(baseUrl + '/Module/GetModuleList', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const updatedModuleData = data.map(item => {
                    return {
                        ...item,
                        updatedAt: formatDate(item.updatedAt),
                        actions: getActions(item.id)
                    };
                });

                setTableData(updatedModuleData);
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    }

    useEffect(() => {
        dispatch(startloading());
        fetchData();
        dispatch(endloading());
    }, []);

    return (
        <>
            <Col sm={6} md={4} xl={3}>
                <Modal isOpen={modal_large} toggle={tog_large} size="lg">
                    <ModalBody>
                        {/*<AddModule id={id}></AddModule>*/}
                        <div style={({ height: "100vh" }, { display: "flex" })}>
                            <div id="page-wrap" style={{ padding: "15px", width: '100%' }}>
                                <div><h3>Add Module</h3></div>
                                <hr />
                                <div className='row'>
                                    <div className='form-group'>
                                        <label> Name</label>
                                        <input className={NameClass} value={Name} onChange={handleNameChange} type='text' id='Name' />
                                        <div type="invalid" className="invalid-feedback">{RequiredError}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={tog_large}>
                            Close
                        </Button>{' '}
                        <Button color="primary" onClick={handleSubmit}>
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>
            </Col>
            <React.Fragment>
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="page-title-box">
                            <Row className="align-items-center">
                                <Col md={8}>
                                    <h6 className="page-title">Module list</h6>
                                </Col>

                                <Col md="4">
                                    <div className="float-end d-none d-md-block">
                                        <button className="btn btn-primary" onClick={e => tog_large(e, "")}>
                                            <small>Add Module</small>
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            <Col className="col-12">
                                <Card>
                                    <CardBody>
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Module Name</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map((rowData, rowIndex) => (
                                                    <tr key={rowIndex} onDoubleClick={() => navigateToFormBuilder(rowData.id)}>
                                                        <td>{rowData.name}</td>
                                                        <td>{getActions(rowData.id)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>



        </>
    );
}

export default withTranslation()(ModuleList);

