import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Typography, Input, Tooltip, Alert } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Label } from 'reactstrap';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { formatDate } from "../../../helpers/format_date";
import { SdvIconStatu, QueryIconStatu } from "../../../helpers/icon_helper";
import { useDispatch, connect } from "react-redux";
import withRouter from '../../../components/Common/withRouter';
import { startloading, endloading } from '../../../store/loader/actions';
import { useAddSubjectMutation, useLazyGetSubjectListQuery, useLazyGetUserPermissionsQuery, useDeleteOrArchiveSubjectMutation, useLazySubjectVisitAnnotatedCrfGetQuery } from '../../../store/services/Subject';
import { useLazyStudyUserSitesGetQuery } from '../../../store/services/Users';
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import { API_BASE_URL } from '../../../constants/endpoints';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import "./Subject.css";
import { v4 as uuidv4 } from 'uuid';
import AddSubjectComp from './Comp/AddSubjectComp';
import { showToast } from '../../../store/toast/actions';

const { TextArea } = Input;

const SubjectList = props => {
    const { studyId } = useParams();
    const modalRef = useRef();
    const modalRefDel = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");
    const [modalContent, setModalContent] = useState(null);
    const [selectSites, setselectSites] = useState([]);
    const [AskSubjectInitial, setAskSubjectInitial] = useState(false);
    const [comment, setComment] = useState("");
    const [subjectNumber, setSubjectNumber] = useState("");
    const [isDelete, setIsDelete] = useState(false);
    const [isArchived, setIsArchived] = useState(false);
    const [showArchivedSubjects, setShowArchivedSubjects] = useState(false);
    const [subjectId, setSubjectId] = useState(0);
    const [data, setData] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchsubjectNumberText, setSearchsubjectNumberText] = useState('');
    const [studyUserSiteData, setStudyUserSiteData] = useState({});
    const [view, setView] = useState(false);
    const [textError, setTextError] = useState("");
    const [unArchive, setUnArchive] = useState("");
    const columns = [];
    const [addingSubject] = useAddSubjectMutation();
    const [deleteOrArchiveSubject] = useDeleteOrArchiveSubjectMutation();
    const [triggerPermission, { data: permissionsData, errorPerm, isLoadingPerm }] = useLazyGetUserPermissionsQuery();
    const [triggerSubjectList, { data: subjectsData, error, isLoading }] = useLazyGetSubjectListQuery();
    const [trigger, { data: studyUserSitesData, errorSite, isLoadingSite }] = useLazyStudyUserSitesGetQuery();
    const [triggerCrf, { data: annotatedData, error: errorCrf, isLoading: isLoadingCrf }] = useLazySubjectVisitAnnotatedCrfGetQuery();

    useEffect(() => {
        dispatch(startloading());
        if (studyId) {
            triggerPermission(studyId);
        }
    }, [studyId, dispatch]);

    useEffect(() => {
        if (!errorPerm && !isLoadingPerm && permissionsData) {
            if (!permissionsData.canSubjectView) {
                navigate('/AccessDenied', { state: { from: props.location } });
                return;
            }
            setView(true);
            setPermissions(permissionsData);
            optionGroup(studyId);
            getStudy(studyId);
            triggerSubjectList({ studyId: studyId, showArchivedSubjects: showArchivedSubjects });
        } else if (errorPerm && !isLoadingPerm) {
            dispatch(endloading());
        }
    }, [permissionsData, errorPerm, isLoadingPerm, navigate, props.location, studyId, showArchivedSubjects]);

    useEffect(() => {
        if (!error && !isLoading && subjectsData) {
            const newData = { ...data };
            if (subjectsData !== null) {
                const updatedSubjectsData = subjectsData.map(item => {
                    const sdvIcon = SdvIconStatu(item.sdvStatus);
                    const queryIcon = QueryIconStatu(item.queryStatus);
                    return {
                        ...item,
                        createdAt: formatDate(item.createdAt),
                        updatedAt: formatDate(item.updatedAt),
                        sdv: <Tooltip title={props.t(sdvIcon.text)}>{sdvIcon.icon}</Tooltip>,
                        query: <Tooltip title={props.t(queryIcon.text)}>{queryIcon.icon}</Tooltip>,
                        actions: getActions(item, permissionsData),
                        key: uuidv4()
                    };
                });
                newData.subjectList = updatedSubjectsData;
            }
            setData(newData);
            dispatch(endloading());
        }
        else if (error && !isLoading) {
            dispatch(endloading());
        }
    }, [subjectsData, error, isLoading, permissionsData, props.t]);

    const goToSubjectDetail = (studyId, pageId, subjectId, subjectNumber) => {
        navigate(`/subject-detail/${studyId}/${pageId}/${subjectId}/${subjectNumber}/${false}/${0}`);
    };


    useEffect(() => {
        if (annotatedData && !errorCrf && !isLoadingCrf) {
            const openButton = document.getElementById('openPdfButton');
            openButton.onclick = () => {
                window.open(`/pdf?url=${annotatedData.data}`, '_blank');
            };
            openButton.click();
            dispatch(endloading());
        }
    }, [annotatedData])

    useEffect(() => {
        if (props.authUserId && studyId) {
            trigger({ authUserId: props.authUserId, studyId: studyId });
        }
    }, [props.authUserId, studyId]);

    useEffect(() => {
        if (!isLoadingSite && !errorSite && studyUserSitesData) {
            setStudyUserSiteData(studyUserSitesData);
        }
    }, [studyUserSitesData, errorSite, isLoadingSite]);

    useEffect(() => {
        if (subjectId && isArchived !== "" && unArchive !== "") {
            handleDeleteOrArchiveSubmit();
        }
    }, [subjectId, isArchived, unArchive]);

    const getActions = (item, permissions) => {
        const actions = (
            <div className="icon-container">
                <div title={props.t("Go to demo subject")} className="icon icon-demo" onClick={() => { goToSubjectDetail(studyId, item.firstPageId, item.id) }}></div>
                {permissions.canSubjectDelete && <div title={props.t("Delete")} className="icon icon-delete" onClick={() => { toggleDeleteModal(item.id, subjectNumber, true) }}></div>}
                {permissions.canSubjectArchive && (
                    <>
                        {item.isActive ? (
                            <div
                                title={props.t("Archive")}
                                className="ti-archive"
                                onClick={() => toggleDeleteModal(item.id, subjectNumber, false)}
                            ></div>
                        ) : (
                            <div
                                title={props.t("Unarchive")}
                                className="ti-back-left"
                                onClick={() => toggleUnArchive(item.id,true, true)}
                            ></div>
                        )}
                    </>
                )}
                {permissions.canSubjectExportForm &&
                    <ExportOutlined onClick={() => triggerCrf(item.id)} />
                }
            </div>);
        return actions;
    };

    const openModal = () => {
        setModalTitle(props.t('Add new subject'));
        setModalButtonText(props.t('Save'));
        setModalContent(<AddSubjectComp studyId={studyId} AskSubjectInitial={AskSubjectInitial} refs={modalRef} selectSites={selectSites} studyUserSiteData={studyUserSiteData} />);
        toggleModal();
    }

    const toggleModal = () => {
        modalRef.current.tog_backdrop();
    }

    const toggleDeleteModal = (id, subjectNumber, isDeleted, unarchive = false) => {
        setSubjectId(id);
        setIsDelete(isDeleted);
        setSubjectNumber(subjectNumber);
        setIsArchived(unarchive);
        setUnArchive(unArchive);
        modalRefDel.current.tog_backdrop();
    }

    const toggleUnArchive = (id, isArchived, unArchive) => {
        Swal.fire({
            title: props.t("This form will be unarchived"),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                dispatch(startloading());
                setSubjectId(id);
                setIsArchived(isArchived);
                setUnArchive(unArchive);
                setComment("a");
            } else {
                return false;
            }
        });
    };

    const handleChangeComment = (e) => {
        setComment(e.target.value)
        if (e.target.value !== "") {
            setTextError("");
        } else {
            setTextError(props.t("This field is required"));
        }
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

    const addSubject = (site) => {
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
                const response = await addingSubject({ studyId: studyId, siteId: site.id, initialName: "", id: 0, firstPageId: 0, subjectNumber: "", updatedAt: new Date(), createdAt: new Date(), country: "", siteName: "", randomData: "", addedByName: "" });
                var retVal = response.data.values;

                if (response.data.isSuccess) {
                    dispatch(endloading());
                    let message = props.t(response.data.message).replace("{SubjectNo}", retVal.subjectNumber);
                    if (retVal.addedById > 0) message = message.replace("{n}", retVal.addedById);
                    dispatch(showToast(message, true, true));
                    goToSubjectDetail(retVal.studyId, retVal.firstPageId, retVal.id, retVal.subjectNumber);
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

    const uniqueCountry = data.length !== 0 ? Array.from(new Set(data.subjectList.map(item => item.country))) : "";
    const uniqueAddedBy = data.length !== 0 ? Array.from(new Set(data.subjectList.map(item => item.addedByName))) : "";
    const uniqueSite = data.length !== 0 ? Array.from(new Set(data.subjectList.map(item => item.siteName))) : "";
    const commonColumns = [
        {
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
        },
        {
            title: props.t('Created on'),
            dataIndex: 'createdAt',
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: props.t('Last updated on'),
            dataIndex: 'updatedAt',
            sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: props.t('Actions'),
            dataIndex: 'actions',
            key: 'actions'
        },
        {
            title: props.t('Randomization'),
            dataIndex: 'randomData',
            sorter: (a, b) => a.randomData.localeCompare(b.randomData),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: props.t('Query'),
            dataIndex: 'query',
            sorter: (a, b) => a.query.localeCompare(b.query),
            sortDirections: ['ascend', 'descend'],
            className: 'center-align',
        },
        {
            title: props.t('SDV'),
            dataIndex: 'sdv',
            sorter: (a, b) => {
                const nameA = a.sdv || '';
                const nameB = b.sdv || '';
                return nameA.localeCompare(nameB);
            },
            sortDirections: ['ascend', 'descend'],
            className: 'center-align',
        }
    ];

    if (studyUserSiteData.sites !== undefined && studyUserSiteData.sites.length < 2) {
        columns.push(commonColumns[0]);

        if (AskSubjectInitial) {
            columns.push({
                title: 'Subject initial',
                dataIndex: 'initialName',
                sorter: (a, b) => {
                    const nameA = a.initialName || '';
                    const nameB = b.initialName || '';
                    return nameA.localeCompare(nameB);
                },
                sortDirections: ['ascend', 'descend'],
            });
        }

        columns.push(...commonColumns.slice(1, 3));
        if (permissionsData) {
            if (permissionsData.canSubjectRandomize || permissionsData.canSubjectViewRandomization) {
                columns.push(commonColumns[4]);
            }

            if (permissionsData.canMonitoringOpenQuery || permissionsData.canMonitoringAnswerQuery) {
                columns.push(commonColumns[5]);
            }

            if (permissionsData.canMonitoringSdv || permissionsData.canMonitoringVerification || permissionsData.canMonitoringRemoteSdv) {
                columns.push(commonColumns[6]);
            }

        }
        columns.push(commonColumns[3]);
    } else {
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
            title: props.t('Site'),
            dataIndex: 'siteName',
            sorter: (a, b) => a.siteName.localeCompare(b.siteName),
            sortDirections: ['ascend', 'descend'],
            filteredValue: filteredInfo.siteName || null,
            filters: uniqueSite.length > 0 ? uniqueSite.map(item => ({ ...item, text: item, value: item })) : "",
            onFilter: (value, record) => record.siteName === value,
        });

        columns.push(commonColumns[0]);

        if (AskSubjectInitial) {
            columns.push({
                title: 'Subject initial',
                dataIndex: 'initialName',
                sorter: (a, b) => {
                    const nameA = a.initialName || '';
                    const nameB = b.initialName || '';
                    return nameA.localeCompare(nameB);
                },
                sortDirections: ['ascend', 'descend'],
            });
        }

        columns.push({
            title: props.t('Investigators'),
            dataIndex: 'addedByName',
            sorter: (a, b) => a.addedByName.localeCompare(b.addedByName),
            sortDirections: ['ascend', 'descend'],
            filteredValue: filteredInfo.addedByName || null,
            filters: uniqueAddedBy.length > 0 ? uniqueAddedBy.map(item => ({ ...item, text: item, value: item })) : "",
            onFilter: (value, record) => record.addedByName === value,
        });

        columns.push(...commonColumns.slice(1, 3));

        if (permissionsData) {
            if (permissionsData.canSubjectRandomize || permissionsData.canSubjectViewRandomization) {
                columns.push(commonColumns[4]);
            }

            if (permissionsData.canMonitoringOpenQuery || permissionsData.canMonitoringAnswerQuery) {
                columns.push(commonColumns[5]);
            }

            if (permissionsData.canMonitoringSdv || permissionsData.canMonitoringVerification || permissionsData.canMonitoringRemoteSdv) {
                columns.push(commonColumns[6]);
            }
        }

        columns.push(commonColumns[3]);
    }

    const handleClick = () => {
        if (studyUserSiteData.sites.length < 1) {
            dispatch(showToast(props.t("You do not have access to this resource. Please contact the system administrator regarding your privileges."), false, false));
        }
        else if (AskSubjectInitial || (selectSites.length > 1 && studyUserSiteData.sites.length > 1)) {
            openModal();
        }
        else {
            addSubject(studyUserSiteData.sites[0]);
        }
    };

    const handleDeleteOrArchiveSubmit = async () => {
        if (!unArchive && (comment == null || comment.trim() === "")) {
            setTextError(props.t("This field is required"));
            return;
        }
        else {
            let values = {
                SubjectId: subjectId,
                IsDelete: isDelete,
                Comment: comment,
                IsArchived: isArchived
            };

            dispatch(startloading());

            const response = await deleteOrArchiveSubject(values);

            if (response.data !== undefined) {
                if (response.data.isSuccess) {
                    dispatch(showToast(props.t(response.data.message), true, true));

                    if (!unArchive) {
                        modalRefDel.current.tog_backdrop();
                        setComment("");
                    }

                    dispatch(endloading());
                } else {
                    dispatch(showToast(props.t(response.data.message), true, false));
                    dispatch(endloading());
                }
            }
        }
    }

    const handleShowArchivedSubjectsChange = (e) => {
        setShowArchivedSubjects(e.target.checked);
    }

    const handleBlur = () => {
        if (comment.trim() === "") {
            setTextError(props.t("This field is required"));
        } else {
            setTextError("");
        }
    };
    document.title = props.t('Subject list');
    return (
        <React.Fragment>
            {!isLoading && !error && subjectsData !== null &&
                <div className="page-content">
                    <div className="container-fluid">
                        {view && <>
                            <div className="page-title-box">
                                <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                                    <Col md={8}>
                                        <h6 className="page-title">{props.t('Subject List')}</h6>
                                    </Col>
                                </Row>
                            </div>
                            <Row>                             
                                {(data.subjectList && data.subjectList.length > 0 && data.subjectList.reduce((sum, subject) => sum + (subject.openQueries || 0), 0) >= 10) &&
                                    <Col className="col-12" style={{padding: '10px 0'}}>
                                        <Alert message={props.t('You have open queries!')} type="warning" showIcon action={
                                            <span style={{ fontWeight: 'bold', color: '#768A9D', cursor: 'pointer' }} onClick={() => navigate(`/query`)}>
                                                {props.t('Go to queries')}
                                                <FontAwesomeIcon icon="fa-solid fa-arrow-right" style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                                            </span>
                                        } />
                                    </Col>
                                }
                                <Col className="col-12">
                                    <div style={{ display: 'inline-block', float: 'left' }} className="col-md-6">
                                        {permissionsData.canSubjectArchive &&
                                            <>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    onChange={handleShowArchivedSubjectsChange}
                                                    checked={showArchivedSubjects} /><label className="form-check-label" style={{ marginLeft: '5px' }}>
                                                    {props.t("Show archived patients")}
                                                </label>
                                            </>
                                        }
                                    </div>
                                    {permissionsData.canSubjectAdd &&
                                        <div style={{ display: 'inline-block', float: 'right', marginBottom: '5px' }} className="col-md-6" onClick={handleClick}>
                                            <div style={{ float: 'right' }}>
                                                <Typography.Text strong style={{ marginRight: '8px', cursor: 'pointer' }}>{props.t('Add new subject')}</Typography.Text>
                                                <Button color="success" className="rounded-circle">
                                                    <FontAwesomeIcon icon="fa-plus" />
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                </Col>
                                <Col className="col-12">
                                    <button id="openPdfButton" style={{ display: "none" }}></button>
                                    <Table
                                        columns={columns}
                                        dataSource={data.subjectList}
                                        pagination={true}
                                        scroll={{ x: 'max-content' }}
                                        onRow={(record, rowIndex) => {
                                            return {
                                                onDoubleClick: () => {
                                                    goToSubjectDetail(studyId, record.firstPageId, record.id, record.subjectNumber)
                                                }
                                            }
                                        }}
                                        onChange={handleChange}
                                        filteredInfo={filteredInfo}
                                    />
                                </Col>
                            </Row>
                        </>}
                    </div>
                </div>
            }
            <ModalComp
                refs={modalRef}
                title={modalTitle}
                body={modalContent}
                buttonText={modalButtonText}
                isButton={true}
                size="lg"
            />
            <ModalComp
                refs={modalRefDel}
                title={subjectNumber + " " + (isDelete ? props.t("deletion") : props.t("archiving"))}
                size={"md"}
                body={
                    <div className="row">
                        <div className="mb-3 col-md-12">
                            <Label className="form-label">{isDelete ? props.t("This subject will be deleted.") : props.t("This subject will be archived.")}</Label>
                            <div className="form-label">{props.t("Do you confirm?")}</div>
                            <TextArea rows={4} placeholder={props.t("Comments")} value={comment} onChange={handleChangeComment} onBlur={handleBlur} />
                            {textError && (
                                <div className="text-danger">
                                    {textError}
                                </div>
                            )}
                        </div>
                    </div>
                }
                handle={() => handleDeleteOrArchiveSubmit()}
                buttonText={props.t("Yes")}
            />
        </React.Fragment>
    )
}

SubjectList.propTypes = {
    t: PropTypes.any
};

const mapStateToProps = state => {
    const authUserId = state.rootReducer.Login.userId;
    const { error } = state.rootReducer.Login;
    return { error, authUserId };
};

export default withTranslation()(withRouter(
    connect(mapStateToProps)(SubjectList)
));