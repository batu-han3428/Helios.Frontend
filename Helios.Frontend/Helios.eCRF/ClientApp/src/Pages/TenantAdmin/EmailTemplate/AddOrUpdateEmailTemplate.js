import PropTypes from 'prop-types';
import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { withTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from "react-router-dom";
import TemplateTagList from './Comp/TemplateTagList';
import UserList from './Comp/UserList';
import TemplateForm from './Comp/TemplateForm';


const AddOrUpdateEmailTemplate = props => {

    const { studyId, templateId } = useParams();


    const userInformation = useSelector(state => state.rootReducer.Login);

    const navigate = useNavigate();

    const [templateType, setTemplateType] = useState();

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={8}>
                                <h6 className="page-title"><FontAwesomeIcon style={{ marginRight: "10px", cursor: "pointer", position: "relative", top: "0.5px" }} onClick={() => navigate(`/email-templates/${studyId}`)} icon="fa-solid fa-left-long" />{props.t("e-Mail templates")}</h6>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Row>
                                <Col md={12}>
                                    <TemplateTagList userId={userInformation.userId} tenantId={userInformation.tenantId} templateType={templateType} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <UserList studyId={studyId} />
                                </Col>
                            </Row>
                        </Col>
                        <Col md={8}>
                            <TemplateForm templateId={templateId} studyId={studyId} userId={userInformation.userId} tenantId={userInformation.tenantId} setTemplateType={setTemplateType} />
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};


AddOrUpdateEmailTemplate.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddOrUpdateEmailTemplate);