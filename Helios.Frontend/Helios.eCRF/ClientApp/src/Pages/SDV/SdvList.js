import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Tooltip, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLazyGetSubjectSdvListQuery, useLazyGetUserPermissionsQuery } from '../../store/services/Subject';
import { useDispatch, useSelector } from "react-redux";
import { endloading, startloading } from '../../store/loader/actions';
import { v4 as uuidv4 } from 'uuid';
import { SdvIconStatu } from '../../helpers/icon_helper';
import { useNavigate } from "react-router-dom";

const SdvList = props => {
    const columns = []

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

    const extractUniqueValues = (data) => {
        const siteNames = [...new Set(data.map(item => item.siteName))];
        const visitNames = [...new Set(data.map(item => item.visitName))];
        const pageNames = [...new Set(data.map(item => item.pageName))];
        const states = [...new Set(data.map(item => item.sdvStatus))];

        const stateDescriptions = states.map(status => ({
            text: SdvIconStatu(status).text || status,
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
    const [trigger, { data: sdvData, isError, isLoading }] = useLazyGetSubjectSdvListQuery();

    useEffect(() => {
        dispatch(startloading());
        if (studyInformation.studyId) {
            triggerPermission(studyInformation.studyId);
        }
    }, [studyInformation.studyId, dispatch]);

    useEffect(() => {
        if (!errorPerm && !isLoadingPerm && permissionsData) {
            if (!permissionsData.canMonitoringSdv) {
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
        if (!isError && !isLoading && sdvData) {
            if (!permissionsData.canSubjectView) {
                navigate('/AccessDenied', { state: { from: props.location } });
                return;
            }
            setData(sdvData);
            extractUniqueValues(sdvData); 
            dispatch(endloading());
        } else if (isError && !isLoading) {
            dispatch(endloading());
        }
    }, [sdvData, isError, isLoading]);

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
        title: props.t('State'),
        dataIndex: 'sdvStatus',
        sorter: (a, b) => a.sdvStatus - b.sdvStatus, 
        sortDirections: ['ascend', 'descend'],
        className: 'center-align',
        filters: uniqueValues.states.map(item => ({ text: props.t(item.text), value: item.value })),
        filteredValue: filteredInfo.sdvStatus || null,
        onFilter: (value, record) => record.sdvStatus === value,
        render: (value) => {
            const iconInf = SdvIconStatu(value);
            return (
                <Tooltip title={props.t(iconInf.text)}>
                    {iconInf.icon}
                </Tooltip>
            );
        }
    });     

    document.title = props.t('SDV list');
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
                                dataSource={data.map(item => ({ ...item, key: uuidv4() }))}
                                columns={columns}                             
                                pagination={true}
                                scroll={{ x: 'max-content' }}  
                                onChange={handleChange}
                                onRow={(record, rowIndex) => {
                                    return {
                                        onDoubleClick: () => {
                                            navigate(`/subject-detail/${studyInformation.studyId}/${record.pageId}/${record.subjectId}/${record.subjectNo}`, { state: { showSdvElement: true } });
                                        }
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>           
        </React.Fragment>
    )
}

SdvList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SdvList);