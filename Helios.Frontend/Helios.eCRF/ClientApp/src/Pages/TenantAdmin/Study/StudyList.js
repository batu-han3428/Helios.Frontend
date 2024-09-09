import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyStudyListGetQuery, useLazyTenantStudyLimitGetQuery, useStudyLockOrUnlockMutation  } from '../../../store/services/Study';
import { useDispatch, useSelector } from "react-redux";
import { startloading, endloading } from '../../../store/loader/actions';
import { formatDate } from "../../../helpers/format_date";
import { Table, Row, Col, Card, Dropdown, Button, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import './study.css';
import { showToast } from '../../../store/toast/actions';

const StudyList = props => {
    
    const userInformation = useSelector(state => state.rootReducer.Login);

    const [tableData, setTableData] = useState([]);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const tenantId = userInformation.tenantId;

    const studyUpdate = (id) => {
        navigate(`/addstudy/false`, { state: { studyId: id } });
    };

    const goToStudy = (id, equivalentStudyId) => {
        navigate(`/visits/${id}`);
    };

    const [studyLockOrUnlock] = useStudyLockOrUnlockMutation();

    const studyLock = async (id, isLock) => {
        Swal.fire({
            title: props.t("Do you confirm you want to lock study?"),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel")
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    dispatch(startloading());
                    const response = await studyLockOrUnlock({
                        Id: id,
                        UserId: userInformation.userId,
                        IsLock: isLock
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
                            confirmButtonText: props.t("Ok"),
                        });
                    }
                } catch (error) {
                    dispatch(endloading());
                    Swal.fire({
                        title: "",
                        text: props.t("An unexpected error occurred."),
                        icon: "error",
                        confirmButtonText: props.t("Ok"),
                    });
                }
            }
        });
    }
    const [searchTextstudyName, setSearchTextstudyName] = useState('');
    const [searchTextprotocolCode, setSearchTextprotocolCode] = useState('');
    const columns = [       
        {
            title: props.t('Study name'),
            dataIndex: 'studyName',
            sorter: (a, b) => a.studyName.localeCompare(b.studyName),
            sortDirections: ['ascend', 'descend'],
            filteredValue: [searchTextstudyName],
            onFilter: (value, record) => String(record.studyName).toLowerCase().includes(value.toLowerCase()),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input.Search
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={(e) => setSearchTextstudyName(e.target.value)}
                        />
                    </div>
                );
            },
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },       
        {
            title: props.t('Protocol code'),
            dataIndex: 'protocolCode',
            sorter: (a, b) => a.protocolCode.localeCompare(b.protocolCode),
            sortDirections: ['ascend', 'descend'],
            filteredValue: [searchTextprotocolCode],
            onFilter: (value, record) => String(record.protocolCode).toLowerCase().includes(value.toLowerCase()),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input.Search
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={(e) => setSearchTextprotocolCode(e.target.value)}
                        />
                    </div>
                );
            },
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Ask subject Initial'),
            dataIndex: 'askSubjectInitial',
            sorter: (a, b) => a.askSubjectInitial !== b.askSubjectInitial ? a.askSubjectInitial.localeCompare(b.askSubjectInitial) : null,
            sortDirections: ['ascend', 'descend'],
            render: (text, record) => {
                if (text) {
                    text = props.t("Yes");
                } else {
                    text = props.t("No");
                }
                return <span>{text}</span>;
            }
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
            sortDirections: ['ascend', 'descend']
        },
        {
            title: props.t('Actions'),
            dataIndex: 'actions',
            width:"150px",
            render: (text, record) => {
                return (
                    <div className="icon-container">
                        <div title={props.t("Update")} className="icon icon-update" onClick={() => { studyUpdate(record.id) }}></div>
                        <div title={props.t("Go to demo study")} className="icon icon-demo" onClick={() => { goToStudy(record.equivalentStudyId, record.id) }}></div>
                        <div title={props.t(record.isLock ? "Unlock" : "Lock")} className={record.isLock ? "icon icon-unlock" :"icon icon-lock"} onClick={() => { studyLock(record.id, record.isLock) }}></div>
                        <div title={props.t("Go to active study")} className="icon icon-live" onClick={() => { goToStudy(record.id, record.equivalentStudyId) }}></div>
                    </div>
                );
            }
        },
    ];

    const [trigger, { data: studyData, error, isLoading }] = useLazyStudyListGetQuery();
    const [triggerTenantStudyLimit, { data: tenantStudyLimitData, isLoading: isLoadingTenantStudyLimit, error: isErrorTenantStudyLimit }] = useLazyTenantStudyLimitGetQuery();

    const { isLocked } = useParams();

    useEffect(() => {
        if (isLocked && tenantId) {
            trigger({ isLocked: isLocked === 'true' ? true : false, tenantId: tenantId });
            triggerTenantStudyLimit({ tenantId: tenantId });
        }
    }, [isLocked, tenantId]);

    useEffect(() => {
        dispatch(startloading());
        if (!isLoading && !error && studyData) {
            const updatedStudyData = studyData.map(item => {               
                return {
                    ...item,
                    updatedAt: formatDate(item.updatedAt),
                    createdAt: formatDate(item.createdAt)
                };
            });
            setTableData(updatedStudyData);
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(endloading());
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
        }
    }, [studyData, error, isLoading, props.t]);

    const handleMenuClick = (e) => {
        if (e.key === "newStudy") {
            if (tableData.length === tenantStudyLimitData) {
                dispatch(showToast(props.t("There is no limit for adding study, please contact the system administrator."), true, false));
            }
            else {
                navigate(`/addstudy/false`);  
            }
                 
        }
        else {
            navigate(`/addstudy/true`);  
        }
    };

    const items = [
        {
            label: props.t("Create a new study"),
            key: 'newStudy',           
            icon: <FontAwesomeIcon style={{ marginRight: "10px" }} icon="fa-solid fa-plus" />
        },
        {
            label: props.t("Use an existing study"),
            key: '2',       
            icon: <FontAwesomeIcon style={{ marginRight: "10px" }} icon="fa-solid fa-copy" />
        },
    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    const handleRowDoubleClick = (rowId) => {
        navigateToFormBuilder(rowId)
    };
    const navigateToFormBuilder = (id) => {
        navigate(`/visits/${id}`);
    };

    document.title = "Studylist | Veltrix - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" justify="space-between" align="middle">
                            <Col span={8}>
                                <h6 className="page-title">{props.t("Study list")}</h6>
                            </Col>
                            <Col span={16}>
                                <div className="float-end d-md-block" style={{ textAlign: 'right' }}>
                                    <Dropdown menu={menuProps}>
                                        <Button>
                                            <Space>
                                                {props.t("Add a study")}
                                                <FontAwesomeIcon icon="fa-solid fa-caret-down" />
                                            </Space>
                                        </Button>
                                    </Dropdown>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <Card className="studylist-card-table">
                                <Table
                                    dataSource={tableData.map(item => ({ ...item, key: item.id }))}
                                    columns={columns}
                                    pagination={true}
                                    scroll={{ x: 'max-content' }}
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onDoubleClick: event => {
                                                handleRowDoubleClick(record.equivalentStudyId, event);
                                            }
                                        }
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};

StudyList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(StudyList);
