﻿import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col, CardHeader, Card, CardBody, Alert } from "reactstrap";
import "./sso.css";
import { useLazyTenantListGetQuery, useSsoLoginPostMutation } from '../../store/services/SSO/SSO_Api';
import { useSelector, useDispatch } from 'react-redux';
import { startloading, endloading } from '../../store/loader/actions';
import { useNavigate, Link, useParams } from "react-router-dom";
import { setLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { onLogin } from '../../helpers/Auth/useAuth';
import { loginuser } from '../../store/actions';
import { Button, ConfigProvider, Table } from 'antd';
import { TinyColor } from '@ctrl/tinycolor';
import { showToast } from '../../store/toast/actions';
import { SearchOutlined } from '@ant-design/icons';

const SSO_Tenants = props => {

    const colors1 = ['#6253E1', '#04BEFE'];
    const getHoverColors = (colors: string[]) =>
        colors.map((color) => new TinyColor(color).lighten(5).toString());
    const getActiveColors = (colors: string[]) =>
        colors.map((color) => new TinyColor(color).darken(5).toString());

    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [triggerTenants, { data: tenantsData, isLoadingTenants, isErrorTenants }] = useLazyTenantListGetQuery();

    useEffect(() => {
        dispatch(startloading());
        if (tenantsData && !isLoadingTenants && !isErrorTenants) {
            setData(tenantsData);
            dispatch(endloading());
        } else if (isErrorTenants && !isLoadingTenants) {
            dispatch(endloading());
        }
    }, [tenantsData, isErrorTenants, isLoadingTenants]);

    const searchFilter = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredData = data.filter((item) =>
        item.tenantName.toLowerCase().includes(searchTerm)
    );  


    const { role } = useParams();
    const columns = [
        {
            title: props.t('Tenant name'),
            dataIndex: 'tenantName',
            sorter: (a, b) => a.tenantName.localeCompare(b.tenantName),
            sortDirections: ['ascend', 'descend'],
            onFilter: (value, record) => String(record.tenantName).toLowerCase().includes(value.toLowerCase()),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Actions'),
            dataIndex: 'actions',
            width: "170px",
            render: (text, record) => {
                return (
                    <div className="icon-container">
                        <div className="icon icon-demo" onClick={() => goToStudies(record.id)}></div>
                    </div>
                );
            }
        },
    ]

    useEffect(() => {
        if (userInformation.userId && role) {
            triggerTenants({ userId: userInformation.userId, role: role });
        }
    }, [userInformation.userId, role])

   

    const [ssoLoginPost] = useSsoLoginPostMutation();

    const goToStudies = async (tenantId) => {
        if (role === "3") {
            dispatch(startloading())
            const response = await ssoLoginPost({ tenantId: tenantId });

            if (response.data.isSuccess) {
                setLocalStorage("accessToken", response.data.values.accessToken);
                let result = onLogin();

                dispatch(endloading())
                if (result === false) {
                    dispatch(showToast(props.t("An unexpected error occurred."), false, false));
                } else {
                    dispatch(loginuser(result));
                    navigate("/");
                }
            } else {
                dispatch(showToast(props.t("An unexpected error occurred."), false, false));
            }

        } else if (role === "4") {
            navigate(`/SSO-studies/${tenantId}`);
        }
    }

    return (
        <> <div className="page-content">
            <div className="container-fluid">
                <Row style={{ marginTop: "10px" }}>
                    <Col className="col-12">
                        <Card>
                            <CardHeader style={{ background: "#FFFFFF", borderBottom: "1px solid #e7eaec", margin: "0 30px" }}>
                                <div className="ibox-title" style={{ display: "flex", justifyContent: "space-between" }} >
                                    <h5 style={{ margin: "10px 7px", color: "#6D6E70", fontFamily: "arial, sans-serif", fontSize: "15px" }}>{props.t("Please select the tenant you want to login")}</h5>
                                    <div style={{ marginRight: "70px" }}>
                                        <form noValidate="novalidate" onSubmit={(event) => event.preventDefault()} className="searchbox">
                                            <div role="search" className="searchbox__wrapper">
                                                <input id="search-input" value={searchTerm} onChange={searchFilter} type="search" name="search" placeholder={props.t("Search")} autoComplete="off" required="required" className="searchbox__input" />
                                                <button type="submit" title="Submit your search query." className="searchbox__submit">
                                                    <svg role="img" aria-label="Search">
                                                        <use xlinkHref="#sbx-icon-search-13"></use>
                                                    </svg>
                                                </button>
                                                <button type="reset" onClick={() => setSearchTerm('')} title="Clear the search query." className="searchbox__reset searchbox-hide">
                                                    <svg role="img" aria-label="Reset">
                                                        <use xlinkHref="#sbx-icon-clear-3"></use>
                                                    </svg>
                                                </button>
                                            </div>
                                        </form>
                                        <div className="svg-icons" style={{ height: "0", width: "0", position: "absolute", visibility: "hidden" }} >
                                            <svg xmlns="http://www.w3.org/2000/svg">
                                                <symbol id="sbx-icon-clear-3" viewBox="0 0 40 40"><path d="M16.228 20L1.886 5.657 0 3.772 3.772 0l1.885 1.886L20 16.228 34.343 1.886 36.228 0 40 3.772l-1.886 1.885L23.772 20l14.342 14.343L40 36.228 36.228 40l-1.885-1.886L20 23.772 5.657 38.114 3.772 40 0 36.228l1.886-1.885L16.228 20z" fillRule="evenodd"></path></symbol>
                                                <symbol id="sbx-icon-search-13" viewBox="0 0 40 40"><path d="M26.806 29.012a16.312 16.312 0 0 1-10.427 3.746C7.332 32.758 0 25.425 0 16.378 0 7.334 7.333 0 16.38 0c9.045 0 16.378 7.333 16.378 16.38 0 3.96-1.406 7.593-3.746 10.426L39.547 37.34c.607.608.61 1.59-.004 2.203a1.56 1.56 0 0 1-2.202.004L26.807 29.012zm-10.427.627c7.322 0 13.26-5.938 13.26-13.26 0-7.324-5.938-13.26-13.26-13.26-7.324 0-13.26 5.936-13.26 13.26 0 7.322 5.936 13.26 13.26 13.26z" fillRule="evenodd"></path></symbol>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div style={{ flexWrap: "wrap", justifyContent: "center" }}>
                                    {isLoadingTenants && !isErrorTenants && filteredData.length === 0 ? (
                                        <Alert color="warning" style={{ height: "50px" }}>
                                            {props.t("You do not have an active tenant, if you think there is an error, please contact the system administrator.")} <Link to="/ContactUs"> {props.t("Contact us")}</Link>
                                        </Alert>
                                    ) : (
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData}
                                            pagination={true}
                                            scroll={{ x: 'max-content' }}
                                            onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: () => {
                                                        goToStudies(record.id)
                                                    }
                                                }
                                            }}
                                            rowKey={(record) => record.id}
                                        />
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
        </>
    );
};


SSO_Tenants.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SSO_Tenants);