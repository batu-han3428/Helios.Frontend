import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";
import { startloading, endloading } from '../../../store/loader/actions';
import { useAddSubjectMutation, useGetSubjectListQuery } from '../../../store/services/Subject';
import "./Subject.css";

const SubjectList = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [studyId, setStudyId] = useState(8);
    const [addingSubject] = useAddSubjectMutation();
    const { data: subjectsData, error, isLoading } = useGetSubjectListQuery(8);

    useEffect(() => {
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

    const addSubject = (id) => {
        Swal.fire({
            title: props.t("You have unsaved changes"),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                    dispatch(startloading());
                const response = await addingSubject(8);
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
            key:'subjectNumber'
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
            key:'actions'
        },
    ];

    const [data, setData] = useState([]);

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
                            <div style={{ display: 'inline-block', float: 'right' }} onClick={addSubject}>
                                <Typography.Text strong style={{ marginRight: '8px', cursor: 'pointer' }}>Yeni hasta ekle</Typography.Text>
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
        </React.Fragment>
    )
}

SubjectList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectList);