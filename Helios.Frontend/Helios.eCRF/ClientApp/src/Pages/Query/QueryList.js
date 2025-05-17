import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Tooltip, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLazyGetSubjectQueryListQuery, useLazyGetUserPermissionsQuery } from '../../store/services/Subject';
import { useDispatch, useSelector } from "react-redux";
import { endloading, startloading } from '../../store/loader/actions';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { QueryIconStatu } from '../../helpers/icon_helper';
import ModalComp from '../../components/Common/ModalComp/ModalComp';
import SubjectQuery from '../Subject/Subject/Comp/SubjectQuery';

const QueryList = props => {

    const modalRef = useRef();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const studyInformation = useSelector(state => state.rootReducer.Study);

    const [data, setData] = useState([]);

    const [filteredInfo, setFilteredInfo] = useState({});

    const [uniqueValues, setUniqueValues] = useState({
        siteNames: [],
        visitNames: [],
        pageNames: [],
        states: []
    });

    const [modalInf, setModalInf] = useState({});

    const extractUniqueValues = (data) => {
        const siteNames = [...new Set(data.map(item => item.siteName))];
        const visitNames = [...new Set(data.map(item => item.visitName))];
        const pageNames = [...new Set(data.map(item => item.pageName))];
        const states = [...new Set(data.map(item => item.status))];

        const stateDescriptions = states.map(status => ({
            text: QueryIconStatu(status).text || status,
            value: status
        }));

        setUniqueValues({
            siteNames,
            visitNames,
            pageNames,
            states: stateDescriptions
        });
    };

    const handleChange = (pagination, filters) => {
        setFilteredInfo(filters);
    };

    const [triggerPermission, { data: permissionsData, errorPerm, isLoadingPerm }] = useLazyGetUserPermissionsQuery();
    const [trigger, { data: queryData, isError, isLoading }] = useLazyGetSubjectQueryListQuery();

    useEffect(() => {
        dispatch(startloading());
        if (studyInformation.studyId) {
            triggerPermission(studyInformation.studyId);
        }
    }, [studyInformation.studyId, dispatch]);

    useEffect(() => {
        if (!errorPerm && !isLoadingPerm && permissionsData) {
            if (!permissionsData.canMonitoringOpenQuery && !permissionsData.canMonitoringAnswerQuery) {
                dispatch(endloading());
                navigate('/AccessDenied', { state: { from: props.location } });
                return;
            }
            trigger();
        } else if (errorPerm && !isLoadingPerm) {
            dispatch(endloading());
        }
    }, [permissionsData, errorPerm, isLoadingPerm, navigate, props.location]);

    useEffect(() => {
        if (!isError && !isLoading && queryData) {
            if (!permissionsData.canSubjectView) {
                navigate('/AccessDenied', { state: { from: props.location } });
                return;
            }
            setData(queryData);
            extractUniqueValues(queryData);
            dispatch(endloading());
        } else if (isError && !isLoading) {
            dispatch(endloading());
        }
    }, [queryData, isError, isLoading]);

    const columns = [];

    const [searchsubjectNumberText, setSearchsubjectNumberText] = useState('');
    columns.push({
        title: props.t('subjectNumber'),
        dataIndex: 'subjectNo',
        sorter: (a, b) => a.subjectNo.localeCompare(b.subjectNo),
        sortDirections: ['ascend', 'descend'],
        filteredValue: [searchsubjectNumberText],
        onFilter: (value, record) => String(record.subjectNo).toLowerCase().includes(value.toLowerCase()),
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
        title: props.t('Site name'),
        dataIndex: 'siteName',
        sorter: (a, b) => a.siteName.localeCompare(b.siteName),
        sortDirections: ['ascend', 'descend'],
        filters: uniqueValues.siteNames.map(item => ({ text: item, value: item })),
        filteredValue: filteredInfo.siteName || null,
        onFilter: (value, record) => record.siteName === value,
    });       
    columns.push({
        title: props.t('Visit'),
        dataIndex: 'visitName',
        sorter: (a, b) => a.visitName.localeCompare(b.visitName),
        sortDirections: ['ascend', 'descend'],
        filters: uniqueValues.visitNames.map(item => ({ text: item, value: item })),
        filteredValue: filteredInfo.visitName || null,
        onFilter: (value, record) => record.visitName === value,
    });
    columns.push({
        title: props.t('Page'),
        dataIndex: 'pageName',
        sorter: (a, b) => a.pageName.localeCompare(b.pageName),
        sortDirections: ['ascend', 'descend'],
        filters: uniqueValues.pageNames.map(item => ({ text: item, value: item })),
        filteredValue: filteredInfo.pageName || null,
        onFilter: (value, record) => record.pageName === value,
    });
    columns.push({
        title: props.t('Opened days number'),
        dataIndex: 'openedDayNumber',
        sorter: (a, b) => a.openedDaysNumber.localeCompare(b.openedDaysNumber),
        sortDirections: ['ascend', 'descend'],
    });
    columns.push({
        title: props.t('Fullname'),
        dataIndex: 'fullName',
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        sortDirections: ['ascend', 'descend'],
    });
    columns.push({
        title: props.t('Query number'),
        dataIndex: 'queryNo',
        sorter: (a, b) => a.queryNumber.localeCompare(b.queryNumber),
        sortDirections: ['ascend', 'descend'],
    });
    columns.push({
        title: props.t('Last message in query'),
        dataIndex: 'lastMessageInQuery',
        sorter: (a, b) => a.lastMessageInQuery.localeCompare(b.lastMessageInQuery),
        sortDirections: ['ascend', 'descend'],
    });
    columns.push({
        title: props.t('State'),
        dataIndex: 'status',
        sorter: (a, b) => a.state.localeCompare(b.state),
        sortDirections: ['ascend', 'descend'],
        className: 'center-align',
        filters: uniqueValues.states.map(item => ({ text: props.t(item.text), value: item.value })),
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status === value,
        render: (value) => {
            const iconInf = QueryIconStatu(value, true);
            return (
                <Tooltip title={props.t(iconInf.text)}>
                    {iconInf.icon}
                </Tooltip>
            );
        }
    });

    const goToQueryElement = (studyId, pageId, subjectId, subjectNo, elementId) => () => {
        navigate(`/subject-detail/${studyId}/${pageId}/${subjectId}/${subjectNo}`, {
            state: { showQueryElement: true, queryElementId: elementId }
        });
    };

    document.title = props.t('Query list');
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        {/*<Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>*/}
                        {/*    <Col md={8}>*/}
                        {/*        <h6 className="page-title">{props.t('Sdv list')}</h6>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                    </div>
                    <Row>
                        <Col className="col-12">
                            <Table
                                columns={columns}
                                pagination={true}
                                scroll={{ x: 'max-content' }}
                                dataSource={data.map(item => ({ ...item, key: uuidv4() }))}    
                                onChange={handleChange}
                                onRow={(record, rowIndex) => {
                                    return {
                                        onDoubleClick: () => {
                                            setModalInf(
                                                {
                                                    content: <SubjectQuery
                                                                subjectId={record.subjectId}
                                                                permissions={{ openQuery: permissionsData.canMonitoringOpenQuery, answerQuery: permissionsData.canMonitoringAnswerQuery }}
                                                                commentType={record.status}
                                                                subjectNumber={record.subjectNo}
                                                                refs={modalRef}
                                                                currentData={{ elementName: record.elementName, value: record.elementValue }}
                                                                subjectElementId={record.elementId}
                                                                isQueryList={true}
                                                                navigate={goToQueryElement(studyInformation.studyId, record.pageId, record.subjectId, record.subjectNo, record.elementId)}
                                                            />
                                                }
                                            );
                                            modalRef.current.tog_backdrop();
                                        }
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalComp
                refs={modalRef}
                body={modalInf.content}
                isButton={false}
                bodyStyle={{ padding: '0' }}
            />
        </React.Fragment>
    )
}

QueryList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(QueryList);