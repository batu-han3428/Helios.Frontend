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


const SSO_NotFoundPage = props => {
  
    return (
        <div className="page-content">
            <div className="container-fluid">
                <Row style={{ marginTop: "10px" }}>
                    <Col className="col-12">
                        <Card>
                            <CardHeader style={{ background: "#FFFFFF", borderBottom: "0px solid #e7eaec", margin: "0 30px" }}>
                              
                            </CardHeader>
                            <CardBody>
                                <div style={{ flexWrap: "wrap", justifyContent: "center" }}>                                 
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <Alert color="warning" style={{ height: "50px" }}>
                                                {props.t("You are no longer actively studying in our system. We are very sorry about that :( If you think there is a problem, please contact the system administrator.")} <Link to="/ContactUs"> {props.t("Contact us")}</Link>
                                            </Alert>
                                            <img src={myImage} alt="Warning Icon" style={{ height: "450px", width: "450px", marginRight: "10px" }} />
                                        </div>                                  
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};


SSO_NotFoundPage.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SSO_NotFoundPage);