import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Modal,
    Container,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Button,
} from "reactstrap";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ElementList from './elementList.js';
import './formBuilder.css';
import { useDispatch, useSelector } from "react-redux";
import { startloading, endloading } from '../../../../store/loader/actions';

const FormBuilder = props => {
    const userInformation = useSelector(state => state.rootReducer.Login);
    const { moduleId } = useParams();
    const [moduleElementList, setModuleElementList] = useState([]);
    const baseUrl = "https://localhost:7196";
    const dispatch = useDispatch();

    const fetchData = () => {
        fetch(baseUrl + '/Module/GetModuleElementsWithChildren?id=' + moduleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setModuleElementList(data);
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    }


    useEffect(() => {
        dispatch(startloading());
        fetchData();
        dispatch(endloading());
    });

    return (
        <div style={({ height: "100vh" }, { display: "flex" })} >
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t("Form builder")}</h6>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <ElementList TenantId={userInformation.TenantId} ModuleId={moduleId} ModuleElementList={moduleElementList} ShowElementList={true } />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withTranslation() (FormBuilder);

