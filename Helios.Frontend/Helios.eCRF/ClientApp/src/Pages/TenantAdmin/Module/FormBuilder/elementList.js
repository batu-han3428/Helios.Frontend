import React, { useState, useEffect, useRef } from 'react';
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
import { Routes, Route, useNavigate } from "react-router-dom";
import Properties from './properties.js';
import './formBuilder.css';
import { useDispatch, useSelector } from "react-redux";
import { startloading, endloading } from '../../../../store/loader/actions';
import Swal from 'sweetalert2'
import ToastComp from '../../../../components/Common/ToastComp/ToastComp';
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
import { withTranslation } from "react-i18next";
import { GetElementNameByKey } from '../Elements/Common/utils.js';
import { GetAllElementList } from './allElementList.js';

function ElementList(props) {
    const toastRef = useRef();
    const baseUrl = "http://localhost:3300";
    const [tenantId] = useState(props.TenantId);
    const [moduleId] = useState(props.ModuleId);
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
    const navigate = useNavigate();
    const userInformation = useSelector(state => state.rootReducer.Login);

    useEffect(() => {
        setModuleElementList(props.ModuleElementList);
    }, [props.ModuleElementList]);

    const navigateToPreview = (id) => {
        navigate(`/preview/${id}`);
    };

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
        fetch(baseUrl + '/Module/CopyElement?id=' + id + '&userId=' + userInformation.userId, {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                if (data.isSuccess) {
                    toastRef.current.setToast({
                        message: data.message,
                        stateToast: true
                    });
                    dispatch(endloading());
                } else {
                    toastRef.current.setToast({
                        message: data.message,
                        stateToast: false
                    });
                    dispatch(endloading());
                }
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
                    fetch(baseUrl + '/Module/DeleteElement?id=' + id + '&userId=' + userInformation.userId, {
                        method: 'POST',
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.isSuccess) {
                                dispatch(endloading());
                                Swal.fire(data.message, '', 'success');
                            } else {
                                dispatch(endloading());
                                Swal.fire(data.message, '', 'error');
                            }
                        })
                        .catch(error => {
                            //console.error('Error:', error);
                        });
                } catch (error) {
                    dispatch(endloading());
                    Swal.fire('An error occurred', '', 'error');
                }
            }
        })
    }

    const renderElementsSwitch = (param) => {
        var dsbl = isDisable ? "disabled" : "";
        switch (param.elementType) {
            case 1:
                return <LabelElement Title={param.title} />;
            case 2:
                return <TextElement IsDisable={dsbl}
                />;
            case 4:
                return <NumericElement
                    IsDisable={dsbl}
                    Unit={""}
                    Mask={""}
                    LowerLimit={0}
                    UpperLimit={0}
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
                    IsDisable={isDisable}
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
                    Layout={param.layout}
                    ElementOptions={param.elementOptions}
                />
            case 10:
                return <DropdownElement
                    IsDisable={isDisable}
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
            case 15:
                return <TableElement
                    IsDisable={isDisable}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount} RowCount={param.rowCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                />
            case 16:
                return <DatagridElement
                    IsDisable={isDisable}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                />
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
                <Row className={cls} key={item.id}>
                    <div style={{ marginBottom: '3px', marginTop: '10px' }}>
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
                                    <Button className="actionBtn" id={item.id} onClick={e => togglePropModal(e, 0, item.id, "1", true)}><i className="fas fa-calculator"></i></Button>
                                )}
                                <Button className="actionBtn" id={item.id} onClick={e => togglePropModal(e, item.elementType, item.id, "1")}><i className="far fa-edit"></i></Button>
                                {item.parentId === 0 && (
                                    < Button className="actionBtn"><i className="far fa-copy" onClick={e => copyElement(e, item.id)}></i></Button>
                                )}
                                <Button className="actionBtn"><i className="fas fa-trash-alt" onClick={e => deleteElement(e, item.id)}></i></Button>
                            </>
                        )}
                    </div>
                    {renderElementsSwitch(item)}
                    <label style={{ fontSize: "8pt", textDecoration: 'none' }}>
                        {item.description}
                    </label>
                </Row>
            );
        })
        : null;

    const elementItems = elements.map((l) =>
        <Button className="elmlst" id={l.key} key={l.key} onClick={e => togglePropModal(e, l.key, 0, "1")}><i className={l.icon} style={{ color: '#00a8f3' }}></i> &nbsp; {GetElementNameByKey(props, l.key)} </Button>
    );

    return (
        <div>
            {showElementList && (
                <>
                    <div style={{ float: 'right' }}>
                        <Button color="success" onClick={() => { navigateToPreview(moduleId); }} className='mt-1'>
                            {props.t("Preview")}
                        </Button>
                    </div>
                    <br />
                    <div style={{ width: "200px", float: 'left', position: 'fixed' }}>
                        <div>
                            {elementItems}
                        </div>
                    </div>
                    <div style={{ margin: '10px 20px 10px 215px' }} className="row">
                        {content}
                    </div>
                </>
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
                            UserId={userInformation.userId}
                            ParentId={0}
                            ActiveTab={activeTab}
                            isCalcBtn={isCalcBtn}
                            ColumnIndex={null}
                            RowIndex={null}
                        >
                        </Properties>
                    </ModalBody>
                </Modal>
            </Col>
            <ToastComp
                ref={toastRef}
            />
        </div>

    );
}

export default withTranslation()(ElementList);
