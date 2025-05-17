import React, { useEffect, useContext, useRef } from "react";
import { Form, Input, Select, Popconfirm, Dropdown } from 'antd';
import visitType from '../VisitTypeItems';
import EditableContext from './EditableContext';
import { useApiHelper, handleSettings, handleAddModule } from '../VisitHelper/Helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../store/toast/actions";
library.add( fas);


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
    openModal,
    ranking,
    toggleModal,
    ...restProps
}) => {

    const form = useContext(EditableContext);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { handleDelete } = useApiHelper(dataSource, setDataSource);

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
                dispatch(showToast(t("No changes were made. Please make changes to save."), true, false));
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

            childNode = !ranking && editing && dataIndex !== 'visittype' ? (
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
                        <Input id={inputId} placeholder={record.placeholder ? record.type === 'page' ? t("Add page") : t("Add visit") : undefined} onPressEnter={save} onBlur={save} onDoubleClick={record.type === 'module' ? () => navigate(`/formBuilder/${record.id}/true`) : undefined} />
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
                    {dataIndex === 'visittype' && children[1] !== undefined && children[1] !== "" ? t(visitType.find(x => x.value == children[1]).label) : dataIndex === 'name' ?
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

            if (!ranking && editing && dataIndex === 'visittype' && record.type === "visit") {
                childNode = (
                    <Form.Item
                        style={{ marginBottom: 0 }}
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
            if (record.type === 'module' && record.key !== dataSource[dataSource.length - 1].key) {
                items.push({
                    key: '4',
                    label: (
                        <a onClick={() => navigate(`/formBuilder/${record.id}/true`)}>{t("Go to module")}</a>
                    ),
                    icon: <FontAwesomeIcon icon="fa-solid fa-arrow-right" style={{ color: "#3498db", }} />,
                    style: { color: "#3498db" },
                });
            }
            if (record.type === 'page' && record.key !== dataSource[dataSource.length - 1].key) {
                items.push({
                    key: '2',
                    label: (
                        <a onClick={() => handleAddModule(openModal, record, modalRef, toggleModal)}>{t("Add module")}</a>
                    ),
                    icon: <FontAwesomeIcon icon="fa-solid fa-plus" style={{ color: "#3498db", }} />,
                    style: { color: "#3498db" },
                });
            }
            if (dataSource.length > 1 && (record.key !== dataSource[dataSource.length - 1].key)) {
                items.push({
                    key: '1',
                    label: (
                        <Popconfirm title={record.type === 'visit' ? t("You will not be able to recover this visit!") : t("You will not be able to recover this page!")} onConfirm={() => handleDelete(record.key)}>
                            <a>{t("Delete")}</a>
                        </Popconfirm>
                    ),
                    icon: <FontAwesomeIcon icon="fa-regular fa-trash-can" style={{ color: "#e74c3c", }} />,
                    style: { color: "#e74c3c" },
                });
            }
            if (record.type !== 'module' && record.key !== dataSource[dataSource.length - 1].key) {
                items.push({
                    key: '3',
                    label: (
                        <a onClick={() => handleSettings(openModal, record, modalRef)}>{t("Settings")}</a>
                    ),
                    icon: <FontAwesomeIcon icon="fa-solid fa-gears" style={{ color: "#f1c40f", }} />,
                    style: { color: "#f1c40f" },
                });
            }
         
            return { items };
        }
    }
    return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;