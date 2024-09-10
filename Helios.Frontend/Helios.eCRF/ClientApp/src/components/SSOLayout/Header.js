import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { Form, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Input, Button } from "reactstrap";
import { Link, useLocation, useParams } from "react-router-dom";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

import logoheliosImg from "../../assets/images/helios-logo.png";
import logoheliossmImg from "../../assets/images/helios-sm-logo.png";
import { useUserPermissionsListGetQuery } from '../../store/services/Permissions';
import { useStudyGetQuery } from '../../store/services/Study';
import { useSelector } from "react-redux";
//i18n
import { withTranslation } from "react-i18next";

// Redux Store
import {
    showRightSidebarAction,
    toggleLeftmenu,
    changeSidebarType,
} from "../../store/actions";

const Header = props => { 

    const location = useLocation();
    const { studyId } = useParams();
    
    const [search, setsearch] = useState(false);
    const [singlebtn, setSinglebtn] = useState(false);

    const studyInformation = useSelector(state => state.rootReducer.Study);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const [newstudyId, setNewStudyId] = useState(0);

    useEffect(() => {
        setNewStudyId((studyInformation.studyId !== undefined && studyInformation.studyId !== "") ? studyInformation.studyId : studyId !== undefined ? studyId : 0);
    }, [studyInformation.studyId, studyId]);

    
    const { data: permissionData, isLoading, isError, refetch } = useUserPermissionsListGetQuery(newstudyId, { refetchOnMountOrArgChange: true });
    useEffect(() => {
        refetch();
    }, [refetch]);

    const initialLink = localStorage.getItem('clickedLink') || '';

    const [clickedLinks, setClickedLinks] = useState({
        query: initialLink === 'query',
        subject: initialLink === 'subject' || initialLink === '',
        sdv: initialLink === 'sdv',
        studyDocuments: initialLink === 'studyDocuments',
        medicalCoding: initialLink === 'medicalCoding',
        iwrs: initialLink === 'iwrs'
    });
    const handleClick = (linkName) => {
        const resetLinks = {
            query: false,
            subject: false,
            sdv: false,
            studyDocuments: false,
            medicalCoding: false,
            iwrs: false,
        };
        setClickedLinks({
            ...resetLinks,
            [linkName]: true,
        });
        localStorage.setItem('clickedLink', linkName);
    };
    const { data: studyData, isLoadingStudy, isErrorStudy } = useStudyGetQuery(newstudyId);

    function toggleFullscreen() {
        if (
            !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
            !document.webkitFullscreenElement
        ) {
            // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(
                    Element.ALLOW_KEYBOARD_INPUT
                );
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    function tToggle() {
        var body = document.body;
        if (window.screen.width <= 992) {
            body.classList.toggle("sidebar-enable");
        } else {
            body.classList.toggle("vertical-collpsed");
            body.classList.toggle("sidebar-enable");
        }
    }

    return (
        <React.Fragment>
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box">

                            <Link to="#" className="logo logo-dark">
                                <span className="logo-sm">
                                    <img src={logoheliossmImg} alt="" height="22" />
                                </span>
                                <span className="logo-lg">
                                    <img src={logoheliosImg} alt="" height="30" />
                                </span>
                            </Link>

                            <Link to="#" className="logo logo-light">
                                <span className="logo-sm">
                                    <img src={logoheliossmImg} alt="" height="22" />
                                </span>
                                <span className="logo-lg">
                                    <img src={logoheliosImg} alt="" height="30" />
                                </span>
                            </Link>
                        </div>
                        <div className="" style={{ marginTop: '30px' }}>
                            {!isLoading && !isError && permissionData && (
                                <>
                                    {permissionData.canSubjectView && (
                                        <Link to={`/subjectlist/${studyId !== undefined ? studyId : studyInformation.studyId}`} className="" onClick={() => handleClick('subject')} >
                                            <label style={{ color: "#757575", textDecoration: clickedLinks.subject ? 'underline' : 'none', backgroundColor: clickedLinks.subject ? 'white' : '', marginRight: '30px' }}>{props.t("Subject")}</label>
                                        </Link>
                                    )
                                    }
                                    {(permissionData.canMonitoringAnswerQuery || permissionData.canMonitoringOpenQuery) && (
                                        <Link to="/query" className="" onClick={() => handleClick('query')} >
                                            <label style={{ color: "#757575", textDecoration: clickedLinks.query ? 'underline' : 'none', backgroundColor: clickedLinks.query ? 'white' : '', marginRight: '30px' }}>{props.t("Query")}</label>
                                        </Link>
                                    )}
                                    {(permissionData.canMonitoringSdv || permissionData.canMonitoringVerification || permissionData.canMonitoringRemoteSdv) && (
                                        <Link to="/sdv" className="" onClick={() => handleClick('sdv')}>
                                            <label style={{ color: "#757575", textDecoration: clickedLinks.sdv ? 'underline' : 'none', backgroundColor: clickedLinks.sdv ? 'white' : '', marginRight: '30px' }}>{props.t("SDV")}</label>
                                        </Link>
                                    )}
                                    {permissionData.canStudyFoldersView && (
                                        <Link to="/studyDocuments" className="" onClick={() => handleClick('studyDocuments')}>
                                            <label style={{ color: "#757575", textDecoration: clickedLinks.studyDocuments ? 'underline' : 'none', backgroundColor: clickedLinks.studyDocuments ? 'white' : '', marginRight: '30px' }}>{props.t("Study documents")}</label>
                                        </Link>
                                    )}
                                    {permissionData.canMedicalCodingCanCode && (
                                        <Link to="/medicalCoding" className="" onClick={() => handleClick('medicalCoding')} >
                                            <label style={{ color: "#757575", textDecoration: clickedLinks.medicalCoding ? 'underline' : 'none', backgroundColor: clickedLinks.medicalCoding ? 'white' : '', marginRight: '30px' }}>{props.t("Medical coding")}</label>
                                        </Link>
                                    )}
                                    {(permissionData.canIwrsMarkAsRecieved || permissionData.canIwrsTransfer) && (
                                        <Link to="/iwrs" className="" onClick={() => handleClick('iwrs')} >
                                            <label style={{ color: "#757575", textDecoration: clickedLinks.iwrs ? 'underline' : 'none', backgroundColor: clickedLinks.iwrs ? 'white' : '', marginRight: '30px' }}>{props.t("IWRS")}</label>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="d-flex">

                        <Dropdown
                            className="d-inline-block d-lg-none ms-2"
                            onClick={() => {
                                setsearch(!search);
                            }}
                            type="button"
                        >
                            <DropdownToggle
                                className="btn header-item noti-icon waves-effect"
                                id="page-header-search-dropdown"
                                tag="button"
                            > <i className="mdi mdi-magnify"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                <Form className="p-3">
                                    <div className="form-group m-0">
                                        <div className="input-group">
                                            <Input type="text" className="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                                            <div className="input-group-append">
                                                <Button className="btn btn-primary" type="submit"><i className="mdi mdi-magnify"></i></Button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </DropdownMenu>
                        </Dropdown>
                        {!isLoadingStudy && !isErrorStudy && studyData &&
                            <LanguageDropdown studyData={studyData} />
                        }
                        <ProfileMenu />
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

Header.propTypes = {
    changeSidebarType: PropTypes.func,
    leftMenu: PropTypes.any,
    leftSideBarType: PropTypes.any,
    showRightSidebar: PropTypes.any,
    showRightSidebarAction: PropTypes.func,
    t: PropTypes.any,
    toggleLeftmenu: PropTypes.func,
    useUserPermissionsListGetQuery: PropTypes.func
};

const mapStatetoProps = state => {
    const {
        layoutType,
        showRightSidebar,
        leftMenu,
        leftSideBarType,
    } = state.rootReducer.Layout;
    return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
    showRightSidebarAction, useUserPermissionsListGetQuery,
    toggleLeftmenu,
    changeSidebarType,
})(withTranslation()(Header));
