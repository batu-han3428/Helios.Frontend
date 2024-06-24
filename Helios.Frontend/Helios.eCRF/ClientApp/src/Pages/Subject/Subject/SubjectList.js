import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Typography, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, FormFeedback, Label } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { formatDate } from "../../../helpers/format_date";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { startloading, endloading } from '../../../store/loader/actions';
import { useAddSubjectMutation, useGetSubjectListQuery } from '../../../store/services/Subject';
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import { API_BASE_URL } from '../../../constants/endpoints';
import { SearchOutlined } from '@ant-design/icons';
import "./Subject.css";

const SubjectList = props => {

    const modalRef = useRef();
    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");
    const [modalContent, setModalContent] = useState(null);
    const [selectSites, setselectSites] = useState([]);
    const [AskSubjectInitial, setAskSubjectInitial] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [studyId, setStudyId] = useState(8);
    const [addingSubject] = useAddSubjectMutation();
    const { data: subjectsData, error, isLoading } = useGetSubjectListQuery(8);

    const [modal, setModal] = useState(false);
    const [data, setData] = useState([]);
    const [changeSiteId, setchangeSiteId] = useState("");
    const [changeInitialName, setchangeInitialName] = useState("");

    const changeValidSiteId = (value) => {
        setchangeSiteId(value);
    };

    const changeValidInitialname = (value) => {
        setchangeInitialName(value);
    };

    const [count, setCount] = useState(0);

    const [formData, setFormData] = useState({
        changeInitialName: '',
        changeSiteId: ''
    });

    useEffect(() => {
        optionGroup(8);
        getStudy(8);

        if (!error && !isLoading && subjectsData) {
            const updatedSubjectsData = subjectsData.subjectList.map(item => {
                return {
                    ...item,
                    updatedAt: formatDate(item.updatedAt),
                    actions: getActions(item)
                };
            });

            const newData = { ...data };
            newData.subjectList = updatedSubjectsData;
            newData.hasQuery = subjectsData.hasQuery;
            newData.hasSdv = subjectsData.hasSdv;
            newData.hasRandomizasyon = subjectsData.hasRandomizasyon;
            setData(newData);
            dispatch(endloading());
        }
    }, [subjectsData, error, isLoading]);

    const goToSubjectDetail = (studyId, pageId, subjectId) => {
        navigate(`/subject-detail/${studyId}/${pageId}/${subjectId}`);
    };

    const getActions = ({ id, firstPageId }) => {
        const actions = (
            <div className="icon-container">
                <div title={props.t("Go to demo subject")} className="icon icon-demo" onClick={() => { goToSubjectDetail(studyId, firstPageId, id) }}></div>
            </div>);
        return actions;
    };


    const refreshContent = () => {
        setCount(count + 1);
    };

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            studyid: 8,
            siteid: 0,
            initialname: "",

        },
        onSubmit: async (values) => {
            values.id = 0;
            values.firstPageId = 0;
            values.subjectNumber = "";
            values.updatedAt = new Date();
            values.createdAt = new Date();
            values.country = "";
            values.siteName = "";
            values.randomData = "";
            values.addedByName = "";

            try {
                changeValidInitialname(values.initialname);
                changeValidSiteId(values.siteid === 0 ? "" : values.siteid);
                if (values.siteid !== 0 && values.initialname !== "") {
                    dispatch(startloading());

                    const response = await addingSubject(values);
                    var retVal = response.data.values;

                    if (response.data.isSuccess) {
                        Swal.fire({
                            title: "",
                            text: props.t(response.data.message),
                            icon: "success",
                            confirmButtonText: props.t("Ok"),
                        });

                        modalRef.current.tog_backdrop();
                        goToSubjectDetail(retVal.studyId, retVal.firstPageId, retVal.id);
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
                }
                else {
                    setFormData({
                        ...formData,
                        [changeSiteId]: values.siteid === 0 ? "" : values.siteid,
                        [changeInitialName]: values.initialname,

                    });

                    refreshContent();
                    setModalContent(modalContent2(count === 0 ? 1 : count, changeSiteId, changeInitialName));
                    //toggleModal();

                }
                dispatch(endloading());

            }
            catch {
            }
        }

    });

    const modalContent2 = (part, contentSiteId, contentInitialName) => {
        const content = (
            <>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validationType.handleSubmit();
                        return false;
                    }}>

                    {selectSites.length > 1 &&
                        <div className="mb-12" style={{ marginBottom: "15px" }}>
                            <Label className="form-label"> {props.t('Site')}</Label>
                            <Select
                                name='siteid'
                                id='sitei'
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions.id;
                                    validationType.setFieldValue('siteid', selectedValues);
                                }}
                                onBlur={(e) => {
                                    setchangeSiteId(e);
                                }}

                                options={selectSites}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                placeholder={props.t("Select")}
                                classNamePrefix="select2-selection" />
                            {(contentSiteId === "" || contentSiteId === undefined || contentSiteId === 0) && part !== 0 ? (
                                <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{props.t("This field is required")}</div>
                            ) : null}
                        </div>
                    }

                    <div className="mb-12" >
                        <Label className="control-label">
                            {props.t('Subject initial')}
                        </Label>
                        <Input className='form-control' type='text' name='initialname' id='initialname' onChange={validationType.handleChange}
                            onBlur={(e) => {
                                setchangeInitialName(e);
                            }} />
                        {(contentInitialName === "" || contentInitialName === undefined) && part !== 0 ? (
                            <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{props.t("This field is required")}</div>
                        ) : null}
                    </div>
                </Form>
            </>
        );
        return content;
    };

    const openModal = (par) => {
        toggleModal();
        setCount(par);
        setModalTitle(props.t('Add new subject'));
        setModalButtonText(props.t('Save'));
        setModalContent(modalContent2(par, changeSiteId, changeInitialName));

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
                const response = await addingSubject({ studyId: 8, siteId: 3, initialName: "", id: 0, firstPageId: 0, subjectNumber: "", updatedAt: new Date(), createdAt: new Date() });
                var retVal = response.data.values;

                if (response.data.isSuccess) {
                    dispatch(endloading());
                    Swal.fire({
                        title: "",
                        text: props.t(response.data.message),
                        icon: "success",
                        confirmButtonText: props.t("Ok"),
                    });

                    goToSubjectDetail(retVal.studyId, retVal.firstPageId, retVal.id);
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

    const handleChange = (pagination, filters) => {
        setFilteredInfo(filters);
    };

    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchsubjectNumberText, setSearchsubjectNumberText] = useState('');
    const columns = []
    if (AskSubjectInitial) {
        const uniqueCountry = data.length !== 0 ? Array.from(new Set(data.subjectList.map(item => item.country))) : "";
        const uniqueAddedBy = data.length !== 0 ? Array.from(new Set(data.subjectList.map(item => item.addedByName))) : "";
        const uniqueSite = data.length !== 0 ? Array.from(new Set(data.subjectList.map(item => item.siteName))) : "";
        columns.push({
            title: props.t('Country'),
            dataIndex: 'country',
            sorter: (a, b) => a.country.localeCompare(b.country),
            sortDirections: ['ascend', 'descend'],
            filteredValue: filteredInfo.country || null,
            filters: uniqueCountry.length > 0 ? uniqueCountry.map(item => ({ ...item, text: item, value: item })) : "",
            onFilter: (value, record) => record.country === value,
        });

        columns.push({
            title: props.t('subjectNumber'),
            dataIndex: 'subjectNumber',
            sorter: (a, b) => a.subjectNumber.localeCompare(b.subjectNumber),
            sortDirections: ['ascend', 'descend'],
            filteredValue: [searchsubjectNumberText],
            onFilter: (value, record) => String(record.subjectNumber).toLowerCase().includes(value.toLowerCase()),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input.Search
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={(e) => setSearchsubjectNumberText(e.target.value)}
                        />
                    </div>
                );
            },
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        });

        columns.push({
            title: props.t('Site'),
            dataIndex: 'siteName',
            sorter: (a, b) => a.siteName.localeCompare(b.siteName),
            sortDirections: ['ascend', 'descend'],
            filteredValue: filteredInfo.siteName || null,
            filters: uniqueSite.length > 0 ? uniqueSite.map(item => ({ ...item, text: item, value: item })) : "",
            onFilter: (value, record) => record.siteName === value,
        });

        columns.push({
            title: props.t('Added by'),
            dataIndex: 'addedByName',
            sorter: (a, b) => a.addedByName.localeCompare(b.addedByName),
            sortDirections: ['ascend', 'descend'],
            filteredValue: filteredInfo.addedByName || null,
            filters: uniqueAddedBy.length > 0 ? uniqueAddedBy.map(item => ({ ...item, text: item, value: item })) : "",
            onFilter: (value, record) => record.addedByName === value,
        });

        columns.push({
            title: 'Subject initial',
            dataIndex: 'initialName',
            sorter: (a, b) => a.initialName.localeCompare(b.initialName),
            sortDirections: ['ascend', 'descend'],
        });
    }
    else {
        columns.push({
            title: props.t('subjectNumber'),
            dataIndex: 'subjectNumber',
            sorter: (a, b) => a.subjectNumber.localeCompare(b.subjectNumber),
            sortDirections: ['ascend', 'descend'],
            filteredValue: [searchsubjectNumberText],
            onFilter: (value, record) => String(record.subjectNumber).toLowerCase().includes(value.toLowerCase()),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input.Search
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={(e) => setSearchsubjectNumberText(e.target.value)}
                        />
                    </div>
                );
            },
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        });
    }

    columns.push({
        title: props.t('Created on'),
        dataIndex: 'createdAt',
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        sortDirections: ['ascend', 'descend'],
    });

    columns.push({
        title: props.t('Last updated on'),
        dataIndex: 'updatedAt',
        sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
        sortDirections: ['ascend', 'descend'],
    });

    if (data.hasRandomizasyon) {
        columns.push({
            title: props.t('Randomization'),
            dataIndex: 'randomData',
            sorter: (a, b) => a.randomData.localeCompare(b.randomData),
            sortDirections: ['ascend', 'descend'],
        });
    }

    if (data.hasQuery) {
        columns.push({
            title: props.t('Query'),
            dataIndex: 'query',
            sorter: (a, b) => a.query.localeCompare(b.query),
            sortDirections: ['ascend', 'descend'],
        });
    }

    if (data.hasSdv) {
        columns.push({
            title: props.t('SDV'),
            dataIndex: 'sdv',
            sorter: (a, b) => a.sdv.localeCompare(b.sdv),
            sortDirections: ['ascend', 'descend'],
        });
    }

    columns.push({
        title: props.t('Actions'),
        dataIndex: 'actions',
        key: 'actions'
    });





    const handleClick = () => {
        if (AskSubjectInitial) {
            setchangeSiteId();
            setchangeInitialName();
            openModal(0);
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
                                dataSource={data.subjectList}
                                pagination={true}
                                scroll={{ x: 'max-content' }}
                                onRow={(record, rowIndex) => {
                                    return {
                                        onDoubleClick: () => {
                                            goToSubjectDetail(studyId, record.firstPageId, record.id)
                                        }
                                    }
                                }}
                                onChange={handleChange}
                                filteredInfo={filteredInfo}
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