import PropTypes from 'prop-types';
import React, { useEffect, useContext } from "react";
import { withTranslation } from "react-i18next";
import { Menu, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, BulbOutlined, FolderOutlined, FileOutlined, MenuOutlined } from '@ant-design/icons';
import { SubjectDetailEllipsis } from './SubjectDetailEllipsis';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubjectDetailContext } from '../SubjectDetail';
import SubjectMissingData from './SubjectMissingData';
import Swal from 'sweetalert2';

const SubjectDetailMenu = props => {
    const navigate = useNavigate();

    const { modalRef, setModalInf, setSdv } = useContext(SubjectDetailContext);

    const CustomMenuHeader = () => {
        let items = [];

        if (props.permissions.canMonitoringPageLock) {
            items.push({
                key: '1',
                label: (
                    <a>
                        {props.t("Lock")}
                    </a>
                ),
                icon: <FontAwesomeIcon icon="fa-solid fa-lock" />
            });
        }

        if (props.permissions.canMonitoringPageFreeze) {
            items.push({
                key: '2',
                label: (
                    <a>
                        {props.t("Freeze")}
                    </a>
                ),
                icon: <FontAwesomeIcon icon="fa-solid fa-snowflake" />
            });
        }

        if (props.permissions.canMonitoringSeePageActionAudit) {
            items.push({
                key: '3',
                label: (
                    <a>
                        {props.t("Audit trail")}
                    </a>
                ),
                icon: <FontAwesomeIcon icon="fa-solid fa-clock" />
            });
        }

        return (
            <div className="subject-menu-header">
                {props.subjectNumber}
                {(props.permissions.canMonitoringPageLock || props.permissions.canMonitoringPageFreeze || props.permissions.canMonitoringSeePageActionAudit) &&
                    <SubjectDetailEllipsis items={items} />
                }
            </div>
        );
    }

    const CustomMenuItem = ({ item, state, pageId, type = 1 }) => {
        const setMissingData = async (e) => {
            e.stopPropagation();

            const result = await Swal.fire({
                title: props.t("Do you want to mark all empty fields on this page as 'missing data' ?"),
                text: props.t("Do you confirm?"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3bbfad",
                confirmButtonText: props.t("Yes"),
                cancelButtonText: props.t("Cancel")
            });

            if (result.isConfirmed) {
                try {
                    setModalInf({
                        title: props.t('Select one of the reasons for the missing value'),
                        content: <SubjectMissingData data={false} elementId={pageId} refs={modalRef} isPage={true} subjectId={props.subjectId} />,
                        isButton: true,
                        buttonText: props.t('Save'),
                    });
                    modalRef.current.tog_backdrop();
                } catch (error) {
                    Swal.fire({
                        title: "",
                        text: props.t("An unexpected error occurred."),
                        icon: "error",
                        confirmButtonText: props.t("Ok"),
                    });
                }
            }
        };

        const setSdvData = async (e) => {
            e.stopPropagation();

            const showConfirmButton = props.nonSdv.length > 0;

            const result = await Swal.fire({
                title: props.t("All data on this page will be SDV'ed."),
                html: `<p style='color:red;'>${props.t('Number of blank data that cannot be SDV :')} ${props.nonSdv.length}</p>${showConfirmButton ? props.t("Do you confirm?") : ''}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3bbfad",
                confirmButtonText: props.t("Yes"),
                cancelButtonText: props.t("Cancel"),
                showConfirmButton: showConfirmButton
            });

            if (result.isConfirmed) {
                try {
                    setSdv(props.nonSdv.map(item => item.subjectVisitPageModuleElementId));
                } catch (error) {
                    Swal.fire({
                        title: "",
                        text: props.t("An unexpected error occurred."),
                        icon: "error",
                        confirmButtonText: props.t("Ok"),
                    });
                }
            }
        };

        let items = [];

        if (props.permissions.canMonitoringPageLock) {
            items.push({
                key: '1',
                label: (
                    <a>
                        {props.t("Lock")}
                    </a>
                ),
                icon: <FontAwesomeIcon icon="fa-solid fa-lock" />
            });
        }

        if (props.permissions.canMonitoringPageFreeze) {
            items.push({
                key: '2',
                label: (
                    <a>
                        {props.t("Freeze")}
                    </a>
                ),
                icon: <FontAwesomeIcon icon="fa-solid fa-snowflake" />
            });
        }

        if (props.permissions.canMonitoringSeePageActionAudit) {
            items.push({
                key: '3',
                label: (
                    <a>
                        {props.t("Audit trail")}
                    </a>
                ),
                icon: <FontAwesomeIcon icon="fa-solid fa-clock" />
            });
        }

        if (state === 2 && props.permissions.canMonitoringMarkAsNull) {
        //];
        }

        if (state === 2 && props.IsMissingData) {
            items.push({
                key: '4',
                label: (
                    <a onClick={setMissingData}>
                        {props.t("Missing data")}
                    </a>
                ),
                icon: <FontAwesomeIcon icon="fas fa-check-square" style={{ color: "#bf9ec9" }} />
            });
        }

        if (state === 2 && props.permissions.canMonitoringSdv) {
            items.push({
                key: '5',
                label: (
                    <a onClick={setSdvData}>
                        {props.t("On-site SDV")}
                    </a>
                ),
                icon: <FontAwesomeIcon icon="fa-solid fa-circle-check" style={{ color: "#3BBFAD" }} />
            });
        }
        

        if (type === 1) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tooltip title={item.title}>
                        <span style={{ width: '90%', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                    </Tooltip>
                {
                    (
                        (state === 2
                         &&
                            (props.permissions.canMonitoringSdv || props.permissions.canMonitoringMarkAsNull || props.permissions.canMonitoringPageLock || props.permissions.canMonitoringPageFreeze || props.permissions.canMonitoringSeePageActionAudit)
                        )
                        ||
                        (state === 1
                            &&
                            (props.permissions.canMonitoringPageLock || props.permissions.canMonitoringPageFreeze || props.permissions.canMonitoringSeePageActionAudit)
                        )
                    )
                    &&
                    <div style={{ position: 'absolute', right: 15.5, overflow: 'hidden' }}>
                        <SubjectDetailEllipsis items={items} />
                    </div>
               }
                </div>
            );
        }
        else {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tooltip title={item.title}>
                        <span style={{ width: '90%', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                    </Tooltip>
                </div>
            );
        }
    };

    const CustomMultiMenuItem = ({ item }) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tooltip title={item.title}>
                    <span style={{ width: '90%', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                </Tooltip>
            </div>
        );
    };

    const convertDataToItems = (data) => {
        return data.map((item, index) => {
            if (item.type === 1 || (props.rowIndex > 0 && item.type === 2)) {
                let children = item.children.map((child, childIndex) => {
                    return {
                        id: child.id,
                        key: `${index + 1}-${childIndex + 1}-${item.id}-${item.type}`,
                        label: <CustomMenuItem item={child} pageId={child.id} state={2} />,
                        icon: <FileOutlined />,
                    };
                });

                if (props.rowIndex > 0 && item.type === 2) {
                    children.unshift({
                        key: "",
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
                                <Tooltip title={props.t("Form No") + ":" + props.rowIndex + ".0"}>
                                    <span style={{ width: '90%', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {props.t("Form No") + ": " + props.rowIndex + ".0"}
                                    </span>
                                </Tooltip>
                            </div>
                        ),
                        children: null
                    });
                }


                return {
                    key: `sub${index + 1}`,
                    label: <CustomMenuItem item={item} state={1} type={item.type} />,
                    icon: item.type === 1 ? <FolderOutlined /> : <MenuOutlined />,
                    children: children 
                };
            } else {
                return {
                    key: `sub${index + 1}-${item.id}`,
                    label: <CustomMultiMenuItem item={item} state={1} />,
                    icon: <MenuOutlined />,
                    children: null
                };
            }
        });
    };

    const items = convertDataToItems(props.data);

    if (!props.isMobil) {
        items.unshift({
            type: 'divider',
        });
        items.unshift({
            key: 'header',
            label: <CustomMenuHeader />,
            disabled: true,
            icon: <FontAwesomeIcon icon="fa-solid fa-user" style={{ color: 'white' }} />,
            className: 'subject-menu-header' 
        });
    }

    const findParentKey = (key, items) => {
        for (const item of items) {
            if (item.key === key) {
                return item.key;
            }
            if (item.children) {
                for (const child of item.children) {
                    if (child.key === key) {
                        return item.key;
                    }
                }
            }
        }
        return null;
    };

    const findMenuItemPathById = (items, id, path = []) => {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const newPath = [...path, i + 1];
            if (item.id === id) {
                return newPath;
            }
            if (item.children) {
                const found = findMenuItemPathById(item.children, id, newPath);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    useEffect(() => {
        const path = findMenuItemPathById(props.data, parseInt(props.pageId, 10));
        if (path) {
            const key = path.join('-');
            props.setSelectedKeys(key);
            props.setOpenSubMenuKeys(['sub' + path[0]]);
            props.setPrevNextButton(props.data, parseInt(props.pageId, 10));
        }
    }, [props.data, props.pageId]);

    const onClick = (e) => {
        if (e.key !== '') {
            const parentKey = findParentKey(e.key, items);
            const key = (e.key).split('-');
            var isVisit = key[0].includes("sub");
            var rowIndex = key.length > 2 && key[3] === "1" ? 0 : props.rowIndex;

            if (parentKey && !isVisit) {
                const newOpenKeys = props.openKeys.includes(parentKey) ? [] : [parentKey];
                props.setOpenKeys(newOpenKeys);
                const parentItem = items.find(item => item.key === parentKey);
                const pageId = parentItem.children.find(child => child.key === e.key).id;

                navigate(`/subject-detail/${props.studyId}/${pageId}/${props.subjectId}/${props.subjectNumber}/${false}/${rowIndex}`);
            }
            else {
                navigate(`/subject-detail/${props.studyId}/${key[1]}/${props.subjectId}/${props.subjectNumber}/${true}/${rowIndex}`);
            }

            props.setSelectedKeys(e.key);
        }
    };

    const handleSubMenuOpenChange = (keys) => {
        props.setOpenSubMenuKeys(keys);
    };

    return (
        <Menu
            onClick={onClick}
            className={!props.isMobil ? "menu-container" : ""}
            mode="inline"
            items={items}
            selectedKeys={props.selectedKeys}
            openKeys={props.openSubMenuKeys}
            onOpenChange={handleSubMenuOpenChange}
            expandIcon={null}
        />
    )
}

SubjectDetailMenu.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectDetailMenu);