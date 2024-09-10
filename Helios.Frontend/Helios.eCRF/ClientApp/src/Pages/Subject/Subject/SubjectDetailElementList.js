import React, { useState, useContext, useCallback, useMemo } from 'react';
import { Row } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import '../../TenantAdmin/Module/FormBuilder/formBuilder.css';
import { useDispatch } from "react-redux";
import { startloading, endloading } from '../../../store/loader/actions';
import { Dropdown, Badge, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import SubjectComment from './Comp/SubjectComment';
import SubjectChangeElementComment from './Comp/SubjectChangeElementComment';
import SubjectMissingData from './Comp/SubjectMissingData';
import { showToast } from '../../../store/toast/actions';
import { SubjectMissingDataType } from './Comp/SubjectMissingDataType';
import { SubjectDetailContext } from './SubjectDetail';
import RandomizationElement from '../../TenantAdmin/Module/Elements/RandomizationElement/RandomizationElement';
import SubjectAuditTrail from './Comp/SubjectAuditTrail';
import { useStudyGetQuery } from '../../../store/services/Study';
import SubjectQuery from './Comp/SubjectQuery';
import { QueryIconStatu } from '../../../helpers/icon_helper';

const SubjectDetailElementList = (props) => {
        const [tenantId] = useState(props.TenantId);
        const [subjectVisitPageModuleId] = useState(0);
        const [studyId] = useState(props.StudyId);
        const { subjectId, subjectNumber } = useParams();
        const [isDisable] = useState(props.IsDisable);
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [isMissingData] = useState(props.IsMissingData);
        const [isSdv] = useState(props.IsSdv);
        const [isAuditTrail] = useState(props.IsAuditTrail);
        const [isOpenQuery] = useState(props.IsOpenQuery);
        const [isAnswerQuery] = useState(props.IsAnswerQuery);

        const { modalRef, setModalInf, setSdv, sdvElementRef, queryElementRef } = useContext(SubjectDetailContext);

        const [autoSaveSubject] = useAutoSaveSubjectMutation();

        const { data: studyData, isLoadingStudy, isErrorStudy } = useStudyGetQuery(studyId);

        const AutoSave = async (id, value, oldValue = "", elementName = "", type = 0) => {
            if (value !== undefined && value !== null && (value !== "" || type === 9 || type === 11)) {
                dispatch(startloading());
                if (studyData.reasonForChange && type !== 7 && type !== 12 && type !== 14 && type !== 17) {
                    setModalInf({ title: props.t("This study is adhering to Good Clinical Practice (GCP)!"), content: <SubjectChangeElementComment studyId={studyId} subjectId={subjectId} isMissingData={false} elementName={elementName} oldValue={oldValue} subjectElementId={id} value={value} type={String(type)} commentType='2' />, isButton: false }); modalRef.current.tog_backdrop();
                } else {
                    const response = await autoSaveSubject({
                        Id: id,
                        Value: value,
                        ElementName: "",
                        Type: type
                    });
                    dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
                }
                dispatch(endloading());
            }
        }
        const ClearData = async (item) => {
            if (item.userValue !== undefined && item.userValue !== null && item.userValue !== "") {
                dispatch(startloading());
                const response = await autoSaveSubject({
                    Id: item.subjectVisitPageModuleElementId,
                    Value: "",
                });
                dispatch(showToast(props.t(response.data.message), true, response.data.isSuccess));
                dispatch(endloading());
            }
        }
        const renderElementsSwitch = useCallback((param) => {
            const dsbl = isDisable ? "disabled" : "";
            const commonProps = {
                Id: param.subjectVisitPageModuleElementId,
                ElementName: param.elementName,
                StudyVisitPageModuleElementId: param.studyVisitPageModuleElementId,
                SubjectVisitPageModuleId: param.subjectVisitPageModuleId,
                Value: param.missingData ? "" : (param.userValue ?? ""),
                IsDisable: dsbl,
                IsRequired: param.isRequired,
                HandleAutoSave: AutoSave,
                IsMissingData: isMissingData,
                IsSdv: isSdv,
                IsAuditTrail: isAuditTrail,
                IsOpenQuery: isOpenQuery,
                IsAnswerQuery: isAnswerQuery,
                SdvInformation: props.SdvInformation,
                QueryInformation: props.QueryInformation,
                IsMissingItem: param.missingData
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
                case 18:
                    return <RandomizationElement {...commonProps} IsFromDesign={false} />;
                default:
                    return "";
            }
        }, [AutoSave, isDisable, studyId, tenantId, subjectVisitPageModuleId, isMissingData, isSdv, isAuditTrail, isOpenQuery, isAnswerQuery, props.SdvInformation, props.QueryInformation]);

        const getItems = useCallback((param) => {
            const items = [
                {
                    key: '3',
                    label: <a onClick={() => { setModalInf({ title: param.elementName, content: <SubjectComment subjectElementId={param.subjectVisitPageModuleElementId} />, isButton: false }); modalRef.current.tog_backdrop(); }}>{props.t("Comments")}</a>,
                    icon: <FontAwesomeIcon icon="fas fa-comment" style={{ color: "#8BB9EE" }} />,
                    style: { color: "#8BB9EE" },
                }
            ];     

            if ((isOpenQuery || isAnswerQuery) && ![1, 17, 14, 15, 16, 3, 7].includes(param.elementType)) {
                items.splice(1, 0, {
                    key: '5',
                    label: <a onClick={() => { setModalInf({ content: <SubjectQuery subjectId={subjectId} permissions={{ openQuery: isOpenQuery, answerQuery: isAnswerQuery }} commentType={param.commentType} subjectNumber={subjectNumber} refs={modalRef} currentData={{ elementName: param.elementName, value: param.userValue }} subjectElementId={param.subjectVisitPageModuleElementId} />, isButton: false, style: { padding: '0' } }); modalRef.current.tog_backdrop(); }}>{props.t("Query")}</a>,
                    icon: <FontAwesomeIcon icon="fas fa-exclamation" style={{ color: "#ffa16c" }} />,
                    style: { color: "#ffa16c" },
                });
            }

            if (isAuditTrail) {
                items.splice(1, 0, {
                    key: '4',
                    label: <a onClick={() => { setModalInf({ title: param.elementName, content: <SubjectAuditTrail />, isButton: false }); modalRef.current.tog_backdrop(); }}>{props.t("Audit trail")}</a>,
                    icon: <FontAwesomeIcon icon="fas fa-directions" style={{ color: "#5b626b" }} />,
                    style: { color: "#5b626b" }
                });
            }

            if (![18].includes(param.elementType)) {
                items.splice(0, 0, {
                    key: '1',
                    label: <a onClick={() => ClearData(param)}>{props.t("Clear data")}</a>,
                    icon: <FontAwesomeIcon icon="fas fa-ban" style={{ color: "#d85b40" }} />,
                    style: { color: "#d85b40" },
                    disabled: isDisable,
                });
            }

            if (isMissingData && param.canMissing && ![18].includes(param.elementType)) {
                items.splice(1, 0, {
                    key: '2',
                    label: <a onClick={() => { setModalInf({ title: props.t('Select one of the reasons for the missing value'), content: <SubjectMissingData studyId={studyId} subjectId={subjectId} data={param.missingData && param.userValue} elementId={param.subjectVisitPageModuleElementId} reasonForChange={studyData.reasonForChange} elementName={param.elementName} oldValue={param.userValue} type={String(param.elementType)} refs={modalRef} />, isButton: true, buttonText: props.t('Save') }); modalRef.current.tog_backdrop(); }}>{props.t("Missing data")}</a>,
                    icon: <FontAwesomeIcon icon="fas fa-check-square" style={{ color: "#bf9ec9" }} />,
                    style: { color: "#bf9ec9" }
                });
            }

            if (isSdv && ![1, 17, 14, 15, 16, 3, 7].includes(param.elementType) && param.userValue !== "" && param.userValue !== null) {
                items.splice(1, 0, {
                    key: '6',
                    label: <a onClick={() => { setSdv([param.subjectVisitPageModuleElementId]); }}>{!param.sdv ? props.t('On-site SDV') : props.t('Remove SDV')}</a>,
                    icon: <FontAwesomeIcon icon="fa-solid fa-circle-check" style={{ color: "#3BBFAD" }} />,
                    style: { color: "#3BBFAD" }
                });
            }

            if (param.elementType === 17 || param.elementType === 7) {
                var items2 = items.filter(item => item.key !== '1');
                return { items: items2 };
            }
            else {
                return { items };
            }

        }, [ClearData, navigate, props.t, isDisable, isMissingData, isSdv, isAuditTrail, isOpenQuery, isAnswerQuery]);

        const renderContent = useMemo(() => {
            return Array.isArray(props.ElementList) ? props.ElementList.map((item) => {
                const w = item.width === 0 ? 12 : item.width;
                const cls = "mb-6 col-md-" + w;

                if (item.isHidden) {
                    return null;
                } else {
                    return (
                        <Row className={cls} key={item.subjectVisitPageModuleElementId} style={{ marginLeft: 'unset', boxShadow: props.SdvInformation && props.SdvInformation.style && props.SdvInformation.item === item.subjectVisitPageModuleElementId ? '0 0 15px rgba(0, 255, 0, 0.5)' : props.QueryInformation && props.QueryInformation.style && props.QueryInformation.item === item.subjectVisitPageModuleElementId ? '0 0 15px rgba(209, 151, 159, 1)' : 'unset' }}>
                            <React.Fragment>
                                <div style={{ marginBottom: '3px', marginTop: '10px', display: 'flex', alignItems: 'center' }}
                                    ref={
                                        (
                                            (props.SdvInformation && props.SdvInformation.style && props.SdvInformation.item === item.subjectVisitPageModuleElementId) ? sdvElementRef : (props.QueryInformation && props.QueryInformation.style && props.QueryInformation.item === item.subjectVisitPageModuleElementId) ? queryElementRef : null)
                                        }>
                                    <label style={{ marginRight: '5px', marginBottom: '0' }}>
                                        {item.isRequired && (<span style={{ color: 'red' }}>*&nbsp;</span>)}
                                        {item.elementType !== 1 && item.title}
                                    </label>
                                    {(![1, 3].includes(item.elementType) && item.isComment) &&
                                        <Tooltip title={props.t('Comments')}>
                                            <FontAwesomeIcon onClick={() => { setModalInf({ title: item.elementName, content: <SubjectComment subjectElementId={item.subjectVisitPageModuleElementId} />, isButton: false }); modalRef.current.tog_backdrop(); }} icon="fa-solid fa-comment" style={{ color: "#8bb9ee", marginRight: '5px', cursor: 'pointer', fontSize: '20px' }} />
                                        </Tooltip>
                                    }
                                    {item.missingData &&
                                        (() => {
                                            const splitValue = (item.userValue !== null && item.userValue !== "") ? item.userValue.split('_') : "";
                                            const searchValue = splitValue != null ? (splitValue.length > 1 ? splitValue[0] : item.userValue) : splitValue;
                                            const foundItem = SubjectMissingDataType.find(x => x.value.includes(searchValue));
                                            return (
                                                <Tooltip title={foundItem && props.t(foundItem.label)}>
                                                    <Badge
                                                        count="UNK"
                                                        title=""
                                                        style={{
                                                            width: '22px',
                                                            height: '22px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#ffa16c',
                                                            color: '#FFFFFF',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '8px',
                                                            fontWeight: 'bold',
                                                            textAlign: 'center',
                                                            cursor: (isMissingData && item.canMissing) ? 'pointer' : 'default',
                                                            marginRight: '5px'
                                                        }}
                                                        onClick={() => {
                                                            if (isMissingData && item.canMissing) {
                                                                setModalInf({ title: props.t('Select one of the reasons for the missing value'), content: <SubjectMissingData data={item.missingData && item.userValue} elementId={item.subjectVisitPageModuleElementId} refs={modalRef} />, isButton: true, buttonText: props.t('Save') }); modalRef.current.tog_backdrop();
                                                            }
                                                        }}
                                                    />
                                                </Tooltip>
                                            );
                                        })()
                                    }
                                    {(item.sdv && ![1, 17, 14, 15, 16, 3, 18].includes(item.elementType)) &&
                                        <Tooltip title={props.t('Remove SDV')}>
                                            <FontAwesomeIcon onClick={() => { if (item.elementType !== 7 && isSdv) setSdv([item.subjectVisitPageModuleElementId]); }} icon="fa-solid fa-circle-check" style={{ color: "#3BBFAD", cursor: item.elementType !== 7 && isSdv ? "pointer" : "default", fontSize: '20px', marginRight: '5px' }} />
                                        </Tooltip>
                                    }
                                    {(item.query && item.commentType !== 3) &&
                                        (() => {
                                            const iconInf = QueryIconStatu(item.commentType, (isAnswerQuery || isOpenQuery));
                                            return (
                                                <Tooltip title={props.t(iconInf.text)}>
                                                    <span onClick={() => { if (isAnswerQuery || isOpenQuery) { setModalInf({ content: <SubjectQuery subjectId={subjectId} permissions={{ openQuery: isOpenQuery, answerQuery: isAnswerQuery }} commentType={item.commentType} subjectNumber={subjectNumber} refs={modalRef} currentData={{ elementName: item.elementName, value: item.userValue }} subjectElementId={item.subjectVisitPageModuleElementId} />, isButton: false, style: { padding: '0' } }); modalRef.current.tog_backdrop(); } }}>{iconInf.icon}</span>
                                                </Tooltip>
                                            );
                                        })()
                                    }
                                </div>
                                <Row>
                                    <div className="col-md-11">{renderElementsSwitch(item)}</div>
                                    {item.elementType !== 1 && item.elementType !== 3 &&
                                        <div className="col-md-1" key={item.subjectVisitPageModuleElementId}>
                                            <Dropdown menu={getItems(item)} trigger={['click']} placement="bottomLeft">
                                                <div style={{ alignItems: 'center' }}>
                                                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                                        <FontAwesomeIcon icon="fa-solid fa-ellipsis-vertical" />
                                                    </a>
                                                </div>
                                            </Dropdown>
                                        </div>
                                    }
                                </Row>
                                <label style={{ fontSize: "8pt", textDecoration: 'none', fontStyle: 'italic', color: '#4a4a4a' }}>
                                    {item.description !== null && item.description !== "" && `* ${item.description}`}
                                </label>
                            </React.Fragment>
                        </Row>
                    );
                }
            }) : null;
        }, [props.ElementList, renderElementsSwitch, getItems, props.SdvInformation, isAnswerQuery, isOpenQuery]);

        return (
            <div>
                <div className="row" style={{ marginLeft: 'unset' }}>
                    {renderContent}
                </div>
            </div>
        );
    };

    export default withTranslation()(React.memo(SubjectDetailElementList));