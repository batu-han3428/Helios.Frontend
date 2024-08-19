import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, FormFeedback, Label, Form, Button } from "reactstrap";
import { withTranslation } from "react-i18next";
import "./tenantusers.css";
import { useLazyTenantUserListGetQuery, useTenantUserSetMutation } from '../../../store/services/TenantUsers';
import { formatDate } from "../../../helpers/format_date";
import { useSelector, useDispatch } from 'react-redux';
import { startloading, endloading } from '../../../store/loader/actions';
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import * as Yup from "yup";
import { useFormik } from "formik";
import { exportToExcel } from '../../../helpers/ExcelDownload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, Input, Badge, Space, TableColumnsType } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { showToast } from '../../../store/toast/actions';

interface ExpandedDataType {
    key: React.Key;
    date: string;
    name: string;
    upgradeNum: string;
}
interface DataType {
    key: React.Key;
    name: string;
    platform: string;
    version: string;
    upgradeNum: number;
    creator: string;
    createdAt: string;
}
const TenantUsers = props => {

    const modalRef = useRef();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const [tableData, setTableData] = useState([]);
    const [basicActive, setBasicActive] = useState('tab1');
    const [excelData, setExcelData] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});

    const handleBasicClick = (value) => {
        if (value === basicActive) {
            return;
        }

        setBasicActive(value);
    };

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);

    };

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
                <div title={props.t("Update")} className="icon icon-update" onClick={() => { updateTenantUser(item) }}></div>
            </div>);
        return actions;
    };

    const [firstNamesearchText, firstNameSetSearchText] = useState('');
    const [lastNamesearchText, lastNameSetSearchText] = useState('');
    const [emailSearchText, emailSetSearchText] = useState('');
    const uniqueRoleNames = Array.from(new Set(tableData.map(item => item.userRoleName)));
    const uniqueStudyNames = Array.from(new Set(tableData.map(item => item.studyName)));


    const expandedRowRender = () => {
        const columns: TableColumnsType<ExpandedDataType> = [
            {
                title: props.t('Email'),
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: props.t('Number of accounts in the system'),
                dataIndex: 'count',
                key: 'count'
            },  
            {
                title: props.t('Study name'),
                dataIndex: 'studyName',
                key: 'studyName'
            }, 
            {
                title: props.t('First name'),
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: props.t('Last name'),
                dataIndex: 'lastName',
                key: 'lastName'
            },
            {
                title: props.t('Study role name'),
                dataIndex: 'userRoleName',
                key: 'userRoleName',
                sorter: (a, b) => a.userRoleName.localeCompare(b.userRoleName),
                sortDirections: ['ascend', 'descend'],
                filteredValue: filteredInfo.userRoleName || null,
                filters: uniqueRoleNames.map(item => ({ ...item, text: item, value: item })),
                onFilter: (value, record) => record.userRoleName === value,
            },
            {
                title: props.t('Created on'),
                dataIndex: 'createdOn',
                key: 'createdOn'
            },
            {
                title: props.t('Last updated on'),
                dataIndex: 'lastUpdatedOn',
                key: 'lastUpdatedOn'
            },
            {
                title: props.t('State'),
                dataIndex: 'isActive',
                key: 'isActive'
            },
            {
                title: props.t('Actions'),
                dataIndex: 'actions',
                width: "170px",             
                key: 'operation',               
            },
        ];      
        return <Table columns={columns} dataSource={tableData} pagination={false} />;
    };

    const columns: TableColumnsType<DataType> = [
        {
            title: props.t('Email'),
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            sortDirections: ['ascend', 'descend'],
            onFilter: (value, record) => String(record.email).toLowerCase().includes(value.toLowerCase()),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input.Search
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={(e) => emailSetSearchText(e.target.value)}
                        />
                    </div>
                );
            },
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Number of accounts in the system'),
            dataIndex: 'count',
            key: 'count'
        },         
    ];   

    const Data = {
        columns: [
            {
                title: props.t('Study name'),
                dataIndex: 'studyName',
                sorter: (a, b) => a.studyName.localeCompare(b.studyName),
                sortDirections: ['ascend', 'descend'],
                filteredValue: filteredInfo.studyName || null,
                filters: uniqueStudyNames.map(item => ({ ...item, text: item, value: item })),
                onFilter: (value, record) => record.studyName === value,
            },
            {
                title: props.t('First name'),
                dataIndex: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['ascend', 'descend'],
                filteredValue: [firstNamesearchText],
                onFilter: (value, record) => String(record.name).toLowerCase().includes(value.toLowerCase()),
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                    return (
                        <div style={{ padding: 8 }}>
                            <Input.Search
                                placeholder="Search name"
                                value={selectedKeys[0]}
                                onChange={(e) => firstNameSetSearchText(e.target.value)}
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
                filteredValue: [lastNamesearchText],
                onFilter: (value, record) => String(record.lastName).toLowerCase().includes(value.toLowerCase()),
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                    return (
                        <div style={{ padding: 8 }}>
                            <Input.Search
                                placeholder="Search name"
                                value={selectedKeys[0]}
                                onChange={(e) => lastNameSetSearchText(e.target.value)}
                            />
                        </div>
                    );
                },
                filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            },
            {
                title: props.t('Email'),
                dataIndex: 'email',
                sorter: (a, b) => a.email.localeCompare(b.email),
                sortDirections: ['ascend', 'descend'],
                filteredValue: [emailSearchText],
                onFilter: (value, record) => String(record.email).toLowerCase().includes(value.toLowerCase()),
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                    return (
                        <div style={{ padding: 8 }}>
                            <Input.Search
                                placeholder="Search name"
                                value={selectedKeys[0]}
                                onChange={(e) => emailSetSearchText(e.target.value)}
                            />
                        </div>
                    );
                },
                filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            },
            {
                title: props.t('Study role name'),
                dataIndex: 'userRoleName',
                sorter: (a, b) => a.userRoleName.localeCompare(b.userRoleName),
                sortDirections: ['ascend', 'descend'],
                filteredValue: filteredInfo.userRoleName || null,
                filters: uniqueRoleNames.map(item => ({ ...item, text: item, value: item })),
                onFilter: (value, record) => record.userRoleName === value,
            },
            {
                title: props.t('Created on'),
                dataIndex: 'createdOn',
                sorter: (a, b) => a.createdOn.localeCompare(b.createdOn),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Last updated on'),
                dataIndex: 'lastUpdatedOn',
                sorter: (a, b) => a.lastUpdatedOn.localeCompare(b.lastUpdatedOn),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('State'),
                dataIndex: 'isActive',
                sorter: (a, b) => a.isActive.localeCompare(b.isActive),
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

    const [triggerTenantUsers, resultTenantUsers] = useLazyTenantUserListGetQuery();
    const { data: tenantUsersData, error, isLoading } = resultTenantUsers;

    useEffect(() => {
        if (userInformation.tenantId) {
            triggerTenantUsers(userInformation.tenantId);
        }
    }, [userInformation.tenantId])

    useEffect(() => {
        dispatch(startloading());
        if (tenantUsersData && !isLoading && !error) {
            const updatedTenantUsersData = tenantUsersData.map(item => {
                return {
                    ...item,
                    createdOn: formatDate(item.createdOn),
                    lastUpdatedOn: formatDate(item.lastUpdatedOn),
                    isActive: item.isActive ? props.t("Active") : props.t("Passive"),
                    actions: getActions(item)
                };
            });
            setTableData(updatedTenantUsersData);

            const data = updatedTenantUsersData.map(updatedUser => {
                return [
                    updatedUser.name,
                    updatedUser.lastName,
                    updatedUser.email,
                    updatedUser.studyName,
                    updatedUser.createdOn,
                    updatedUser.lastUpdatedOn,
                    updatedUser.isActive,
                ];
            });

            setExcelData(data);

            //const timer = setTimeout(() => {
            //    generateInfoLabel();
            //}, 10)

            dispatch(endloading());

            /* return () => clearTimeout(timer);*/
        } else if (!isLoading && error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }, [tenantUsersData, error, isLoading, props.t]);

    const [tenantUserSet] = useTenantUserSetMutation();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            authUserId: "",
            userid: userInformation.userId,
            tenantid: userInformation.tenantId,
            studyId: "",
            name: "",
            lastname: "",
            email: ""
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(
                props.t("This field is required")
            ),
            lastname: Yup.string().required(
                props.t("This field is required")
            ),
            email: Yup.string().required(
                props.t("This field is required")
            ).email(props.t("Invalid email format")),
        }),

        onSubmit: async (values) => {
            try {
                dispatch(startloading());
                const response = await tenantUserSet(values);
                if (response.data.isSuccess) {
                    dispatch(showToast(props.t(response.data.message), true, true));
                    modalRef.current.tog_backdrop();
                    dispatch(endloading());
                } else {
                    dispatch(showToast(props.t(response.data.message), true, false));
                    dispatch(endloading());
                }
            } catch (e) {
                dispatch(endloading());
            }
        }
    });

    const updateTenantUser = (item) => {
        validationType.setValues({
            authUserId: item.authUserId,
            userid: userInformation.userId,
            tenantid: userInformation.tenantId,
            studyId: item.studyId,
            name: item.name,
            lastname: item.lastName,
            email: item.email
        });
        modalRef.current.tog_backdrop();
    };

    const resetValue = () => {
        validationType.validateForm().then(errors => {
            validationType.setErrors({});
            validationType.resetForm();
        });
    };
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const handleExpand = (expanded, record) => {
        const currentRowKey = record.key;
        if (expanded) {
            setExpandedRowKeys(prevKeys => [...prevKeys, currentRowKey]);
        } else {
            const filteredKeys = expandedRowKeys.filter(key => key !== currentRowKey);
            setExpandedRowKeys(filteredKeys);
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom: "5px" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t("User list")}</h6>
                            </Col>
                            <Col md="4">
                                <div className="float-end d-none d-md-block">
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={() => exportToExcel({
                                            headers: [
                                                props.t("First name"),
                                                props.t("Last name"),
                                                "Email",
                                                props.t("Study name"),
                                                props.t("Created on"),
                                                props.t("Last updated on"),
                                                props.t("State")
                                            ],
                                            rows: excelData
                                        },
                                            props.t("User list"),
                                            props.t("User list")
                                        )}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-download" /> {props.t("Excel Download")}
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
                                        dataSource={Data.rows.map(item => ({ ...item, key: item.studyUserId }))}
                                        columns={Data.columns}
                                        expandedRowKeys={expandedRowKeys}
                                        onExpand={handleExpand}
                                        pagination={true}
                                        scroll={{ x: 'max-content' }}
                                        onChange={handleChange}
                                        filteredInfo={filteredInfo}
                                        sortedInfo={sortedInfo}
                                    />
                                    <Table
                                        columns={columns}
                                        expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
                                        dataSource={tableData}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalComp
                refs={modalRef}
                title={props.t("Update user")}
                body={
                    <>
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
                                    />
                                    {validationType.touched.lastname && validationType.errors.lastname ? (
                                        <FormFeedback type="invalid">{validationType.errors.lastname}</FormFeedback>
                                    ) : null}
                                </div>
                                <div className="mb-3 col-md-6">
                                    <Label className="form-label">{props.t("e-Mail")}</Label>
                                    <Input
                                        name="email"
                                        placeholder="abc@hotmail.com"
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
                                    {validationType.touched.email && validationType.errors.email ? (
                                        <FormFeedback type="invalid">{validationType.errors.email}</FormFeedback>
                                    ) : null}
                                </div>
                            </div>
                        </Form>
                    </>
                }
                resetValue={resetValue}
                handle={() => validationType.handleSubmit()}
                buttonText={props.t("Update")}
            />
        </React.Fragment>
    );
};


TenantUsers.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(TenantUsers);