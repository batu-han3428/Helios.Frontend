import PropTypes from 'prop-types';
import React, { useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Menu, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, BulbOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import { SubjectDetailEllipsis } from './SubjectDetailEllipsis';
import { useNavigate } from "react-router-dom";

const SubjectDetailMenu = props => {
    const navigate = useNavigate();

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

    const CustomMenuItem = ({ item }) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Tooltip title={item.title}>
                    <span style={{ width: '90%', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
                </Tooltip>
                <div style={{ position: 'absolute', right: 15.5, overflow: 'hidden' }}>
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
            </div>
        );
    };

    const convertDataToItems = (data) => {
        return data.map((item, index) => {
            return {
                key: `sub${index + 1}`,
                label: <CustomMenuItem item={item} />,
                icon: <FolderOutlined />,
                children: item.children.map((child, childIndex) => {
                    return {
                        id: child.id,
                        key: `${index + 1}-${childIndex + 1}`,
                        label: <CustomMenuItem item={child} />,
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
            navigate(`/subject-detail/${props.studyId}/${pageId}/${props.subjectId}`);
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