import PropTypes from 'prop-types';
import React, { useEffect, useContext } from "react";
import { withTranslation } from "react-i18next";
import { Menu, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, BulbOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
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
        return (
            <div className="subject-menu-header">
                {props.subjectNumber}
                <SubjectDetailEllipsis items={[
                    {
                        key: '1',
                        label: <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">Kilitle</a>,
                        icon: <LockOutlined />
                    },
                    {
                        key: '3',
                        type: 'divider'
                    },
                    {
                        key: '2',
                        label: <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">Dondur</a>,
                        icon: <BulbOutlined />
                    },
                ]} />
            </div>
        );
    }

    const CustomMenuItem = ({ item, state, pageId }) => {
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
                html: `<p>${props.t('Number of blank data that cannot be SDV :')} ${props.nonSdv.length}</p>${showConfirmButton ? props.t("Do you confirm?") : ''}`,
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

        let items = [
            {
                key: '1',
                label: <a>Kilitle</a>,
                icon: <LockOutlined />
            },
            {
                key: '3',
                type: 'divider'
            },
            {
                key: '2',
                label: <a>Dondur</a>,
                icon: <BulbOutlined />
            }
        ];

        if (state === 2 && props.permissions.canMonitoringMarkAsNull) {
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
        
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tooltip title={item.title}>
                    <span style={{ width: '90%', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                </Tooltip>
                <div style={{ position: 'absolute', right: 15.5, overflow: 'hidden' }}>
                    <SubjectDetailEllipsis items={items} />
                </div>
            </div>
        );
    };

    const convertDataToItems = (data) => {
        return data.map((item, index) => {
            return {
                key: `sub${index + 1}`,
                label: <CustomMenuItem item={item} state={1} />,
                icon: <FolderOutlined />,
                children: item.children.map((child, childIndex) => {
                    return {
                        id: child.id,
                        key: `${index + 1}-${childIndex + 1}`,
                        label: <CustomMenuItem item={child} pageId={child.id} state={2} />,
                        icon: <FileOutlined />,
                    };
                })
            };
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
            icon: <UserOutlined />
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
        const parentKey = findParentKey(e.key, items);
        if (parentKey) {
            const newOpenKeys = props.openKeys.includes(parentKey) ? [] : [parentKey];
            props.setOpenKeys(newOpenKeys);
            const parentItem = items.find(item => item.key === parentKey);
            const pageId = parentItem.children.find(child => child.key === e.key).id;
            navigate(`/subject-detail/${props.studyId}/${pageId}/${props.subjectId}/${props.subjectNumber}`);
        }
        props.setSelectedKeys(e.key);
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