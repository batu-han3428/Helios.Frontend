import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Typography, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Label } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { formatDate } from "../../../helpers/format_date";
import { SdvIconStatu, QueryIconStatu } from "../../../helpers/icon_helper";
import { useDispatch, connect } from "react-redux";
import withRouter from '../../../components/Common/withRouter';
import { startloading, endloading } from '../../../store/loader/actions';
import { useLazyGetSubjectMultiListQuery, useLazyGetUserPermissionsQuery, useAddSubjectMultiFormMutation, useDeleteOrArchiveSubjectMultiFormMutation } from '../../../store/services/Subject';
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import { API_BASE_URL } from '../../../constants/endpoints';
import { SearchOutlined, ExportOutlined, HistoryOutlined } from '@ant-design/icons';
import "./Subject.css";
import { v4 as uuidv4 } from 'uuid';
import AddSubjectComp from './Comp/AddSubjectComp';
import { showToast } from '../../../store/toast/actions';
import { useParams } from "react-router-dom";

const { TextArea } = Input;

const SubjectMultiList = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const modalRefDel = useRef();
    const { studyId, subjectId, pageId, subjectNumber } = useParams();
    const [triggerPermission, { data: permissionsData, errorPerm, isLoadingPerm }] = useLazyGetUserPermissionsQuery();
    const [triggersubjectMultiFormData, { data: subjectMultiFormData, error, isLoading }] = useLazyGetSubjectMultiListQuery();
    const [addingSubjectMultiForm] = useAddSubjectMultiFormMutation();
    const [deleteOrArchiveSubjectMultiForm] = useDeleteOrArchiveSubjectMultiFormMutation();
    const [data, setData] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [showArchivedMulties, setShowArchivedMulties] = useState(false);
    const [searchFormNameText, setSearchFormNameText] = useState('');
    const [textError, setTextError] = useState("");
    const [comment, setComment] = useState("");
    const [isArchived, setIsArchived] = useState("");
    const [unArchive, setUnArchive] = useState("");
    const [selectedSubjectVisitId, setSelectedSubjectVisitId] = useState("");
    const [rowIndex, setRowIndex] = useState("");

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
            setPermissions(permissionsData);
            triggersubjectMultiFormData({ subjectId: subjectId, studyVisitId: pageId, showArchivedMulties: !showArchivedMulties });
        } else if (errorPerm && !isLoadingPerm) {
            dispatch(endloading());
        }
    }, [permissionsData, errorPerm, isLoadingPerm, navigate, props.location, studyId, showArchivedMulties]);

    useEffect(() => {
        if (!error && !isLoading && subjectMultiFormData) {
            const newData = { ...data };
            if (subjectMultiFormData !== null) {
                const updatedSubjectsData = subjectMultiFormData.map(item => {
                    return {
                        ...item,
                        createdAt: formatDate(item.createdAt),
                        updatedAt: formatDate(item.updatedAt),
                        actions: getActions(item),
                        key: uuidv4()
                    };
                });
                newData.subjectList = updatedSubjectsData;
            }
            setData(newData);
            dispatch(endloading());
        }
    }, [subjectMultiFormData, error, isLoading]);

    useEffect(() => {
        if (selectedSubjectVisitId && rowIndex && isArchived !== "" && unArchive !== "") {
            handleDeleteOrArchiveSubmit();
        }
    }, [selectedSubjectVisitId, rowIndex, isArchived, unArchive]);

    const getActions = (item) => {
        if (permissions !== undefined) {
            const actions = (
                <div className="icon-container">
                    <div title={props.t("Go to form")} className="icon icon-demo" onClick={() => { goToFormDetail(item.firstPageId, item.rowIndex) }}></div>
                    {permissions.canFormRemoveMultiVisit && <div title={props.t("Delete")} className="icon icon-delete" onClick={() => { toggleDeleteModal(item.id, item.rowIndex, false) }}></div>}
                    <HistoryOutlined />
                    {permissions.canFormArchiveMultiVisit && (
                        <>
                            {!item.isArchived ? (
                                <div
                                    title={props.t("Archive")}
                                    className="ti-archive"
                                    onClick={() => toggleDeleteModal(item.id, item.rowIndex, true)}
                                ></div>
                            ) : (
                                <div
                                    title={props.t("Unarchive")}
                                    className="ti-back-left"
                                    onClick={() => toggleUnArchive(item.id, item.rowIndex, true, true)}
                                ></div>
                            )}
                        </>
                    )}
                    {permissions.canSubjectExportForm &&
                        <ExportOutlined/>
                    }
                </div>);
            return actions;
        }
    };

    const goToFormDetail = (id, rowIndex) => {
        navigate(`/subject-detail/${studyId}/${id}/${subjectId}/${subjectNumber}/${false}/${rowIndex}`);
    }

    const toggleDeleteModal = (id, rowIndex, isArchived, unArchive = false) => {
        setSelectedSubjectVisitId(id);
        setRowIndex(rowIndex);
        setIsArchived(isArchived);
        setUnArchive(unArchive);
        modalRefDel.current.tog_backdrop();
    }

    const handleShowArchivedSubjectsChange = (e) => {
        setShowArchivedMulties(e.target.checked);
    }

    const handleChangeComment = (e) => {
        setComment(e.target.value)
        if (e.target.value !== "") {
            setTextError("");
        } else {
            setTextError(props.t("This field is required"));
        }
    }

    const handleBlur = () => {
        if (comment.trim() === "") {
            setTextError(props.t("This field is required"));
        } else {
            setTextError("");
        }
    };

    const handleDeleteOrArchiveSubmit = async () => {
        if (!unArchive && (comment == null || comment.trim() === "")) {
            setTextError(props.t("This field is required"));
            return;
        }
        else {
            let data = {
                subjectId: subjectId,
                subjectVisitId: selectedSubjectVisitId,
                comment: unArchive ? "a" : comment,
                rowIndex: rowIndex,
                isArchived: isArchived,
                unArchive: unArchive
            };

            dispatch(startloading());

            const response = await deleteOrArchiveSubjectMultiForm(data);

            if (response.data !== undefined) {
                if (response.data.isSuccess) {
                    dispatch(showToast(props.t(response.data.message), true, true));

                    if (!unArchive) {
                        modalRefDel.current.tog_backdrop();
                        setComment("");
                    }

                    triggersubjectMultiFormData({ subjectId: subjectId, studyVisitId: pageId, showArchivedMulties: !showArchivedMulties });
                    dispatch(endloading());
                } else {
                    dispatch(showToast(props.t(response.data.message), true, false));
                    dispatch(endloading());
                }
            }
        }
    }

    const toggleUnArchive = (id, rowIndex, isArchived, unArchive) => {
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
                setSelectedSubjectVisitId(id);
                setRowIndex(rowIndex);
                setIsArchived(isArchived);
                setUnArchive(unArchive);
            } else {
                return false;
            }
        });
    };

    const handleClick = () => {
        Swal.fire({
            title: props.t("You will add a new form"),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                dispatch(startloading());
                const response = await addingSubjectMultiForm({ subjectId: subjectId, studyVisitId: pageId });

                if (response.data.isSuccess) {
                    dispatch(endloading());
                    dispatch(showToast(response.data.message, true, true));
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
            title: props.t('Form Name'),
            dataIndex: 'formName',
            sorter: (a, b) => a.formName.localeCompare(b.formName),
            sortDirections: ['ascend', 'descend'],
            filteredValue: [searchFormNameText],
            onFilter: (value, record) => String(record.FormName).toLowerCase().includes(value.toLowerCase()),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input.Search
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={(e) => setSearchFormNameText(e.target.value)}
                        />
                    </div>
                );
            },
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Form No'),
            dataIndex: 'formNo',
            sorter: (a, b) => a.createdAt.localeCompare(b.formNo),
            sortDirections: ['ascend', 'descend'],
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
            title: props.t('Status'),
            dataIndex: 'updatedAt',
            sorter: (a, b) => a.status.localeCompare(b.status),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: props.t('Form Status'),
            dataIndex: 'updatedAt',
            sorter: (a, b) => a.formStatus.localeCompare(b.formStatus),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: props.t('Actions'),
            dataIndex: 'actions',
            key: 'actions'
        }
    ];

    return (
        <React.Fragment>
            {!isLoading && !error && subjectMultiFormData !== null &&
                <div className="page-content">
                    <div className="container-fluid">
                        <>
                            <div className="page-title-box">
                                <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                                    <Col md={8}>
                                        <h6 className="page-title">{props.t('Multi form list')}</h6>
                                    </Col>
                                </Row>
                            </div>
                            <Row>
                                <Col className="col-12">
                                    <div style={{ display: 'inline-block', float: 'left' }} className="col-md-6">
                                        {permissions.canFormArchiveMultiVisit &&
                                            <>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    onChange={handleShowArchivedSubjectsChange}
                                                    checked={showArchivedMulties} /><label className="form-check-label" style={{ marginLeft: '5px' }}>
                                                    {props.t("Show archived forms")}
                                                </label>
                                            </>
                                        }
                                    </div>
                                    {permissions.canFormAddMultiVisit &&
                                        <div style={{ display: 'inline-block', float: 'right', marginBottom: '5px' }} className="col-md-6" onClick={handleClick}>
                                            <div style={{ float: 'right' }}>
                                                <Typography.Text strong style={{ marginRight: '8px', cursor: 'pointer' }}>{props.t('Add new form')}</Typography.Text>
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
                                    />
                                </Col>
                            </Row>
                        </>
                    </div>
                </div>
            }
            <ModalComp
                refs={modalRefDel}
                title={isArchived ? props.t("deletion") : props.t("archiving")}
                size={"md"}
                body={
                    <div className="row">
                        <div className="mb-3 col-md-12">
                            <Label className="form-label">{isArchived ? props.t("This form will be deleted") : props.t("This form will be archived")}</Label>
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

SubjectMultiList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectMultiList);