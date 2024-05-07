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
import '../../TenantAdmin/Module/FormBuilder/formBuilder.css';
import { useDispatch, useSelector } from "react-redux";
import { startloading, endloading } from '../../../store/loader/actions';
import Swal from 'sweetalert2'
import ToastComp from '../../../components/Common/ToastComp/ToastComp';
import TextElement from '../../TenantAdmin/Module/Elements/TextElement/textElement.js';
import NumericElement from '../../TenantAdmin/Module/Elements/NumericElement/numericElement.js';
import RadioElement from '../../TenantAdmin/Module/Elements/RadioElement/radioElement.js';
import CheckElement from '../../TenantAdmin/Module/Elements/CheckElement/checkElement.js';
import DropdownElement from '../../TenantAdmin/Module/Elements/DropdownElement/dropdownElement.js';
import DropdownCheckListElement from '../../TenantAdmin/Module/Elements/DropdownCheckListElement/dropdownCheckListElement.js';
import LabelElement from '../../TenantAdmin/Module/Elements/LabelElement/labelElement.js';
import DateElement from '../../TenantAdmin/Module/Elements/DateElement/dateElement.js';
import TextareaElement from '../../TenantAdmin/Module/Elements/TextareaElement/textareaElement.js';
import FileUploaderElement from '../../TenantAdmin/Module/Elements/FileUploaderElement/fileUploaderElement.js';
import RangeSliderElement from '../../TenantAdmin/Module/Elements/RangeSliderElement/rangeSliderElement.js';
import DatagridElement from '../../TenantAdmin/Module/Elements/DatagridElement/datagridElement.js';
import TableElement from '../../TenantAdmin/Module/Elements/TableElement/tableElement.js';
import CalculationElement from '../../TenantAdmin/Module/Elements/CalculationElement/calculationElement.js';
import AdverseEventElement from '../../TenantAdmin/Module/Elements/AdverseEventElement/adverseEventElement.js';
import HiddenElement from '../../TenantAdmin/Module/Elements/HiddenElement/hiddenElement.js';
import ConcomittantMedicationElement from '../../TenantAdmin/Module/Elements/ConcomittantMedicationElement/concomittantMedicationElement.js';
import { withTranslation } from "react-i18next";
import { GetAllElementList } from '../../TenantAdmin/Module/FormBuilder/allElementList.js';

function SubjectDetailElementList(props) {
    debugger;
    const toastRef = useRef();
    const baseUrl = "http://localhost:3300/Subject";
    const [tenantId] = useState(props.TenantId);
    const [moduleId] = useState(props.ModuleId);
    const [studyId] = useState(props.StudyId);
    const [isDisable] = useState(props.IsDisable);
    const [elementId, setElementId] = useState(0);
    const [ElementList, setElementList] = useState([]);
    const [elements] = useState(GetAllElementList());
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInformation = useSelector(state => state.rootReducer.Login);

    useEffect(() => {
        setElementList(props.ElementList);
    }, [props.ElementList]);

    const renderElementsSwitch = (param) => {
        var dsbl = isDisable ? "disabled" : "";
        switch (param.elementType) {
            case 1:
                return <LabelElement Title={param.title} />;
            case 2:
                return <TextElement IsDisable={dsbl}
                />;
            case 3:
                return <HiddenElement />;
            case 4:
                return <NumericElement
                    Id={param.id}
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
            case 14:
                return <ConcomittantMedicationElement
                    IsDisable={isDisable}
                    ButtonText={param.buttonText}
                />

            case 15:
                return <TableElement
                    StudyId={studyId}
                    FormType={0}
                    IsDisable={isDisable}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount} RowCount={param.rowCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                    Dispatch={dispatch}
                />
            case 16:
                return <DatagridElement
                    StudyId={studyId}
                    FormType={0}
                    IsDisable={isDisable}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                    Dispatch={dispatch}
                />
            case 17:
                return <AdverseEventElement
                    AdverseEventType={param.adverseEventType}
                    IsDisable={isDisable}
                />
            default:
                return <TextElement
                    IsDisable={dsbl}
                />;
        }
    }

    const content = Array.isArray(ElementList)
        ? ElementList.map((item) => {
            var w = item.width === 0 ? 12 : item.width;
            var cls = "mb-6 col-md-" + w;

            return (
                <Row className={cls} key={item.id}>
                    <div style={{ marginBottom: '3px', marginTop: '10px' }}>
                        <label style={{ marginRight: '5px' }}>
                            {item.isRequired && (<span style={{ color: 'red' }}>*&nbsp;</span>)}
                            {item.elementType !== 1 && item.title}
                        </label>
                    </div>
                    {renderElementsSwitch(item)}
                    <label style={{ fontSize: "8pt", textDecoration: 'none' }}>
                        {item.description}
                    </label>
                </Row>
            );
        })
        : null;

    return (
        <div>
            <div>
                {content}
            </div>
            <ToastComp
                ref={toastRef}
            />
        </div>

    );
}

export default withTranslation()(SubjectDetailElementList);
