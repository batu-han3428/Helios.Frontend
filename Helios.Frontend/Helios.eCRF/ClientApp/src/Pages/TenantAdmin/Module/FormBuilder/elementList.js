import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, ModalBody, ModalHeader, Button } from "reactstrap";
import Properties from './properties.js';
import './formBuilder.css';
import { useDispatch, useSelector } from "react-redux";
import { startloading, endloading } from '../../../../store/loader/actions';
import Swal from 'sweetalert2'
import TextElement from '../Elements/TextElement/textElement.js';
import NumericElement from '../Elements/NumericElement/numericElement.js';
import RadioElement from '../Elements/RadioElement/radioElement.js';
import CheckElement from '../Elements/CheckElement/checkElement.js';
import DropdownElement from '../Elements/DropdownElement/dropdownElement.js';
import DropdownCheckListElement from '../Elements/DropdownCheckListElement/dropdownCheckListElement.js';
import LabelElement from '../Elements/LabelElement/labelElement.js';
import DateElement from '../Elements/DateElement/dateElement.js';
import TextareaElement from '../Elements/TextareaElement/textareaElement.js';
import FileUploaderElement from '../Elements/FileUploaderElement/fileUploaderElement.js';
import RangeSliderElement from '../Elements/RangeSliderElement/rangeSliderElement.js';
import DatagridElement from '../Elements/DatagridElement/datagridElement.js';
import TableElement from '../Elements/TableElement/tableElement.js';
import CalculationElement from '../Elements/CalculationElement/calculationElement.js';
import AdverseEventElement from '../Elements/AdverseEventElement/adverseEventElement.js';
import HiddenElement from '../Elements/HiddenElement/hiddenElement.js';
import ConcomittantMedicationElement from '../Elements/ConcomittantMedicationElement/concomittantMedicationElement.js';
import { withTranslation } from "react-i18next";
import { GetElementNameByKey } from '../Elements/Common/utils.js';
import { GetAllElementList } from './allElementList.js';
import { API_BASE_URL } from '../../../../constants/endpoints';
import { showToast } from '../../../../store/toast/actions.js';
import RandomizationElement from '../Elements/RandomizationElement/RandomizationElement.js';

