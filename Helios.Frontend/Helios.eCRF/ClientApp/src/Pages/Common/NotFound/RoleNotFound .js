import React from "react";
import { Container, Card, CardBody, Row, Col } from "reactstrap";

//Import Images
import errorImg from "../../../assets/images/error.png";
import { withTranslation } from "react-i18next";

const RoleNotFound = (props) => {  

    return (
        <React.Fragment>
            <div className="authentication-bg d-flex align-items-center pb-0 vh-100">
                <div className="content-center w-100">
                    <Container>
                        <Row className="justify-content-center">
                            <Col xl={10}>
                                <Card>
                                    <CardBody>
                                        <Row className="align-items-center">
                                            <Col lg={4} className="ms-auto">
                                                <div className="ex-page-content">
                                                    <h4 className="mb-4">{props.t("Sorry, page not found")}</h4>
                                                    <p className="mb-5">{props.t("Your study role has not yet been defined by the administrator. If you think there is a problem, please contact the system administrator.")}<br />

                                                    </p>
                                                </div>
                                            </Col>
                                            <Col lg={5} className="mx-auto">
                                                <img
                                                    src={errorImg}
                                                    alt=""
                                                    className="img-fluid mx-auto d-block"
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(RoleNotFound);