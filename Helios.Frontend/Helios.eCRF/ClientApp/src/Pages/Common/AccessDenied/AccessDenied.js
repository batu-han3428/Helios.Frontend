import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

//Import Images
import errorImg from "../../../assets/images/error.png";
import { withTranslation } from "react-i18next";


const AccessDeniend = (props) => {
    document.title = "500 Error Page | Veltrix - React Admin & Dashboard Template";

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
                                                    <h4 className="mb-4">{props.t("HELIOS E-CRF SYSTEM")}</h4>
                                                    <p className="mb-5">{props.t("You do not have access to this resource. Please contact the system administrator regarding your privileges.")}</p>
                                                    <Link className="btn btn-primary mb-5 waves-effect waves-light" to="/"><i className="mdi mdi-home"></i> {props.t("Back to home page")}</Link>
                                                </div>

                                            </Col>
                                            <Col lg={5} className="mx-auto">
                                                <img src={errorImg} alt="" className="img-fluid mx-auto d-block" />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>

            </div>

        </React.Fragment >
    );
};

export default withTranslation()(AccessDeniend);