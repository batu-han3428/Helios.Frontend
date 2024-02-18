import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle} from "reactstrap";
import { withTranslation } from "react-i18next";
import { MDBDataTable } from "mdbreact";
import { useLazyStudyRoleUsersListGetQuery } from '../../../../store/services/Permissions';
import { startloading, endloading } from '../../../../store/loader/actions';
import { useDispatch } from 'react-redux';


const UserList = props => {

    const dispatch = useDispatch();

    const [table, setTable] = useState([]);

    const [trigger, { data: usersData, isLoading, isError }] = useLazyStudyRoleUsersListGetQuery();

    useEffect(() => {
        if (props.studyId) {
            dispatch(startloading());
            trigger(props.studyId);
        }
    }, [props.studyId])

    useEffect(() => {
        if (usersData && !isLoading && !isError) {
            setTable(usersData);
            dispatch(endloading());
        } else if (isError && !isLoading) {
            dispatch(endloading());
        }
    }, [usersData, isError, isLoading]);

    const data = {
        columns: [
            {
                label: props.t("Name / Surname"),
                field: "name",
                sort: "asc",
                width: 100
            },
            {
                label: props.t("Role"),
                field: "role",
                sort: "asc",
                width: 100
            }
        ],
        rows: table
    }

    return (
        <Card className="mb-3">
            <CardHeader style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "white", borderBottom: "1px solid #e9ecef" }}>
                <CardTitle>{props.t("List of users to view the email")}</CardTitle>
            </CardHeader>
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
    );
};


UserList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(UserList);