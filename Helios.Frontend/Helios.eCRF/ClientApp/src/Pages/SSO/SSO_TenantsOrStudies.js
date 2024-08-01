import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col, CardHeader, Card, CardBody, Alert } from "reactstrap";
import "./sso.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLazyTenantOrStudytGetQuery } from '../../store/services/SSO/SSO_Api';
import { useSelector, useDispatch } from 'react-redux';
import { startloading, endloading } from '../../store/loader/actions';
import { useNavigate, Link } from "react-router-dom";
import { Button, ConfigProvider } from 'antd';
import { TinyColor } from '@ctrl/tinycolor';


const SSO_TenantsOrStudies = props => {

    const colors1 = ['#6253E1', '#04BEFE'];
    const getHoverColors = (colors: string[]) =>
        colors.map((color) => new TinyColor(color).lighten(5).toString());
    const getActiveColors = (colors: string[]) =>
        colors.map((color) => new TinyColor(color).darken(5).toString());
    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [tsCount, setTsCount] = useState({ tenantCount: 0, studyCount: 0 });

    const [trigger, { data, isLoading, isError}] = useLazyTenantOrStudytGetQuery();

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
        navigate(`/SSO-tenants/${role}`);
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
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                                    {tsCount.studyCount < 1 && tsCount.tenantCount < 1 ? (
                                        <Alert color="warning" style={{ height: "50px" }}>
                                            {props.t("You do not have an active tenant, if you think there is an error, please contact the system administrator.")} <Link to="/ContactUs"> {props.t("Contact us")}</Link>
                                        </Alert>
                                    ) : (                                         
                                            <>
                                                {((tsCount.tenantCount && tsCount.tenantCount > 1) || (tsCount.studyCount && tsCount.studyCount > 0 && tsCount.tenantCount && tsCount.tenantCount > 0)) ? (
                                                    <div className="col-lg-2">
                                                        <div className=" float-e-margins" style={{ marginBottom: "0", marginTop:"25px" }}>
                                                            <div className="" style={{ padding: "0" }}>
                                                                <div>
                                                                    <div style={{ width: "90%" }}>
                                                                        <ConfigProvider
                                                                            theme={{
                                                                                components: {
                                                                                    Button: {
                                                                                        colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                                                                                        colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
                                                                                        colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
                                                                                        lineWidth: 0,
                                                                                    },
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Button type="primary" size="large" onClick={() => goToTenants(3)} style={{ width: "100%" }}>
                                                                                Admin
                                                                            </Button>
                                                                        </ConfigProvider>
                                                                       
                                                                    </div>                                                                  
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null}

                                                {((tsCount.studyCount && tsCount.studyCount > 1) || (tsCount.tenantCount && tsCount.tenantCount > 0 && tsCount.studyCount && tsCount.studyCount > 0)) ? (
                                                    <div className="col-lg-2">
                                                        <div className="ibox float-e-margins" style={{ marginBottom: "0", marginTop: "25px" }}>
                                                            <div className="" style={{ padding: "0" }}>
                                                                <div>
                                                                    <div style={{ width: "90%" }}>
                                                                        <ConfigProvider
                                                                            theme={{
                                                                                components: {
                                                                                    Button: {
                                                                                        colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                                                                                        colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
                                                                                        colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
                                                                                        lineWidth: 0,
                                                                                    },
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Button type="primary" size="large" onClick={() => goToTenants(4)} style={{ width: "100%" }}>
                                                                                Study
                                                                            </Button>
                                                                        </ConfigProvider>
                                                                    </div>                             
                                                                   
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ): null}
                                            </>
                                    )}
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