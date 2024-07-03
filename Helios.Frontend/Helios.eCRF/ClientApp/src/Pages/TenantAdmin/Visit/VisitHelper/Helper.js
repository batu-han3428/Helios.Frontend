import { endloading, startloading } from '../../../../store/loader/actions';
import Settings from '../../Visit/Comp/Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18n from 'i18next';
import { useLazyVisitListGetQuery, useVisitSetMutation, useVisitDeleteMutation, useVisitRankingSetMutation } from "../../../../store/services/Visit";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import AddModule from '../Comp/AddModule';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Swal from 'sweetalert2';
import { arrayMove } from '@dnd-kit/sortable';
import TransferData from '../Comp/TransferData';
import Relation from '../Comp/Relation';
import AnnotatedCrfPdf from '../Comp/AnnotatedCrfPdf';
import AnnotatedCrfPdfHistory from '../Comp/AnnotatedCrfPdfHistory';

export const findItemRecursive = (items, key) => {
    for (const item of items) {
        if (item.key === key) {
            return item;
        } else if (item.children) {
            const childResult = findItemRecursive(item.children, key);
            if (childResult) {
                return childResult;
            }
        }
    }
    return null;
};

export const handleSettings = (openModal, record, ref, toastRef) => {
    const title = i18n.t("Settings");
    const buttonText = i18n.t("Save");
    const content = <Settings record={record} refs={ref} toast={toastRef} />;
    openModal({ title: title, buttonText: buttonText, content: content });
}

export const handleAddModule = (openModal, record, ref, toastRef, toggleModal) => {
    const title = i18n.t("Add module");
    const buttonText = i18n.t("Save");
    const content = <AddModule record={record} refs={ref} toast={toastRef} toggleModal={toggleModal} />;
    openModal({ title: title, buttonText: buttonText, content: content });
}

