import PropTypes from 'prop-types';
import React from "react";
import { withTranslation } from "react-i18next";
import { Drawer } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LockOutlined, BulbOutlined } from '@ant-design/icons';
import { SubjectDetailEllipsis } from './SubjectDetailEllipsis';

const SubjectDetailDrawer = props => {
    return (
        <Drawer
            className="subject-mobil-drawer"
            title={
                <React.Fragment>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon="fa-regular fa-user" />
                        <span style={{ padding: '0 10px' }}>
                            123456
                        </span>
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
                        ]}
                            />
                    </div>
                </React.Fragment>
            }
            placement="left"
            width={500}
            onClose={props.onClose}
            open={props.openMobileMenu}
        >
            {props.content}
        </Drawer>
    )
}

SubjectDetailDrawer.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectDetailDrawer);