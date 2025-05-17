﻿import PropTypes from 'prop-types';
import React, { useImperativeHandle, useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { Tabs, Table, Checkbox, Typography } from 'antd';
import { useVisitPageEProSetMutation, useLazyPermissionListGetQuery, useVisitPagePermissionSetMutation, useLazyStudyVisitPermissionsListGetQuery } from "../../../../store/services/Visit";
import { showToast } from '../../../../store/toast/actions';

const Settings = props => {

    const dispatch = useDispatch();

    const [visitPageEProSet] = useVisitPageEProSetMutation();

    const [visitPagePermissionSet] = useVisitPagePermissionSetMutation();

    const [recordEPro, setRecordEPro] = useState(false);

    const studyInformation = useSelector(state => state.rootReducer.Study);

    const userInformation = useSelector(state => state.rootReducer.Login);

    const submitForm = async () => {
        if (activeTab === 1) {
            if (isEpro !== recordEPro) {
                try {
                    dispatch(startloading());
                    const response = await visitPageEProSet({
                        id: props.record.id,
                        userId: userInformation.userId,
                        studyId: studyInformation.studyId,
                        type: "",
                        name: "",
                        order: 0
                    });
                    if (response.data.isSuccess) {
                        await setRecordEPro(response.data.values.value);
                        dispatch(showToast(props.t(response.data.message), true, true));
                        dispatch(endloading());
                    } else {
                        dispatch(showToast(props.t(response.data.message), true, false));
                        dispatch(endloading());
                    }
                } catch (e) {
                    dispatch(showToast(props.t("An unexpected error occurred."), true, false));
                    dispatch(endloading());
                }
            } else {
                dispatch(showToast(props.t("It is not possible to update without making changes."), true, false));
            }
        }
        else if (activeTab === 2) {
            try {
                dispatch(startloading());
                let dto = {
                    permissionKeys: selectedRowKeys
                };
                if (props.record.type === 'visit') {
                    dto.studyVisitId = props.record.id;
                } else if (props.record.type === 'page') {
                    dto.studyVisitPageId = props.record.id;
                }
                else {
                    return false;
                }
                const response = await visitPagePermissionSet(dto);
                dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
                dispatch(endloading());
            } catch (e) {
                dispatch(showToast(props.t("An unexpected error occurred."), true, false));
                dispatch(endloading());
            }
        }
        else {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }

    useImperativeHandle(props.refs, () => ({
        submitForm: submitForm
    }), [submitForm, props]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        }
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [permission, setPermission] = useState();

    const [totalHeight, setTotalHeight] = useState(0);

    const [items, setItems] = useState([]);

    const [trigger, { data: permissionsData, error, isLoading }] = useLazyPermissionListGetQuery();

    const [triggerPermissionList, { data: permissionsListData, errorPermissionList, isLoadingPermissionList }] = useLazyStudyVisitPermissionsListGetQuery();

    useEffect(() => {
        if (props.record && studyInformation.studyId) {
            dispatch(startloading());
            triggerPermissionList();
        }
    }, [props.record, studyInformation.studyId])

    useEffect(() => {
        if (!isLoadingPermissionList && !errorPermissionList && permissionsListData) {
            setPermission(permissionsListData);
            setTotalHeight(permissionsListData.length * 50);
            trigger({ pageKey: props.record.type === 'page' ? 2 : 1, studyId: studyInformation.studyId, id: props.record.id });
            setRecordEPro(props.record.epro);
            if (props.record.type === 'page') {
                setIsEpro(props.record.epro);
            }
        } else if (!isLoadingPermissionList && errorPermissionList) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }, [permissionsListData, errorPermissionList, isLoadingPermissionList]);

    useEffect(() => {
        if (!isLoading && !error && permissionsData) {
            setSelectedRowKeys(permissionsData.map(x=>x.permissionName));
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }, [permissionsData, error, isLoading]);


    const [isEpro, setIsEpro] = useState(false);

    const handleCheckboxChange = (e) => {
        setIsEpro(e.target.checked);
    };

    const { Text } = Typography;

    const contentEpro = () => {
        return (
            <div>
                <Text strong>{props.t("Is this page an ePRO page?")}</Text><br/><br/>
                <Checkbox checked={isEpro} onChange={handleCheckboxChange}>
                    <Text>{props.t("Evet")}</Text>
                </Checkbox>
            </div>
        );
    }

    useEffect(() => {
        let items = [];
        let key = 1;
        if (props.record.type === 'page') {
            items.push({
                key: key,
                label: 'ePRO',
                children: contentEpro()
            });
            key++;
        } else {
            setActiveTab(2);
        }
        items.push({
            key: key,
            label: props.t('Permissions'),
            children: contentPermission()
        });
        setItems(items);
    }, [selectedRowKeys, isEpro, permission])

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys, selectedRows) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };

    const contentPermission = () => {
        return (
            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={permission}
                pagination={false}
                scroll={{ y: totalHeight > 300 ? 300 : undefined }}
            />
        );
    }

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        setActiveTab(1);
    }, []);

    const handleTabChange = (key) => {
        const data = items.find(x => x.key === key);
        if (data.label === 'ePRO') {
            setActiveTab(1);
        } else {
            setActiveTab(2);
        }
    };

    return (
        <Tabs
            onChange={handleTabChange}
            defaultActiveKey="1"
            items={items}
        />
    )
}

Settings.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Settings);