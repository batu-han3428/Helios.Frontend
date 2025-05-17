import { Dropdown, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SubjectDetailEllipsis = ({ items = [] }) => {
    return (
        <div style={{ marginLeft: 'auto' }}>
            <Dropdown
                menu={{ items: items }}
                trigger={['click']}
                overlayStyle={{ zIndex: '9999 !important' }} 
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