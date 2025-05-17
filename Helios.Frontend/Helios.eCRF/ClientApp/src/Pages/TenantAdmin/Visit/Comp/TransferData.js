import PropTypes from 'prop-types';
import React, { useImperativeHandle, useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { Table, Checkbox } from 'antd';
import { useLazyTransferDataGetQuery, useTransferDataSetMutation } from "../../../../store/services/Visit";
import { v4 as uuidv4 } from 'uuid';
import visitType from '../VisitTypeItems';
import { showToast } from '../../../../store/toast/actions';
import { formatDate } from "../../../../helpers/format_date";

const TransferData = props => {

    const dispatch = useDispatch();

    const [transferDataSet] = useTransferDataSetMutation();

    const submitForm = async () => {
        try {
            dispatch(startloading());
            if (selectedRowKeys.length < 1 && backRowKeys.length < 1) {
                dispatch(endloading());
                return false;
            }

            const filteredRows = [];

            const traverseData = (items) => {
                items.forEach(item => {
                    if (selectedRowKeys.includes(item.key)) {
                        filteredRows.push(item);
                    }
                    if (item.children) {
                        traverseData(item.children);
                    }
                });
                items.forEach(item => {
                    if (backRowKeys.includes(item.key)) {
                        filteredRows.push(item);
                    }
                    if (item.children) {
                        traverseData(item.children);
                    }
                });
            };

            traverseData(data);

            const response = await transferDataSet(filteredRows.map(item => {
                return {
                    id: item.id,
                    type: item.visitStatu,
                    statu: backRowKeys.includes(item.key) ? 4 : item.status === 'Insert' ? 1 : item.status === 'Delete' ? 2 : 3
                };
            }));
            dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
            dispatch(endloading());
            if (response.data.isSuccess) props.modalRef.current.tog_backdrop();
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
            title: props.t('Visit name'),
            dataIndex: 'name',
            width: '30%',
            render: (text, record) => {
                let className = '';
                if (record.status === 'Delete') {
                    className = 'deleted-row';
                }
                return <span className={className}>{text}</span>;
            }
        },
        {
            title: props.t('Visit type'),
            dataIndex: 'visitType',
            render: (text, record) => {
                let className = '';
                if (record.status === 'Delete') {
                    className = 'deleted-row';
                }
                return <span className={className}>{text}</span>;
            }
        },
        {
            title: props.t('Order'),
            dataIndex: 'order',
            render: (text, record) => {
                let className = '';
                if (record.status === 'Delete') {
                    className = 'deleted-row';
                }
                return <span className={className}>{text}</span>;
            }
        },
        {
            title: props.t('Updated on'),
            dataIndex: 'updatedAt',
            render: (text, record) => {
                let className = '';
                if (record.status === 'Delete') {
                    className = 'deleted-row';
                }
                return <span className={className}>{text}</span>;
            }
        },
        {
            title: 'Transfer state',
            dataIndex: 'status',
            render: (text, record) => {
                let color = '#000';
                switch (text) {
                    case 'Insert':
                        color = 'green';
                        break;
                    case 'Update':
                        color = 'blue';
                        break;
                    case 'Delete':
                        color = 'red';
                        break;
                    case 'None':
                        color = '#ccc';
                        break;
                    default:
                        break;
                }
                return (
                    <span style={{ color }}>
                        {text && text !== 'None' && (
                            <Checkbox
                                style={{ marginRight: 8 }}
                                checked={selectedRowKeys.includes(record.key)}
                                onChange={(e) => handleCheckboxChange(record, e.target.checked)}
                                disabled={record.disabled}
                            />
                        )}
                        {text}
                        {text === 'Delete' && (
                            <>
                                <Checkbox
                                    style={{ margin: "0 8px" }}
                                    checked={backRowKeys.includes(record.key)}
                                    onChange={(e) => handleBackCheckboxChange(record, e.target.checked)}
                                    disabled={record.disabled}
                                />
                                Back
                            </>
                        )}
                    </span>
                )
            },
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [backRowKeys, setBackRowKeys] = useState([]);

    const [totalHeight, setTotalHeight] = useState(0);

    const [data, setData] = useState([]);

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const [trigger, { data: visitData, error, isLoading }] = useLazyTransferDataGetQuery();

    useEffect(() => {
        if (props.studyId && props.activeStudyId) {
            dispatch(startloading());
            trigger({ demoStudyId: props.studyId, activeStudyId: props.activeStudyId });
        }
    }, [props.studyId, props.activeStudyId])

    useEffect(() => {
        if (!isLoading && !error && visitData) {
            function calculateTotalHeight(data) {
                let totalHeight = 0;

                function calculateNodeHeight(node) {
                    totalHeight += 50;

                    if (node.children) {
                        node.children.forEach(child => {
                            calculateNodeHeight(child);
                        });
                    }
                }

                data.forEach(node => {
                    calculateNodeHeight(node);
                });

                return totalHeight;
            }
            const totalHeight = calculateTotalHeight(visitData);
            setTotalHeight(totalHeight);
            const addKeysToData = (data, parentType = 0) => {
                if (!data) return [];

                return data.map(item => {
                    const newItem = { ...item };
                    parentType++;
                    if (newItem.children && newItem.children.length > 0) {
               
                        newItem.children = addKeysToData(newItem.children, parentType);
                    }

                    newItem.key = uuidv4();
                    newItem.visitStatu = parentType;
                    parentType--;
                    if (!newItem.children || newItem.children.length === 0) {
                        delete newItem.children;
                    }

                    return newItem;
                });
            };
            let newData = addKeysToData(visitData);
            function clearVisitType(obj) {
                if (obj.children) {
                    obj.children.forEach(child => {
                        delete child.visitType;
                        clearVisitType(child);
                    });
                }
            }
            newData.forEach(element => {
                const option = visitType.find(option => option.value === element.visitType);
                if (option) {
                    element.visitType = option.label;
                }
                clearVisitType(element);
            });
            handleDataChange(newData);
            const allRowKeys = getAllRowKeys(newData);
            setExpandedRowKeys(allRowKeys);
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }, [visitData, error, isLoading]);

    const handleDataChange = (data) => {
        const newData = data.map(item => {
            if (item.children) {
                const updatedChildren = item.children.map(chld => {
                    if (chld.children) {
                        const updatedChildren2 = chld.children.map(chld2 => {                          
                            return { ...chld2, updatedAt: formatDate(chld2.updatedAt) };
                        });
                        return { ...chld, children: updatedChildren2, updatedAt: formatDate(chld.updatedAt) };
                    }
                    else {
                        return { ...chld, updatedAt: formatDate(chld.updatedAt) }
                    }                 
                });
                return { ...item, children: updatedChildren, updatedAt: formatDate(item.updatedAt) }              
            }
            else {
                return { ...item, updatedAt: formatDate(item.updatedAt) }
            }
        
        });
        setData(newData);
    };

    const getAllRowKeys = (data) => {
        return data.reduce((keys, record) => {
            keys.push(record.key);
            if (record.children) {
                const childKeys = getAllRowKeys(record.children);
                keys.push(...childKeys);
            }
            return keys;
        }, []);
    };

    const handleExpand = (expanded, record) => {
        const currentRowKey = record.key;
        if (expanded) {
            setExpandedRowKeys(prevKeys => [...prevKeys, currentRowKey]);
        } else {
            const filteredKeys = expandedRowKeys.filter(key => key !== currentRowKey);
            setExpandedRowKeys(filteredKeys);
        }
    };

    const handleCheckboxChange = (record, checked) => {
        const key = record.key;
        const filterChildrenKeys = (record, keysToRemove) => {
            if (!record.children) return;

            for (let i = 0; i < record.children.length; i++) {
                const child = record.children[i];
                keysToRemove.push(child.key);
                filterChildrenKeys(child, keysToRemove);
            }
        };
        if (checked) {
            const updatedSelectedRowKeys = [...selectedRowKeys, key];
            const updatedBackRowKeys = [...backRowKeys, key];
            setSelectedRowKeys(updatedSelectedRowKeys);
            if (record.status === 'Delete' && record.children) {
                const keysToRemove = [];
                filterChildrenKeys(record, keysToRemove);
                const newSelectedRowKeys = updatedSelectedRowKeys.filter(k => !keysToRemove.includes(k));
                const newBackRowKeys = updatedBackRowKeys.filter(k => !keysToRemove.includes(k));
                setSelectedRowKeys(newSelectedRowKeys);
                setBackRowKeys(newBackRowKeys.filter(k => k !== key));
            } else{
                setBackRowKeys(backRowKeys.filter(k => k !== key));
            }
        } else {
            setSelectedRowKeys(selectedRowKeys.filter(k => k !== key));
            setBackRowKeys(backRowKeys.filter(k => k !== key));
        }

        if (record.status === 'Delete') {
            const disableChildren = (items) => {
                for (let i = 0; i < items.length; i++) {
                    const child = items[i];
                    child.disabled = checked;
                    if (child.children) {
                        child.children = disableChildren(child.children);
                    }
                }
                return items;
            };

            const disableAllChildren = (items) => {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.key === key) {
                        if (item.children) {
                            item.children = disableChildren(item.children);
                        }
                    } else if (item.children) {
                        item.children = disableAllChildren(item.children);
                    }
                }
                return items;
            };

            const newData = disableAllChildren(data);
            setData(newData);
        }
    };

    const handleBackCheckboxChange = (record, checked) => {
        const key = record.key;
        const filterChildrenKeys = (record, keysToRemove) => {
            if (!record.children) return;

            for (let i = 0; i < record.children.length; i++) {
                const child = record.children[i];
                keysToRemove.push(child.key);
                filterChildrenKeys(child, keysToRemove);
            }
        };

        if (checked) {
            const updatedSelectedRowKeys = [...selectedRowKeys, key];
            const updatedBackRowKeys = [...backRowKeys, key];

            if (record.children) {
                const keysToRemove = [];
                filterChildrenKeys(record, keysToRemove);
                const newSelectedRowKeys = updatedSelectedRowKeys.filter(k => !keysToRemove.includes(k));
                const newBackRowKeys = updatedBackRowKeys.filter(k => !keysToRemove.includes(k));
                setBackRowKeys(newBackRowKeys);
                setSelectedRowKeys(newSelectedRowKeys.filter(k => k !== key));
            } else {
                setBackRowKeys(updatedBackRowKeys);
                setSelectedRowKeys(selectedRowKeys.filter(k => k !== key));
            }
        } else {
            setBackRowKeys(backRowKeys.filter(k => k !== key));
            setSelectedRowKeys(selectedRowKeys.filter(k => k !== key));
        }

        if (record.status === 'Delete') {
            const disableChildren = (items) => {
                for (let i = 0; i < items.length; i++) {
                    const child = items[i];
                    child.disabled = checked;
                    if (child.children) {
                        child.children = disableChildren(child.children);
                    }
                }
                return items;
            };

            const disableAllChildren = (items) => {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.key === key) {
                        if (item.children) {
                            item.children = disableChildren(item.children);
                        }
                    } else if (item.children) {
                        item.children = disableAllChildren(item.children);
                    }
                }
                return items;
            };

            const newData = disableAllChildren(data);
            setData(newData);
        }
    };

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ y: totalHeight > 350 ? 350 : undefined }}
            expandedRowKeys={expandedRowKeys}
            onExpand={handleExpand}
        />
    )
}

TransferData.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(TransferData);