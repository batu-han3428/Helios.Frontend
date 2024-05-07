import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import SubjectDetailMenu from './Comp/SubjectDetailMenu';
import './Subject.css';
import SubjectDetailDrawer from './Comp/SubjectDetailDrawer';
import { useParams } from "react-router-dom";
import { useLazyGetSubjectDetailMenuQuery, useGetSubjectElementListQuery } from '../../../store/services/Subject';
import { endloading, startloading } from '../../../store/loader/actions';
import { useDispatch } from "react-redux";
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import SubjectDetailElementList from './SubjectDetailElementList.js';

const SubjectDetail = props => {

    const { subjectId, pageId } = useParams();

    const dispatch = useDispatch();

    const toastRef = useRef();

    const [selectedKeys, setSelectedKeys] = useState(['1-1']);
    const [openKeys, setOpenKeys] = useState([]);
    const [openSubMenuKeys, setOpenSubMenuKeys] = useState(['sub1']);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [leftMenuData, setLeftMenuData] = useState([]);
    const [subjectElementList, setSubjectElementList] = useState([]);

    const [trigger, { data: menuData, error, isLoading }] = useLazyGetSubjectDetailMenuQuery();
    const { data: elementList, error1, isLoading1 } = useGetSubjectElementListQuery({ subjectId: 4, pageId: 3 });

    useEffect(() => {
        if (subjectId) {
            dispatch(startloading());
            trigger(subjectId);
        }
    }, [subjectId]);

    useEffect(() => {
        if (!error1 && !isLoading1 && elementList) {
            setSubjectElementList(elementList);
            dispatch(endloading());
        }
    }, [elementList, error1, isLoading1]);

    useEffect(() => {
        if (menuData && !error && !isLoading) {
            dispatch(endloading());
            setLeftMenuData(menuData);
        }
        else if (!isLoading && error) {
            toastRef.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }, [menuData, error, isLoading]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setOpenMobileMenu(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const showDrawer = () => {
        setOpenMobileMenu(true);
    };

    const onClose = () => {
        setOpenMobileMenu(false);
    };

    return (
        <React.Fragment>
            <div className="page-content" style={{ paddingBottom: 0, paddingLeft: 0 }}>
                <div className="container-fluid" style={{ paddingLeft: 0 }}>
                    <Row gutter={16}>
                        <Col xs={0} sm={0} md={6} lg={6} xl={5}>
                            <SubjectDetailMenu data={leftMenuData} openSubMenuKeys={openSubMenuKeys} setOpenSubMenuKeys={setOpenSubMenuKeys} openKeys={openKeys} setOpenKeys={setOpenKeys} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} isMobil={false} />
                        </Col>
                        <Col xs={1} sm={1} md={0} lg={0} xl={0}>
                            <Button style={{ position: "fixed", top: "80px", left: "10px", zIndex: "1000" }} onClick={showDrawer} shape="circle" icon={<MenuOutlined />} />
                            <SubjectDetailDrawer onClose={onClose} openMobileMenu={openMobileMenu} content={<SubjectDetailMenu data={leftMenuData} openSubMenuKeys={openSubMenuKeys} setOpenSubMenuKeys={setOpenSubMenuKeys} openKeys={openKeys} setOpenKeys={setOpenKeys} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} isMobil={true} />} />
                        </Col>
                        <Col xs={24} sm={24} md={18} lg={18} xl={19}>
                            <div>
                                <SubjectDetailElementList
                                    IsDisable={false}
                                    ElementList={subjectElementList}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <ToastComp ref={toastRef} />
        </React.Fragment>
    )
}

SubjectDetail.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectDetail);