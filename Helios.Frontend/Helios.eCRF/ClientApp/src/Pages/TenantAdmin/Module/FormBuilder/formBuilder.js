import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ElementList from './elementList.js';
import './formBuilder.css';
import { useDispatch, useSelector } from "react-redux";
import { startloading, endloading } from '../../../../store/loader/actions.js';
import { API_BASE_URL } from '../../../../constants/endpoints.js';
import ModalComp from '../../../../components/Common/ModalComp/ModalComp.js';
import RankingList from './RankingList.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decodeToken } from "../../../../helpers/Util/tokenUtil";
import { getLocalStorage } from '../../../../helpers/local-storage/localStorageProcess.js';

const FormBuilder = props => {
    let token = getLocalStorage("accessToken");
    var auth = decodeToken(token);
    const userInformation = useSelector(state => state.rootReducer.Login);
    const { moduleId, isStudy } = useParams();
    const [moduleElementList, setModuleElementList] = useState([]);
    const [moduleName, setModuleName] = useState('');
    const dispatch = useDispatch();
    const modalRef = useRef();
    const [path, setPath] = useState([]);
    const [formType, setFormType] = useState(0);
    const [StudyId] = useState(isStudy === "true" ? auth.studyId : 0);

    const fetchData = () => {
        fetch(API_BASE_URL + path[0] + moduleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setModuleElementList(data);
            })
            .catch(error => {
                //console.error('Error:', error);
            });

        fetch(API_BASE_URL + path[1] + moduleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setModuleName(data.name);
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    };

    useEffect(() => {
        dispatch(startloading());
        if (moduleId && isStudy !== undefined) {
            if (isStudy === 'true') {
                setPath(["Study/GetStudyModuleElementsWithChildren?studyVisitPageModuleId=", "Study/GetStudyPageModule?id="]);
                setFormType(2);
            } else {
                setPath(["Module/GetModuleElementsWithChildren?id=", "Module/GetModule?id="]);
                setFormType(1);
            }
        } else {
            dispatch(endloading());
        }
    }, [moduleId, isStudy]);

    useEffect(() => {
        if (path.length > 0) {
            fetchData();
        }
        dispatch(endloading());
    }, [path]);

    const navigate = useNavigate();

    const navigateToPreview = (id) => {
        navigate(`/preview/${id}/${moduleName}/${isStudy}`);
    };

    const [modalTitle, setModalTitle] = useState("");
    const [modalButtonText, setModalButtonText] = useState("");
    const [modalContent, setModalContent] = useState(null);

    const openModal = (data) => {
        setModalTitle(data.title);
        setModalButtonText(data.buttonText);
        setModalContent(data.content);
        toggleModal();
    }

    const toggleModal = () => {
        modalRef.current.tog_backdrop();
    }
    const backPage = () => {
        if (isStudy === "true") {
            navigate(`/visits/${StudyId}`);
        }
        else {
            navigate(`/moduleList`);
        }
    };

    return (
        <>
            <div style={({ height: "100vh" }, { display: "flex" })} >
                <div className="page-content" style={{ width: "100%" }}>
                    <div className="container-fluid">
                        <div className="page-title-box">
                            <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom: '10px' }}>
                                <Col md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="page-title-box">
                                        <Row className="align-items-center" >
                                            <Col>
                                                <h6 className="page-title"><FontAwesomeIcon style={{ marginRight: "10px", cursor: "pointer", position: "relative", top: "0.5px" }} onClick={backPage} icon="fa-solid fa-left-long" />{moduleName}</h6>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div>
                                        <Button color="success" onClick={() => {
                                            openModal({
                                                title: props.t("Ranking"), buttonText: props.t("Save"), content: <RankingList fetchData={fetchData} toggleModal={toggleModal} moduleId={moduleId} refs={modalRef} isStudy={isStudy} />
                                            });
                                        }} style={{ marginRight: '8px' }}>
                                            {props.t("Ranking")}
                                        </Button>
                                        <Button color="success" onClick={() => { navigateToPreview(moduleId); }}>
                                            {props.t("Preview")}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <ElementList TenantId={userInformation.TenantId} StudyId={StudyId} ModuleId={moduleId} ModuleElementList={moduleElementList} ShowElementList={true} IsDisable={true} FormType={formType} />
                        </div>
                    </div>
                </div>
            </div>
            <ModalComp
                refs={modalRef}
                title={modalTitle}
                body={modalContent}
                buttonText={modalButtonText}
                isButton={true}
            />
        </>
    );
}

export default withTranslation()(FormBuilder);
