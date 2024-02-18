import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Card, CardBody, FormGroup, CardSubtitle, Label, Input, Form, FormFeedback } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import './study.css';
import { useStudySaveMutation } from '../../../store/services/Study';
import { useSelector } from "react-redux";
import { useStudyGetQuery } from '../../../store/services/Study';
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import { useDispatch } from "react-redux";
import { startloading, endloading } from '../../../store/loader/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AccordionComp from '../../../components/Common/AccordionComp/AccordionComp';


const AddOrUpdateStudy = props => {

    const toastRef = useRef();

    const [studyId, setStudyId] = useState(0);
    const [skip, setSkip] = useState(true);
    const [apiStudyData, setApiStudyData] = useState(null);

    const dispatch = useDispatch();

    const userInformation = useSelector(state => state.rootReducer.Login);

    const [studySave] = useStudySaveMutation();

    const navigate = useNavigate();

    const location = useLocation();

    const backPage = () => {
        navigate('/studylist');
    };

    const optionGroup = [
        {
            label: props.t("Languages"),
            options: [
                { label: props.t("English"), value: 1 },
                { label: props.t("Turkish"), value: 2 },
            ]
        }
    ];

    const validationType = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            userid: userInformation.userId,
            tenantid: userInformation.tenantId,
            studyId: studyId,
            studyname: apiStudyData ? apiStudyData.studyName : '',
            studylink: apiStudyData ? apiStudyData.studyLink : '',
            protocolcode: apiStudyData ? apiStudyData.protocolCode : '',
            studylanguage: apiStudyData ? apiStudyData.studyLanguage : 0,
            description: apiStudyData ? apiStudyData.description : '',
            subdescription: apiStudyData ? apiStudyData.subDescription : '',
            doubledataentry: apiStudyData ? apiStudyData.doubleDataEntry : false,
            asksubjectinitial: apiStudyData ? apiStudyData.askSubjectInitial : false,
            reasonforchange: apiStudyData ? apiStudyData.reasonForChange : true,
        },
        validationSchema: Yup.object().shape({
            studyname: Yup.string().required(
                props.t("This field is required")
            ),
            studylink: Yup.string().required(
                props.t("This field is required")
            ),
        }),
        onSubmit: async (values) => {
            dispatch(startloading());
            const response = await studySave(values);
            if (response.data.isSuccess) {
                dispatch(endloading());

                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: true
                });

                if (studyId === 0) {
                    setStudyId(response.data.values.studyId);
                }
            } else {
                dispatch(endloading());
                toastRef.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: false,
                    autoHide: false
                });
            }
        }
    });

    useEffect(() => {
        validationType.setValues({
            ...validationType.values,
            studyId: studyId,
        });
    }, [studyId]);

    useEffect(() => {
        setApiStudyData(null);
        if (location.state !== null) {
            dispatch(startloading());
            setStudyId(location.state.studyId);
            setSkip(false);
        }
    }, []);

    const { data: studyData, error, isLoading } = useStudyGetQuery({
        skip, refetchOnMountOrArgChange: true 
    });

    useEffect(() => {
        if (!isLoading && !error && studyData) {
            setApiStudyData(studyData);
            setSkip(true);
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(endloading());
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
        }else {
            dispatch(endloading());
        }
    }, [studyData, error, isLoading]);


    document.title = "Study | Veltrix - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={8}>
                                <h6 className="page-title"><FontAwesomeIcon style={{ marginRight: "10px", cursor: "pointer", position: "relative", top: "0.5px" }} onClick={backPage} icon="fa-solid fa-left-long" />{props.t("Study information")}</h6>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <Card style={{ width: "50%", backgroundColor:"#f8f8fa", boxShadow:"unset", margin: "0 auto" }}>
                                <CardBody>
                                    <Label className="form-label">{props.t("Study information")}</Label>
                                    <CardSubtitle className="mb-3">
                                        {props.t("Your study will be created on the Azure Server because you are logged in the domain: trials.helios-crf.com.")}
                                    </CardSubtitle>
                                     <Form
                                        onSubmit={(e) => {
                                        e.preventDefault();
                                        validationType.handleSubmit();
                                        return false;
                                    }}>
                                        <div className="mb-3">
                                          <Label className="form-label">{props.t("Study name")}</Label>
                                          <Input
                                            name="studyname"
                                            placeholder={props.t("Study name")}
                                            type="text"
                                            onChange={validationType.handleChange}
                                            onBlur={(e) => {
                                                validationType.handleBlur(e);
                                                validationType.submitForm();
                                            }}
                                            value={validationType.values.studyname || ""}
                                            invalid={
                                              validationType.touched.studyname && validationType.errors.studyname ? true : false
                                            }
                                          />
                                          {validationType.touched.studyname && validationType.errors.studyname ? (
                                            <FormFeedback type="invalid">{validationType.errors.studyname}</FormFeedback>
                                          ) : null}
                                        </div>
                                        <div className="mb-3">
                                            <Label className="form-label">{props.t("Study link")}</Label>
                                            <Input
                                                name="studylink"
                                                placeholder={props.t("Study link")}
                                                type="text"
                                                onChange={validationType.handleChange}
                                                onBlur={(e) => {
                                                    validationType.handleBlur(e);
                                                    validationType.submitForm();
                                                }}
                                                value={validationType.values.studylink || ""}
                                                invalid={
                                                    validationType.touched.studylink && validationType.errors.studylink ? true : false
                                                }
                                            />
                                            {validationType.touched.studylink && validationType.errors.studylink ? (
                                                <FormFeedback type="invalid">{validationType.errors.studylink}</FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="mb-3">
                                          <Label>{props.t("Protocol code")}</Label>
                                          <Input
                                            name="protocolcode"
                                            type="text"
                                            placeholder={props.t("Protocol code")}
                                            onChange={validationType.handleChange}
                                            onBlur={(e) => {
                                                validationType.handleBlur(e);
                                                validationType.submitForm();
                                            }}
                                            value={validationType.values.protocolcode || ""}
                                          />
                                        </div>
                                        <div className="mb-3">
                                            <Label>{props.t("Study language")}</Label>
                                            <Select
                                                value={optionGroup[0].options.find(option => option.value === validationType.values.studylanguage)}
                                                name="studylanguage"
                                                onChange={(selectedOption) => {
                                                    const formattedValue = {
                                                        target: {
                                                            name: 'studylanguage',
                                                            value: selectedOption.value
                                                        }
                                                    };
                                                    validationType.handleChange(formattedValue);
                                                    validationType.submitForm();
                                                }}
                                                options={optionGroup}
                                                classNamePrefix="select2-selection"
                                                placeholder={props.t("Select")}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <Label className="form-label">{props.t("Description")}</Label>
                                            <Input
                                                name="description"
                                                type="textarea"
                                                id="textarea"
                                                onChange={e => {
                                                    validationType.handleChange(e);
                                                }}
                                                onBlur={(e) => {
                                                    validationType.handleBlur(e);
                                                    validationType.submitForm();
                                                }}
                                                value={validationType.values.description || ""}
                                                rows="3"
                                                placeholder={props.t("Description")}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <Label className="form-label">{props.t("Sub description")}</Label>
                                            <Input
                                                name="subdescription"
                                                type="textarea"
                                                onChange={e => {
                                                    validationType.handleChange(e);
                                                }}
                                                onBlur={(e) => {
                                                    validationType.handleBlur(e);
                                                    validationType.submitForm();
                                                }}
                                                value={validationType.values.subdescription || ""}
                                                rows="3"
                                                placeholder={props.t("Sub description")}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <AccordionComp title="Advanced options" body={
                                                <>
                                                    <div className="mb-3">
                                                        <Label>{props.t("Subject number digits")}</Label>
                                                        <Input
                                                            name="subjectnumberdigist"
                                                            type="text"
                                                            placeholder={props.t("Subject number digits")}
                                                            onChange={validationType.handleChange}
                                                            onBlur={(e) => {
                                                                validationType.handleBlur(e);
                                                                validationType.submitForm();
                                                            }}
                                                            value={validationType.values.subjectnumberdigist || ""}
                                                        />
                                                        <span className="text-muted" style={{ fontSize: "10px" }}>
                                                            {'{' + props.t("Country code") + '}{' + props.t("Site no") + '}{###1}'}
                                                        </span>
                                                    </div>
                                                    <div className="mb-3">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    name="doubledataentry"
                                                                    type="checkbox"
                                                                    checked={validationType.values.doubledataentry || false}
                                                                    onChange={(e) => {
                                                                        validationType.handleChange(e);
                                                                        validationType.submitForm();
                                                                    }}
                                                                />
                                                                {props.t("Double data entry")}
                                                            </Label>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="mb-3">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    name="asksubjectinitial"
                                                                    type="checkbox"
                                                                    checked={validationType.values.asksubjectinitial || false}
                                                                    onChange={(e) => {
                                                                        validationType.handleChange(e);
                                                                        validationType.submitForm();
                                                                    }}
                                                                />
                                                                {props.t("Ask subject Initial")}
                                                            </Label>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="mb-3">
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input
                                                                    name="reasonforchange"
                                                                    type="checkbox"
                                                                    checked={validationType.values.reasonforchange || false}
                                                                    onChange={(e) => {
                                                                        validationType.handleChange(e);
                                                                        validationType.submitForm();
                                                                    }}
                                                                />
                                                                {props.t("Reason for change")}
                                                            </Label>
                                                        </FormGroup>
                                                    </div>
                                                </>
                                            } />
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
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

AddOrUpdateStudy.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddOrUpdateStudy);
