import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { Table } from 'antd';
import { useLazyStudyVisitAnnotatedCrfHistoryGetQuery, useLazyStudyVisitAnnotatedCrfHistoryPdfGetQuery } from '../../../../store/services/Visit';
import { endloading, startloading } from '../../../../store/loader/actions';
import { v4 as uuidv4 } from 'uuid';
import { EyeOutlined } from '@ant-design/icons';

const AnnotatedCrfPdfHistory = props => {

    const dispatch = useDispatch();

    const [data, setData] = useState([]);

    const [trigger, { data: annotatedData, isError, isLoading }] = useLazyStudyVisitAnnotatedCrfHistoryGetQuery();

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        dispatch(startloading());
        if (annotatedData && !isLoading && !isError) {
            setData(annotatedData.map(item => ({ ...item, key: uuidv4() })));
            dispatch(endloading());
        } else if (!isLoading && isError) {
            dispatch(endloading());
        }
    }, [annotatedData, isError, isLoading]);

    const columns = [
        {
            title: props.t('Version'),
            dataIndex: 'version',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: props.t('Created by'),
            dataIndex: 'createdBy',
            sorter: (a, b) => a.role.localeCompare(b.role),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: props.t('Created on'),
            dataIndex: 'createdOn',
            sorter: (a, b) => a.role.localeCompare(b.role),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: props.t('Action'),
            dataIndex: 'action',
            align: 'center',
            render: (text, record) => {
                return (
                    <EyeOutlined
                        style={{ cursor: 'pointer' }}
                        onClick={() => getPdf(record.id)}
                    />
                )
            },
        }
    ];

    const [triggerPdf, { data: pdf, isError: errorPdf, isLoading: loadingPdf }] = useLazyStudyVisitAnnotatedCrfHistoryPdfGetQuery();

    const getPdf = (id) => {
        triggerPdf(id);
    };
    useEffect(() => {
        if (pdf && !errorPdf && !loadingPdf) {
            const openButton = document.getElementById('openPdfButton');
            openButton.onclick = () => {
                window.open(`/pdf?url=${pdf.data}`, '_blank');
            };
            openButton.click();
        }
    }, [pdf, errorPdf, loadingPdf])
   
    return (
        <>
            <button id="openPdfButton" style={{ display: "none" }}></button>
            <Table
                dataSource={data}
                columns={columns}
                pagination={true}
                scroll={{ x: 'max-content' }}
            />
        </>
    )
}

AnnotatedCrfPdfHistory.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AnnotatedCrfPdfHistory);