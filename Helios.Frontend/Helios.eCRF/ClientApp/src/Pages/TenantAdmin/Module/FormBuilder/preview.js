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
import { useParams } from "react-router-dom";
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

function Preview() {
    const toastRef = useRef();
    const baseUrl = "http://localhost:3300";
    const [tenantId, setTenantId] = useState(0);
    const { moduleId } = useParams();
    const [moduleElementList, setModuleElementList] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(startloading());
        fetchData();
        dispatch(endloading());
    });

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

    const renderElementsSwitch = (param) => {
        switch (param.elementType) {
            case 1:
                return <LabelElement Title={param.title} />;
            case 2:
                return <TextElement IsDisable={""}
                />;
            case 4:
                return <NumericElement
                    IsDisable={""}
                    Unit={""}
                    Mask={""}
                    LowerLimit={0}
                    UpperLimit={0}
                />;
            case 5:
                return <TextareaElement
                    IsDisable={false}
                    DefaultValue={param.defaultValue}
                />
            case 6:
                return <DateElement
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
                    IsPreview={true }
                />
            case 7:
                return <CalculationElement
                />
            case 8:
                return <RadioElement
                    IsDisable={""}
                    Layout={param.layout}
                    ElementOptions={param.elementOptions}
                />
            case 9:
                return <CheckElement
                    IsDisable={""}
                    Layout={param.layout}
                    ElementOptions={param.elementOptions}
                />
            case 10:
                return <DropdownElement
                    IsDisable={false}
                    ElementOptions={param.elementOptions}
                />
            case 11:
                return <DropdownCheckListElement
                    IsDisable={false}
                    ElementOptions={param.elementOptions}
                />
            case 12:
                return <FileUploaderElement
                    IsDisable={false}
                />
            case 13:
                return <RangeSliderElement
                    IsDisable={false}
                    LowerLimit={param.lowerLimit}
                    UpperLimit={param.upperLimit}
                    LeftText={param.leftText}
                    RightText={param.rightText}
                    DefaultValue={param.defaultValue}
                />
            case 15:
                return <TableElement
                    IsDisable={false}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount} RowCount={param.rowCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                />
            case 16:
                return <DatagridElement
                    IsDisable={false}
                    Id={param.id} TenantId={tenantId} ModuleId={moduleId} UserId={0}
                    ColumnCount={param.columnCount}
                    DatagridAndTableProperties={param.datagridAndTableProperties}
                    ChildElementList={param.childElements}
                />
            default:
                return <TextElement
                    IsDisable={""}
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
                    <label style={{ fontSize: "8pt", textDecoration: 'none' }}>
                        {item.description}
                    </label>
                </Row>
            );
        })
        : null;

    return (
        <div>
            <div style={{ margin: '80px 20px' }} className="row">
                {content}
            </div>
            <ToastComp
                ref={toastRef}
            />
        </div>

    );
}

export default withTranslation()(Preview);
