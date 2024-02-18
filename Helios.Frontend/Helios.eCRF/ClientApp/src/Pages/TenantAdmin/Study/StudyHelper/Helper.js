import { endloading, startloading } from '../../../../store/loader/actions';
import Settings from '../Comp/Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import i18n from 'i18next';
import { useLazyVisitListGetQuery, useVisitSetMutation, useVisitDeleteMutation } from "../../../../store/services/Visit";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';

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

export const useApiHelper = (dataSource, setDataSource, toastRef) => {

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

    useEffect(() => {
        if (!isLoading && !error && visitsData) {
            const formattedData = visitsData.map((data) => {
                const visitRow = {
                    key: data.id.toString(),
                    id: data.id,
                    type: 'visit',
                    name: data.name,
                    visittype: data.visitType,
                    order: data.order,
                    createdat: data.createdAt,
                    updatedon: data.updatedAt,
                };

                const pageRows = data.children ? data.children.map((page, i) => {
                    const pageRow = {
                        key: `${data.id}_${i}`,
                        id: page.id,
                        parentId: page.parentId,
                        type: 'page',
                        name: page.name,
                        order: page.order,
                        epro: page.ePro,
                        createdat: page.createdAt,
                        updatedon: page.updatedAt,
                        ...(page.children && page.children.length > 0 && {
                            children: page.children.map((module, j) => ({
                                key: `${data.id}_${page.id}_${j}`,
                                id: module.id,
                                parentId: module.parentId,
                                type: 'module',
                                name: module.name,
                                order: module.order,
                                createdat: module.createdAt,
                                updatedon: module.updatedAt,
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

                    pageRows.push(emptyPage);
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
            formattedData.push(emptyVisit);
            setDataSource(formattedData);
            dispatch(endloading());
        } else if (!isLoading && error) {
            toastRef.current.setToast({
                message: i18n.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }, [visitsData, error, isLoading]);

    return {
        handleSave,
        handleDelete,
        handleList,
        studyInformation
    };
};
export function visitSettingsItems() {
    let items = [];
    items.push({
        label: i18n.t('Transfer data to active study'),
        key: '1',
        icon: <FontAwesomeIcon icon="fa-solid fa-arrow-up-from-bracket" style={{ color: "#6fce7a", }} />,
        style: { color: "#6fce7a" },
    });
    items.push({
        label: i18n.t('Relation'),
        key: '2',
        icon: <FontAwesomeIcon icon="fa-solid fa-diagram-project" style={{ color: "#f6f797", }} />,
        style: { color: "#f6f797" },
    });
    items.push({
        label: i18n.t('Annotated CRF PDF'),
        key: '3',
        icon: <FontAwesomeIcon icon="fa-regular fa-file-pdf" style={{ color: "#fdc16d", }} />,
        style: { color: "#fdc16d" },
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
    });
    items.push({
        label: i18n.t('Study design audit trail'),
        key: '6',
        icon: <FontAwesomeIcon icon="fa-solid fa-plus" />,
    });
    return { items };
}