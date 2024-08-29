import React, { useState, useEffect } from 'react';
import { Row, Col } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import './formBuilder.css';
import { useDispatch } from "react-redux";
import { startloading, endloading } from '../../../../store/loader/actions';
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
import { withTranslation } from "react-i18next";
import { API_BASE_URL } from '../../../../constants/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HiddenElement from '../Elements/HiddenElement/hiddenElement';
import RandomizationElement from '../Elements/RandomizationElement/RandomizationElement';

function Preview() {
    const [tenantId, setTenantId] = useState(0);
    const { moduleId, moduleName, isStudy } = useParams();
    const [dependentData, setDependentData] = useState([]);
    const [moduleElementList, setModuleElementList] = useState([]);
    const [defaultModuleElementList, setDefaultModuleElementList] = useState([]);
    const [ElementId, setElementId] = useState(0);
    const [ElementValue, setElementValue] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(startloading());
        fetchData();
        dispatch(endloading());
    }, []);

    const fetchData = () => {
        fetch(API_BASE_URL + 'Study/GetStudyModuleElementsWithChildren?studyVisitPageModuleId=' + moduleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {    
                let dependentElm = data.filter(x => x.isDependent === true);
                setDependentData(dependentElm);
                setDefaultModuleElementList(data.map(item => ({ ...item })));
                setModuleElementList(data.map(item => ({ ...item })));
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    }

    useEffect(() => {
        if (dependentData.length > 0 && defaultModuleElementList.length > 0) {
            const targetElementIds = defaultModuleElementList.flatMap(d =>
                dependentData
                    .filter(x => x.dependentSourceFieldId === d.id)
                    .map(x => x.id)
            );
            if (targetElementIds.length > 0) {
                hideDependentElement({ tElmIds: targetElementIds, value: null })
            }
        }
    }, [dependentData, defaultModuleElementList])

    const AutoSaveElement = () => {
        fetch(API_BASE_URL + 'Module/AutoSaveElement?id=' + ElementId + '&value=' + ElementValue, {
            method: 'POST',
        }).then(res => res.json())
            .then(data => {
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    }

    const AutoSave = (id, value) => {
        let targetElementIds = dependentData.filter(x => x.dependentSourceFieldId === id).map(x => x.id);
        if (targetElementIds.length > 0) {
            hideDependentElement({ tElmIds: targetElementIds, value: value })
        }
       
    }

    const hideDependentElement = (data) => {
        fetch(API_BASE_URL + 'Study/GetDependentHideElement?targetElementIds=' + data.tElmIds + '&pValue=' + data.value, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                const updatedList = defaultModuleElementList.filter(
                    element => !data.includes(element.id)
                );
                setModuleElementList(updatedList);
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    };

    const renderElementsSwitch = (param) => {
        const commonProps = {
            HandleAutoSave: AutoSave,
            IsDependent: param.isDependent
        };
        switch (param.elementType) {
            case 1:
                return <LabelElement
                    Id={param.id}
                    Title={param.title} />;
            case 2:
                return <TextElement
                    Id={param.id}
                    IsDisable={""}
                    {...commonProps}
                />;
            case 3:
                return <HiddenElement value={param.targetElementName} />;
            case 4:
                return <NumericElement
                    Id={param.id} SetElementId={setElementId}
                    ElementValue={ElementValue} SetElementValue={setElementValue}
                    IsDisable={""}
                    Unit={""}
                    Mask={""}
                    LowerLimit={0}
                    UpperLimit={0}
                    AutoSaveElement={AutoSaveElement}
                    {...commonProps}
                />;
            case 5:
                return <TextareaElement
                    Id={param.id}
                    IsDisable={false}
                    DefaultValue={param.defaultValue}
                    {...commonProps}
                />
            case 6:
                return <DateElement
                    Id={param.id}
                    Title={param.title}
                    IsRequired={param.isRequired}
                    IsDisable={false}
                    AddTodayDate={param.addTodayDate}
                    StartDay={param.startDay}
                    EndDay={param.endDay}
                    StartMonth={param.startMonth}
                    EndMonth={param.endMonth}
                    StartYear={param.startYear}
                    EndYear={param.endYear}
                    DefaultValue={param.defaultValue}
                    IsPreview={true}
                    {...commonProps}
                />
            case 7:
                return <CalculationElement
                    Id={param.id}
                    {...commonProps}
                />
            case 8:
                return <RadioElement
                    Id={param.id}
                    IsDisable={""}
                    Layout={param.layout}
                    ElementOptions={param.elementOptions}
                    {...commonProps}
                />
            case 9:
                return <CheckElement
                    Id={param.id}
                    IsDisable={""}
                    Layout={param.layout}
                    ElementOptions={param.elementOptions}
                    Value={[]}
                    {...commonProps}
                />
            case 10:
                return <DropdownElement
                    Id={param.id}
                    IsDisable={false}
                    ElementOptions={param.elementOptions}
                    {...commonProps}
                />
            case 11:
                return <DropdownCheckListElement
                    Id={param.id}
                    IsDisable={false}
                    ElementOptions={param.elementOptions}
                    {...commonProps}
                />
            case 12:
                return <FileUploaderElement
                    Id={param.id}
                    IsDisable={false}
                    {...commonProps}
                />
            case 13:
                return <RangeSliderElement
                    Id={param.id}
                    IsDisable={false}
                    LowerLimit={param.lowerLimit}
                    UpperLimit={param.upperLimit}
                    LeftText={param.leftText}
                    RightText={param.rightText}
                    DefaultValue={param.defaultValue}
                    {...commonProps}
                />
            case 15:
                return <TableElement
                    IsDisable={false}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount} RowCount={param.rowCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                    IsFromDesign={false}
                    {...commonProps}
                />
            case 16:
                return <DatagridElement
                    IsDisable={false}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                    IsFromDesign={false}
                    {...commonProps}
                />
            case 17:
                return <AdverseEventElement
                    Id={param.id}
                    AdverseEventType={param.adverseEventType}
                    IsDisable={false}
                    {...commonProps}
                />
            case 18:
                return <RandomizationElement {...commonProps} IsPreview={true} />;
            default:
                return <TextElement
                    Id={param.id}
                    IsDisable={""}
                    {...commonProps}
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
                        {item.elementType !== 6 && (
                            <label style={{ marginRight: '5px' }}>
                                {item.isRequired && (<span style={{ color: 'red' }}>*&nbsp;</span>)}
                                {item.elementType !== 1 && item.title}
                            </label>
                        )}
                    </div>
                    {renderElementsSwitch(item)}
                    <label style={{ fontSize: "8pt", textDecoration: 'none', fontStyle: 'italic', color: '#4a4a4a' }}>
                        {item.description !== null && item.description !== "" && `* ${item.description}`}
                    </label>                  
                </Row>
            );
        })
        : null;

    const navigate = useNavigate();
    const backPage = () => {
        navigate(`/formBuilder/${moduleId}/${isStudy}`);
    };
    return (
        <div>           
            <div style={{ margin: '80px 20px' }} className="row">
                <Row className="align-items-center" style={{ borderBottom: "1px solid black", paddingBottom: '10px' }}>
                    <Col md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="page-title-box">
                    <Row className="align-items-center" >
                        <Col>
                            <h6 className="page-title"><FontAwesomeIcon style={{ marginRight: "10px", cursor: "pointer", position: "relative", top: "0.5px" }} onClick={backPage} icon="fa-solid fa-left-long" />{moduleName}</h6>
                        </Col>
                    </Row>
                        </div>
                    </Col>
                </Row>
                {content}
            </div>
        </div>
    );
}

export default withTranslation()(Preview);
