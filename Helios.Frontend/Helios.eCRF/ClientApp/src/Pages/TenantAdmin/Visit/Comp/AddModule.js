import PropTypes from 'prop-types';
import React, { useImperativeHandle, useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLazyModuleListGetQuery, useAddStudyModuleSetMutation } from "../../../../store/services/Visit";
import { showToast } from '../../../../store/toast/actions';
import { formatDate } from "../../../../helpers/format_date";

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
                dispatch(showToast(props.t(response.data.message), true, true));
                if (response.data.values !== null) {
                    dispatch(showToast(props.t("There is no element in the module you want to add. Please add element first.") + "\n" + response.data.values, false, false));
                }
                dispatch(endloading());
                props.toggleModal();
            } else {
                if (response.data.message !== "") {
                    dispatch(showToast(props.t(response.data.message), true, false));
                }
                if (response.data.values !== null) {
                    dispatch(showToast(props.t("There is no element in the module you want to add. Please add element first.") + "\n" + response.data.values, false, false));
                }
                dispatch(endloading());
            }
        } catch (e) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
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
          
                return {
                    ...item,
                    updatedAt: formatDate(item.updatedAt),
                    createdAt: formatDate(item.createdAt), 
                };                     
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
            handleDataChange();
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
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