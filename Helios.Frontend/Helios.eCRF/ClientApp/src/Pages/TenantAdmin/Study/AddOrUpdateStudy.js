import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Card, CardBody, FormGroup, CardSubtitle, Label, Input, Form, FormFeedback } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useStudySaveMutation } from '../../../store/services/Study';
import { useSelector } from "react-redux";
import { useStudyGetQuery } from '../../../store/services/Study';
import { useDispatch } from "react-redux";
import { startloading, endloading } from '../../../store/loader/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from "react-router-dom";
import AccordionComp from '../../../components/Common/AccordionComp/AccordionComp';
import { useLazyStudyListGetQuery } from '../../../store/services/Study';
import { showToast } from '../../../store/toast/actions';


const AddOrUpdateStudy = props => {

    const { copyStudy } = useParams();
    const [studyId, setStudyId] = useState(0);
    const [skip, setSkip] = useState(true);
    const [apiStudyData, setApiStudyData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const dispatch = useDispatch();

    const userInformation = useSelector(state => state.rootReducer.Login);
    const tenantId = userInformation.tenantId;

    const [trigger, { data: studyListData, error: errorStudy, isLoading:isLoadingStudy }] = useLazyStudyListGetQuery();

    const [studySave] = useStudySaveMutation();

    const navigate = useNavigate();

    const location = useLocation();

    const backPage = () => {
        navigate('/studylist/false');
    };

    useEffect(() => {
        if (copyStudy && tenantId) {
            trigger({ isLocked: false, tenantId: tenantId });
        }
        dispatch(startloading());
        if (studyListData && !isLoadingStudy && !errorStudy  ) {
            setTableData(studyListData);
            dispatch(endloading());
        } else if (errorStudy && !isLoadingStudy) {
            dispatch(endloading());
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
        }
    }, [studyListData, tenantId, copyStudy, errorStudy, isLoadingStudy, props.t]);

    const optionGroup = [
        {
            label: props.t("Languages"),
            options: [
                { label: props.t("English"), value: 1 },
                { label: props.t("Turkish"), value: 2 },
            ]
        }
    ];
    const optionStudy = [
        {
            label: props.t("Study"),
            options: tableData.map(tableData => ({
                label: tableData.studyName,
                value: tableData.id
            }))
        }
    ];
    const validationType = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            userid: userInformation.userId,
            tenantid: userInformation.tenantId,
            studyId: studyId,
            copyStudyId: apiStudyData ? apiStudyData.copyStudyId : 0,
            copyStudy: copyStudy,
            studyname: apiStudyData ? apiStudyData.studyName : '',
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
            copyStudyId: Yup.string().when('copyStudy', {
                is: (value) => value === "true",
                then: (schema) => schema.required('This field is required'),
                otherwise: (schema) => schema,
            }),
        }),
        onSubmit: async (values) => {
            dispatch(startloading());
            const response = await studySave(values);
            if (response.data.isSuccess) {
                dispatch(endloading());
                dispatch(showToast(props.t(response.data.message), true, true));
                if (studyId === 0) {
                    setStudyId(response.data.values.studyId);
                }
            } else {
                dispatch(endloading());
                dispatch(showToast(props.t(response.data.message), false, false));
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

    const { data: studyData, error, isLoading } = useStudyGetQuery(studyId,
        {
            skip, refetchOnMountOrArgChange: true
        });

    useEffect(() => {
        if (!isLoading && !error && studyData) {
            setApiStudyData(studyData);
            setSkip(true);
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(endloading());
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
        } else {
            dispatch(endloading());
        }
    }, [studyData, error, isLoading]);

    const isError = validationType.touched.copyStudyId && validationType.errors.copyStudyId;
    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: isError !== undefined ? 'red !important' : base.borderColor,
        })
    }

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
                        <Card style={{ width: "50%", backgroundColor: "#f8f8fa", boxShadow: "unset", margin: "0 auto" }}>
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
                                    {copyStudy === "true" &&
                                        <div className="mb-3">
                                            <Label>{props.t("Source study")}</Label>
                                            <Select
                                                value={optionStudy[0].options.find(option => option.value === validationType.values.id)}
                                                name="copyStudyId"
                                                onChange={(selectedOption) => {
                                                    const formattedValue = {
                                                        target: {
                                                            name: 'copyStudyId',
                                                            value: selectedOption.value
                                                        }
                                                    };
                                                    validationType.handleChange(formattedValue);
                                                    validationType.submitForm();
                                                }}
                                                options={optionStudy}
                                                classNamePrefix="select2-selection"
                                                placeholder={props.t("Select")}
                                                onBlur={validationType.handleBlur}
                                                styles={customStyles}
                                            />
                                            {validationType.touched.copyStudyId && validationType.errors.copyStudyId ? (
                                                <FormFeedback style={{ display: 'block' }} type="invalid">{validationType.errors.copyStudyId}</FormFeedback>
                                            ) : null}
                                        </div>

                                    }
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
                                            value={optionGroup[0].options.find(option => option.value === validationType.values.studylanguage) || optionGroup[0].options[0]}
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
    </React.Fragment>
);
};

AddOrUpdateStudy.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddOrUpdateStudy);
