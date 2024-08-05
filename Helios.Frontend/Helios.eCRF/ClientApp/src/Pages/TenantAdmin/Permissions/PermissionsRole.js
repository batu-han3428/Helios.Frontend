import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useLazyPermissionsVisitListGetQuery, useSetPermissionsVisitPageMutation } from '../../../store/services/Permissions';
import { startloading, endloading } from '../../../store/loader/actions';
import { useDispatch } from 'react-redux';
import { Table, Checkbox } from 'antd';
import { useLazyStudyVisitPermissionsListGetQuery } from '../../../store/services/Visit';
import { showToast } from '../../../store/toast/actions';

const PermissionsRole = props => {

    const dispatch = useDispatch();

    const [data, setTableData] = useState([]);

    const [columns, setColumns] = useState([
        {
            title: props.t('Visits & pages'),
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            ellipsis: true,
        },
    ]);

    function assignKeys(d) {
        let keyCounter = 1;

        function assignKeysRecursive(node) {
            const newNode = { ...node };
            newNode.key = keyCounter++;

            if (!newNode.children) {
                newNode.type = "page";
            } else {
                newNode.type = "visit";
                newNode.children = newNode.children.map(child => assignKeysRecursive(child));
            }

            if ((newNode.children && newNode.children.length === 0) || (!newNode.children)) {
                delete newNode.children;
            }

            return newNode;
        }

        const newData = d.map(item => assignKeysRecursive(item));
        return newData;
    }
    
    const [triggerP, { data: permissionsList, isLoadingP, isErrorP }] = useLazyStudyVisitPermissionsListGetQuery();

    useEffect(() => {
        dispatch(startloading());
        if (props.id) {
            triggerP();
        }
    }, [props.id])

    const [trigger, { data: resultData, isLoading, isError }] = useLazyPermissionsVisitListGetQuery();

    useEffect(() => {
        if (permissionsList && !isLoadingP && !isErrorP) {
            const longestTitleLength = Math.max(...permissionsList.map(data => props.t(data.name).length));
            const newData = permissionsList.map(data => {
                return {
                    title: props.t(data.name),
                    dataIndex: data.key,
                    key: data.key,
                    align: 'center',
                    width: longestTitleLength * 10,
                    render: (text, record) => (
                        <Checkbox />
                    ),
                };
            });
            setColumns(prevColumns => [...prevColumns, ...newData]);
            trigger(props.id);
        } else if (!isLoadingP && isErrorP) {
            dispatch(endloading());
        }
    }, [permissionsList, isErrorP, isLoadingP, , props.t]);

    useEffect(() => {
        dispatch(startloading());
        if (resultData && !isLoading && !isError) {
            const newData = assignKeys(resultData);
            setTableData(newData);
            setColumns(prevColumns => {
                return prevColumns.map(column => {
                    if (column.dataIndex && column.dataIndex !== 'name') {
                        column.render = (text, record) => {
                            const permissionRecord = record.permissions.find(perm => perm.key === column.key);
                            if (permissionRecord) {
                                const { isDisabled, isActive } = permissionRecord;
                                return <Checkbox checked={isActive} disabled={isDisabled} onChange={(e) => {
                                    const { id, type } = record;
                                    const { key } = column;
                                    submitPermission(id, key, type);
                                }} />;
                            }
                        };
                    }
                    return column;
                });
            });
            dispatch(endloading());
        } else if (!isLoading && isError) {
            dispatch(endloading());
        }
    }, [resultData, isError, isLoading, props.t]);

    const [setPermissionsVisitPage] = useSetPermissionsVisitPageMutation();

    const submitPermission = async (id, key, type) => {
        try {
            dispatch(startloading());
            const response = await setPermissionsVisitPage({
                studyRoleId: props.id,
                studyVisitId: type === "visit" ? id : null,
                studyPageId: type === "page" ? id : null,
                permissionKey: key
            });
            dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
            dispatch(endloading());
        } catch (e) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }; 

    return (
        <>
            <Table
                className="role-visit-permission-table"
                columns={columns}
                dataSource={data}
                scroll={{ x: 'max-content', y: 240 }}
                pagination={false}
            />
        </>
    )
}

PermissionsRole.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(PermissionsRole);