function ElementList(props) {
    const baseUrl = props.FormType === 1 ? API_BASE_URL + "Module" : API_BASE_URL + "Study";
    const [tenantId] = useState(props.TenantId);
    const [moduleId] = useState(props.ModuleId);
    const [studyId] = useState(props.StudyId);
    const [isDisable] = useState(props.IsDisable);
    const [elementId, setElementId] = useState(0);
    const [moduleElementList, setModuleElementList] = useState([]);
    const [elements] = useState(GetAllElementList());
    const [elementType, setElementType] = useState(0);
    const [showElementList] = useState(props.ShowElementList);
    const [propModal, setpropModal] = useState(false);
    const [activeTab, setActiveTab] = useState(false);
    const [elementName, setElementName] = useState('');
    const [isCalcBtn, setIsCalcBtn] = useState('');
    const dispatch = useDispatch();
    const userInformation = useSelector(state => state.rootReducer.Login);

    useEffect(() => {
        setModuleElementList(props.ModuleElementList);
    }, [props.ModuleElementList]);

    const removeBodyCss = () => {
        document.body.classList.add("no_padding");
    };

    const togglePropModal = (e, type, id, tabid, isCalc = false) => {
        setIsCalcBtn(isCalc);
        setElementName(GetElementNameByKey(props, type) + " " + props.t("Properties"));

        if (id !== 0) {
            setElementId(id);
            setElementType(0);
        }
        else {
            setElementType(type);
        }

        setActiveTab(tabid);
        setpropModal(!propModal);
        removeBodyCss();
    };

    const copyElement = (e, id) => {
        dispatch(startloading());
        fetch(baseUrl + '/CopyElement?id=' + id + '&userId=' + userInformation.userId, {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                if (data.isSuccess) {
                    dispatch(showToast(props.t(data.message), true, true));
                    window.location.reload();
                } else {
                    dispatch(showToast(props.t(data.message), true, false));
                }

                dispatch(endloading());
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    };

    const deleteElement = (e, id) => {
        Swal.fire({
            title: props.t("You will not be able to recover this element"),
            text: props.t("Do you confirm"),
            icon: props.t("Warning"),
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel"),
            closeOnConfirm: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    dispatch(startloading());

                    fetch(baseUrl + '/DeleteElement?id=' + id + '&userId=' + userInformation.userId, {
                        method: 'POST',
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.isSuccess) {
                                dispatch(showToast(props.t(data.message), true, true));
                                window.location.reload();
                            } else {
                                dispatch(showToast(props.t(data.message), true, false));
                            }
                        })
                        .catch(error => {
                            dispatch(showToast(props.t("An error occurred while processing your request."), true, false));
                        })
                        .finally(() => {
                            dispatch(endloading());
                        });
                } catch (error) {
                    dispatch(endloading());
                    dispatch(showToast(props.t("An error occurred while processing your request."), true, false));
                }
            }
        })
    }

    const renderElementsSwitch = (param) => {
        const dsbl = isDisable ? "disabled" : "";
        switch (param.elementType) {
            case 1:
                return <LabelElement Title={param.title} />;
            case 2:
                return <TextElement IsDisable={dsbl}
                />;
            case 3:
                return <HiddenElement value={param.targetElementName} />;
            case 4:
                return <NumericElement
                    Id={param.id}
                    IsDisable={dsbl}
                    Unit={""}
                    Mask={""}
                    LowerLimit={param.lowerLimit}
                    UpperLimit={param.upperLimit}
                />;
            case 5:
                return <TextareaElement
                    IsDisable={isDisable}
                    DefaultValue={param.defaultValue}
                />
            case 6:
                return <DateElement
                    Title={param.title}
                    IsRequired={param.isRequired}
                    IsDisable={true}
                    AddTodayDate={param.addTodayDate}
                    StartDay={param.startDay}
                    EndDay={param.endDay}
                    StartMonth={param.startMonth}
                    EndMonth={param.endMonth}
                    StartYear={param.startYear}
                    EndYear={param.endYear}
                    DefaultValue={param.defaultValue}
                    IsPreview={false}
                />
            case 7:
                return <CalculationElement
                />
            case 8:
                return <RadioElement
                    IsDisable={dsbl}
                    Layout={param.layout}
                    ElementOptions={param.elementOptions}
                />
            case 9:
                return <CheckElement
                    IsDisable={dsbl}
                    IsRequired={param.isRequired}
                    Layout={param.layout}
                    ElementOptions={param.elementOptions}
                    Value={[]}
                />
            case 10:
                return <DropdownElement
                    IsDisable={isDisable}
                    IsRequired={param.isRequired}
                    ElementOptions={param.elementOptions}
                />
            case 11:
                return <DropdownCheckListElement
                    IsDisable={isDisable}
                    ElementOptions={param.elementOptions}
                />
            case 12:
                return <FileUploaderElement
                    IsDisable={isDisable}
                />
            case 13:
                return <RangeSliderElement
                    IsDisable={isDisable}
                    LowerLimit={param.lowerLimit}
                    UpperLimit={param.upperLimit}
                    LeftText={param.leftText}
                    RightText={param.rightText}
                    DefaultValue={param.defaultValue}
                />
            case 14:
                return <ConcomittantMedicationElement
                    IsDisable={isDisable}
                    ButtonText={param.buttonText}
                />

            case 15:
                return <TableElement
                    StudyId={studyId}
                    FormType={props.FormType}
                    IsDisable={isDisable}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount} RowCount={param.rowCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                    Dispatch={dispatch}
                    IsFromDesign={true}
                />
            case 16:
                return <DatagridElement
                    StudyId={studyId}
                    FormType={props.FormType}
                    IsDisable={isDisable}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                    Dispatch={dispatch}
                    IsFromDesign={true}
                />
            case 17:
                return <AdverseEventElement
                    AdverseEventType={param.adverseEventType}
                    IsDisable={isDisable}
                />
            case 18:
                return <RandomizationElement IsDisable={dsbl} IsFromDesign={true}
                />;
            default:
                return <TextElement
                    IsDisable={dsbl}
                />;
        }
    }

    const content = Array.isArray(moduleElementList)
        ? moduleElementList.map((item) => {
            var w = item.width === 0 ? 12 : item.width;
            var cls = "mb-6 col-md-" + w;

            return (
                <Col className={cls} key={item.id}>
                    <div className="actionBtnDiv" style={{ textAlign: (item.elementType === 1) ? 'right' : '', marginLeft: (item.elementType === 15) ? "20px" : " ", marginBottom: (item.elementType === 15) ? "-35px" : " " }}>
                        <label style={{ marginRight: '5px' }}>
                            {item.isRequired && (<span style={{ color: 'red' }}>*&nbsp;</span>)}
                            {item.elementType !== 1 && item.title}
                        </label>
                        {isDisable && (
                            <>
                                {item.isDependent && (
                                    <Button className="actionBtn" id={item.id} onClick={e => togglePropModal(e, item.elementType, item.id, "2")}><i className="fas fa-link"></i></Button>
                                )}
                                {item.isRelated && (
                                    <Button className="actionBtn" id={item.id} onClick={e => togglePropModal(e, item.elementType, item.id, "2")}><i className="fas fa-project-diagram"></i></Button>
                                )}
                                {item.elementType === 7 /*calculated*/ && (
                                    <Button className="actionBtn" id={item.id} onClick={e => togglePropModal(e, 7, item.id, "1", true)}><i className="fas fa-calculator"></i></Button>
                                )}
                                <Button className="actionBtn" id={item.id} onClick={e => togglePropModal(e, item.elementType, item.id, "1")}><i className="far fa-edit"></i></Button>
                                {(item.parentId === 0 || item.parentId == null) && (
                                    < Button className="actionBtn"><i className="far fa-copy" onClick={e => copyElement(e, item.id)}></i></Button>
                                )}
                                <Button className="actionBtn"><i className="fas fa-trash-alt" onClick={e => deleteElement(e, item.id)}></i></Button>
                            </>
                        )}
                    </div>
                    {renderElementsSwitch(item)}
                    <label style={{ fontSize: "8pt", textDecoration: 'none', fontStyle: 'italic', color: '#4a4a4a' }}>
                        {item.description !== null && item.description !== "" && `* ${item.description}`}
                    </label>
                </Col>
            );
        })
        : null;

    const elementItems = elements.map((l) =>
        (l.key !== 3 && l.key !== 14) || props.FormType === 2 ? (/*hidden & concomitantd elements don't show in formbuilder*/
            <Button className="elmlst" id={l.key} key={l.key} onClick={e => togglePropModal(e, l.key, 0, "1")}>
                <i className={l.icon} style={{ color: '#00a8f3' }}></i> &nbsp; {GetElementNameByKey(props, l.key)}
            </Button>
        ) : null
    );

    //const elementItems = elements.map((l) =>
    //    <Button className="elmlst" id={l.key} key={l.key} onClick={e => togglePropModal(e, l.key, 0, "1")}><i className={l.icon} style={{ color: '#00a8f3' }}></i> &nbsp; {GetElementNameByKey(props, l.key)} </Button>
    //);

    return (
        <div>
            {showElementList && (
                <Col md={12}>
                    <Row>
                        <Col xs={5} sm={4} md={3} lg={3}>
                            <div style={{ maxWidth: '300px', position: 'sticky', top: '70px' }}>
                                {elementItems}
                            </div>
                        </Col>
                        <Col xs={7} sm={8} md={9} lg={9}>
                            <Row>
                                {content}
                            </Row>
                        </Col>
                    </Row>
                </Col>
            )}
            {!showElementList && (
                <div>
                    {content}
                </div>
            )}
            <Col sm={6} md={4} xl={3}>
                <Modal isOpen={propModal} toggle={togglePropModal} size="lg">
                    <ModalHeader className="mt-0" toggle={togglePropModal}>{elementName}</ModalHeader>
                    <ModalBody>
                        <Properties
                            ModuleId={moduleId}
                            Type={elementType}
                            Id={elementId}
                            TenantId={userInformation.tenantId}
                            StudyId={studyId}
                            UserId={userInformation.userId}
                            ParentId={0}
                            ActiveTab={activeTab}
                            isCalcBtn={isCalcBtn}
                            ColumnIndex={null}
                            RowIndex={null}
                            FormType={props.FormType}
                            Dispatch={dispatch}
                        >
                        </Properties>
                    </ModalBody>
                </Modal>
            </Col>
        </div>

    );
}

export default withTranslation()(ElementList);
