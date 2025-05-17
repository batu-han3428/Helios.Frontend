import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from "react";
import { withTranslation } from "react-i18next";
import { Tree } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { useElementRankingListSetMutation, useLazyElementRankingListGetQuery } from '../../../../store/services/Module';
import { useDispatch } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { showToast } from '../../../../store/toast/actions';

const RankingList = props => {

    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [originalItems, setOriginalItems] = useState([]);
    const [trigger, { data: rankingData, error, isLoading }] = useLazyElementRankingListGetQuery();

    useEffect(() => {
        if (props.moduleId && props.isStudy !== undefined) {
            dispatch(startloading());
            trigger({ moduleId: props.moduleId, isStudy: props.isStudy === 'true' ? true : false });
        }
    }, [props.moduleId, props.isStudy]);

    useEffect(() => {
        if (!isLoading && !error && rankingData) {
            setItems(JSON.parse(JSON.stringify(rankingData)));
            setOriginalItems(JSON.parse(JSON.stringify(rankingData)));
            dispatch(endloading());
        } else if (!isLoading && error) {
            dispatch(endloading());
        }
    }, [rankingData, error, isLoading]);

    const childTopOrder = (hoverArray, dragItem, dragIndex) => {
        const index = hoverArray.findIndex(item => item.key === dragItem.key);
        const filteredItems = hoverArray.slice(index, dragIndex + 1);
        const updateOrderValues = (items) => {
            const length = items.length;
            let backOrder = 0;
            for (let i = 0; i <= length - 1; i++) {
                if (i === 0) backOrder = items[i].order;
                if ((length - 1) === i) {
                    items[i].order = backOrder;
                } else {
                    items[i].order = items[i + 1].order;
                }
            }
        };
        updateOrderValues(filteredItems);
    }

    const moveItem = (dragKey, hoverKey, isDragChild, isNodeChild, isNodeDragOver, dropPosition, isNodeParent, dragParentIndex, nodeDragParentIndex, nodeDragOverGapTop, dragOverGapBottom) => {
        const findItem = (arr, key) => {
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (item.key === key) {
                    return { item, index: i, array: arr };
                }
                if (item.children) {
                    const nestedItem = findItem(item.children, key);
                    if (nestedItem) {
                        return nestedItem;
                    }
                }
            }
            return null;
        };

        const { item: dragItem, index: dragIndex, array: dragArray } = findItem(items, dragKey);
        const { item: hoverItem, index: hoverIndex, array: hoverArray } = findItem(items, hoverKey);

        if (!dragItem || !hoverItem || dragItem.key === hoverKey || ((isNodeChild && dragItem.children) || (dragItem.children && hoverItem.children && !dragOverGapBottom))) {
            console.log('return')
            return;
        }

        //child işlemleri  
        if (isNodeChild || isDragChild) {
            if (dragItem.id === -1 && ((nodeDragParentIndex !== undefined && dragParentIndex !== nodeDragParentIndex) || (nodeDragParentIndex === undefined && dragParentIndex !== hoverIndex))) {
                console.log('empty')
                return;
            }
            if (isNodeChild && isDragChild) {
                if (dragParentIndex === nodeDragParentIndex) {
                    dragArray.splice(dragIndex, 1);
                    if (dragIndex > hoverIndex) {
                        console.log('child if')
                        hoverArray.splice(hoverIndex + 1, 0, dragItem);
                        childTopOrder(hoverArray, dragItem, dragIndex);
                    }
                    else {
                        console.log('child else')
                        hoverArray.splice(hoverIndex, 0, dragItem);
                        const index = hoverArray.findIndex(item => item.key === dragItem.key);
                        const filteredItems = hoverArray.slice(dragIndex, index);
                        console.log(filteredItems)
                        const updateOrderValues = (items, dragBack) => {
                            const length = items.length;
                            let backOrder = 0;
                            for (let i = 0; i <= length - 1; i++) {
                                if ((i + 1) > length - 1) {
                                    break;
                                }
                                if (i === 0) {
                                    backOrder = items[i + 1].order;
                                    items[i + 1].order = items[i].order;
                                }
                                else {
                                    let b = items[i + 1].order;
                                    items[i + 1].order = backOrder;
                                    backOrder = b;
                                }
                            }
                            items[0].order = dragBack;
                        };
                        let dragBack = dragItem.order;
                        dragItem.order = hoverItem.order;
                        updateOrderValues(filteredItems, dragBack);
                    }
                }
                else {
                    console.log('edasda else')
                    if (nodeDragParentIndex !== dragParentIndex && hoverItem.id !== -1) {
                        console.log('return')
                        return;
                    }
                    dragArray.splice(dragIndex, 1);
                    hoverArray.splice(hoverIndex + 1, 0, dragItem);

                    let newEmpty = {
                        id: -1,
                        key: uuidv4(),
                        title: "Empty",
                        order: dragItem.order,
                        children: null
                    };
                    dragArray.splice(dragIndex, 0, newEmpty);
                    dragItem.order = hoverItem.order;
                    //if(hoverItem.empty){
                    if (hoverItem.id === -1) {
                        hoverArray.splice(hoverIndex, 1);
                    }
                }
            }
            else if (isDragChild && !isNodeChild) {
                if (dragItem.id === -1) {
                    return;
                }

                if (isNodeParent !== undefined && isNodeDragOver) {
                    if (
                        (
                            (nodeDragParentIndex !== undefined && nodeDragParentIndex !== dragParentIndex)
                            ||
                            hoverIndex !== dragParentIndex
                        )
                        &&
                        hoverItem.id !== -1
                    ) {
                        console.log('return 206')
                        return;
                    }
                    dragArray.splice(dragIndex, 1);
                    hoverItem.children.unshift(dragItem);
                    console.log('dadasda')
                    childTopOrder(hoverItem.children, dragItem, dragIndex);
                }
                else {
                    console.log('else 163')
                    dragArray.splice(dragIndex, 1);
                    let newEmpty = {
                        id: -1,
                        key: uuidv4(),
                        title: "Empty",
                        order: dragItem.order,
                        children: null
                    };
                    dragArray.splice(dragIndex, 0, newEmpty);

                    let v = 0;
                    if (hoverIndex !== 0 || dropPosition === 1) {
                        v = 1;
                    }
                    hoverArray.splice(hoverIndex + v, 0, dragItem);
                    let newOrder = (parseInt(hoverItem.order)).toString();
                    dragItem.order = newOrder;
                    let filteredArray = hoverArray.filter(item => parseInt(item.order) > (parseInt(newOrder) - 1));
                    let sortArray = filteredArray.sort((a, b) => {
                        const orderA = a.order.padStart(10, '0');
                        const orderB = b.order.padStart(10, '0');
                        return orderA.localeCompare(orderB);
                    });
                    sortArray.forEach((x, index) => {
                        x.order = (newOrder).toString();
                        newOrder++;
                    });
                }
            }
            else if (!isDragChild && isNodeChild) {
                console.log('else if')
                if (hoverItem.id !== -1) {
                    return;
                }
                dragArray.splice(dragIndex, 1);
                hoverArray.splice(hoverIndex + 1, 0, dragItem);

                let newOrder = dragItem.order;
                let filteredArray = dragArray.filter(item => parseInt(item.order) > parseInt(newOrder));
                filteredArray.forEach((x, index) => {
                    x.order = (newOrder).toString();
                    newOrder++;
                });

                dragItem.order = hoverItem.order;
                //if(hoverItem.empty){
                if (hoverItem.id === -1) {
                    hoverArray.splice(hoverIndex, 1);
                }
            }
        }
        //root sıralama
        else {
            console.log('else')
            console.log(dragParentIndex)
            console.log(nodeDragParentIndex)
            if (dragParentIndex === undefined && nodeDragParentIndex === undefined && isNodeDragOver) {
                console.log('return 297')
                return;
            }

            dragArray.splice(dragIndex, 1);

            if (isNodeParent !== undefined && isNodeDragOver) {
                hoverItem.children.unshift(dragItem);
                console.log(hoverItem.children)
            } else {
                if (dragIndex > hoverIndex) {
                    let v = 0;
                    if (hoverIndex !== 0 || (hoverIndex === 0 && !nodeDragOverGapTop)) {
                        v = 1;
                    }
                    hoverArray.splice(hoverIndex + v, 0, dragItem);
                    let newOrder = (parseInt(hoverItem.order)).toString();
                    dragItem.order = newOrder;
                    let filteredArray = hoverArray.filter(item => parseInt(item.order) > (parseInt(newOrder) - 1));
                    console.log(filteredArray)
                    let sortArray = filteredArray.sort((a, b) => {
                        const orderA = a.order.padStart(10, '0');
                        const orderB = b.order.padStart(10, '0');
                        return orderA.localeCompare(orderB);
                    });
                    sortArray.forEach((x, index) => {
                        x.order = (newOrder).toString();
                        newOrder++;
                    });
                } else {
                    hoverArray.splice(hoverIndex, 0, dragItem);
                    let newOrder = hoverItem.order;
                    let filteredArray = hoverArray.filter(item => (parseInt(item.order) <= (parseInt(newOrder)) && item.id !== dragItem.id));
                    dragItem.order = newOrder;
                    filteredArray.reverse().forEach((x, index) => {
                        newOrder--;
                        x.order = (newOrder).toString();
                    });
                }
            }
        }

        setItems([...items]);
    };

    const getParentIndex = (str) => {
        const hyphenCount = (str.match(/-/g) || []).length;
        if (hyphenCount === 2) {
            const parts = str.split('-');
            return parseInt(parts[1]);//burayı sonradan parse yaptım. sorun olabilir
        }
        return undefined;
    };

    const handleDrop = (info) => {
        console.log(info)
        const dragKey = info.dragNode.key;
        const hoverKey = info.node.key;
        const isDragChild = info.dragNode.pos.replace(/^0-/, "").includes("-"); // ? true : false;
        const isNodeChild = info.node.pos.replace(/^0-/, "").includes("-");
        const isNodeParent = info.node.children;
        const isNodeDragOver = info.node.dragOver;
        const dropPosition = info.dropPosition;
        const dragParentIndex = getParentIndex(info.dragNode.pos);
        const nodeDragParentIndex = getParentIndex(info.node.pos);
        const nodeDragOverGapTop = info.node.dragOverGapTop;
        const dragOverGapBottom = info.node.dragOverGapBottom;

        moveItem(dragKey, hoverKey, isDragChild, isNodeChild, isNodeDragOver, dropPosition, isNodeParent, dragParentIndex, nodeDragParentIndex, nodeDragOverGapTop, dragOverGapBottom);
    };

    const generateTreeNodes = (data) =>
        data.map((item, index) => {
            if (item.children) {
                return {
                    title: item.title + "-" + item.elementType,
                    key: item.key,
                    children: generateTreeNodes(item.children),
                    order: item.order,
                    index: index+1
                };
            }
            return {
                title: item.title + "-" + item.elementType,
                key: item.key,
                order: item.order,
                index: index+1
            };
        });

    const isItemsEqual = () => {
        if (originalItems.length !== items.length) {
            console.log('root length')
            return true;
        }
        for (let i = 0; i < originalItems.length; i++) {
            const oItem = originalItems[i];
            const item = items[i];
            if (oItem.id !== item.id) {
                console.log('root order');
                return true;
            }
            if (oItem.children && item.children) {
                for (let index = 0; index < oItem.children.length; index++) {
                    const oItemChild = oItem.children[index];
                    const itemChild = item.children[index];
                    if (oItemChild.id !== itemChild.id) {
                        console.log('child order');
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const [elementRankingListSet] = useElementRankingListSetMutation();

    const save = useCallback(async () => {
        try {
            dispatch(startloading());
            const hasChanges = isItemsEqual();
            if (!hasChanges) {
                dispatch(showToast(props.t("No changes were made. Please make changes to save."), false, false));
                dispatch(endloading());
                return;
            }
            const response = await elementRankingListSet({ elements: items, moduleId: parseInt(props.moduleId), isStudy: props.isStudy === 'true' ? true : false });
            if (response.data.isSuccess) {
                props.fetchData();
                dispatch(showToast(props.t(response.data.message), true, true));
                props.toggleModal();
                dispatch(endloading());
            } else {
                dispatch(showToast(props.t(response.data.message), true, false));
                dispatch(endloading());
            }
        } catch (error) {
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
            dispatch(endloading());
        }
    }, [items, props]);

    useEffect(() => {
        if (props.refs.current) {
            props.refs.current = { ...props.refs.current, submitForm: save };
        }
    }, [save, props]);

    const renderTitle = (nodeData) => {
        const titleStyle = {
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '4px',
        };
        const orderStyle = {
            color: '#999',
            fontWeight: 'bold',
            marginRight: '8px',
            fontSize: '14px',
        };
        return (
            <div style={titleStyle}>
                {nodeData.order && <span style={orderStyle}>{`${nodeData.index} -`}</span>}
                <span>{nodeData.title}</span>
            </div>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Tree
                style={{ padding: "20px", maxHeight: "500px", overflowY: "auto" }}
                draggable
                blockNode
                treeData={generateTreeNodes(items)}
                onDrop={handleDrop}
                titleRender={renderTitle}
            />
        </DndProvider>
    );
};

RankingList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(RankingList);