import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
} from "reactstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ElementList from '../../Module/FormBuilder/elementList.js';
import '../../Module/FormBuilder/formBuilder.css';
import { useDispatch, useSelector } from "react-redux";
import { startloading, endloading } from '../../../../store/loader/actions.js';
import { decodeToken } from "../../../../helpers/Util/tokenUtil";
import { getLocalStorage, removeLocalStorage } from '../../../../helpers/local-storage/localStorageProcess.js';
import { API_BASE_URL } from '../../../../constants/endpoints';

const VisitFormBuilder = props => {
    let token = getLocalStorage("accessToken");
    var auth = decodeToken(token);
    const userInformation = useSelector(state => state.rootReducer.Login);
    const { studyVisitPageModuleId } = useParams();
    const [moduleElementList, setModuleElementList] = useState([]);
    const [studyPageModuleName, setStudyPageModuleName] = useState('');
    const dispatch = useDispatch();

    const fetchData = () => {
        fetch(API_BASE_URL + 'Study/GetStudyModuleElementsWithChildren?studyVisitPageModuleId=' + studyVisitPageModuleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setModuleElementList(data);
            })
            .catch(error => {
                //console.error('Error:', error);
            });
        
        fetch(API_BASE_URL + 'Study/GetStudyPageModule?id=' + studyVisitPageModuleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setStudyPageModuleName(data.name);
            })
            .catch(error => {
            });
    }


    useEffect(() => {
        dispatch(startloading());
        fetchData();
        dispatch(endloading());
    },[]);

    return (
        <div style={({ height: "100vh" }, { display: "flex" })} >
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={8}>
                                <h6 className="page-title">{studyPageModuleName}</h6>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <ElementList TenantId={userInformation.TenantId} ModuleId={studyVisitPageModuleId} StudyId={auth.studyId} ModuleElementList={moduleElementList} ShowElementList={true} IsDisable={true} FormType={2} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(VisitFormBuilder);

