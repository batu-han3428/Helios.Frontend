import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Table, Row, Col, Switch, Dropdown, Tooltip, Space, FloatButton } from 'antd';
import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import EditableRow from '../Visit/Comp/EditableRow';
import EditableCell from '../Visit/Comp/EditableCell';
import ModalComp from '../../../components/Common/ModalComp/ModalComp';
import { getAllKeys, useApiHelper, visitSettingsItems } from './VisitHelper/Helper';
import "./visit.css";
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import * as signalR from '@microsoft/signalr';
import { useParams } from 'react-router-dom';
import { showToast } from '../../../store/toast/actions';
import { useDispatch } from 'react-redux';
import { formatDate } from "../../../helpers/format_date";

const Study = props => {

    const modalRef = useRef();

    const modalContentRef = useRef();

    const navigate = useNavigate();

    const backPage = () => {
        navigate('/studylist');
    };

    const [dataSource, setDataSource] = useState([]);

    const { handleSave, handleList, studyInformation, sensors, onDragEnd, saveRanking, rankingHandle, ranking, editing, editingHandle, setData, setEditing } = useApiHelper(dataSource, setDataSource);

    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");
    const [modalContent, setModalContent] = useState(null);

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [allRowsExpanded, setAllRowsExpanded] = useState(true);
    const [firstExpanded, setFirstExpanded] = useState(true);

    const openModal = (data) => {
        setModalTitle(data.title);
        setModalButtonText(data.buttonText);
        setModalContent(data.content);
        toggleModal();
    }

    const toggleModal = () => {
        modalRef.current.tog_backdrop();
    }

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

    const defaultColumns = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={allRowsExpanded ? props.t("Collapse all") : props.t("Expand all")} >
                        <Button onClick={handleToggleAllRows} icon={<FontAwesomeIcon icon="fa-solid fa-bars" style={{ color: "#3d3d3d", }} />} />
                    </Tooltip>
                    <label style={{ marginBottom: "0px", display: 'flex', alignItems: 'center', marginLeft: "5px" }}> {props.t('Visit name')}</label>

                </div>

            ),
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
            row: (props) => <EditableRow {...props} ranking={ranking} />,
            cell: (e) => <EditableCell {...e} toggleModal={toggleModal} openModal={openModal} t={props.t} setDataSource={setDataSource} dataSource={dataSource} editing={editing} ranking={ranking} />,
        },
    };

    useEffect(() => {
        if (studyInformation.studyId) {
            handleList(studyInformation.studyId);
        }
    }, [studyInformation.studyId])



    useEffect(() => {
        if (dataSource && dataSource.length > 0 && firstExpanded) {
            const allRowKeys = getAllRowKeys(dataSource);
            setExpandedRowKeys(allRowKeys);
            setFirstExpanded(false);
        }
    }, [dataSource, firstExpanded]);

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

    const dispatch = useDispatch();

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:3300/liveDataHub")
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: 30000,
                maxRetries: 10
            })
            .build();

        connection.start()
            .then(() => {
                connection.invoke("JoinGroup", "Visit")
                    .then()
                    .catch();
            })
            .catch();

        connection.on("LiveData", (response) => {
            setData(response.data.data, studyInformation.isDemo)
            dispatch(showToast(props.t("Has updated the table").replace("{user}", response.message), false, true));
        });

        return () => {
            connection.stop();
        };
    }, [studyInformation.isDemo]);

    const { studyId } = useParams();

    useEffect(() => {
        setEditing(false);
    }, [studyId]);

    const handleDataChange = () => {
        const newData = dataSource.map(item => {
            if (item.children) {
                const updatedChildren = item.children.map(chld => {
                    if (chld.children) {
                        const updatedChildren2 = chld.children.map(chld2 => {
                            return { ...chld2, createdat: formatDate(chld2.createdat), updatedon: formatDate(chld2.updatedon) };
                        });
                        return { ...chld, children: updatedChildren2, createdat: formatDate(chld.createdat), updatedon: formatDate(chld.updatedon) };
                    }
                    else {
                        return { ...chld, createdat: formatDate(chld.createdat), updatedon: formatDate(chld.updatedon) }
                    }
                });
                return { ...item, children: updatedChildren, createdat: formatDate(item.createdat), updatedon: formatDate(item.updatedon) }
            }
            else {
                return { ...item, createdat: formatDate(item.createdat), updatedon: formatDate(item.updatedon) }
            }
        });
        setDataSource(newData);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t('Visit list')}</h6>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                                <div>
                                    {editing && studyInformation.isDemo &&
                                        <>
                                            <Dropdown menu={visitSettingsItems(openModal, studyInformation.studyId, studyInformation.equivalentStudyId, modalContentRef, modalRef)} trigger={['click']} placement="bottomLeft">
                                                <Button type="default" style={{ margin: "0 10px" }}>
                                                    <Space>
                                                        {props.t("Visit settings")}
                                                        <DownOutlined />
                                                    </Space>
                                                </Button>
                                            </Dropdown>
                                            <Space direction="vertical" title={props.t("Edit visits ")}>
                                                <Switch checked={ranking} checkedChildren={props.t("Ranking")} unCheckedChildren={props.t("Ranking")} onChange={(checked) => rankingHandle(checked)} />
                                            </Space>
                                            {ranking && <FloatButton icon={<CheckOutlined />} type="primary" tooltip={<div>Save</div>} onClick={saveRanking} />}
                                        </>
                                    }
                                </div>
                                {studyInformation.isDemo &&
                                    <Switch
                                        checkedChildren={props.t("Edit visits")}
                                        unCheckedChildren={props.t("Edit visits")}
                                        defaultChecked={editing}
                                        onChange={editingHandle}
                                        checked={editing}
                                    />
                                }
                            </div>
                            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                                <SortableContext
                                    items={getAllKeys(dataSource)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <Table
                                        components={components}
                                        rowClassName={(record, index) => {
                                            return record.type === "visit" ? 'row-visit-background-color' : record.type === "page" ? 'row-page-background-color' : "row-module-background-color";
                                        }}
                                        bordered
                                        dataSource={dataSource}
                                        columns={columns}
                                        expandedRowKeys={expandedRowKeys}
                                        onExpand={handleExpand}
                                        pagination={false}
                                        scroll={{ x: 'max-content' }}
                                    />
                                </SortableContext>
                            </DndContext>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalComp
                refs={modalRef}
                title={modalTitle}
                body={modalContent}
                buttonText={modalButtonText}
                isButton={true}
                size="xl"
            />
        </React.Fragment>
    );
};

Study.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Study);