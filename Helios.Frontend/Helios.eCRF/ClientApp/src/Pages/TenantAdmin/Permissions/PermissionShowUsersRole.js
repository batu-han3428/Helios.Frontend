import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useLazyRoleUsersListGetQuery } from '../../../store/services/Permissions';
import { startloading, endloading } from '../../../store/loader/actions';
import { useDispatch } from 'react-redux';
import { MDBDataTable } from "mdbreact";


const PermissionShowUsersRole = props => {

    const dispatch = useDispatch();

    const [tableData, setTableData] = useState([]);

    const data = {
        columns: [
            {
                label: props.t("Name"),
                field: "name",
                sort: "asc",
                width: 150
            },
            {
                label: props.t("Role"),
                field: "role",
                sort: "asc",
                width: 150
            }
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
    )
}

PermissionShowUsersRole.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(PermissionShowUsersRole);