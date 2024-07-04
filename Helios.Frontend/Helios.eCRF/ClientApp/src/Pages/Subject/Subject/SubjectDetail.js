import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col, Button } from 'antd';
import { MenuOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import SubjectDetailMenu from './Comp/SubjectDetailMenu';
import './Subject.css';
import SubjectDetailDrawer from './Comp/SubjectDetailDrawer';
import { useParams } from "react-router-dom";
import { useLazyGetSubjectDetailMenuQuery, useGetSubjectElementListQuery } from '../../../store/services/Subject';
import { endloading, startloading } from '../../../store/loader/actions';
import { useDispatch } from "react-redux";
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import SubjectDetailElementList from './SubjectDetailElementList.js';
import Footer from '../../../components/HorizontalLayout/Footer';
import { useNavigate } from "react-router-dom";

const SubjectDetail = props => {

    const navigate = useNavigate();
    const { studyId, pageId, subjectId } = useParams();

    const dispatch = useDispatch();
    const toastRef = useRef();

    const [selectedKeys, setSelectedKeys] = useState(['1-1']);
    const [openKeys, setOpenKeys] = useState([]);
    const [openSubMenuKeys, setOpenSubMenuKeys] = useState(['sub1']);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [leftMenuData, setLeftMenuData] = useState([]);
    const [subjectElementList, setSubjectElementList] = useState([]);   
  
    const [trigger, { data: menuData, error, isLoading }] = useLazyGetSubjectDetailMenuQuery();
    const { data: elementList, error1, isLoading1 } = useGetSubjectElementListQuery({ subjectId: subjectId, pageId: pageId });

    const [currentPage, setCurrentPage] = useState(pageId); 

    const goToNextPage = () => {     
        const nextPage = Number(pageId) + 1;
        setCurrentPage(nextPage);
        navigate(`/subject-detail/${studyId}/${nextPage}/${subjectId}`);
       
    };

    const goToPreviousPage = () => {     
        if (currentPage > 1) {
            const nextPage = Number(pageId) - 1;
            setCurrentPage(nextPage);
            navigate(`/subject-detail/${studyId}/${nextPage}/${subjectId}`);
        }       
    };


    useEffect(() => {
        if (studyId && subjectId) {
            dispatch(startloading());
            trigger({ studyId: studyId, subjectId: subjectId });
        }
    }, [studyId, subjectId]);

    useEffect(() => {
        if (!error1 && !isLoading1 && elementList) {
            setSubjectElementList(elementList);
            dispatch(endloading());
        }
    }, [elementList, error1, isLoading1]);

    const findPageIdInChildren = (data, pageId) => {
        for (const item of data) {
            if (item.children) {
                const index = item.children.findIndex(child => child.id === pageId);
                if (index !== -1) {
                    return {
                        parentIndex: data.findIndex(parent => parent.id === item.id),
                        childIndex: index,
                        isFirstChild: index === 0,
                        isLastChild: index === item.children.length - 1,
                        childrenCount: item.children.length,
                    };
                } else {
                    const result = findPageIdInChildren(item.children, pageId);
                    if (result) {
                        return {
                            parentIndex: data.findIndex(parent => parent.id === item.id),
                            ...result,
                        };
                    }
                }
            }
        }

        return null;
    };

    const [isPrevButton, setIsPrevButton] = useState(true);
    const [isNextButton, setIsNextButton] = useState(true);

    const setPrevNextButton = (data, id) => {
        const result = findPageIdInChildren(data, parseInt(id, 10));
        if (result.childrenCount <= 2) {
            setIsPrevButton(false);
            setIsNextButton(false);
        } else if (result.isFirstChild) {
            setIsPrevButton(false);
            setIsNextButton(true);
        } else if (result.isLastChild) {
            setIsPrevButton(true);
            setIsNextButton(false);
        } else {
            setIsPrevButton(true);
            setIsNextButton(true);
        }
    };

    useEffect(() => {
        if (menuData && !error && !isLoading) {
            dispatch(endloading());
            setLeftMenuData(menuData);
            setPrevNextButton(menuData, pageId);
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
            <div className="page-content" style={{ paddingBottom: '100px', paddingLeft: 0 }}>
                <div className="container-fluid" style={{ paddingLeft: 0 }}>
                    <Row gutter={16}>
                        <Col xs={0} sm={0} md={6} lg={6} xl={5}>
                            <SubjectDetailMenu setPrevNextButton={setPrevNextButton} pageId={pageId} data={leftMenuData} openSubMenuKeys={openSubMenuKeys} setOpenSubMenuKeys={setOpenSubMenuKeys} openKeys={openKeys} setOpenKeys={setOpenKeys} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} isMobil={false} studyId={studyId} subjectId={subjectId} />
                        </Col>
                        <Col xs={1} sm={1} md={0} lg={0} xl={0}>
                            <Button style={{ position: "fixed", top: "80px", left: "10px", zIndex: "1000" }} onClick={showDrawer} shape="circle" icon={<MenuOutlined />} />
                            <SubjectDetailDrawer onClose={onClose} openMobileMenu={openMobileMenu} content={<SubjectDetailMenu data={leftMenuData} openSubMenuKeys={openSubMenuKeys} setOpenSubMenuKeys={setOpenSubMenuKeys} openKeys={openKeys} setOpenKeys={setOpenKeys} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} isMobil={true} studyId={studyId} subjectId={subjectId} />} />
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
            <footer style={{ position: 'fixed', bottom: 0, right: 0, width: '81%', background: '#f1f1f1', padding: '10px', textAlign: 'right' }}>
                <div style={{ textAlign: 'right', display: 'flex',alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div style={{ display: isPrevButton ? 'inline-block' : 'none', marginRight: '10px' }}>
                        <Button className="btn btn-outline-dark waves-effect waves-light" onClick={goToPreviousPage} icon={<LeftOutlined />}>{props.t("Previous page")}</Button>
                    </div>
                    <div style={{ display: isNextButton ? 'inline-block' : 'none' }}>
                        <Button className="btn btn-outline-dark waves-effect waves-light" onClick={goToNextPage}>{props.t("Next page")}<RightOutlined /></Button>
                    </div>
                </div>
            </footer>
            <ToastComp ref={toastRef} />
        </React.Fragment>
    )
}

SubjectDetail.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectDetail);