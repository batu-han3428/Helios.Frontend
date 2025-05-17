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
import Swal from 'sweetalert2';
import { useUserActivePassiveMutation, useUserActivePassiveByAuthUserIdMutation } from '../../../store/services/Users';

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
    const studyInformation = useSelector(state => state.rootReducer.Study);

    const dispatch = useDispatch();

    const [tableData, setTableData] = useState([]);
    const [groupTableData, setGroupTableData] = useState([]);
    const [basicActive, setBasicActive] = useState('tab1');
    const [excelData, setExcelData] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [activeUserCount, setActiveUserCount] = useState(0);
    const [tenantUserLimit, setTenantUserLimit] = useState();
    const [tenatUserLimitStatu, setTenatUserLimitStatu] = useState();
    const [dropdownOpen, setDropdownOpen] = useState({});

    const [isTenantLimitChecked, setIsTenantLimitChecked] = useState(false);
    const [userActivePassive] = useUserActivePassiveMutation();

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

    const activePassiveUser = (item, tenantuserlimitstatu) => {     
        if (!tenantuserlimitstatu && !item.isActive) {
            dispatch(showToast(props.t("Your user adding limit for the relevant tenant has been reached. Please contact the system administrator."), true, false));

        } else {
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
                            studyId: item.studyId,
                            userId: item.studyUserId,
                            name: item.name,
                            lastName: item.lastName,
                            isActive: item.isActive,
                            email: item.email,
                            roleId: item.roleId,
                            siteIds: [],
                            password: "",
                            researchName: item.studyName,
                            researchLanguage: studyInformation.studyLanguage,
                            firstAddition: false,
                            responsiblePersonIds: []
                        };
                        const response = await userActivePassive(activePassiveData);
                        if (response.data.isSuccess) {
                            dispatch(endloading());
                            setIsTenantLimitChecked(false);
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
    }

    const [userActivePassiveByAuthUserId] = useUserActivePassiveByAuthUserIdMutation();
    const activePassiveUsers = (users, tenantuserlimitstatu) => {
        const limit = tenantUserLimit - activeUserCount;
        const userscount = users.filter(user => user.isActive === props.t("Passive")).length;
        const userStatu = users.some(user => user.isActive === props.t("Active"));
        if ((!tenantuserlimitstatu && !userStatu) || (tenantuserlimitstatu && (userscount==0 || userscount > limit))) {
            dispatch(showToast(props.t("Your user adding limit for the relevant tenant has been reached. Please contact the system administrator."), true, false));

        } else {
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
                            authUserId: users[0].authUserId,
                            tenantId: userInformation.tenantId,
                        };
                        const response = await userActivePassiveByAuthUserId(activePassiveData);
                        if (response.data.isSuccess) {
                            dispatch(endloading());
                            setIsTenantLimitChecked(false);
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
    }

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
                <div title={props.t("Active or passive")} className="icon icon-lock" onClick={() => { activePassiveUser(item, tenatUserLimitStatu) }}></div>
            </div>);
        return actions;
    };
    const getAllUserActions = (users) => {
        const actions = (
            <div className="icon-container">             
                <div title={props.t("Active or passive")} className="icon icon-lock" onClick={() => { activePassiveUsers(users, tenatUserLimitStatu) }}></div>
            </div>);
        return actions;
    };

    const [emailSearchText, emailSetSearchText] = useState('');
    const uniqueRoleNames = Array.from(new Set(tableData.map(item => item.userRoleName)));
    const uniqueStudyNames = Array.from(new Set(tableData.map(item => item.studyName)));


    const columns: TableColumnsType<DataType> = [
        {
            title: props.t('Email'),
            dataIndex: 'email',
            key: 'email',
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
            title: props.t('Number of accounts in the system'),
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: props.t('Study name'),
            dataIndex: 'studyName',
            key: 'studyName',
            sorter: (a, b) => a.studyName.localeCompare(b.studyName),
            sortDirections: ['ascend', 'descend'],
            filteredValue: filteredInfo.studyName || null,
            filters: [
                { text: 'Demo', value: 'demo' },
                { text: 'Live', value: 'live' },
            ],
            onFilter: (value, record) => {
                const studyName = String(record.studyName).toLowerCase();
                if (value === 'live') {
                    return studyName.slice(0, 4) !== 'demo';
                }
                return (studyName !== '-' ? studyName.slice(0, 4) === value : true);
            },
        },
        {
            title: props.t('First name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: props.t('Last name'),
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: props.t('Study role name'),
            dataIndex: 'userRoleName',
            key: 'userRoleName',
            sorter: (a, b) => a.userRoleName.localeCompare(b.userRoleName),
            sortDirections: ['ascend', 'descend'],
            filteredValue: filteredInfo.userRoleName || null,
            filters: uniqueRoleNames.map(item => ({ ...item, text: item, value: item })),
            onFilter: (value, record) => (record.userRoleName !== '-' ? record.userRoleName === value : true),
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
            key: 'isActive',
            render: (text, record) => (
                <span style={{ color: record.isActive === props.t("Active") ? 'green' : 'red' }}>
                    {record.isActive}
                </span>
            ),
        },
        {
            title: props.t('Actions'),
            dataIndex: 'actions',
            width: "170px",
            key: 'operation',
        }
    ];

    const [triggerTenantUsers, resultTenantUsers] = useLazyTenantUserListGetQuery();
    const { data: tenantUsersData, error, isLoading } = resultTenantUsers;

    useEffect(() => {
        if (userInformation.tenantId) {
            triggerTenantUsers(userInformation.tenantId);
        }
    }, [userInformation.tenantId, isTenantLimitChecked])

    useEffect(() => {
        if (tenantUsersData && !isLoading && !error) {
            const activeusercount = tenantUsersData.tenantUserList.reduce((total, user) => {
                if (user.isActive) {
                    total += 1;
                }
                return total;
            }, 0);
            setActiveUserCount(activeusercount);
            setTenantUserLimit(tenantUsersData.tenantUserLimit);

            if (activeusercount === tenantUsersData.tenantUserLimit) {
                setTenatUserLimitStatu(false);
            }
            else {
                setTenatUserLimitStatu(true);
            }

            setIsTenantLimitChecked(true);

        }
    }, [tenantUsersData, error, isLoading])

    const toggle = (userId) => {
        setDropdownOpen(prevState => {
            return {
                ...prevState,
                [userId]: !prevState[userId]
            };
        });
    };

    useEffect(() => {
        if (isTenantLimitChecked) {
            dispatch(startloading());
            if (tenantUsersData && !isLoading && !error) {              
                const updatedTenantUsersData = tenantUsersData.tenantUserList.map(item => {
                    return {
                        ...item,
                        createdOn: formatDate(item.createdOn),
                        lastUpdatedOn: formatDate(item.lastUpdatedOn),
                        isActive: item.isActive ? props.t("Active") : props.t("Passive"),
                        count: 1,
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

                const groupedData = updatedTenantUsersData.reduce((acc, updatedUser) => {
                    if (!acc[updatedUser.email]) {
                        acc[updatedUser.email] = [];
                    }
                    acc[updatedUser.email].push(updatedUser);
                    return acc;
                }, {});
                const GroupDataSource = Object.keys(groupedData).map((email, index) => {
                    const users = groupedData[email];

                    return {
                        key: index,
                        email: email,
                        count: users.length,
                        studyName: "-",
                        userRoleName: "-",
                        children: users,
                       /* actions: getAllUserActions(users)*/
                    };
                });
                setGroupTableData(GroupDataSource);
                dispatch(endloading());

                /* return () => clearTimeout(timer);*/
            } else if (!isLoading && error) {
                if (error.data != null) {
                    setTenantUserLimit(error.data.tenantUserLimit)
                    setActiveUserCount(error.data.tenantUserList.length);
                }
                else {
                    dispatch(showToast(props.t("An unexpected error occurred."), true, false));
                }
                dispatch(endloading());
            }
        }
    }, [tenantUsersData, error, isLoading, props.t, dropdownOpen, isTenantLimitChecked]);

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
                                    {tenantUserLimit !== undefined && <p className="card-title-desc" style={{ color: "red", marginRight: "0", textAlign: "right" }}>{props.t("Active user")}:{activeUserCount}/{tenantUserLimit}</p>}
                                    <Table
                                        size="small"
                                        columns={columns}
                                        indentSize={0}
                                        dataSource={groupTableData}
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