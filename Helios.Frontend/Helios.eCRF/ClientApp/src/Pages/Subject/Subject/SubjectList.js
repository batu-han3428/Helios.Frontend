import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { startloading, endloading } from '../../../store/loader/actions';
import { useAddSubjectMutation, useGetSubjectListQuery } from '../../../store/services/Subject';
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import { API_BASE_URL } from '../../../constants/endpoints';
import "./Subject.css";

const SubjectList = props => {
    const modalRef = useRef();
    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");
    const [modalContent, setModalContent] = useState(null);
    const [selectSites, setselectSites] = useState([]);
    const [AskSubjectInitial, setAskSubjectInitial] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [addingSubject] = useAddSubjectMutation();
    const { data: subjectsData, error, isLoading } = useGetSubjectListQuery(8);


    useEffect(() => {
        optionGroup(8);
        getStudy(8);
        if (!error && !isLoading && subjectsData) {
            const updatedSubjectsData = subjectsData.map(item => {
                return {
                    ...item,
                    actions: getActions(item)
                };
            });
            setData(updatedSubjectsData);
            dispatch(endloading());
        }
    }, [subjectsData, error, isLoading]);

    const goToSubjectDetail = (id, pageId) => {
        navigate(`/subject-detail/${id}/${pageId}`);
    };

    const getActions = ({ id, firstPageId }) => {
        const actions = (
            <div className="icon-container">
                <div title={props.t("Go to demo subject")} className="icon icon-demo" onClick={() => { goToSubjectDetail(id, firstPageId) }}></div>
            </div>);
        return actions;
    };

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            studyId: 8,
            siteId: selectSites.length === 1 ? selectSites[0].id : 0,
            initialName: "",

        },
        validationSchema: Yup.object().shape({
            siteId: Yup.string().required(
                props.t("This field is required")
            ),
            initialName: Yup.string().required(
                props.t("This field is required")
            ),

        }),
        onSubmit: async (values) => {
            values.id = 0;
            values.firstPageId = 0;
            values.subjectNumber = "";
            values.updatedAt = new Date();
            values.createdAt = new Date();
            try {
                dispatch(startloading());
                const response = await addingSubject(values);
                if (response.data.isSuccess) {
                    Swal.fire({
                        title: "",
                        text: props.t(response.data.message),
                        icon: "success",
                        confirmButtonText: props.t("Ok"),
                    });
                    modalRef.current.tog_backdrop();
                    dispatch(endloading());

                } else {
                    Swal.fire({
                        title: "",
                        text: response.data.message,
                        icon: "error",
                        confirmButtonText: props.t("Ok"),
                    });
                    dispatch(endloading());
                }
            } catch (e) {
                dispatch(endloading());
            }
        }
    });

    const modalContent2 = () => {
        const content = (
            <>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validationType.handleSubmit();
                        return false;
                    }}>
                    <div className='row'>
                        <div className='form-group'>
                            {selectSites.length > 1 &&
                                <div className="mb-12" style={{ marginBottom: "15px" }}>
                                    <label className="form-label"> {props.t('Site')}</label>
                                    <Select
                                        name='siteId'
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions.id;
                                            validationType.setFieldValue('siteId', selectedValues);

                                        }}
                                        value={validationType.values.id}
                                        onBlur={(e) => {
                                            validationType.handleBlur(e);
                                        }}
                                        options={selectSites}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        placeholder={props.t("Select")}
                                        classNamePrefix="select2-selection" />
                                </div>
                            }
                            <div className="mb-12" >
                                <label className="control-label">
                                    {props.t('Subject initial')}
                                </label>
                                <input className='form-control' type='text' name='initialName' onChange={validationType.handleChange}
                                    onBlur={(e) => {
                                        validationType.handleBlur(e);
                                    }} />
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        );
        return content;
    };
    const openModal = () => {
        setModalTitle(props.t('Add new subject'));
        setModalButtonText(props.t('Save'));
        setModalContent(modalContent2());
        toggleModal();
    }
    const resetValue = () => {
        validationType.validateForm().then(errors => {
            validationType.setErrors({});
            validationType.resetForm();
        });
    };
    const toggleModal = () => {
        modalRef.current.tog_backdrop();
    }

    const optionGroup = (id) => {
        fetch(API_BASE_URL + 'Subject/GetSites?studyId=' + id, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setselectSites(data);
            })
            .catch(error => {

            });
    };
    const getStudy = (id) => {
        fetch(API_BASE_URL + 'Subject/GetStudyAskSubjectInitial?studyId=' + id, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setAskSubjectInitial(data);
            })
            .catch(error => {

            });
    };
    
    const addSubject = (id) => {
        Swal.fire({
            title: props.t("You will add a new subject"),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                dispatch(startloading());
                const response = await addingSubject({studyId: 8, siteId: 3, initialName: "", id: 0, firstPageId: 0, subjectNumber: "", updatedAt: new Date(), createdAt:new Date()});
                if (response.data.isSuccess) {
                    dispatch(endloading());
                    Swal.fire({
                        title: "",
                        text: props.t(response.data.message),
                        icon: "success",
                        confirmButtonText: props.t("Ok"),
                    });
                } else {
                    dispatch(endloading());
                    Swal.fire({
                        title: "",
                        text: response.data.message,
                        icon: "error",
                        confirmButtonText: props.t("Ok"),
                    });
                }
            } else {
                return false;
            }
        });
    };

    const columns = [
        {
            title: props.t('subjectNumber'),
            dataIndex: 'subjectNumber',
            key: 'subjectNumber'
        },
        {
            title: 'firstPageId',
            dataIndex: 'firstPageId',
            key: 'firstPageId',
            className: 'hidden-column'
        },
        {
            title: props.t('Actions'),
            dataIndex: 'actions',
            key: 'actions'
        },
    ];

    const [data, setData] = useState([]);

    const handleClick = () => {
        if (AskSubjectInitial) {
            openModal();
        } else {
            addSubject();
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t('Subject list')}</h6>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <div style={{ display: 'inline-block', float: 'right' }} onClick={handleClick}>
                                <Typography.Text strong style={{ marginRight: '8px', cursor: 'pointer' }}>{props.t('Add new subject')}</Typography.Text>
                                <Button color="success" className="rounded-circle">
                                    <FontAwesomeIcon icon="fa-plus" />
                                </Button>
                            </div>
                        </Col>
                        <Col className="col-12">
                            <Table
                                columns={columns}
                                dataSource={data}
                                pagination={true}
                                scroll={{ x: 'max-content' }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalComp
                refs={modalRef}
                title={modalTitle}
                body={modalContent}
                resetValue={resetValue}
                handle={() => validationType.handleSubmit()}
                buttonText={modalButtonText}
                isButton={true}
                size="lg"
            />
        </React.Fragment>
    )
}

SubjectList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectList);