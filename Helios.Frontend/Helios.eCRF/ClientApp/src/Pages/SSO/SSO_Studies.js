﻿import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col, CardHeader, Alert, Card, CardBody } from "reactstrap";
import "./sso.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLazyStudiesListGetQuery } from '../../store/services/SSO/SSO_Api';
import { useSelector, useDispatch } from 'react-redux';
import { startloading, endloading } from '../../store/loader/actions';
import { API_BASE_URL } from "../../constants/endpoints";
import { addStudy, loginuser } from "../../store/actions";
import { SearchOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { setLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { onLogin } from '../../helpers/Auth/useAuth';

const SSO_Studies = props => {

    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { tenantId } = useParams();

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("1");

    const [triggerStudies, { data: studiesData, isLoading: isLoadingStudies, isError: isErrorStudies } ] = useLazyStudiesListGetQuery();

    useEffect(() => {
        if (userInformation.userId && tenantId) {
            triggerStudies({ tenantId: tenantId, userId: userInformation.userId });
        }
    }, [userInformation.userId, tenantId])

    useEffect(() => {
        dispatch(startloading());
        if (studiesData && !isLoadingStudies && !isErrorStudies) {
            setData(studiesData);
            dispatch(endloading());
        } else if (isErrorStudies && !isLoadingStudies) {
            dispatch(endloading());
        }
    }, [studiesData, isErrorStudies, isLoadingStudies]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const searchFilter = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleDropdownChange = (event) => {
        const selectedValue = event.target.id;
        setSelectedOption(selectedValue);
        setIsDropdownOpen(false);
    };

    const filteredData = data.filter((item) => {
        const isStatusMatched = selectedOption ? item.statu === selectedOption : true;
        const isStudyNameMatched = item.studyName && item.studyName.toLowerCase().includes(searchTerm);
        const isUserRoleNameMatched = item.userRoleName && item.userRoleName.toLowerCase().includes(searchTerm);

        return isStatusMatched && (isStudyNameMatched || isUserRoleNameMatched);
    });
    const getStudy = async (result) => {
        const apiUrl = API_BASE_URL + `Study/GetStudy/${result.studyId}`;
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${result.token}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                dispatch(addStudy(data));
            })
            .catch(error => {
             
            });
    };
    const updateJwt = (token, studyId) => {
        const apiUrl = API_BASE_URL + `Account/UpdateJwt`;
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ studyId: studyId })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setLocalStorage("accessToken", data.values.accessToken);
                const result = onLogin();
                dispatch(loginuser(result));
                if (studyId !== 0) getStudy({ token: data.values.accessToken, studyId: studyId });
            })
            .catch(error => {
            });
    };
    const goToStudy = (studyId) => {
        updateJwt(userInformation.token, studyId);
        navigate(`/subjectlist/${studyId}`);
    }
    const columns = [
        {
            title: props.t('Study name'),
            dataIndex: 'studyName',
            sorter: (a, b) => a.studyName.localeCompare(b.studyName),
            sortDirections: ['ascend', 'descend'],
            onFilter: (value, record) => String(record.studyName).toLowerCase().includes(value.toLowerCase()),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('User role name'),
            dataIndex: 'userRoleName',
            sorter: (a, b) => a.userRoleName.localeCompare(b.userRoleName),
            sortDirections: ['ascend', 'descend'],
            onFilter: (value, record) => String(record.userRoleName).toLowerCase().includes(value.toLowerCase()),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: props.t('Actions'),
            dataIndex: 'actions',
            width: "170px",
            render: (text, record) => {
                return (
                    <div className="icon-container">
                        <div className="icon icon-demo" onClick={() => goToStudy(record.studyId)}></div>
                    </div>
                );
            }
        },
    ]
    return (
        <div className="page-content">
            <div className="container-fluid">
                <Row style={{ marginTop: "10px" }}>
                    <Col className="col-12">
                        <Card>
                            <CardHeader style={{ background: "#FFFFFF", borderBottom:"1px solid #e7eaec", margin:"0 30px"} }>
                                <div className="ibox-title" style={{ display: "flex", justifyContent: "space-between" }} >
                                    <h5 style={{ margin: "10px 7px", color: "#6D6E70", fontFamily: "arial, sans-serif", fontSize: "15px" }}>{props.t("Please select the study you want to login") }</h5>
                                    <div style={{marginRight:"70px"}}>
                                        <form noValidate="novalidate" onSubmit={(event) => event.preventDefault()} className="searchbox">
                                            <div role="search" className="searchbox__wrapper">
                                                <input id="search-input" value={searchTerm} onChange={searchFilter} type="search" name="search" placeholder={ props.t("Search") } autoComplete="off" required="required" className="searchbox__input"/>
                                                <button type="submit" title="Submit your search query." className="searchbox__submit">
                                                    <svg role="img" aria-label="Search">
                                                        <use  xlinkHref="#sbx-icon-search-13"></use>
                                                    </svg>
                                                </button>
                                                <button type="reset" onClick={() => setSearchTerm('')} title="Clear the search query." className="searchbox__reset searchbox-hide">
                                                    <svg role="img" aria-label="Reset">
                                                        <use xlinkHref="#sbx-icon-clear-3"></use>
                                                    </svg>
                                                </button>
                                            </div>
                                        </form>
                                        <div className="svg-icons" style={{ height: "0", width: "0", position: "absolute", visibility: "hidden" }} >
                                            <svg xmlns="http://www.w3.org/2000/svg">
                                                <symbol id="sbx-icon-clear-3" viewBox="0 0 40 40"><path d="M16.228 20L1.886 5.657 0 3.772 3.772 0l1.885 1.886L20 16.228 34.343 1.886 36.228 0 40 3.772l-1.886 1.885L23.772 20l14.342 14.343L40 36.228 36.228 40l-1.885-1.886L20 23.772 5.657 38.114 3.772 40 0 36.228l1.886-1.885L16.228 20z" fillRule="evenodd"></path></symbol>
                                                <symbol id="sbx-icon-search-13" viewBox="0 0 40 40"><path d="M26.806 29.012a16.312 16.312 0 0 1-10.427 3.746C7.332 32.758 0 25.425 0 16.378 0 7.334 7.333 0 16.38 0c9.045 0 16.378 7.333 16.378 16.38 0 3.96-1.406 7.593-3.746 10.426L39.547 37.34c.607.608.61 1.59-.004 2.203a1.56 1.56 0 0 1-2.202.004L26.807 29.012zm-10.427.627c7.322 0 13.26-5.938 13.26-13.26 0-7.324-5.938-13.26-13.26-13.26-7.324 0-13.26 5.936-13.26 13.26 0 7.322 5.936 13.26 13.26 13.26z" fillRule="evenodd"></path></symbol>
                                            </svg>
                                        </div>
                                        <div className="dropdown">
                                            <button onClick={toggleDropdown} className="btn sso-dropdown-button" ><i className="fa fa-filter" aria-hidden="true"></i></button>
                                            {isDropdownOpen && (
                                                <div id="myDropdown" className="dropdown-content">
                                                    <a onClick={handleDropdownChange} id="2">{props.t("Live studies")} {selectedOption === "2" && <FontAwesomeIcon style={{marginLeft: "5px"}} icon="fa-solid fa-check" />}</a>
                                                    <a onClick={handleDropdownChange} id="1">{props.t("Demo studies")} {selectedOption === "1" && <FontAwesomeIcon style={{ marginLeft: "5px" }} icon="fa-solid fa-check" />}</a>
                                                    <a onClick={handleDropdownChange} id="3">{props.t("Locked studies")} {selectedOption === "3" && <FontAwesomeIcon style={{ marginLeft: "5px" }} icon="fa-solid fa-check" />}</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div style={{ flexWrap: "wrap", justifyContent: "center" }}>
                                    {!isLoadingStudies && !isErrorStudies && filteredData.length === 0 ? (
                                        <Alert color="warning" style={{ height: "50px" }}>
                                            {props.t("You do not have an active study, if you think there is an error, please contact the system administrator.")} <Link to="/ContactUs"> {props.t("Contact us")}</Link>
                                        </Alert>
                                    ) : (
                                            <Table
                                                columns={columns}
                                                dataSource={filteredData.map(item => ({ ...item, key: uuidv4() }))}
                                                pagination={true}
                                                scroll={{ x: 'max-content' }}
                                                onRow={(record, rowIndex) => {
                                                    return {
                                                        onClick: () => {
                                                            goToStudy(record.studyId)
                                                        }
                                                    }
                                                }}
                                            />
                                      )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};


SSO_Studies.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SSO_Studies);