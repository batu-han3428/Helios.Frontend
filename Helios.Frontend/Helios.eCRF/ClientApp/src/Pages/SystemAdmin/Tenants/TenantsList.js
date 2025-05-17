import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next";
import { Row, Col, Button, Card, CardBody } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from 'antd';
import { useDispatch } from 'react-redux';
import { startloading, endloading } from '../../../store/loader/actions';
import { useTenantListGetQuery } from '../../../store/services/Tenants';
import { formatDate } from "../../../helpers/format_date";
import { useNavigate } from "react-router-dom";


const TenantsList = props => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [table, setTable] = useState([]);

    const getActions = (item) => {
        const actions = (
            <div className="icon-container">
                <div title={props.t("Update")} className="icon icon-update" onClick={() => navigate(`/set-tenant/${item.id}`)}></div>
            </div>);
        return actions;
    };

    const data = {
        columns: [
            {
                title: props.t('Tenant name'),
                dataIndex: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Active studies'),
                dataIndex: 'activeStudies',
                sorter: (a, b) => a.activeStudies.localeCompare(b.activeStudies),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('User limit'),
                dataIndex: 'userLimit',
                sorter: (a, b) => a.userLimit.localeCompare(b.userLimit),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Created on'),
                dataIndex: 'createdAt',
                sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Updated on'),
                dataIndex: 'updatedAt',
                sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Actions'),
                dataIndex: 'actions',
                width: "170px",
            },
        ],
        rows: table
    }
   
    const { data: tenantsData, error, isLoading } = useTenantListGetQuery();

    useEffect(() => {
        dispatch(startloading());
        if (!isLoading && !error && tenantsData) {
            const updatedTenantsData = tenantsData.map(item => {
                return {
                    ...item,
                    createdAt: formatDate(item.createdAt),
                    updatedAt: formatDate(item.updatedAt),
                    actions: getActions(item)
                };
            });
            setTable(updatedTenantsData);
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(endloading());
        }
    }, [tenantsData, error, isLoading]);

    const addOrUpdateTenant = (tenantId = "") => {
        if (tenantId !== "") {
            navigate(`/set-tenant/${tenantId}`);
        } else {
            navigate(`/set-tenant`);
        }
    }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom: "5px" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t("Tenants")}</h6>
                            </Col>
                            <Col md="4">
                                <div className="float-end d-none d-md-block" style={{ marginLeft: "10px" }}>
                                    <Button
                                        color="success"
                                        className="btn btn-success waves-effect waves-light"
                                        type="button"
                                        onClick={() => addOrUpdateTenant()}
                                    >
                                        <FontAwesomeIcon icon="fa-solid fa-plus" /> {props.t("Add a tenant")}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <Card>
                                <CardBody>                                  
                                    <Table
                                        dataSource={data.rows.map(item => ({ ...item, key: item.id }))}
                                        columns={data.columns}
                                        pagination={true}
                                        scroll={{ x: 'max-content' }}
                                        onRow={(record) => {
                                            return {
                                                onDoubleClick: () => {
                                                    addOrUpdateTenant(record.id)
                                                }
                                            }
                                        }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

TenantsList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(TenantsList);