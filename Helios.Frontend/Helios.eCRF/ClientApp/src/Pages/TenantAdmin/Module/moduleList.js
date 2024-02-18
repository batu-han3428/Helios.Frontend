import React, { useState, useEffect } from 'react';
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

let id = 0;

function ModuleList() {
    const userInformation = useSelector(state => state.rootReducer.Login);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const baseUrl = "https://localhost:7196";

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
                    TenantId: userInformation.TenantId,
                    Name: Name,
                    UserId: userInformation.userId
                })

            })
                .then(response => response.json())
                .then(data => {
                    tog_large();
                    // Handle response from the controller
                })
                .catch(error => {
                    //console.error('Error:', error);
                });
        }
    };

    const deleteModule = (event, id) => {
        fetch(baseUrl + '/Module/DeleteModule?id=' + id, {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                // Handle response from the controller
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    };
    
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
        fetch(baseUrl + '/Module/GetModuleList?tenantId=' + 2, {
            method: 'GET',
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
    }, [tableData]);

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

export default ModuleList;

