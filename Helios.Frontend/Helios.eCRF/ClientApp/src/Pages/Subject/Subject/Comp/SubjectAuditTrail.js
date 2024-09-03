import PropTypes from 'prop-types';
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Table } from 'antd';

const SubjectAuditTrail = props => {

    const [data, setData] = useState([]);

    return (
        <Table
            columns={[
                {
                    title: props.t('Fullname'),
                    dataIndex: 'fullname',
                    sorter: (a, b) => a.fullname.localeCompare(b.fullname),
                    sortDirections: ['ascend', 'descend'],
                },
                {
                    title: props.t('Previous data'),
                    dataIndex: 'previousData',
                    sorter: (a, b) => a.previousData.localeCompare(b.previousData),
                    sortDirections: ['ascend', 'descend'],
                },
                {
                    title: props.t('New data'),
                    dataIndex: 'newData',
                    sorter: (a, b) => a.newData.localeCompare(b.newData),
                    sortDirections: ['ascend', 'descend'],
                },
                {
                    title: props.t('Actions'),
                    dataIndex: 'actions',
                    sorter: (a, b) => a.actions.localeCompare(b.actions),
                    sortDirections: ['ascend', 'descend'],
                },
                {
                    title: props.t('Audit trail date'),
                    dataIndex: 'auditTrailDate',
                    sorter: (a, b) => a.auditTrailDate.localeCompare(b.auditTrailDate),
                    sortDirections: ['ascend', 'descend'],
                }
            ]}
            dataSource={data}
            pagination={true}
            scroll={{ x: 'max-content' }}
        />
    );
};

SubjectAuditTrail.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectAuditTrail);