import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
} from "reactstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ElementList from './elementList.js';
import './formBuilder.css';
import { useDispatch, useSelector } from "react-redux";
import { startloading, endloading } from '../../../../store/loader/actions';
import { API_BASE_URL } from '../../../../constants/endpoints';

const FormBuilder = props => {
    const userInformation = useSelector(state => state.rootReducer.Login);
    const { moduleId } = useParams();
    const [moduleElementList, setModuleElementList] = useState([]);
    const [moduleName, setModuleName] = useState('');
    const dispatch = useDispatch();

    const fetchData = () => {
        fetch(API_BASE_URL + 'Module/GetModuleElementsWithChildren?id=' + moduleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setModuleElementList(data);
            })
            .catch(error => {
                //console.error('Error:', error);
            });

        fetch(API_BASE_URL + 'Module/GetModule?id=' + moduleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setModuleName(data.name);
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    }


    useEffect(() => {
        dispatch(startloading());
        fetchData();
        dispatch(endloading());
    },[]);

    return (
        <div style={({ height: "100vh" }, { display: "flex" })} >
            <div className="page-content" style={{ width:"100%"} }>
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={12}>
                                <h6 className="page-title">{moduleName}</h6>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <ElementList TenantId={userInformation.TenantId} StudyId={0} ModuleId={moduleId} ModuleElementList={moduleElementList} ShowElementList={true} IsDisable={true} FormType={1} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(FormBuilder);

