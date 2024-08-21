import PropTypes from 'prop-types';
import { Alert } from "reactstrap";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col, Button, Progress, Tag, Tooltip } from 'antd';
import { MenuOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import SubjectDetailMenu from './Comp/SubjectDetailMenu';
import './Subject.css';
import SubjectDetailDrawer from './Comp/SubjectDetailDrawer';
import { useParams } from "react-router-dom";
import { useLazyGetSubjectDetailMenuQuery, useGetSubjectElementListQuery, useLazyGetUserPermissionsQuery } from '../../../store/services/Subject';
import { endloading, startloading } from '../../../store/loader/actions';
import { useDispatch } from "react-redux";
import SubjectDetailElementList from './SubjectDetailElementList.js';
import { useNavigate } from "react-router-dom";
import { showToast } from '../../../store/toast/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SubjectDetail = props => {

    const navigate = useNavigate();
    const { studyId, pageId, subjectId, subjectNumber } = useParams();

    const dispatch = useDispatch();

    const [selectedKeys, setSelectedKeys] = useState(['1-1']);
    const [openKeys, setOpenKeys] = useState([]);
    const [openSubMenuKeys, setOpenSubMenuKeys] = useState(['sub1']);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [leftMenuData, setLeftMenuData] = useState([]);
    const [subjectElementList, setSubjectElementList] = useState([]);
    const [sdvInformation, setSdvInformation] = useState({});

    const [trigger, { data: menuData, error, isLoading }] = useLazyGetSubjectDetailMenuQuery();
    const { data: elementList, error1, isLoading1 } = useGetSubjectElementListQuery({ subjectId: subjectId, pageId: pageId });

    const [currentPage, setCurrentPage] = useState(pageId);

    const [permissions, setPermissions] = useState([]);
    const [triggerPermission, { data: permissionsData, errorPerm, isLoadingPerm }] = useLazyGetUserPermissionsQuery();

    useEffect(() => {
        if (studyId) {
            triggerPermission(studyId);
        }
    }, [studyId])
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!errorPerm && !isLoadingPerm && permissionsData) {
            setPermissions(permissionsData);
            setIsLoaded(true);
        }
    }, [permissionsData, errorPerm, isLoadingPerm]);

    const goToNextPage = () => {
        const nextPage = Number(pageId) + 1;
        setCurrentPage(nextPage);
        navigate(`/subject-detail/${studyId}/${nextPage}/${subjectId}/${subjectNumber}`);

    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const nextPage = Number(pageId) - 1;
            setCurrentPage(nextPage);
            navigate(`/subject-detail/${studyId}/${nextPage}/${subjectId}/${subjectNumber}`);
        }
    };
    
    function filterElements(elements) {
        return elements.reduce((acc, item) => {
            if (![1, 17, 14, 15, 16, 3, 7].includes(item.elementType) && item.userValue !== "" && item.userValue !== null) {
                acc.push(item);
            }
            if (item.childElements && item.childElements.length > 0) {
                let sortedChildren;
                if (item.elementType === 15) {
                    sortedChildren = [...item.childElements].sort((a, b) => {
                        if (a.rowIndex !== b.rowIndex) {
                            return a.rowIndex - b.rowIndex;
                        }
                        return a.columnIndex - b.columnIndex;
                    });
                } else if (item.elementType === 16) {
                    sortedChildren = [...item.childElements].sort((a, b) => {
                        if (a.dataGridRowId !== b.dataGridRowId) {
                            return a.dataGridRowId - b.dataGridRowId;
                        }
                        return a.columnIndex - b.columnIndex;
                    });
                } else {
                    sortedChildren = item.childElements;
                }
                const filteredChildren = filterElements(sortedChildren);
                acc = acc.concat(filteredChildren);
            }
            return acc;
        }, []);
    }

    const sdvCalculate = (data) => {
        const filteredList = filterElements(data);
        const sdvTrueCount = filteredList.filter(item => item.sdv === true).length;
        const sdvFalseFirstItem = filteredList.find(item => item.sdv === false);
        const totalCount = filteredList.length;
        const percentage = totalCount > 0 ? (sdvTrueCount / totalCount) * 100 : 0;
        const upPercentage = percentage % 1 === 0 ? percentage : percentage.toFixed(2);
        setSdvInformation({ percent: upPercentage, inf: `${sdvTrueCount}/${totalCount}`, item: sdvFalseFirstItem ? sdvFalseFirstItem.subjectVisitPageModuleElementId : null, style: false })
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
            if (elementList.length > 0) sdvCalculate(elementList);
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
        if (result === null) return;
        else if (result.childrenCount <= 2) {
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
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
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
                    <Row gutter={16} >
                        <Col xs={0} sm={0} md={6} lg={6} xl={5}>
                            <SubjectDetailMenu subjectNumber={subjectNumber} setPrevNextButton={setPrevNextButton} pageId={pageId} data={leftMenuData} openSubMenuKeys={openSubMenuKeys} setOpenSubMenuKeys={setOpenSubMenuKeys} openKeys={openKeys} setOpenKeys={setOpenKeys} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} isMobil={false} studyId={studyId} subjectId={subjectId} />
                        </Col>
                        <Col xs={1} sm={1} md={0} lg={0} xl={0}>
                            <Button style={{ position: "fixed", top: "80px", left: "10px", zIndex: "1000" }} onClick={showDrawer} shape="circle" icon={<MenuOutlined />} />
                            <SubjectDetailDrawer onClose={onClose} openMobileMenu={openMobileMenu} content={<SubjectDetailMenu data={leftMenuData} openSubMenuKeys={openSubMenuKeys} setOpenSubMenuKeys={setOpenSubMenuKeys} openKeys={openKeys} setOpenKeys={setOpenKeys} selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} isMobil={true} studyId={studyId} subjectId={subjectId} />} />
                        </Col>
                        <Col xs={24} sm={24} md={18} lg={18} xl={19} >
                            <div id="myDiv" style={{ minHeight: "calc(100vh - 70px)", paddingBottom: "100px", paddingLeft: '50px' }}>
                                {!isLoading1 && !error1 && isLoaded && elementList && subjectElementList.length < 1 ?
                                    (
                                         <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 'calc(100vh - 170px)'
                                        }}>
                                            <Alert color="warning" style={{ height: "50px" }}>
                                                {props.t("There is no module on the page. Please contact the system administrator.")}
                                            </Alert>
                                        </div>
                                    )
                                    :
                                    (
                                        <>
                                            {(permissions.canMonitoringSdv && sdvInformation.percent !== 100) &&
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 10px', position: 'sticky', top: 70, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', zIndex: 999 }}>
                                                    <Tag color="#87d068">{sdvInformation.inf}</Tag>
                                                    <Progress
                                                        percent={sdvInformation.percent}
                                                        status="active"
                                                        strokeColor={{
                                                            from: '#87D068',
                                                            to: '#87d068',
                                                        }}
                                                        size="small"
                                                        style={{width:'80%'}}
                                                    />                                              
                                                    <Tooltip title={props.t('Go to missing SDV')}>
                                                        <Button
                                                            type="primary"
                                                            shape="circle"
                                                            size="small"
                                                            icon={<FontAwesomeIcon icon="fa-solid fa-arrow-right" />}
                                                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                                            onClick={() => {
                                                                setSdvInformation(prevState => ({
                                                                    ...prevState,
                                                                    style: true
                                                                })); }}
                                                            />
                                                    </Tooltip>
                                                </div>
                                            }
                                            <SubjectDetailElementList
                                                IsDisable={!permissions.canSubjectEdit}
                                                StudyId={studyId}
                                                ElementList={subjectElementList}
                                                IsMissingData={permissions.canMonitoringMarkAsNull}
                                                IsSdv={permissions.canMonitoringSdv}
                                                SdvInformation={sdvInformation}
                                            />
                                        </>
                                    )
                                }

                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <footer style={{ position: 'fixed', bottom: 0, right: 0, width: '100%', background: '#f1f1f1', padding: '10px', textAlign: 'right' }}>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div style={{ display: isPrevButton ? 'inline-block' : 'none', marginRight: '10px' }}>
                        <Button className="btn btn-outline-dark waves-effect waves-light" onClick={goToPreviousPage} icon={<LeftOutlined />}>{props.t("Previous page")}</Button>
                    </div>
                    <div style={{ display: isNextButton ? 'inline-block' : 'none' }}>
                        <Button className="btn btn-outline-dark waves-effect waves-light" onClick={goToNextPage}>{props.t("Next page")}<RightOutlined /></Button>
                    </div>
                </div>
            </footer>
        </React.Fragment>
    )
}

SubjectDetail.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectDetail);