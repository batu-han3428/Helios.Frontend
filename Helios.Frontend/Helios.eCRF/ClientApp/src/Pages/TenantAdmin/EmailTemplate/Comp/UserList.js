import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle} from "reactstrap";
import { withTranslation } from "react-i18next";
import { Table } from 'antd';
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
                title: props.t('Name / Surname'),
                dataIndex: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: props.t('Role'),
                dataIndex: 'role',
                sorter: (a, b) => a.role.localeCompare(b.role),
                sortDirections: ['ascend', 'descend'],
            },      
        ],
        rows: table
    }  
    return (
        <Card className="mb-3">
            <CardHeader style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "white", borderBottom: "1px solid #e9ecef" }}>
                <CardTitle>{props.t("List of users to view the email")}</CardTitle>
            </CardHeader>
            <CardBody>
              
                <Table
                    dataSource={data.rows.map(item => ({ ...item, key: item.id }))}
                    columns={data.columns}
                    pagination={true}
                    scroll={{ x: 'max-content' }}
                />
            </CardBody>
        </Card>
    );
};


UserList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(UserList);