import PropTypes from 'prop-types';
import React from "react";
import { withTranslation } from "react-i18next";
import { Menu, Row, Col, Dropdown, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppstoreOutlined, UserOutlined, LockOutlined, BulbOutlined } from '@ant-design/icons';
import './Subject.css';

const SubjectDetail = props => {

    const CustomMenuHeader = () => {
        const ellipsisItems = [
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
        ];
        return (
            <div className="subject-menu-header">
                123456
                <Dropdown
                    menu={{ items: ellipsisItems }}
                    trigger={['click']}
                >
                    <a onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                        <Space>
                            <FontAwesomeIcon style={{ cursor: "pointer" }} icon="fa-solid fa-ellipsis-vertical" />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        );
    }

    const CustomMenuItem = () => {
        const ellipsisItems = [
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
        ];
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                Custom Menu Item
                <Dropdown
                    menu={{ items: ellipsisItems }}
                    trigger={['click']}
                   
                >
                    <a onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                        <Space>
                            <FontAwesomeIcon style={{ cursor: "pointer" }} icon="fa-solid fa-ellipsis-vertical" />
                        </Space>
                    </a>
                </Dropdown>
            </div>
        );
    };

    const items = [
        {
            key: 'header',
            label: <CustomMenuHeader />,
            disabled: true, 
            icon: <UserOutlined />
        },
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
    ];

    const onClick = (e) => {
        console.log('click ', e);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Menu
                                onClick={onClick}
                                style={{
                                    width: '100%',
                                    marginBottom: '16px',
                                }}
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                                items={items}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={18} lg={18} xl={20}>
                            <div>elementler</div>
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    )
}

SubjectDetail.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectDetail);