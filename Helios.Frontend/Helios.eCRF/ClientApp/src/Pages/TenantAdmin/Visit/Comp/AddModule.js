import PropTypes from 'prop-types';
import React, { useImperativeHandle, useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLazyModuleListGetQuery, useAddStudyModuleSetMutation } from "../../../../store/services/Visit";

const AddModule = props => {

    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [addStudyModuleSet] = useAddStudyModuleSetMutation();

    const submitForm = async () => {
        try {
            dispatch(startloading());
            if (selectedRowKeys.length < 1) {
                dispatch(endloading());
                return false;
            }
            const response = await addStudyModuleSet({ moduleIds: selectedRowKeys, pageId: props.record.id });
            if (response.data.isSuccess) {
                props.toast.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: true
                });
                if (response.data.values !== null) {
                    props.toast.current.setToast({
                        message: props.t("There is no element in the module you want to add. Please add element first.") + "\n" + response.data.values,
                        stateToast: false,
                        autoHide: false
                    });
                }
                dispatch(endloading());
                props.toggleModal();
            } else {
                if (response.data.message !== "") {
                    props.toast.current.setToast({
                        message: props.t(response.data.message),
                        stateToast: false
                    });
                }
                if (response.data.values !== null) {
                    props.toast.current.setToast({
                        message: props.t("There is no element in the module you want to add. Please add element first.") + "\n" + response.data.values,
                        stateToast: false,
                        autoHide: false
                    });
                }
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
            ellipsis: true,
            filteredValue: [searchText],
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input.Search
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                );
            },
            onFilter: (value, record) => String(record.name).toLowerCase().includes(value.toLowerCase()),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
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

    const handleDataChange = () => {    
        const newData = moduleData.map(item => {          
            if (item.updatedAt === "0001-01-01T00:00:00+00:00") {
                return { ...item, updatedAt: "-" };
            }
            return item;
        });
        setData(newData);
    };

    useEffect(() => {
        if (props.record) {
            dispatch(startloading());
            trigger();    
        }
    }, [props.record])

    useEffect(() => {      
        if (!isLoading && !error && moduleData) {
            setTotalHeight(moduleData.length * 50);
          /*  setData(moduleData);*/
            handleDataChange();
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
            pagination={true}
            scroll={{ y: totalHeight > 350 ? 350 : undefined }}
        />
    )
}

AddModule.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddModule);