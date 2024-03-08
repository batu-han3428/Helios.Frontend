import PropTypes from 'prop-types';
import React, { useImperativeHandle, useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { Table} from 'antd';
import { useLazyModuleListGetQuery, useAddStudyModuleSetMutation } from "../../../../store/services/Visit";

const AddModule = props => {

    const dispatch = useDispatch();

    const [addStudyModuleSet] = useAddStudyModuleSetMutation();

    const submitForm = async () => {
        try {
            dispatch(startloading());
            if (selectedRowKeys.length < 1) {
                dispatch(endloading());
                return false;
            }
            const response = await addStudyModuleSet({moduleIds: selectedRowKeys, pageId: props.record.id});
            if (response.data.isSuccess) {
                props.toast.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: true
                });
                dispatch(endloading());
            } else {
                props.toast.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: false
                });
                dispatch(endloading());
            }
        } catch (e) {
            props.toast.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }

    useImperativeHandle(props.refs, () => ({
        submitForm: submitForm
    }), [submitForm, props]);

    const columns = [
        {
            title: props.t("Module name"),
            dataIndex: 'name',
        },
        {
            title: props.t("Created on"),
            dataIndex: 'createdAt',
        },
        {
            title: props.t("Updated on"),
            dataIndex: 'updatedAt',
        }
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [totalHeight, setTotalHeight] = useState(0);

    const [data, setData] = useState([]);

    const [trigger, { data: moduleData, error, isLoading }] = useLazyModuleListGetQuery();

    useEffect(() => {
        if (props.record) {
            dispatch(startloading());
            trigger();    
        }
    }, [props.record])

    useEffect(() => {
        if (!isLoading && !error && moduleData) {
            setTotalHeight(moduleData.length * 50);
            setData(moduleData);
            dispatch(endloading());
        } else if (!isLoading && error) {
            props.toast.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }, [moduleData, error, isLoading]);


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

    return (
        <Table
            rowSelection={{
                type: "checkbox",
                ...rowSelection,
            }}
            columns={columns}
            dataSource={data.map(item => ({ ...item, key: item.id }))}
            pagination={false}
            scroll={{ y: totalHeight > 350 ? 350 : undefined }}
        />
    )
}

AddModule.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddModule);