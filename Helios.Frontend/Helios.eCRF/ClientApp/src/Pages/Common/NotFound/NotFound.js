import React from "react";
import { Container, Card, CardBody, Row, Col } from "reactstrap";

//Import Images
import errorImg from "../../../assets/images/error.png";
import { withTranslation } from "react-i18next";

const NotFound = (props) => {
    document.title = "404 Error Page | Veltrix - React Admin & Dashboard Template";

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
                                                    <p className="mb-5">{props.t("We can't seem to find the page you're looking for.")}<br />
                                                        <span dangerouslySetInnerHTML={{ __html: props.t("Try going @Back to the previous page or see our @Contactus page for more information").replace("@Back", `<a href="javascript:history.back()"> ${props.t("Back")} </a>`).replace("@Contactus", `<a href="/ContactUs"> ${props.t("Contact us")}</a>`) }}></span>
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

export default withTranslation()(NotFound);