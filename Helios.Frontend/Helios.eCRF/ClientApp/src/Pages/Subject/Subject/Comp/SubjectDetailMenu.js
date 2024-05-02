import PropTypes from 'prop-types';
import React from "react";
import { withTranslation } from "react-i18next";
import { Menu, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, BulbOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import { SubjectDetailEllipsis } from './SubjectDetailEllipsis';

const SubjectDetailMenu = props => {

    const CustomMenuHeader = () => {
        return (
            <div className="subject-menu-header">
                123456
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

    const CustomMenuItem = ({item}) => {      
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

    const onClick = (e) => {
        const parentKey = findParentKey(e.key, items);
        if (parentKey) {
            const newOpenKeys = props.openKeys.includes(parentKey) ? [] : [parentKey];
            props.setOpenKeys(newOpenKeys);
            const parentItem = items.find(item => item.key === parentKey);
            const pageId = parentItem.children.find(child => child.key === e.key).id;
            console.log("pageId: ", pageId);
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
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
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