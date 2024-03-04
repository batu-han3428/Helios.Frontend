import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Table, Row, Col, Switch, Dropdown, Tooltip, Space } from 'antd';
import { CheckOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import EditableRow from '../Visit/Comp/EditableRow';
import EditableCell from '../Visit/Comp/EditableCell';
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import { useApiHelper, visitSettingsItems } from './VisitHelper/Helper';

const Study = props => {

    const modalRef = useRef();

    const toastRef = useRef();

    const navigate = useNavigate();

    const backPage = () => {
        navigate('/studylist');
    };

    const [dataSource, setDataSource] = useState([]);
    const [editing, setEditing] = useState(false);

    const { handleSave, handleList, studyInformation } = useApiHelper(dataSource, setDataSource, toastRef);

    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");
    const [modalContent, setModalContent] = useState(null);

    const openModal = (data) => {
        setModalTitle(data.title);
        setModalButtonText(data.buttonText);
        setModalContent(data.content);
        modalRef.current.tog_backdrop();
    }

    const defaultColumns = [
        {
            title: props.t('Visit name'),
            dataIndex: 'name',
            width: '30%',
            editable: true,
        },
        {
            title: props.t('Visit type'),
            dataIndex: 'visittype',
            editable: true,
        },
        {
            title: props.t('Order'),
            dataIndex: 'order',
        },
        {
            title: props.t('Created on'),
            dataIndex: 'createdat',
        },
        {
            title: props.t('Updated on'),
            dataIndex: 'updatedon',
        }
    ];
    
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave
            }),
        };
    });

    const components = {
        body: {
            row: EditableRow,
            cell: (e) => <EditableCell {...e} openModal={openModal} toastRef={toastRef} t={props.t} setDataSource={setDataSource} dataSource={dataSource} editing={editing} />,
        },
    };

    useEffect(() => {
        if (studyInformation.studyId) {
            handleList();
        }
    }, [studyInformation.studyId])

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [allRowsExpanded, setAllRowsExpanded] = useState(true);

    useEffect(() => {
        const allRowKeys = getAllRowKeys(dataSource);
        setExpandedRowKeys(allRowKeys);
    }, [dataSource]);

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

    const handleToggleAllRows = () => {
        if (allRowsExpanded) {
            setExpandedRowKeys([]);
        } else {
            const closeAllChildren = (data) => {
                return data.reduce((keys, record) => {
                    keys.push(record.key);
                    if (record.children) {
                        const childKeys = closeAllChildren(record.children);
                        keys.push(...childKeys);
                    }
                    return keys;
                }, []);
            };

            const allChildKeys = closeAllChildren(dataSource);
            setExpandedRowKeys(allChildKeys);
        }
        setAllRowsExpanded(!allRowsExpanded);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={8}>
                                <h6 className="page-title"><FontAwesomeIcon style={{ marginRight: "10px", cursor: "pointer", position: "relative", top: "0.5px" }} onClick={backPage} icon="fa-solid fa-left-long" />{props.t('Visit list')}</h6>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <div style={{ display: "flex", justifyContent: "space-between", padding:"10px 0" }}>
                                <div>
                                    <Tooltip title={allRowsExpanded ? props.t("Collapse all") : props.t("Expand all")}>
                                        <Button onClick={handleToggleAllRows} icon={<FontAwesomeIcon icon="fa-solid fa-bars" style={{ color: "#3d3d3d", }} />} />
                                    </Tooltip>
                                    {editing &&
                                        <Dropdown menu={visitSettingsItems()} trigger={['click']} placement="bottomLeft">
                                            <Button type="default" style={{ marginLeft: "10px" }}>
                                                <Space>
                                                    {props.t("Visit settings")}
                                                    <DownOutlined />
                                                </Space>
                                            </Button>
                                        </Dropdown>
                                    }
                                </div>
                                <Switch
                                    checkedChildren={<CheckOutlined />}
                                    unCheckedChildren={<CloseOutlined />}
                                    defaultChecked={editing}
                                    onChange={() => setEditing(!editing)}
                                />
                            </div>                            
                            <Table
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                dataSource={dataSource}
                                columns={columns}
                                expandedRowKeys={expandedRowKeys}
                                onExpand={handleExpand}
                                pagination={false}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
            <ToastComp ref={toastRef} />
            <ModalComp
                refs={modalRef}
                title={modalTitle}
                body={modalContent}
                buttonText={modalButtonText}
                isButton={true}
                size="lg"
            />
        </React.Fragment>
    );
};

Study.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Study);