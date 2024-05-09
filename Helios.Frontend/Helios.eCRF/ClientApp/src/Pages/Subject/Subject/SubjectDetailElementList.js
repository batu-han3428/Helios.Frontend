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
import { API_BASE_URL } from '../../../constants/endpoints';

function SubjectDetailElementList(props) {
    const toastRef = useRef();
    const [tenantId] = useState(props.TenantId);
    const [moduleId] = useState(props.ModuleId);
    const [studyId] = useState(props.StudyId);
    const [isDisable] = useState(props.IsDisable);
    const [ElementList, setElementList] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setElementList(props.ElementList);
    }, [props.ElementList]);

    const AutoSave = (id, value) => {
        debugger;
        fetch(API_BASE_URL + 'Subject/AutoSaveSubjectData', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: id,
                Value: value
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            this.state.dispatch(startloading());
            if (data.isSuccess) {
                this.toastRef.current.setToast({
                    message: data.message,
                    stateToast: true
                });
            } else {
                this.toastRef.current.setToast({
                    message: data.message,
                    stateToast: false
                });
            }
            this.state.dispatch(endloading());
        }).catch(error => {
            console.log(error)
        });
    }

    const renderElementsSwitch = (param) => {
        var dsbl = isDisable ? "disabled" : "";
        switch (param.elementType) {
            case 1:
                return <LabelElement Title={param.title} />;
            case 2:
                return <TextElement IsDisable={dsbl}
                    Id={param.subjectVisitPageModuleElementId}
                    Value={param.userValue === null ? "" : param.userValue}
                    HandleAutoSave={AutoSave}
                />;
            case 3:
                return <HiddenElement />;
            case 4:
                return <NumericElement
                    Id={param.subjectVisitPageModuleElementId}
                    Value={param.userValue}
                    IsDisable={dsbl}
                    Unit={""}
                    Mask={""}
                    LowerLimit={0}
                    UpperLimit={0}
                    HandleAutoSave={AutoSave}
                />;
            case 5:
                return <TextareaElement
                    Id={param.subjectVisitPageModuleElementId}
                    Value={param.userValue === null ? "" : param.userValue}
                    IsDisable={isDisable}
                    DefaultValue={param.defaultValue}
                    HandleAutoSave={AutoSave}
                />
            case 6:
                return <DateElement
                    Id={param.subjectVisitPageModuleElementId}
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
                    HandleAutoSave={AutoSave}
                />
            case 7:
                return <CalculationElement
                    Id={param.subjectVisitPageModuleElementId}
                    Value={param.userValue === null ? "" : param.userValue}
                />
            case 8:
                return <RadioElement
                    Id={param.subjectVisitPageModuleElementId}
                    Value={param.userValue === null ? "" : param.userValue}
                    IsDisable={dsbl}
                    Layout={param.layout}
                    ElementOptions={param.elementOptions}
                    HandleAutoSave={AutoSave}
                />
            case 9:
                return <CheckElement
                    Id={param.subjectVisitPageModuleElementId}
                    Value={param.userValue === null ? [] : JSON.parse(param.userValue)}
                    IsDisable={dsbl}
                    Layout={param.layout}
                    ElementOptions={param.elementOptions}
                    HandleAutoSave={AutoSave}
                />
            case 10:
                return <DropdownElement
                    Id={param.subjectVisitPageModuleElementId}
                    Value={param.userValue === null ? "" : param.userValue}
                    IsDisable={isDisable}
                    ElementOptions={param.elementOptions}
                    HandleAutoSave={AutoSave}
                />
            case 11:
                return <DropdownCheckListElement
                    Id={param.subjectVisitPageModuleElementId}
                    Value={param.userValue === null ? [] : JSON.parse(param.userValue)}
                    IsDisable={isDisable}
                    ElementOptions={param.elementOptions}
                    HandleAutoSave={AutoSave}
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
                return "";
        }
    }

    const content = Array.isArray(ElementList)
        ? ElementList.map((item) => {
            var w = item.width === 0 ? 12 : item.width;
            var cls = "mb-6 col-md-" + w;

            return (
                <Row className={cls} key={item.subjectVisitPageModuleElementId}>
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
            <div className="row">
                {content}
            </div>
            <ToastComp
                ref={toastRef}
            />
        </div>

    );
}

export default withTranslation()(SubjectDetailElementList);
