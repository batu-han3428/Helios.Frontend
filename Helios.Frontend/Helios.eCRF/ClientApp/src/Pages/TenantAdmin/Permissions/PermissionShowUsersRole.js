import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useLazyRoleUsersListGetQuery } from '../../../store/services/Permissions';
import { startloading, endloading } from '../../../store/loader/actions';
import { useDispatch } from 'react-redux';
import { Table } from 'antd';


const PermissionShowUsersRole = props => {

    const dispatch = useDispatch();

    const [tableData, setTableData] = useState([]);

    const data = {
        columns: [
            {
                title: props.t('Name'),
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
        rows: tableData
    }
  
    const generateInfoLabel = () => {
        var infoDiv = document.querySelector('.dataTables_info');
        var infoText = infoDiv.innerHTML;
        let words = infoText.split(" ");
        if (words[0] === "Showing") {
            let from = words[1];
            let to = words[3];
            let total = words[5];
            if (words[1] === "0") {
                from = "0";
                to = "0";
                total = "0";
            }
            infoDiv.innerHTML = props.t("Showing entries").replace("{from}", from).replace("{to}", to).replace("{total}", total);
        } else {
            let from = words[2];
            let to = words[4];
            let total = words[0];
            if (words[0] === "0") {
                from = "0";
                to = "0";
                total = "0";
            }
            infoDiv.innerHTML = props.t("Showing entries").replace("{from}", from).replace("{to}", to).replace("{total}", total);
        }
    };

    const [trigger, { data: resultData, isLoading, isError }] = useLazyRoleUsersListGetQuery();

    useEffect(() => {
        trigger(props.id);
    }, [props.id])

    useEffect(() => {
        dispatch(startloading());
        if (resultData && !isLoading && !isError) {

            setTableData(resultData);

            const timer = setTimeout(() => {
                generateInfoLabel();
            }, 10)

            dispatch(endloading());

            return () => clearTimeout(timer);
        } else if (!isLoading && isError) {
            dispatch(endloading());
        }
    }, [resultData, isError, isLoading, props.t]);

    return (
        
        <Table
            dataSource={data.rows.map(item => ({ ...item, key: item.id }))}
            columns={data.columns}
            pagination={true}
            scroll={{ x: 'max-content' }}
        />
    )
}

PermissionShowUsersRole.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(PermissionShowUsersRole);