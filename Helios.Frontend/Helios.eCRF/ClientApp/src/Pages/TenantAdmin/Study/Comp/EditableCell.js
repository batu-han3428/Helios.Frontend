import React, { useEffect, useContext, useRef } from "react";
import { Form, Input, Select, Popconfirm, Dropdown } from 'antd';
import visitType from '../VisitTypeItems';
import EditableContext from './EditableContext';
import { useApiHelper, handleSettings } from '../StudyHelper/Helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    editing,
    dataSource,
    setDataSource,
    t,
    toastRef,
    openModal,
    ...restProps
}) => {

    const form = useContext(EditableContext);

    const { handleDelete } = useApiHelper(dataSource, setDataSource, toastRef);

    const modalRef = useRef();

    const toggleEdit = () => {
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            if (dataIndex === 'name' && values.name === record[dataIndex]) {
                toastRef.current.setToast({
                    message: t("No changes were made. Please make changes to save."),
                    stateToast: false
                });
                return false;
            }
            if (values.hasOwnProperty("")) {
                const oldValue = values[""];
                values["name"] = oldValue;
                delete values[""];
            }
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
        }
    };

    let childNode = children;

    useEffect(() => {
        if (editing && dataIndex !== undefined && record !== undefined) {
            toggleEdit();
        }
    }, [editing, dataIndex, record]);

    if (editable) {
        const selectedValue = record[dataIndex];
        const inputId = `input_${dataIndex}_${record.key}`;
        const selectId = `select_${dataIndex}_${record.key}`;
        childNode = editing && dataIndex !== 'visittype' ? (
            <>
                {children[0]}
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={record.placeholder ? "" : dataIndex}
                    rules={[
                        {
                            required: true,
                            message: t("This field is required"),
                        },
                    ]}
                >
                    <Input id={inputId} placeholder={record.placeholder ? record.type === 'page' ? t("Add page") : t("Add visit") : undefined} onPressEnter={save} onBlur={save} />
                </Form.Item>
                <Dropdown menu={getItems()} trigger={['click']} placement="bottomLeft">
                    <div style={{ position: 'absolute', right: 7, top: 22, display: 'flex', alignItems: 'center' }}>
                        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                            <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical" />
                        </a>
                    </div>
                </Dropdown>
            </>
        ) : (
            <div
            className={dataIndex !== 'visittype' ? "editable-cell-value-wrap" : "editable-cell-value-wrap-dropdown"}
            style={{
                paddingRight: 24,
                color: record.placeholder ? '#ccc' : undefined
            }}>
                {dataIndex === 'visittype' && children[1] !== undefined && children[1] !== "" ? t(visitType.find(x=>x.value == children[1]).label) : dataIndex === 'name' ?              
                    <>
                        {record.placeholder && (
                            <>
                                <FontAwesomeIcon icon="fa-solid fa-plus" />
                                {' '}
                                {record.type === 'page' ? t("Add page") : t("Add visit")}
                            </>
                        )}
                        {children}
                    </>
                : (children)}
            </div>
        );

        if (editing && dataIndex === 'visittype' && record.type === "visit") {
            childNode = (
                <Form.Item
                style={{marginBottom:0}}
                name={dataIndex}
                rules={[
                    {
                        required: record.type === 'visit',
                        message: t("This field is required"),
                    },
                ]}>
                    <Select
                        id={selectId}
                        options={visitType.map(type => ({ label: t(type.label), value: type.value }))}
                        onChange={save}
                        value={selectedValue}
                    />
                </Form.Item>
            );
        }
        function getItems() {        
            let items = [];
            if (dataSource.length > 1 && (record.key !== dataSource[dataSource.length - 1].key)) {
                items.push({
                    key: '1',
                    label: (
                        <Popconfirm title={record.type === 'visit' ? t("You will not be able to recover this visit!") : t("You will not be able to recover this page!")} onConfirm={() => handleDelete(record.key)}>
                            <a>{t("Delete")}</a>
                        </Popconfirm>
                    ),
                    icon: <FontAwesomeIcon icon="fa-regular fa-trash-can" style={{ color: "#e48181", }} />,
                    style: { color: "#e48181" },
                });
            }
            if (record.type !== 'module' && record.key !== dataSource[dataSource.length - 1].key) {
                items.push({
                    key: '3',
                    label: (
                        <a onClick={() => handleSettings(openModal, record, modalRef, toastRef)}>{t("Settings")}</a>
                    ),
                    icon: <FontAwesomeIcon icon="fa-solid fa-gears" style={{ color: "#e5f37c", }} />,
                    style: { color: "#e5f37c" },
                });
            }
         
            return { items };
        }
    }
    return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;