import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Table, Tag, Select, Input, theme, Button } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { useLazyVisitRelationGetQuery, useVisitRelationSetMutation } from '../../../../store/services/Visit';

const { Option, OptGroup } = Select;
const tagInputStyle = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: 'top',
};

const Relation = props => {

    const dispatch = useDispatch();

    const [sourcePageOptions, setSourcePageOptions] = useState([]);

    const [sourceInputOptions, setSourceInputOptions] = useState([]);

    const [fieldOperationOptions, setFieldOperationOptions] = useState([]);

    const [visitRelationSet] = useVisitRelationSetMutation();

    const [trigger, { data: relationData, error, isLoading }] = useLazyVisitRelationGetQuery();

    useEffect(() => {
        dispatch(startloading());
        trigger();
    }, []);

    const [dataSource, setDataSource] = useState([]);
    //{ key: '1', id: 1, sourcepage: 342, elementId: 9589, actionCondition: 1, actionValue: ['nice', 'developer'], targetPage: ['target Page 1'], actionType: 1 },
    //{ key: '2', id: 2, sourcepage: null, elementId: null, actionCondition: null, actionValue: ['cool'], targetPage: [], actionType: 1 },
    useEffect(() => {
        if (!isLoading && !error && relationData) {
            console.log(relationData)
            let sourcePage = relationData.studyVisitRelationSourcePageModels;
            let fieldOperation = relationData.fieldOperationData;
            let visitRelation = relationData.visitRelationModels;
            setSourcePageOptions(sourcePage.map(visit => ({
                id: visit.id,
                label: visit.label,
                options: visit.options.map(page => ({ id: page.id, label: page.label }))
            })));
            setSourceInputOptions(sourcePage.flatMap(visit => visit.options).map(page => ({
                [page.id]: page.options.map(elm => ({
                    id: elm.id,
                    label: elm.label
                }))
            })));
            setFieldOperationOptions(fieldOperation);
            setDataSource(visitRelation);
            dispatch(endloading());
        } else if (!isLoading && error) {
           
            dispatch(endloading());
        }
    }, [relationData, error, isLoading]);

    //const [dataSource, setDataSource] = useState([
    //    { key: '1', sourcepage: 342, sourceinput: null, fieldoperation: 'Operation 2', tags: ['nice', 'developer'], targetpage: ['target Page 1'], role: 'Developer' },
    //    { key: '2', sourcepage: null, sourceinput: null, fieldoperation: '', tags: ['cool'], targetpage: [], role: 'Designer' },
    //]);

   /* const fieldOperationOptions = ['Operation 1', 'Operation 2', 'Operation 3'];*/

    //const sourcePageOptions = [
    //    { label: 'Group 1', options: ['Page 1', 'Page 2'] },
    //    { label: 'Group 2', options: ['Page 3', 'Page 4'] },
    //];

    //const sourceInputOptions = {
    //    342: ['Input 1', 'Input 2', 'Input 3'],
    //    'Page 2': ['Input 4', 'Input 5', 'Input 6'],
    //    'Page 3': ['Input 7', 'Input 8', 'Input 9'],
    //    'Page 4': ['Input 10', 'Input 11', 'Input 12'],
    //};

    //const targetPageOptions = [
    //    { label: 'Group 1', options: ['target Page 1', 'target Page 2'] },
    //    { label: 'Group 2', options: ['target Page 3', 'target Page 4'] },
    //];

    const handleTagChange = (key, newTags) => {
        const newDataSource = dataSource.map(item => {
            if (item.key === key) {
                return { ...item, actionValue: newTags };
            }
            return item;
        });
        setDataSource(newDataSource);
    };

    const removeTag = (key, tag) => {
        const newDataSource = dataSource.map(item => {
            if (item.key === key) {
                const newTags = item.actionValue.filter(t => t !== tag);
                return { ...item, actionValue: newTags };
            }
            return item;
        });
        setDataSource(newDataSource);
    };

    const { token } = theme.useToken();


    const tagPlusStyle = {
        height: 22,
        background: token.colorBgContainer,
        borderStyle: 'dashed',
    };


    const [inputVisibleMap, setInputVisibleMap] = useState({});


    const showInput = (record) => {
        const updatedInputVisibleMap = { ...inputVisibleMap, [record.key]: true };
        setInputVisibleMap(updatedInputVisibleMap);

    };

    const handleInputConfirm = (record, inputValue) => {
        inputValue = inputValue.trim();
        if (inputValue && !record.actionValue.includes(inputValue)) {
            const newTags = [...record.actionValue, inputValue];
            handleTagChange(record.key, newTags);
        }
        setInputVisibleMap({ ...inputVisibleMap, [record.key]: false });
    };

    const isInputVisible = (record) => {
        return inputVisibleMap[record.key];
    };


    const renderTags = (tags, record) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            {tags.map(tag => (
                <Tag
                    key={tag}
                    closable
                    onClose={() => removeTag(record.key, tag)}
                    style={{ marginBottom: '4px', marginRight: '4px' }}
                >
                    {tag}
                </Tag>
            ))}
            {isInputVisible(record) ? (
                <Input
                    key={record.key }
                    autoFocus
                    type="text"
                    size="small"
                    style={tagInputStyle}
                    onBlur={(e) => handleInputConfirm(record, e.target.value)}
                    onPressEnter={(e) => handleInputConfirm(record, e.target.value)}
                />
            ) : (
                <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={() => showInput(record)}>
                    New Tag
                </Tag>
            )}
        </div>
    );

    const [lastSelectedItem, setLastSelectedItem] = useState('');

    const handleSelect = (record, selectedValue, fieldName, option) => {
        if (selectedValue === 'visit' && fieldName === 'targetPage') {
            console.log(record);
            console.log(sourcePageOptions)
            console.log(selectedValue)
            console.log(option)
            const visit = sourcePageOptions.find(x => x.id === parseInt(option.key));
            console.log(visit)
            if (!visit) return;
            if (record.targetPage.length === visit.options.length) {
                console.log('hepsini kaldır')
            }
            else {
                console.log('hepsini seç')
                const newTargetPage = [];
                newTargetPage.push(...visit.options.map(opt => opt.id));
                record.targetPage = newTargetPage;
            }
        }
    };

    const handleDeselect = (key, deselectedValue, fieldName) => {
        setLastSelectedItem(deselectedValue);
        console.log(`Deselected: ${deselectedValue} in field: ${fieldName}`);
    };

    const handleSelectChange = (key, value, fieldName) => {

        //if (fieldName === 'targetpage') {
        //    console.log(lastSelectedItem)
        //    const totalOptions = targetPageOptions.reduce((acc, group) => acc + group.options.length, 0);
        //    console.log(totalOptions)
        //    const clickedItem = value[value.length - 1];
        //    console.log(clickedItem)
        //    if (value.length === totalOptions) {
        //        value = [];
        //        console.log(value)
        //    } else if (value.indexOf('all') !== -1) {
        //        value = targetPageOptions.flatMap(group => group.options).concat('all');

        //        console.log(value)
        //    }
        //}
        const newDataSource = dataSource.map(item => {
            if (item.key === key) {
                return { ...item, [fieldName]: value };
            }
            return item;
        });
        setDataSource(newDataSource);
    };

    const renderSelect = (fieldName, value, record) => {
        return (
            <Select
                mode={fieldName === 'targetPage' ? 'multiple' : undefined}
                style={{ width: 120 }}
                value={value}
                onChange={(value) => handleSelectChange(record.key, value, fieldName)}
                onSelect={(selectedValue, option) => handleSelect(record, selectedValue, fieldName, option)}
                onDeselect={(deselectedValue) => handleDeselect(record.key, deselectedValue, fieldName)}
                placeholder='Select Item...'
                maxTagCount='responsive'
            >
                {fieldName === 'sourcePageId' &&
                    sourcePageOptions.map(visit => (
                        <OptGroup key={visit.label} label={visit.label}>
                            {visit.options.map(page => (
                                <Option key={page.id} value={page.id}>{page.label}</Option>
                            ))}
                        </OptGroup>
                    ))}
                {fieldName === 'elementId' && record.sourcePageId && (
                    sourceInputOptions.map(optionGroup => {
                        return (
                            optionGroup[record.sourcePageId] && (
                                optionGroup[record.sourcePageId].map(elm => (
                                    <Option key={elm.id} value={elm.id}>{elm.label}</Option>
                                ))
                            )
                        );
                    })
                )}
                {fieldName === 'actionCondition' &&
                    fieldOperationOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                {fieldName === 'targetPage' && (
                    <>
                        {sourcePageOptions.map(visit => (
                            <OptGroup key={visit.label} label={visit.label}>
                                <Option key={visit.id} value="visit">
                                    Viziti seç
                                </Option>
                                {visit.options.map(page => (
                                    <Option key={page.id} value={page.id}>{page.label}</Option>
                                ))}
                            </OptGroup>
                        ))}
                    </>
                )}
                {fieldName === 'actionType' &&
                    <Option key={2} value={2}>Hide</Option>
                }
            </Select>
        )
    };

    const renderDelete = (key) => {
        return (
            <div style={{ textAlign: 'center' }}>
                <CloseOutlined onClick={() => deleteRecord(key)} />
            </div>
        );
    };

    const columns = [
        {
            title: 'Source Page',
            dataIndex: 'sourcePageId',
            key: 'sourcePageId',
            render: (text, record) => renderSelect('sourcePageId', text, record),
        },
        {
            title: 'Source Input',
            dataIndex: 'elementId',
            key: 'elementId',
            render: (text, record) => renderSelect('elementId', text, record),
        },
        {
            title: 'Field Operation',
            dataIndex: 'actionCondition',
            key: 'actionCondition',
            render: (text, record) => renderSelect('actionCondition', text, record),
        },
        {
            title: 'Tags',
            dataIndex: 'actionValue',
            key: 'actionValue',
            render: renderTags,
        },
        {
            title: 'Target Page',
            dataIndex: 'targetPage',
            key: 'targetPage',
            render: (text, record) => renderSelect('targetPage', text, record),
        },
        {
            title: 'Action Type',
            dataIndex: 'actionType',
            key: 'actionType',
            render: (text, record) => renderSelect('actionType', text, record),
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            render: (text, record) => renderDelete(record.key),
        },
    ];

    const addRecord = () => {
        const newDataItem = {
            key: uuidv4(),
            id: -1,
            sourcePageId: null,
            elementId: null,
            actionCondition: null,
            actionValue: [],
            targetPage: [],
            actionType: 2,
        };
        const updatedDataSource = [...dataSource, newDataItem];
        setDataSource(updatedDataSource);
    };

    const deleteRecord = (key) => {
        const updatedDataSource = dataSource.filter(item => item.key !== key);
        setDataSource(updatedDataSource);
    };

    const save = useCallback(async () => {
        try {
            dispatch(startloading());
            //const hasChanges = isItemsEqual();
            //if (!hasChanges) {
            //    props.toast.current.setToast({
            //        message: props.t("No changes were made. Please make changes to save."),
            //        stateToast: false,
            //        autoHide: false
            //    });
            //    dispatch(endloading());
            //    return;
            //}
            console.log(dataSource)
            const response = await visitRelationSet(dataSource.map(item => ({
                ...item,
                actionValue: JSON.stringify(item.actionValue),
                targetPage: JSON.stringify(item.targetPage)
            })));
            if (response.data.isSuccess) {
                props.toast.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: true
                });
                props.toggleModal();
                dispatch(endloading());
            } else {
                props.toast.current.setToast({
                    message: props.t(response.data.message),
                    stateToast: false
                });
                dispatch(endloading());
            }
        } catch (error) {
            props.toast.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false,
                autoHide: false
            });
            dispatch(endloading());
        }
    }, [dataSource, props]);

    useEffect(() => {
        if (props.refs.current) {
            props.refs.current = { ...props.refs.current, submitForm: save };
        }
    }, [save, props]);

    return (
        <>
            <Button onClick={() => { addRecord(); }} icon={<PlusOutlined />} style={{marginBottom:"10px", float:"right"}} />
            <Table dataSource={dataSource} columns={columns} scroll={{ x: '100%' }} pagination={false} />
        </>
    );
}; 

Relation.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Relation);