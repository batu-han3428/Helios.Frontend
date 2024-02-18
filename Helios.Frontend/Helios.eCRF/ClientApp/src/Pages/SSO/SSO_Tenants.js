import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col, CardHeader, Card, CardBody, Alert } from "reactstrap";
import "./sso.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLazyTenantListGetQuery, useSsoLoginPostMutation } from '../../store/services/SSO/SSO_Api';
import { useSelector, useDispatch } from 'react-redux';
import { startloading, endloading } from '../../store/loader/actions';
import { useNavigate, Link, useParams } from "react-router-dom";
import { setLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { onLogin } from '../../helpers/Auth/useAuth';
import { loginuser } from '../../store/actions';
import ToastComp from '../../components/Common/ToastComp/ToastComp';


const SSO_Tenants = props => {

    const userInformation = useSelector(state => state.rootReducer.Login);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const toastRef = useRef();

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const searchFilter = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredData = data.filter((item) =>
        item.tenantName.toLowerCase().includes(searchTerm)
    );

    const [triggerTenants, { data: tenantsData, isLoadingTenants, isErrorTenants }] = useLazyTenantListGetQuery();


    const { role } = useParams();


    useEffect(() => {
        if (userInformation.userId && role) {
            triggerTenants({ userId: userInformation.userId, role: role });
        }
    }, [userInformation.userId, role])

    useEffect(() => {
        dispatch(startloading());
        if (tenantsData && !isLoadingTenants && !isErrorTenants) {
            setData(tenantsData);
            dispatch(endloading());
        } else if (isErrorTenants && !isLoadingTenants) {
            dispatch(endloading());
        }
    }, [tenantsData, isErrorTenants, isLoadingTenants]);

    const [ssoLoginPost] = useSsoLoginPostMutation();

    const goToStudies = async (tenantId) => {
        if (role === "3") {
            dispatch(startloading())
            const response = await ssoLoginPost({ tenantId: tenantId });

            if (response.data.isSuccess) {
                setLocalStorage("accessToken", response.data.values.accessToken);
                let result = onLogin();

                dispatch(endloading())
                if (result === false) {
                    toastRef.current.setToast({
                        message: props.t("An unexpected error occurred."),
                        stateToast: false
                    });
                } else {
                    dispatch(loginuser(result));
                    navigate("/");
                }
            } else {
                toastRef.current.setToast({
                    message: props.t("An unexpected error occurred."),
                    stateToast: false
                });
            }
           
        } else if (role === "4") {
            navigate(`/SSO-studies/${tenantId}`);
        }
    }

    return (
        <>
        <div className="page-content">
            <div className="container-fluid">
                <Row style={{ marginTop: "10px" }}>
                    <Col className="col-12">
                        <Card>
                            <CardHeader style={{ background: "#FFFFFF", borderBottom: "1px solid #e7eaec", margin: "0 30px" }}>
                                <div className="ibox-title" style={{ display: "flex", justifyContent: "space-between" }} >
                                    <h5 style={{ margin: "10px 7px", color: "#6D6E70", fontFamily: "arial, sans-serif", fontSize: "15px" }}>{props.t("Please select the tenant you want to login")}</h5>
                                    <div style={{ marginRight: "70px" }}>
                                        <form noValidate="novalidate" onSubmit={(event) => event.preventDefault()} className="searchbox">
                                            <div role="search" className="searchbox__wrapper">
                                                <input id="search-input" value={searchTerm} onChange={searchFilter} type="search" name="search" placeholder={props.t("Search")} autoComplete="off" required="required" className="searchbox__input" />
                                                <button type="submit" title="Submit your search query." className="searchbox__submit">
                                                    <svg role="img" aria-label="Search">
                                                        <use xlinkHref="#sbx-icon-search-13"></use>
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
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                                    {filteredData.length === 0 ? (
                                        <Alert color="warning" style={{ height: "50px" }}>
                                            {props.t("You do not have an active tenant, if you think there is an error, please contact the system administrator.")} <Link to="/ContactUs"> {props.t("Contact us")}</Link>
                                        </Alert>
                                    ) : (
                                    filteredData.map((item, index) => (
                                        <div key={index} className="col-lg-2" style={{ border: "1px solid rgb(231, 234, 236)", margin: "10px", padding: "0px" }} >
                                            <div className="ibox float-e-margins" style={{ marginBottom: "0" }}>
                                                <div className="ibox-content" style={{ padding: "0" }} >
                                                    <div>
                                                        <div style={{ width: "90%" }} >
                                                            {item.tenantName}
                                                        </div>
                                                        <div style={{ width: "10%" }} >
                                                            <FontAwesomeIcon onClick={() => goToStudies(item.id) } style={{ cursor: "pointer", color: "#868686" }} icon="fa-solid fa-caret-right" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )))}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
            </div>
        <ToastComp
            required={toastRef}
        />
        </>
    );
};


SSO_Tenants.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SSO_Tenants);