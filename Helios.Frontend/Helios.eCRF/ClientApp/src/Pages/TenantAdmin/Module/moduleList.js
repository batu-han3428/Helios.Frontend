import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import './module.css';
import { useNavigate } from "react-router-dom";
import { startloading, endloading } from '../../../store/loader/actions';
import { formatDate } from "../../../helpers/format_date";
import { useDispatch, useSelector } from "react-redux";
import { getLocalStorage } from '../../../helpers/local-storage/localStorageProcess';
import { withTranslation } from "react-i18next";
import { Table, Input, Row, Col, Card, Space, Button } from 'antd';
import Swal from 'sweetalert2'
import { API_BASE_URL } from '../../../constants/endpoints';
import { SearchOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { showToast } from '../../../store/toast/actions';

function ModuleList(props) {
    const token = getLocalStorage("accessToken");
    const userInformation = useSelector(state => state.rootReducer.Login);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [Name, setName] = useState('');
    const [Id, setId] = useState(0);
    const [NameClass, setNameClass] = useState('form-control');
    const [RequiredError] = useState(props.t('This field is required'));
    const [modal_large, setmodal_large] = useState(false);
    const [tableData, setTableData] = useState([]);

    const removeBodyCss = () => {
        document.body.classList.add("no_padding");
    };

    const navigateToFormBuilder = (id) => {
        navigate(`/formBuilder/${id}/false`);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const tog_large = (e, id) => {
        if (id !== "" && id !== undefined) {
            setId(id);
            fetch(API_BASE_URL + 'Module/GetModule?id=' + id, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    setName(data.name);
                    setNameClass("form-control");
                })
                .catch(error => {
                    dispatch(showToast(props.t("An unexpected error occurred."), true, false));
                });
        }
        else {
            setName('');
        }

        setmodal_large(!modal_large);
        removeBodyCss();
    };

    const handleSubmit = (e) => {
        if (Name === "") {
            setNameClass("is-invalid form-control");
            e.preventDefault();
        }
        else {
            dispatch(startloading());
            fetch(API_BASE_URL + 'Module/SaveModule', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Id: Id,
                    TenantId: userInformation.tenantId,
                    Name: Name,
                    UserId: userInformation.userId,
                    AddedNameAndLastName: "",
                    UpdatedNameAndLastName:"",
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        tog_large();
                        fetchData();
                        dispatch(endloading());
                        dispatch(showToast(props.t("Successful"), true, true));
                    }
                    else {
                        dispatch(endloading());
                        dispatch(showToast(props.t("Unsuccessful"), true, false));
                    }
                })
                .catch(error => {
                    dispatch(endloading());
                    dispatch(showToast(props.t("An unexpected error occurred."), true, false));
                });
        }
    };

    const deleteModule = (event) => {      
        Swal.fire({
            title: props.t("You will not be able to recover this element"),
            text: props.t("Do you confirm"),
            icon: props.t("info"),
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel")
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    dispatch(startloading());
                    fetch(API_BASE_URL + 'Module/DeleteModule', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Id: event,
                            TenantId: userInformation.tenantId,
                            Name: Name,                         
                            UserId: userInformation.userId,
                            UpdatedNameAndLastName: "",
                            AddedNameAndLastName:"",
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.isSuccess) {
                                fetchData();
                                Swal.fire(props.t(data.message), '', 'success');
                            } else {
                                Swal.fire(props.t(data.message), '', 'error');
                            }
                            dispatch(endloading());
                        })
                        .catch(error => {
                            Swal.fire(props.t("An unexpected error occurred."), '', 'error');
                            dispatch(endloading());
                        });
                } catch (error) {
                    dispatch(endloading());
                    Swal.fire('An error occurred', '', 'error');
                }
            }
        })
    }

    const fetchData = () => {
        fetch(API_BASE_URL + 'Module/GetModuleList', {
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
                        createdAt: formatDate(item.createdAt),
                        updatedNameAndLastName: item.updatedNameAndLastName != null ? item.updatedNameAndLastName : "-",
                        addedNameAndLastName: item.addedNameAndLastName != null ? item.addedNameAndLastName : "-"
                    };
                });
                setTableData(updatedModuleData);
            })
            .catch(error => {
                dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            });
    }

    const handleRowDoubleClick = (rowId) => {
        navigateToFormBuilder(rowId)
    };

    const [searchText, setSearchText] = useState('');

    const columns = [
        {
            title: props.t('Module Name'),
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
            filteredValue: [searchText],
            onFilter: (value, record) => String(record.name).toLowerCase().includes(value.toLowerCase()),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input.Search
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                );
            },
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Created on'),
            dataIndex: 'createdAt',
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            sortDirections: ['ascend', 'descend'],        
            onFilter: (value, record) => String(record.createdAt).toLowerCase().includes(value.toLowerCase()),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Last updated on'),
            dataIndex: 'updatedAt',
            sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
            sortDirections: ['ascend', 'descend'],        
            onFilter: (value, record) => String(record.updatedAt).toLowerCase().includes(value.toLowerCase()),

            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Created by'),
            dataIndex: 'addedNameAndLastName',
            sorter: (a, b) => a.addedNameAndLastName.localeCompare(b.addedNameAndLastName),
            sortDirections: ['ascend', 'descend'],          
            onFilter: (value, record) => String(record.createdBy).toLowerCase().includes(value.toLowerCase()),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Updated by'),
            dataIndex: 'updatedNameAndLastName',
            sorter: (a, b) => a.updatedNameAndLastName.localeCompare(b.updatedNameAndLastName),
            sortDirections: ['ascend', 'descend'],         
            onFilter: (value, record) => String(record.updatedBy).toLowerCase().includes(value.toLowerCase()),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Actions'),
            dataIndex: 'actions',
            width: "170px",
            render: (text, record) => {             
                return (
                    <div className="icon-container">
                        <div className="icon icon-update" onClick={e => tog_large(e, record.id)}></div>
                        <div className="icon icon-delete" onClick={() => { deleteModule(record.id) }}></div>
                        <div className="icon icon-demo" onClick={() => { navigateToFormBuilder(record.id) }}></div>
                    </div>
                );
            }
        },
    ];

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
                        <div style={({ height: "100vh" }, { display: "flex" })}>
                            <div id="page-wrap" style={{ padding: "15px", width: '100%' }}>
                                <div><h3>{ Name === "" ? props.t("Add module") : props.t("Rename module")}</h3></div>
                                <hr />
                                <div className='row'>
                                    <div className='form-group'>
                                        <label>{props.t("Name")}</label>
                                        <input className={NameClass} value={Name} onChange={handleNameChange} type='text' id='Name' />
                                        <div type="invalid" className="invalid-feedback">{RequiredError}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={tog_large}>
                            {props.t("Close")}
                        </Button>{' '}
                        <Button color="primary" onClick={handleSubmit}>
                            {props.t("Save")}
                        </Button>
                    </ModalFooter>
                </Modal>
            </Col>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" justify="space-between" align="middle">
                            <Col span={8}>
                                <h6 className="page-title">{props.t("Module list")}</h6>
                            </Col>
                            <Col span={16}>
                                <div className="float-end d-md-block" style={{ textAlign: 'right' }}>
                                    <Button onClick={e => tog_large(e, "")}>
                                        <Space>
                                            {props.t("Add module")}
                                            <FontAwesomeIcon icon="fa-solid fa-plus" />
                                        </Space>
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <Card className="modulelist-card-table">
                                <Table
                                    dataSource={tableData.map(item => ({ ...item, key: item.id }))}
                                    columns={columns}
                                    pagination={true}
                                    scroll={{ x: 'max-content' }}
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onDoubleClick: event => {
                                                handleRowDoubleClick(record.id, event);
                                            }
                                        }
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}

export default withTranslation()(ModuleList);