export const useApiHelper = (dataSource, setDataSource, toastRef) => {

    const [editing, setEditing] = useState(false);

    const [changedDataSource, setChangedDataSource] = useState([]);

    const [ranking, setRanking] = useState(false);

    const [visitSet] = useVisitSetMutation();

    const [visitDelete] = useVisitDeleteMutation();

    const dispatch = useDispatch();

    const studyInformation = useSelector(state => state.rootReducer.Study);

    const userInformation = useSelector(state => state.rootReducer.Login);

    const handleSave = async (row) => {
        try {
            dispatch(startloading());
            const response = await visitSet({
                id: row.id,
                userId: userInformation.userId,
                studyId: studyInformation.studyId,
                parentId: row.parentId ? row.parentId : 0,
                type: row.type,
                name: row.name,
                visitType: row.visittype,
                order: parseInt(row.order, 10)
            });
            if (response.data.isSuccess) {
                toastRef.current.setToast({
                    message: i18n.t(response.data.message),
                    stateToast: true
                });
                dispatch(endloading());
            } else {
                toastRef.current.setToast({
                    message: i18n.t(response.data.message),
                    stateToast: false
                });
                dispatch(endloading());
            }
        } catch (e) {
            toastRef.current.setToast({
                message: i18n.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }

    const handleDelete = async (key) => {
        try {
            dispatch(startloading());
            const row = findItemRecursive(dataSource, key);
            if (row) {
                const response = await visitDelete({
                    id: row.id,
                    userId: userInformation.userId,
                    studyId: studyInformation.studyId,
                    parentId: row.parentId ? row.parentId : 0,
                    type: row.type,
                    name: row.name,
                    visitType: row.visittype,
                    order: parseInt(row.order, 10)
                });
                if (response.data.isSuccess) {
                    toastRef.current.setToast({
                        message: i18n.t(response.data.message),
                        stateToast: true
                    });
                    dispatch(endloading());
                } else {
                    toastRef.current.setToast({
                        message: i18n.t(response.data.message),
                        stateToast: false
                    });
                    dispatch(endloading());
                }
            }
        } catch (e) {
            toastRef.current.setToast({
                message: i18n.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    };

    const [trigger, { data: visitsData, error, isLoading }] = useLazyVisitListGetQuery();

    const handleList = () => {
        dispatch(startloading());
        trigger(studyInformation.studyId);       
    }
    const handleDataChange = () => {
        const newData = visitsData.map(item => {
            if (item.children) {
                const updatedChildren = item.children.map(chld => {
                    if (chld.children) {
                        const updatedChildren2 = chld.children.map(chld2 => {
                            if (chld2.updatedAt === "0001-01-01T00:00:00+00:00") {
                                return { ...chld2, updatedAt: "-" };
                            }
                            return chld2;
                        });
                        if (chld.updatedAt === "0001-01-01T00:00:00+00:00") {
                            return { ...chld, children: updatedChildren2, updatedAt: "-" };
                        }
                        else {
                            return { ...chld, children: updatedChildren2 }
                        }
                    }
                    else {
                        if (chld.updatedAt === "0001-01-01T00:00:00+00:00") {
                            return { ...chld, updatedAt: "-" };
                        }
                    }
                    return chld;
                });
                if (item.updatedAt === "0001-01-01T00:00:00+00:00") {
                    return { ...item, children: updatedChildren, updatedAt: "-" };
                }
                else {
                    return { ...item, children: updatedChildren }
                }

            }
            else {
                if (item.updatedAt === "0001-01-01T00:00:00+00:00") {
                    return { ...item, updatedAt: "-" };
                }
            }

            return item;
        });
        setData(newData);
    };

    const setData = (data) => {
        const formattedData = [...data].sort((a, b) => a.order - b.order).map((data) => {
            const visitRow = {
                key: data.id.toString(),
                id: data.id,
                type: 'visit',
                name: data.name,
                visittype: data.visitType,
                order: data.order,
                createdat: data.createdAt,
                updatedon: data.updatedAt === "0001-01-01T00:00:00+00:00" ? "-" : data.updatedAt,
            };

            const pageRows = data.children ? [...data.children].sort((a, b) => a.order - b.order).map((page, i) => {
                const pageRow = {
                    key: `${data.id}_${i}`,
                    id: page.id,
                    parentId: data.id,
                    type: 'page',
                    name: page.name,
                    order: page.order,
                    epro: page.ePro,
                    createdat: page.createdAt,
                    updatedon: page.updatedAt === "0001-01-01T00:00:00+00:00" ? "-" : page.updatedAt,
                    ...(page.children && page.children.length > 0 && {
                        children: [...page.children].sort((a, b) => a.order - b.order).map((module, j) => ({
                            key: `${data.id}_${page.id}_${j}`,
                            id: module.id,
                            parentId: page.id,
                            type: 'module',
                            name: module.name,
                            order: module.order,
                            createdat: module.createdAt,
                            updatedon: module.updatedAt === "0001-01-01T00:00:00+00:00" ? "-" : module.updatedAt,
                        })),
                    }),
                };

                return pageRow;
            }) : [];

            if (visitRow.type === 'visit') {
                const lastChildIndex = pageRows.length - 1;
                const lastChild = pageRows[lastChildIndex];

                const emptyPage = {
                    key: `${data.id}_${lastChild ? lastChild.id : data.id}_empty`,
                    id: null,
                    parentId: data.id,
                    type: 'page',
                    name: "",
                    placeholder: true,
                    order: (parseInt(lastChild ? lastChild.order : 0, 10) || 0) + 1,
                    createdat: "",
                    updatedon: "",
                };
                if (studyInformation.isDemo) {
                    pageRows.push(emptyPage);
                }
             
            }

            return {
                ...visitRow,
                ...(pageRows.length > 0 && {
                    children: pageRows,
                }),
            };
        });

        const lastRowIndex = formattedData.length;
        const lastRow = formattedData[lastRowIndex - 1];

        const emptyVisit = {
            key: `new_row_${lastRowIndex + 1}`,
            id: null,
            type: 'visit',
            name: "",
            placeholder: true,
            visittype: "",
            order: (parseInt(lastRow ? lastRow.order : 0, 10) || 0) + 1,
            createdat: "",
            updatedon: "",
        };
        if (studyInformation.isDemo) {
            formattedData.push(emptyVisit);
        }
        syncRankingData(formattedData);
        setDataSource(formattedData);
    };

    useEffect(() => {
        if (!isLoading && !error && visitsData) {
            setData(visitsData);
            handleDataChange();
            dispatch(endloading());
        } else if (!isLoading && error) {
            toastRef.current.setToast({
                message: i18n.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }, [visitsData, error, isLoading]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );

    const onDragEnd = ({ active, over }) => {
        if (active === null || active === undefined || over === null || over === undefined || over.id.includes("empty") || active.id.includes("empty")) {
            return false;
        }
        let isTop = false;
        const activeRect = active.rect?.current?.initial;
        const activeY = activeRect?.top;
        const overY = over.rect.top;

        if (activeY !== undefined && overY !== undefined) {
            isTop = activeY > overY;
        } else {
            return false;
        }

        setDataSource((prev) => {
            const activeItem = findItemById(prev, active.id);
            const overItem = findItemById(prev, over?.id);

            if (activeItem === null || activeItem.id === null) {
                return prev;
            }
            if (overItem === null || (overItem.id === null && !isTop)) {
                return prev;
            }

            if (activeItem && overItem) {
                if (activeItem.type === 'visit' && overItem.type === 'visit') {
                    const newDataSource = [...prev];
                    const activeIndex = findIndexWithChildren(newDataSource, activeItem.key);
                    const overIndex = findIndexWithChildren(newDataSource, overItem.key);
                    const sortedArr = arrayMove(newDataSource, activeIndex, overIndex);
                    sortedArr.forEach((item, index) => {
                        item.order = index + 1;
                    });
                    return sortedArr;
                }
                else if (activeItem.type === 'page') {
                    if (overItem.type === 'visit') {
                        if (activeItem.parentId === overItem.id) {
                            const newDataSource = [...prev];
                            const parent = newDataSource.find(item => item.id === activeItem.parentId);
                            parent.children = parent.children.filter(item => item.key !== activeItem.key);
                            activeItem.parentId = overItem.id;
                            activeItem.order = 1;
                            overItem.children.unshift(activeItem);
                            overItem.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            parent.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            return newDataSource;
                        }
                        else {
                            const newDataSource = [...prev];
                            const parentOfActive = newDataSource.find(item => item.id === activeItem.parentId);
                            parentOfActive.children = parentOfActive.children.filter(item => item.key !== activeItem.key);
                            activeItem.parentId = overItem.id;
                            activeItem.order = 1;
                            overItem.children.unshift(activeItem);
                            overItem.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            parentOfActive.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            return newDataSource;
                        }
                    }
                    else if (overItem.type === 'page') {
                        if (activeItem.parentId === overItem.parentId) {
                            const newDataSource = [...prev];
                            overItem.order = activeItem.order;
                            const activeIndex = findIndexWithChildren(newDataSource, activeItem.key);
                            const overIndex = findIndexWithChildren(newDataSource, overItem.key);
                            let visit = newDataSource.find(x => x.id == overItem.parentId);
                            const sortedArr = arrayMove(visit.children, activeIndex, overIndex);
                            visit.children = sortedArr;
                            visit.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            return newDataSource;
                        }
                        else {
                            const newDataSource = [...prev];
                            const newParent = newDataSource.find(x => x.id === overItem.parentId);
                            if (newParent) {
                                let visit = newDataSource.find(x => x.id === activeItem.parentId);
                                const activeChildIndex = visit.children.findIndex(child => child.key === activeItem.key);
                                visit.children.splice(activeChildIndex, 1);
                                activeItem.parentId = overItem.parentId;
                                const overChildIndex = newParent.children.findIndex(child => child.key === overItem.key);
                                activeItem.order = overChildIndex + 1;
                                if (isTop) {
                                    newParent.children.splice(overChildIndex, 0, activeItem);
                                }
                                else {
                                    newParent.children.splice(overChildIndex + 1, 0, activeItem);
                                }
                                newParent.children.forEach((child, index) => {
                                    child.order = index + 1;
                                });
                                visit.children.forEach((child, index) => {
                                    child.order = index + 1;
                                });
                            }
                            return newDataSource;
                        }
                    }
                    else {
                        return prev;
                    }
                }
                else if (activeItem.type === 'module') {
                    if (overItem.type === 'page') {
                        if (activeItem.parentId === overItem.id) {
                            const newDataSource = [...prev];
                            const parent = findItemById(newDataSource, overItem.key);
                            parent.children = parent.children.filter(item => item.key !== activeItem.key);
                            activeItem.parentId = overItem.id;
                            activeItem.order = 1;
                            overItem.children.unshift(activeItem);
                            overItem.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            parent.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            return newDataSource;
                        }
                        else {
                            const newDataSource = [...prev];
                            const allVisitChildren = newDataSource.reduce((accumulator, current) => {
                                if (current.type === 'visit' && current.children) {
                                    accumulator.push(...current.children);
                                }
                                return accumulator;
                            }, []);
                            const parentOfActive = allVisitChildren.find(item => item.id === activeItem.parentId);
                            parentOfActive.children = parentOfActive.children.filter(item => item.key !== activeItem.key);
                            activeItem.parentId = overItem.id;
                            activeItem.order = 1;
                            if (!overItem.children) {
                                overItem.children = [];
                            }
                            overItem.children.unshift(activeItem);
                            overItem.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            parentOfActive.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            return newDataSource;
                        }
                    }
                    else if (overItem.type === 'module') {
                        if (activeItem.parentId === overItem.parentId) {
                            const newDataSource = [...prev];
                            overItem.order = activeItem.order;
                            const activeIndex = findIndexWithChildren(newDataSource, activeItem.key);
                            const overIndex = findIndexWithChildren(newDataSource, overItem.key);
                            const allVisitChildren = newDataSource.reduce((accumulator, current) => {
                                if (current.type === 'visit' && current.children) {
                                    accumulator.push(...current.children);
                                }
                                return accumulator;
                            }, []);
                            let page = allVisitChildren.find(x => x.id == overItem.parentId);
                            const sortedArr = arrayMove(page.children, activeIndex, overIndex);
                            page.children = sortedArr;
                            page.children.forEach((child, index) => {
                                child.order = index + 1;
                            });
                            return newDataSource;
                        }
                        else {
                            const newDataSource = [...prev];
                            const allVisitChildren = newDataSource.reduce((accumulator, current) => {
                                if (current.type === 'visit' && current.children) {
                                    accumulator.push(...current.children);
                                }
                                return accumulator;
                            }, []);
                            let newParent = allVisitChildren.find(x => x.id == overItem.parentId);
                            if (newParent) {
                                let page = allVisitChildren.find(x => x.id == activeItem.parentId);
                                const activeChildIndex = page.children.findIndex(child => child.key === activeItem.key);
                                page.children.splice(activeChildIndex, 1);
                                activeItem.parentId = overItem.parentId;
                                const overChildIndex = newParent.children.findIndex(child => child.key === overItem.key);
                                activeItem.order = overChildIndex + 1;
                                if (isTop) {
                                    newParent.children.splice(overChildIndex, 0, activeItem);
                                } else {
                                    newParent.children.splice(overChildIndex + 1, 0, activeItem);
                                }
                                newParent.children.forEach((child, index) => {
                                    child.order = index + 1;
                                });
                                page.children.forEach((child, index) => {
                                    child.order = index + 1;
                                });
                            }
                            return newDataSource;
                        }
                    }
                    else {
                        return prev;
                    }
                }
                else {
                    return prev;
                }
            }
            return prev;
        });
    };

    const compareData = (data1, data2) => {
        const changedItems = [];
        data1.forEach(item1 => {
            const matchingItem = data2.find(item2 => item2.id === item1.id && item2.type === item1.type);
            if (matchingItem) {
                if (matchingItem.order !== item1.order || matchingItem.parentId !== item1.parentId) {
                    changedItems.push(item1);
                }
            } else {
                changedItems.push(item1);
            }
        });

        return changedItems;
    };

    const findChangedItems = () => {
        const flattenedData = flattenChildren(dataSource);
        const flattenedChangedData = flattenChildren(changedDataSource);
        const changedItems = compareData(flattenedData, flattenedChangedData);
        return changedItems;
    };

    const checkChangesRanking = (checked, e = false) => {
        const changedItems = findChangedItems();
        if (changedItems.length > 0) {
            Swal.fire({
                title: i18n.t("You have unsaved changes"),
                text: i18n.t("Do you confirm?"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3bbfad",
                confirmButtonText: i18n.t("Yes"),
                cancelButtonText: i18n.t("Cancel"),
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setDataSource(changedDataSource);
                    setChangedDataSource([]);
                    setRanking(checked);
                    if (e) setEditing(!editing);
                } else {
                    return false;
                }
            });
        } else {
            setChangedDataSource([]);
            setRanking(checked);
            if (e) setEditing(!editing);
        }
    };

    const rankingHandle = (checked) => {
        if (!checked) {
            checkChangesRanking(checked);
        } else {
            syncRankingData(dataSource);
            setRanking(checked);
        }
    };

    const syncRankingData = (source) => {
        setChangedDataSource(JSON.parse(JSON.stringify(source)));
    }

    const [visitRankingSet] = useVisitRankingSetMutation();

    const saveRanking = async () => {
        const changedItems = findChangedItems();
        if (changedItems.length > 0) {
            try {
                dispatch(startloading());
                const response = await visitRankingSet(changedItems);
                if (response.data.isSuccess) {
                    //setChangedDataSource(JSON.parse(JSON.stringify(dataSource)));
                    //setRankingDataSource(JSON.parse(JSON.stringify(dataSource)));
                    toastRef.current.setToast({
                        message: i18n.t(response.data.message),
                        stateToast: true
                    });
                    dispatch(endloading());
                } else {
                    toastRef.current.setToast({
                        message: i18n.t(response.data.message),
                        stateToast: false
                    });
                    dispatch(endloading());
                }
            } catch (e) {
                toastRef.current.setToast({
                    message: i18n.t("An unexpected error occurred."),
                    stateToast: false
                });
                dispatch(endloading());
            }
        } else {
            Swal.fire({
                title: "",
                text: i18n.t("You haven't made any changes."),
                icon: "warning",
                confirmButtonText: i18n.t("Ok"),
            });
        }
    };

    const editingHandle = () => {
        if (editing && ranking) {
            checkChangesRanking(false, true);
        } else {
            setEditing(!editing);
        }
    };

    return {
        handleSave,
        handleDelete,
        handleList,
        studyInformation,
        sensors,
        onDragEnd,
        saveRanking,
        rankingHandle,
        ranking,
        editing,
        editingHandle,
        setData,
        setEditing
    };
};

const handleTransferData = (openModal, studyId, activeStudyId, ref, toastRef, modalRef) => {
    const content = <TransferData studyId={studyId} activeStudyId={activeStudyId} refs={ref} toast={toastRef} modalRef={modalRef} />;
    openModal({ title: "Data Transfer", buttonText: "Save Transfer", content: content });
};

const handleRelation = (openModal, studyId, activeStudyId, ref, toastRef, modalRef) => {
    const content = <Relation studyId={studyId} activeStudyId={activeStudyId} toast={toastRef} refs={modalRef} />;
    openModal({ title: i18n.t("Relation"), buttonText: i18n.t("Save"), content: content });
};

const handleAnnotatedCrfPdf = (openModal, studyId, activeStudyId, ref, toastRef, modalRef) => {
    const content = <AnnotatedCrfPdf studyId={studyId} activeStudyId={activeStudyId} toast={toastRef} refs={modalRef} />;
    openModal({ title: i18n.t("Print options"), buttonText: i18n.t("Preview"), content: content });
};

const handleAnnotatedCrfPdfHistory = (openModal, studyId, activeStudyId, ref, toastRef, modalRef) => {
    const content = <AnnotatedCrfPdfHistory studyId={studyId} activeStudyId={activeStudyId} toast={toastRef} refs={modalRef} />;
    openModal({ title: i18n.t("Print options"), buttonText: i18n.t("Preview"), content: content });
};

export function visitSettingsItems(openModal, studyId, activeStudyId, ref, toastRef, modalRef) {
    let items = [];
    items.push({
        label: i18n.t('Transfer data to active study'),
        key: '1',
        icon: <FontAwesomeIcon icon="fa-solid fa-arrow-up-from-bracket" style={{ color: "#6fce7a", }} />,
        style: { color: "#6fce7a" },
        onClick: () => handleTransferData(openModal, studyId, activeStudyId, ref, toastRef, modalRef)
    });
    items.push({
        label: i18n.t('Relation'),
        key: '2',
        icon: <FontAwesomeIcon icon="fa-solid fa-diagram-project" style={{ color: "#f6f797", }} />,
        style: { color: "#f6f797" },
        onClick: () => handleRelation(openModal, studyId, activeStudyId, ref, toastRef, modalRef)
    });
    items.push({
        label: i18n.t('Annotated CRF PDF'),
        key: '3',
        icon: <FontAwesomeIcon icon="fa-regular fa-file-pdf" style={{ color: "#fdc16d", }} />,
        style: { color: "#fdc16d" },
        onClick: () => handleAnnotatedCrfPdf(openModal, studyId, activeStudyId, ref, toastRef, modalRef)
    });
    items.push({
        label: i18n.t('Annotated CRF Excel'),
        key: '4',
        icon: <FontAwesomeIcon icon="fa-regular fa-file-excel" style={{ color: "#ff9494", }} />,
        style: { color: "#ff9494" },
    });
    items.push({
        label: i18n.t('Annotated CRF PDF history'),
        key: '5',
        icon: <FontAwesomeIcon icon="fa-solid fa-clock-rotate-left" style={{ color: "#ff85fb", }} />,
        style: { color: "#ff85fb" },
        onClick: () => handleAnnotatedCrfPdfHistory(openModal, studyId, activeStudyId, ref, toastRef, modalRef)
    });
    items.push({
        label: i18n.t('Study design audit trail'),
        key: '6',
        icon: <FontAwesomeIcon icon="fa-solid fa-plus" />,
    });
    return { items };
}

export const getAllKeysRecursive = (item) => {
    // if(item.id === null){
    //   return false;
    // }
    let keys = [item.key];

    if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
            keys = keys.concat(getAllKeysRecursive(child));
        });
    }

    return keys;
};

export const getAllKeys = (data) => {
    let keys = [];

    data.forEach((item) => {
        keys = keys.concat(getAllKeysRecursive(item));
    });

    return keys;
};

export const findItemById = (data, id) => {
    for (const item of data) {
        if (item.key === id) {
            return item;
        }

        if (item.children) {
            const foundInChildren = findItemById(item.children, id);
            if (foundInChildren) {
                return foundInChildren;
            }
        }
    }

    return null;
};

export function findIndexWithChildren(data, key) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
            return i;
        }

        if (data[i].children && data[i].children.length > 0) {
            const childIndex = findIndexWithChildren(data[i].children, key);
            if (childIndex !== -1) {
                return childIndex;
            }
        }
    }

    return -1;
};

export const flattenChildren = (data) => {
    const flattenArray = [];
    const flatten = (item) => {
        if (item.id !== null) {
            flattenArray.push({ ...item, children: undefined });
        }
        if (item.children && item.children.length > 0) {
            item.children.forEach(child => flatten({ ...child, parentId: item.id }));
        }
    };
    data.forEach(item => {
        flatten(item);
    });
    return flattenArray;
};