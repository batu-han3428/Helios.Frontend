import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Input } from 'antd';
import { showToast } from '../../../../store/toast/actions';
import { useDispatch } from "react-redux";
import { useAutoSaveSubjectMutation, useSetSubjectMissingDataMutation, useLazyGetRelationPageElementListQuery } from '../../../../store/services/Subject';

const SubjectChangeElementComment = props => {
    const dispatch = useDispatch();
    const [error, setError] = useState({});
    const [autoSaveSubject] = useAutoSaveSubjectMutation();
    const [setSubjectMissingData] = useSetSubjectMissingDataMutation();
    const [triggerQuery] = useLazyGetRelationPageElementListQuery();
    const [data, setData] = useState([{
        id: props.subjectElementId,
        elementName: props.elementName,
        oldValue: props.oldValue,
        newValue: props.value,
        type: props.type
    }]);


    useEffect(() => {
        const fetchData = async () => {
            const result = await triggerQuery({
                subjectVisitPageModuleElementId: props.subjectElementId,
                studyId: props.studyId,
                subjectId: props.subjectId,
                ...(props.value && { value: String(props.value) })
            });

            if (result.data) {
                setData(prevData => [
                    ...prevData,
                    ...result.data.map(item => ({
                        id:item.id,
                        elementName: item.elementName,
                        oldValue: item.value,
                        newValue: "",
                        type: item.type
                    }))
                ]);
            }
        };

        fetchData();
    }, [props.subjectElementId, props.studyId, props.subjectId, props.value, triggerQuery]);

    const columns = [];
    columns.push({
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: () => null,
        width: 0,
        className: 'hidden-column',
    });
    columns.push({
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: () => null,
        width: 0,
        className: 'hidden-column',
    });
    columns.push({
        title: props.t('Input'),
        dataIndex: 'elementName',
        sorter: (a, b) => a.elementName.localeCompare(b.elementName),
    });
    columns.push({
        title: props.t('Old value'),
        dataIndex: 'oldValue',
        sorter: (a, b) => a.oldValue.localeCompare(b.oldValue),
    });
    columns.push({
        title: props.t('New value'),
        dataIndex: 'newValue',
        sorter: (a, b) => a.value.localeCompare(b.value),
    });
    columns.push({
        title: props.t('Reason for change'),
        dataIndex: 'reasonForChange',
        sorter: (a, b) => a.reasonForChange.localeCompare(b.reasonForChange),
        render: (text, record) => (
            <div>
                <Input
                    value={record.reasonForChange}
                    onBlur={(e) => handleChange(e, record)}
                    status={error[record.key] ? 'error' : ''}
                />
                {
                    error[record.key] && (
                        <div style={{ color: 'red', marginTop: '4px' }}>
                            {error[record.key]}
                        </div>
                    )
                }
            </div>
        ),
    });
    const handleChange = (e, record) => {
        const { value } = e.target;
        const trimmedValue = value.trim();
        if (!trimmedValue || trimmedValue === '-' || /^\s*-\s*$/.test(value)) {
            setError(prevError => ({
                ...prevError,
                [record.key]: props.t("This field is required")
            }));
        } else {
            setError(prevError => ({
                ...prevError,
                [record.key]: null
            }));
            if (props.isMissingData) {
                setSubjectMissingData({
                    elementId: record.id,
                    value: record.newValue,                  
                    type: record.type,
                    comment: value,
                    commentType: 2
                }).then(response => {
                    dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
                }).catch(error => {
                    console.error("Error saving subject:", error);
                });
            } else {
                autoSaveSubject({
                    id: record.id,
                    value: record.newValue,
                    elementName:"",
                    type: Number(record.type),
                    comment: value,
                    commentType: 2
                }).then(response => {
                    dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
                }).catch(error => {
                    console.error("Error saving subject:", error);
                });
            }

        }
    };
    return (

        <Row>
            <Col className="col-12">
                <label>{props.t("Please, supply a reason for changing this field's value:")}</label>

                <Table
                    columns={columns}
                    dataSource={data}
                    scroll={{ x: 'max-content' }}
                />

            </Col>
        </Row>

    )
}

SubjectChangeElementComment.propTypes = {
    t: PropTypes.any,
    elementName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    subjectElementId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default withTranslation()(SubjectChangeElementComment);