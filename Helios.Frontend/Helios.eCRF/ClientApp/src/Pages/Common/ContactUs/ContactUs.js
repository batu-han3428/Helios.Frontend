import React, { useRef } from "react";
import {
    Row,
    Col,
    Form,
    Label,
    Input,
    FormFeedback,
    Button
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContactUsPostMutation } from "../../../store/services/ContactUs";
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import { useDispatch } from "react-redux";
import { startloading, endloading } from "../../../store/loader/actions";
import { withTranslation } from "react-i18next";


const ContactUs = (props) => {
    document.title = "Contact Us Page | Veltrix - React Admin & Dashboard Template";

    const toastRef = useRef();

    const dispatch = useDispatch();

    const [contactUsPost, { isLoading }] = useContactUsPostMutation();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            namesurname: '',
            email: '',
            institutionname: '',
            studycode: '',
            yourmessage: '',
        },
        validationSchema: Yup.object().shape({
            namesurname: Yup.string().required(
                props.t("This value is required")
            ),
            email: Yup.string().required(
                props.t("This value is required")
            ),
            institutionname: Yup.string().required(
                props.t("This value is required")
            ),
            studycode: Yup.string().required(
                props.t("This value is required")
            ),
            yourmessage: Yup.string().required(
                props.t("This value is required")
            ),
        }),
        onSubmit: async (values) => {
            dispatch(startloading());
            const response = await contactUsPost(values);

            if (response.data.isSuccess) {
                dispatch(endloading());
                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: true
                });
            } else {
                dispatch(endloading());
                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: false
                });
            }
        }
    });

    return (
        <React.Fragment>
            <div className="page-content" style={{ minHeight: "100vh",
            backgroundColor: "white",
            position: "relative",
          }}>
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center justify-content-center">
                            <Col className="col-lg-6 col-md-offset-3" style={{
                                textAlign: "center", marginBottom: "15px",
                            paddingBottom: "15px",
                            borderBottom: "2px solid #ffc600" } }>
                                <h3 style={{
                                    color: "#ffc600",
                                    fontSize: "30pt",
                                    fontWeight: "bold"
                                }}>{props.t("Contact us")}</h3>
                                <span style={{ fontSize: "12px", color: "#6D6E70" }}>{props.t("Please complete the form below to contact us.")}</span>
                            </Col>
                        </Row>
                    </div>
                    <Row className="justify-content-center">
                        <Col lg={4 }>
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validationType.handleSubmit();
                                    return false;
                                }}>
                                <div className="mb-3">
                                    <Label className="form-label">{props.t("Name / Surname")}</Label>
                                    <Input
                                        name="namesurname"
                                        placeholder=""
                                        type="text"
                                        onChange={validationType.handleChange}
                                        onBlur={(e) => {
                                            validationType.handleBlur(e);
                                        }}
                                        value={validationType.values.namesurname || ""}
                                        invalid={
                                            validationType.touched.namesurname && validationType.errors.namesurname ? true : false
                                        }
                                    />
                                    {validationType.touched.namesurname && validationType.errors.namesurname ? (
                                        <FormFeedback type="invalid">{validationType.errors.namesurname}</FormFeedback>
                                    ) : null}
                                </div>
                                <div className="mb-3">
                                    <Label className="form-label">{props.t("Your e-mail address")}</Label>
                                    <Input
                                        name="email"
                                        placeholder="abc@xyz.com"
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
                                <div className="mb-3">
                                    <Label>{props.t("Institution name")}</Label>
                                    <Input
                                        name="institutionname"
                                        type="text"
                                        placeholder=""
                                        onChange={validationType.handleChange}
                                        onBlur={(e) => {
                                            validationType.handleBlur(e);
                                        }}
                                        value={validationType.values.institutionname || ""}
                                        invalid={
                                            validationType.touched.institutionname && validationType.errors.institutionname ? true : false
                                        }
                                    />
                                    {validationType.touched.institutionname && validationType.errors.institutionname ? (
                                        <FormFeedback type="invalid">{validationType.errors.institutionname}</FormFeedback>
                                    ) : null}
                                </div>
                                <div className="mb-3">
                                    <Label className="form-label">{props.t("Study code")}</Label>
                                    <Input
                                        name="studycode"
                                        type="text"
                                        placeholder=""
                                        onChange={validationType.handleChange}
                                        onBlur={(e) => {
                                            validationType.handleBlur(e);
                                        }}
                                        value={validationType.values.studycode || ""}
                                        invalid={
                                            validationType.touched.studycode && validationType.errors.studycode ? true : false
                                        }
                                    />
                                    {validationType.touched.studycode && validationType.errors.studycode ? (
                                        <FormFeedback type="invalid">{validationType.errors.studycode}</FormFeedback>
                                    ) : null}
                                </div>
                                <div className="mb-3">
                                    <Label className="form-label">{props.t("Your message")}</Label>
                                    <Input
                                        name="yourmessage"
                                        type="textarea"
                                        onChange={e => {
                                            validationType.handleChange(e);
                                        }}
                                        onBlur={(e) => {
                                            validationType.handleBlur(e);
                                        }}
                                        value={validationType.values.yourmessage || ""}
                                        rows="3"
                                        placeholder=""
                                        invalid={
                                            validationType.touched.yourmessage && validationType.errors.yourmessage ? true : false
                                        }
                                    />
                                    {validationType.touched.yourmessage && validationType.errors.yourmessage ? (
                                        <FormFeedback type="invalid">{validationType.errors.yourmessage}</FormFeedback>
                                    ) : null}
                                </div>
                                <div>
                                    <Button style={{ float:"right" }} color="success" type="submit">
                                        {props.t("Send")}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col className="col-lg-6 col-md-offset-3" style={{
                            textAlign: "center", marginTop: "15px",
                            paddingTop: "15px",
                            borderTop: "2px solid #ffc600"
                        }}>
                            <p style={{ margin: "0", padding: "0" } }><span  style={{
                                color: "black",
                                fontWeight: "bold", fontSize:"12px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
                            }}>{props.t("Send us an e-mail")} : </span><a href="mailto:contact@helios-crf.com"> contact@helios-crf.com </a></p>
                            <p style={{ margin: "0", padding: "0" }}><span  style={{
                                color: "black",
                                fontWeight: "bold", fontSize: "12px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
                            }}>{props.t("Call us")} :</span><a href="tel://+902122341260"> +90 212 234 12 60 </a></p>
                            <p style={{ margin: "0", padding: "0" }}> <span  style={{
                                color: "black",
                                fontWeight: "bold", fontSize: "12px", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif"
                            }}>{props.t("Address")} :</span><a target="_blank" href="https://goo.gl/maps/pXPMkwYwHpJUPJjv9"> Cumhuriyet District Haciahmet Silahsor Street Yeniyol Street No: 2/58 Now, 34440 Sisli/Istanbul, Turkey </a></p>
                        </Col>
                    </Row>
                </div>
            </div>
            <ToastComp
                ref={toastRef}
            />
        </React.Fragment>
    );
};

export default withTranslation()(ContactUs);
