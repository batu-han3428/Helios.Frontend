import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next";
import { Row, Col, Button, Card, CardBody } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MDBDataTable } from "mdbreact";
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
                label: props.t("Tenant name"),
                field: "name",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Active studies"),
                field: "activeStudies",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Created on"),
                field: "createdAt",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Updated on"),
                field: "updatedAt",
                sort: "asc",
                width: 150
            },
            {
                label: props.t('Actions'),
                field: 'actions',
                sort: 'disabled',
                width: 100,
            }
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
                                    <MDBDataTable
                                        paginationLabel={[props.t("Previous"), props.t("Next")]}
                                        entriesLabel={props.t("Show entries")}
                                        searchLabel={props.t("Search")}
                                        noRecordsFoundLabel={props.t("No matching records found")}
                                        hover
                                        responsive
                                        striped
                                        bordered
                                        data={data}
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