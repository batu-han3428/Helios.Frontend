import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col, CardHeader, Card, CardBody, Alert } from "reactstrap";
import "./sso.css";
import { useLazyTenantOrStudytGetQuery } from '../../store/services/SSO/SSO_Api';
import { useSelector, useDispatch } from 'react-redux';
import { startloading, endloading } from '../../store/loader/actions';
import { useNavigate, Link } from "react-router-dom";
import { Button, ConfigProvider, Table } from 'antd';
import { TinyColor } from '@ctrl/tinycolor';
import { SearchOutlined } from '@ant-design/icons';
import myImage from '../../../src/assets/images/gezegen.jpg';


const SSO_TenantsOrStudies = props => {

    const colors1 = ['#6253E1', '#04BEFE'];
    const getHoverColors = (colors: string[]) =>
        colors.map((color) => new TinyColor(color).lighten(5).toString());
    const getActiveColors = (colors: string[]) =>
        colors.map((color) => new TinyColor(color).darken(5).toString());
    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [tsCount, setTsCount] = useState({ superAdminCount:0, systemCount: 0, tenantCount: 0, studyCount: 0 });

    const [trigger, { data, isLoading, isError }] = useLazyTenantOrStudytGetQuery();

    const filteredData = [];

    useEffect(() => {
        if (userInformation.userId) {
            trigger(userInformation.userId);
        }
    }, [userInformation.userId])

    useEffect(() => {
        dispatch(startloading());
        if (data && !isLoading && !isError) {
            dispatch(endloading());
            if (data.tenantCount === 1 && data.studyCount === 0) {
                navigate("/");
            } else if (data.tenantCount === 0 && data.studyCount === 1) {
                navigate("/UnderConstruction");
            } else {
                setTsCount(data);
            }
        } else if (!isLoading && isError) {
            dispatch(endloading());
        }
    }, [data, isLoading, isError]);

    const goToTenants = (role) => {
        if (role===1) {
            navigate(`/add-system-admin`);
        }
        else if (role === 2) {
            navigate(`/tenants`);
        }
        else {
            navigate(`/SSO-tenants/${role}`);
        }

    }
    const Data = [
        {
            id: 1,
            name: props.t('Super admin')
        },
        {
            id: 2,
            key: 2,
            name: props.t('System admin')
        },
        {
            id: 3,
            key: 3,
            name: props.t('Tenant admin')
        },
        {
            id: 4,
            key: 4,
            name: props.t('Study')
        }
    ]
    const columns = [
        {
            title: props.t('Account name'),
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
            onFilter: (value, record) => String(record.studyName).toLowerCase().includes(value.toLowerCase()),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Action'),
            dataIndex: 'actions',
            width: "170px",
            render: (text, record) => {
                return (
                    <div className="icon-container">
                        <div className="icon icon-demo" onClick={() => goToTenants(record.id)}></div>
                    </div>
                );
            }
        },
    ]
    if (tsCount.superAdminCount && tsCount.superAdminCount > 0) {
        filteredData.push(Data[0]);
    }
    if (tsCount.systemCount && tsCount.systemCount > 0) {
        filteredData.push(Data[1]);
    }
    if (((tsCount.tenantCount && tsCount.tenantCount > 1) || (tsCount.studyCount && tsCount.studyCount > 0 && tsCount.tenantCount && tsCount.tenantCount > 0))) {
        filteredData.push(Data[2]);
    }
    if (((tsCount.studyCount && tsCount.studyCount > 1) || (tsCount.tenantCount && tsCount.tenantCount > 0 && tsCount.studyCount && tsCount.studyCount > 0))) {
        filteredData.push(Data[3]);
    }
    return (
        <div className="page-content">
            <div className="container-fluid">
                <Row style={{ marginTop: "10px" }}>
                    <Col className="col-12">
                        <Card>
                            <CardHeader style={{ background: "#FFFFFF", borderBottom: "1px solid #e7eaec", margin: "0 30px" }}>
                                <div className="ibox-title" style={{ display: "flex", justifyContent: "space-between" }} >
                                    <h5 style={{ margin: "10px 7px", color: "#6D6E70", fontFamily: "arial, sans-serif", fontSize: "15px" }}>{props.t("Please select the account you want to log in")}</h5>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div style={{ flexWrap: "wrap", justifyContent: "center" }}>
                                    {!isLoading && !isError && tsCount.studyCount < 1 && tsCount.tenantCount < 1 ? (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <Alert color="warning" style={{ height: "50px" }}>
                                                {props.t("You are no longer actively studying in our system. We are very sorry about that :( If you think there is a problem, please contact the system administrator.")} <Link to="/ContactUs"> {props.t("Contact us")}</Link>
                                            </Alert>
                                            <img src={myImage} alt="Warning Icon" style={{ height: "450px", width: "450px", marginRight: "10px" }} />
                                        </div>

                                    ) : (

                                        <Table
                                            columns={columns}
                                            dataSource={filteredData}
                                            pagination={true}
                                            scroll={{ x: 'max-content' }}
                                            onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: () => {
                                                        goToTenants(record.id)
                                                    }
                                                }
                                            }}
                                        />
                                    )
                                    }


                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};


SSO_TenantsOrStudies.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SSO_TenantsOrStudies);