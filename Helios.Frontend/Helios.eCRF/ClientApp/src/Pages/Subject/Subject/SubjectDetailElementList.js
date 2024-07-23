import React, { useState, useRef } from 'react';
import { Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
import '../../TenantAdmin/Module/FormBuilder/formBuilder.css';
import { useDispatch } from "react-redux";
import { startloading, endloading } from '../../../store/loader/actions';
import { Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import ConcomittantMedicationElement from '../../TenantAdmin/Module/Elements/ConcomittantMedicationElement/concomittantMedicationElement.js';
import { withTranslation } from "react-i18next";
import { useAutoSaveSubjectMutation } from '../../../store/services/Subject';

function SubjectDetailElementList(props) {
    const toastRef = useRef();
    const [tenantId] = useState(props.TenantId);
    const [subjectVisitPageModuleId] = useState(props.ModuleId);
    const [studyId] = useState(props.StudyId);
    const [dataGridRowId] = useState(props.DataGridRowId);
    const [isDisable] = useState(props.IsDisable);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [autoSaveSubject] = useAutoSaveSubjectMutation();

    const AutoSave = async (id, value, dataGridRowId = 0, type = 0) => {
        if (value !== undefined && value !== null && (value !== "" || type === 9 || type === 11)) {
            dispatch(startloading());
            const response = await autoSaveSubject({
                Id: id,
                Value: value,
                DataGridRowId: dataGridRowId
            });
            if (response.data.isSuccess) {
                toastRef.current.setToast({
                    message: response.data.message,
                    stateToast: true
                });
            } else {
                toastRef.current.setToast({
                    message: response.data.message,
                    stateToast: false
                });
            }
            dispatch(endloading());
        }
    }

    const renderElementsSwitch = (param) => {
        const dsbl = props.IsDisable ? "disabled" : "";
        const commonProps = {
            Id: param.subjectVisitPageModuleElementId,
            StudyVisitPageModuleElementId: param.studyVisitPageModuleElementId,
            SubjectVisitPageModuleId: param.subjectVisitPageModuleId,
            Value: param.userValue ?? "",
            IsDisable: dsbl,
            DataGridRowId: dataGridRowId,
            HandleAutoSave: AutoSave,
        };

        switch (param.elementType) {
            case 1:
                return <LabelElement Title={param.title} />;
            case 2:
                return <TextElement {...commonProps} />;
            case 3:
                return "";
            case 4:
                return <NumericElement {...commonProps} Unit={""} Mask={""} LowerLimit={param.lowerLimit} UpperLimit={param.upperLimit} />;
            case 5:
                return <TextareaElement {...commonProps} DefaultValue={param.defaultValue} />;
            case 6:
                return <DateElement {...commonProps} Title={param.title} IsRequired={param.isRequired} AddTodayDate={param.addTodayDate} StartDay={param.startDay} EndDay={param.endDay} StartMonth={param.startMonth} EndMonth={param.endMonth} StartYear={param.startYear} EndYear={param.endYear} DefaultValue={param.defaultValue} IsPreview={false} />;
            case 7:
                return <CalculationElement {...commonProps} />;
            case 8:
                return <RadioElement {...commonProps} Layout={param.layout} ElementOptions={param.elementOptions} />;
            case 9:
                return <CheckElement {...commonProps} Layout={param.layout} ElementOptions={param.elementOptions} />;
            case 10:
                return <DropdownElement {...commonProps} ElementOptions={param.elementOptions} />;
            case 11:
                return <DropdownCheckListElement {...commonProps} ElementOptions={param.elementOptions} />;
            case 12:
                return <FileUploaderElement IsDisable={isDisable} />;
            case 13:
                return <RangeSliderElement {...commonProps} LowerLimit={param.lowerLimit} UpperLimit={param.upperLimit} LeftText={param.leftText} RightText={param.rightText} DefaultValue={param.defaultValue ?? 0} />;
            case 14:
                return <ConcomittantMedicationElement IsDisable={isDisable} ButtonText={param.buttonText} />;
            case 15:
                return <TableElement {...commonProps} StudyId={studyId} FormType={0} TenantId={tenantId} ModuleId={subjectVisitPageModuleId} UserId={0} ColumnCount={param.columnCount} RowCount={param.rowCount} DatagridAndTableProperties={param.datagridAndTableProperties} ChildElementList={param.childElements} Dispatch={dispatch} IsFromDesign={false} />;
            case 16:
                return <DatagridElement {...commonProps} StudyId={studyId} FormType={0} TenantId={tenantId} ModuleId={subjectVisitPageModuleId} UserId={0} ColumnCount={param.columnCount} RowCount={param.rowCount} DatagridAndTableProperties={param.datagridAndTableProperties} ChildElementList={param.childElements} Dispatch={dispatch} IsFromDesign={false} />;
            case 17:
                return <AdverseEventElement AdverseEventType={param.adverseEventType} IsDisable={isDisable} />;
            default:
                return "";
        }
    }

    const getItems = () => {
        const items = [
            {
                key: '1',
                label: <a onClick={() => navigate('')}>{props.t("Clear data")}</a>,
                icon: <FontAwesomeIcon icon="fas fa-ban" style={{ color: "#5b626b" }} />,
                style: { color: "#5b626b" },
            },
            {
                key: '2',
                label: <a onClick={() => navigate('')}>{props.t("Missing data")}</a>,
                icon: <FontAwesomeIcon icon="fas fa-check-square" style={{ color: "#5b626b" }} />,
                style: { color: "#5b626b" },
            },
            {
                key: '3',
                label: <a onClick={() => navigate('')}>{props.t("Comments")}</a>,
                icon: <FontAwesomeIcon icon="fas fa-comment" style={{ color: "#5b626b" }} />,
                style: { color: "#5b626b" },
            },
            {
                key: '4',
                label: <a onClick={() => navigate('')}>{props.t("Audit trail")}</a>,
                icon: <FontAwesomeIcon icon="fas fa-directions" style={{ color: "#5b626b" }} />,
                style: { color: "#5b626b" },
            },
            {
                key: '5',
                label: <a onClick={() => navigate('')}>{props.t("Query")}</a>,
                icon: <FontAwesomeIcon icon="fas fa-exclamation" style={{ color: "#5b626b" }} />,
                style: { color: "#5b626b" },
            },
        ];

        return { items };
    }

    const content = Array.isArray(props.ElementList)
        ? props.ElementList.map((item) => {
            const w = item.width === 0 ? 12 : item.width;
            const cls = "mb-6 col-md-" + w;

            if (item.isHidden)
                return ("");
            else
                return (
                    <Row className={cls} key={item.subjectVisitPageModuleElementId}>
                        <div style={{ marginBottom: '3px', marginTop: '10px' }}>
                            <label style={{ marginRight: '5px' }}>
                                {item.isRequired && (<span style={{ color: 'red' }}>*&nbsp;</span>)}
                                {item.elementType !== 1 && item.title}
                            </label>
                        </div>
                        <Row>
                            <div className="col-md-11">{renderElementsSwitch(item)}</div>
                            {item.elementType !== 1 && item.elementType !== 3 &&
                                <div className="col-md-1" key={item.subjectVisitPageModuleElementId}>
                                    <Dropdown menu={getItems()} trigger={['click']} placement="bottomLeft">
                                        <div style={{ alignItems: 'center' }}>
                                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                                <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical" />
                                            </a>
                                        </div>
                                    </Dropdown>
                                </div>
                            }
                        </Row>
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