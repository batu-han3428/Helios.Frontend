import PropTypes from 'prop-types';
import React from "react";
import { withTranslation } from "react-i18next";
import { Menu } from 'antd';
import { AppstoreOutlined, UserOutlined, LockOutlined, BulbOutlined } from '@ant-design/icons';
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

    const CustomMenuItem = () => {      
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Custom Menu Item
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
    };

    const items = [
        {
            type: 'divider',
        },
        {
            key: 'sub1',
            label: <CustomMenuItem />,
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: '1',
                    label: 'Option 1',
                },
                {
                    key: '2',
                    label: 'Option 2',
                },
            ],
        },
        {
            key: 'sub2',
            label: <CustomMenuItem />,
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: '3',
                    label: 'Option 1',
                },
                {
                    key: '4',
                    label: 'Option 2',
                },
            ],
        },
        {
            key: 'sub28',
            label: <CustomMenuItem />,
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: '38',
                    label: 'Option 1',
                },
                {
                    key: '48',
                    label: 'Option 2',
                },
            ],
        },
        {
            key: 'sub27',
            label: <CustomMenuItem />,
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: '37',
                    label: 'Option 1',
                },
                {
                    key: '47',
                    label: 'Option 2',
                },
            ],
        },
        {
            key: 'sub26',
            label: <CustomMenuItem />,
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: '36',
                    label: 'Option 1',
                },
                {
                    key: '46',
                    label: 'Option 2',
                },
            ],
        },
        {
            key: 'sub25',
            label: <CustomMenuItem />,
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: '35',
                    label: 'Option 1',
                },
                {
                    key: '45',
                    label: 'Option 2',
                },
            ],
        },
        {
            key: 'sub24',
            label: <CustomMenuItem />,
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: '34',
                    label: 'Option 1',
                },
                {
                    key: '44',
                    label: 'Option 2',
                },
            ],
        },
    ];

    if (!props.isMobil) {
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