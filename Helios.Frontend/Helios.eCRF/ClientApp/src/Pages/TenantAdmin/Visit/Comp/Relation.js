import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Table, Tag, Select, Input, theme, Button } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { useLazyVisitRelationGetQuery, useVisitRelationSetMutation } from '../../../../store/services/Visit';
import isEqual from 'lodash/isEqual';
import { showToast } from '../../../../store/toast/actions';

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

    const [originalDataSource, setOriginalDataSource] = useState([]);

    useEffect(() => {
        if (!isLoading && !error && relationData) {
            let sourcePage = relationData.studyVisitRelationSourcePageModels;
            let fieldOperation = relationData.fieldOperationData;
            let visitRelation = relationData.visitRelationModels;
            let sourcePageOption = sourcePage.map(visit => ({
                id: visit.id,
                label: visit.label,
                options: visit.options.map(page => ({ id: page.id, label: page.label }))
            }));
            setSourcePageOptions(sourcePageOption);
            setSourceInputOptions(sourcePage.flatMap(visit => visit.options).map(page => ({
                [page.id]: page.options.map(elm => ({
                    id: elm.id,
                    label: elm.label
                }))
            })));
            setFieldOperationOptions(fieldOperation);
            const updatedVisitRelation = visitRelation.map(item => {
                const currentTargetPage = item.targetPage || [];
                const newTargetPage = [...currentTargetPage];
                sourcePageOption.forEach(visit => {
                    const allOptionsInTarget = visit.options.every(page => newTargetPage.includes(page.id));
                    if (allOptionsInTarget) {
                        newTargetPage.push(visit.id);
                    }
                });
                return { ...item, targetPage: newTargetPage };
            });
            setDataSource(JSON.parse(JSON.stringify(updatedVisitRelation)));
            setOriginalDataSource(JSON.parse(JSON.stringify(updatedVisitRelation)));
            dispatch(endloading());
        } else if (!isLoading && error) {
           
            dispatch(endloading());
        }
    }, [relationData, error, isLoading]);

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
                    {props.t("New tag")}
                </Tag>
            )}
        </div>
    );

    const handleSelect = (record, selectedValue, fieldName, option) => {
        if (option.label === 'visit' && fieldName === 'targetPage') {
            const visit = sourcePageOptions.find(x => x.id === parseInt(selectedValue));
            if (!visit) return;
            const newDataSource = dataSource.map(item => {
                if (item.key === record.key) {
                    const existingItems = item[fieldName].filter(existingItem => !visit.options.some(opt => opt.id === existingItem));
                    const updatedField = [...existingItems, ...visit.options.map(opt => opt.id)];

                    return { ...item, [fieldName]: [selectedValue, ...updatedField] };
                }
                return item;
            });
            setDataSource(newDataSource);
        }
        else if (option.label !== 'visit' && fieldName === 'targetPage') {
            const visit = sourcePageOptions.find(x => x.options.find(a => a.id === selectedValue));
            const otherOptions = visit.options.filter(option => option.id !== selectedValue);
            const filteredTargetPage = record.targetPage.filter(targetId => {
                return visit.options.some(option => option.id === targetId);
            });
            const isMatching = filteredTargetPage.every(id => otherOptions.some(option => option.id === id)) &&
                otherOptions.every(option => filteredTargetPage.some(id => option.id === id));
            if (otherOptions.length < 1 || isMatching) {
                const newDataSource = dataSource.map(item => {
                    if (item.key === record.key) {
                        return { ...item, [fieldName]: [selectedValue, visit.id, ...item[fieldName]] };
                    }
                    return item;
                });
                setDataSource(newDataSource);
            }
        }
    };

    const handleDeselect = (record, deselectedValue, fieldName, option) => {
        if (option.label === 'visit' && fieldName === 'targetPage') {
            const visit = sourcePageOptions.find(x => x.id === parseInt(deselectedValue));
            if (!visit) return;
            const newDataSource = dataSource.map(item => {
                if (item.key === record.key) {
                    const updatedField = item[fieldName].filter(existingItem => !visit.options.some(opt => opt.id === existingItem) && existingItem !== deselectedValue);

                    return { ...item, [fieldName]: updatedField };
                }
                return item;
            });
            setDataSource(newDataSource);
        }
        else if (option.label !== 'visit' && fieldName === 'targetPage') {
            const visit = sourcePageOptions.find(x => x.options.find(a => a.id === deselectedValue));       
            const filteredTargetPage = record.targetPage.filter(targetId => targetId !== deselectedValue);
            const allOptionsInTargetPage = filteredTargetPage.some(targetPageId => visit.options.some(option => option.id === targetPageId));
            if (allOptionsInTargetPage || visit.options.length < 2) {
                const newDataSource = dataSource.map(item => {
                    if (item.key === record.key) {
                        const updatedField = item[fieldName].filter(id => id !== visit.id && id !== deselectedValue);
                        return { ...item, [fieldName]: updatedField };
                    }
                    return item;
                });
                setDataSource(newDataSource);
            } 
        }
    };

    const handleSelectChange = (key, value, fieldName) => {
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
                onDeselect={(deselectedValue, option) => handleDeselect(record, deselectedValue, fieldName, option)}
                placeholder={props.t("Select")}
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
                    sourcePageOptions.map(visit => (
                        <React.Fragment key={visit.label}>
                            <Option key={visit.key} value={visit.id} label="visit" style={{ fontWeight: 'bold', color:'red' }}>
                                {visit.label }
                            </Option>
                            {visit.options.map(page => (
                                <Option  key={page.id} value={page.id}>{page.label}</Option>
                            ))}
                        </React.Fragment>
                    ))
                )}
                {fieldName === 'actionType' &&
                    <Option key={2} value={2}>{props.t('Hide')}</Option>
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
            title: props.t('Source page'),
            dataIndex: 'sourcePageId',
            key: 'sourcePageId',
            render: (text, record) => renderSelect('sourcePageId', text, record),
        },
        {
            title: props.t('Source input'),
            dataIndex: 'elementId',
            key: 'elementId',
            render: (text, record) => renderSelect('elementId', text, record),
        },
        {
            title: props.t('Field operation'),
            dataIndex: 'actionCondition',
            key: 'actionCondition',
            render: (text, record) => renderSelect('actionCondition', text, record),
        },
        {
            title: props.t('Input value'),
            dataIndex: 'actionValue',
            key: 'actionValue',
            render: renderTags,
        },
        {
            title: props.t('Target page'),
            dataIndex: 'targetPage',
            key: 'targetPage',   
            render: (text, record) => renderSelect('targetPage', text, record),
        },
        {
            title: props.t('Hide'),
            dataIndex: 'actionType',
            key: 'actionType',
            render: (text, record) => renderSelect('actionType', text, record),
        },
        {
            title: props.t('Delete'),
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

    const hasChanges = (originalDataSource, dataSource) => {
        if (originalDataSource.length !== dataSource.length) {
            return true;
        }
        for (let i = 0; i < originalDataSource.length; i++) {
            if (!isEqual(originalDataSource[i], dataSource[i])) {
                return true;
            }
        }
        return false;
    };

    const isEmpty = (dataSource) => {
        const emptyFields = [];
        for (let item of dataSource) {
            const keys = Object.keys(item);          
            for (let key of keys) {
                if (!item[key] || (Array.isArray(item[key]) && item[key].length === 0)) {
                    emptyFields.push(columns.find(x => x.key === key).title);
                }
            }
        }
        return emptyFields;
    };

    const save = useCallback(async () => {
        try {
            dispatch(startloading());
            const empty = isEmpty(dataSource);
            if (empty.length > 0) {
                dispatch(showToast(<div>
                    <h5>{props.t("This field is required")}</h5>
                    <ul>
                        {
                            empty.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))
                        }
                    </ul>
                </div>, false, false));
                dispatch(endloading());
                return;
            }
            const changesExist = hasChanges(originalDataSource, dataSource);
            if (!changesExist) {
                dispatch(showToast(props.t("No changes were made. Please make changes to save."), false, false));
                dispatch(endloading());
                return;
            }
            const updatedDataSource = dataSource.map(item => {
                const newTargetPage = [...item.targetPage];
                    sourcePageOptions.forEach(visit => {
                     
                        if (newTargetPage.includes(visit.id)) {
                            const index = newTargetPage.indexOf(visit.id);
                            newTargetPage.splice(index, 1);
                        }
                    });
                return { ...item, actionValue: JSON.stringify(item.actionValue), targetPage: JSON.stringify(newTargetPage) };
            });
            const response = await visitRelationSet(updatedDataSource);
            dispatch(showToast(props.t(response.data.message), false, response.data.isSuccess));
            dispatch(endloading());
        } catch (error) {
            dispatch(showToast(props.t("An unexpected error occurred."), false, false));
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