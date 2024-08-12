import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SdvList = props => {
    const columns = [] 
   
    columns.push({
        title: props.t('subjectNumber'),
        dataIndex: 'subjectNumber',
        sorter: (a, b) => a.subjectNumber.localeCompare(b.subjectNumber),
        sortDirections: ['ascend', 'descend'],
        onFilter: (value, record) => String(record.subjectNumber).toLowerCase().includes(value.toLowerCase()),       
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    });

    columns.push({
        title: props.t('Site name'),
        dataIndex: 'siteName',
        sorter: (a, b) => a.siteName.localeCompare(b.siteName),
        sortDirections: ['ascend', 'descend'],            
        onFilter: (value, record) => record.siteName === value,
    });
    columns.push({
        title: props.t('Visit'),
        dataIndex: 'visitName',
        sorter: (a, b) => a.visitName.localeCompare(b.visitName),
        sortDirections: ['ascend', 'descend'],
    });   
    columns.push({
        title: props.t('Page'),
        dataIndex: 'pageName',
        sorter: (a, b) => a.pageName.localeCompare(b.pageName),
        sortDirections: ['ascend', 'descend'],
    });   
    columns.push({
        title: props.t('State'),
        dataIndex: 'state',
        sorter: (a, b) => a.state.localeCompare(b.state),
        sortDirections: ['ascend', 'descend'],
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
                                columns={columns}                             
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

SdvList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SdvList);