import React from "react";
import { Card, CardBody, CardText, Col, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane, Input, Button, Label } from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { withTranslation } from "react-i18next";
import { GetElementNameByKey, GetConditionList, GetWidth, GetActionList } from '../Elements/Common/utils.js'
import CodeMirror from "@uiw/react-codemirror";
import { startloading, endloading } from '../../../../store/loader/actions';
import AccordionComp from '../../../../components/Common/AccordionComp/AccordionComp';
import TextElementProperties from '../Elements/TextElement/textElementProperties.js';
import NumericElementProperties from '../Elements/NumericElement/numericElementProperties.js';
import ListElementsProperties from '../Elements/Common/listElementsProperties.js';
import Validation from '../Elements/Common/validation.js';
import LabelElementProperties from "../Elements/LabelElement/labelElementProperties.js";
import DateElementProperties from "../Elements/DateElement/dateElementProperties.js";
import CalculationElementProperties from "../Elements/CalculationElement/calculationElementProperties.js";
import TextareaElementProperties from "../Elements/TextareaElement/textareaElementProperties.js";
import FileUploaderElementProperties from "../Elements/FileUploaderElement/fileUploaderElementProperties.js";
import RangeSliderElementProperties from "../Elements/RangeSliderElement/rangeSliderElementProperties.js";
import DatagridElementProperties from "../Elements/DatagridElement/datagridElementProperties";
import TableElementProperties from "../Elements/TableElement/tableElementProperties";
import AdverseEventElementProperties from "../Elements/AdverseEventElement/adverseEventElementProperties";
import HiddenElementProperties from "../Elements/HiddenElement/hiddenElementProperties";
import ConcomittantMedicationElementProperties from "../Elements/ConcomittantMedicationElement/concomittantMedicationElementProperties";
import { API_BASE_URL } from '../../../../constants/endpoints';
import { GetElementPropertiesPlace, GetElementPropertiesWidth } from '../Elements/Common/ElementPropertiesPlace'
import { connect } from 'react-redux';
import { showToast } from "../../../../store/toast/actions.js";

class Properties extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: props.ActiveTab,
            showWhereElementPropeties: GetElementPropertiesPlace(props.Type),
            dispatch: props.Dispatch,

            // General properties
            Id: props.Id,
            ParentId: props.ParentId,
            TenantId: 2,
            UserId: props.UserId,
            ModuleId: props.ModuleId,
            StudyId: props.StudyId,
            FormType: props.FormType,
            IsCalcBtn: props.isCalcBtn,
            ElementDetailId: 0,
            ElementType: props.Type,
            ElementName: '',
            Title: '',
            IsTitleHidden: true,
            Order: 0,
            Description: '',
            FieldWidths: 0,
            IsHidden: false,
            IsRequired: false,
            IsDependent: false,
            IsRelation: false,
            IsReadonly: false,
            CanMissing: true,

            widthOptionGroup: GetWidth(),
            widthSelectedGroup: null,

            // Dependency properties
            DependentSourceFieldId: 0,
            DependentTargetFieldId: 0,
            DependentCondition: 3,
            DependentAction: 1,
            DependentFieldValue: [],
            DependentFieldValueTags: [],
            wth: 10,

            dependentFieldOptionGroup: [],
            dependentFieldsSelectedGroup: 0,
            conditionOptionGroup: GetConditionList(),
            conditionSelectedGroup: { label: "Equal", value: 3 },
            actionOptionGroup: GetActionList(),
            actionSelectedGroup: { label: "Show", value: 1 },
            dependentEnabled: true,

            // Relation
            RelationFieldId: 0,
            RelationVariableName: '',
            RelationMainJs: '',
            RelationSourceInputs: '',
            relationElementRows: [],
            inputCounter: 1,
            relationFieldOptionGroup: [],
            relationFieldsSelectedGroup: 0,
            fieldWidthsW: GetElementPropertiesWidth(props.Type),
            relationEnabled: true,
            RelFldVlInputClass: 'table-responsive mb-3',

            // Elements properties
            Unit: '',
            Mask: '',
            LowerLimit: '',
            UpperLimit: '',
            Layout: 0,
            SavedTagList: [],
            DefaultValue: '',
            AddTodayDate: false,
            StartDay: 1,
            EndDay: 31,
            StartMonth: 1,
            EndMonth: 12,
            StartYear: 0,
            EndYear: 0,
            CalculationSourceInputs: '',
            MainJs: '',
            LeftText: '',
            RightText: '',
            DatagridAndTableProperties: '',
            RowCount: 1,
            ColumnCount: 0,
            ColumnIndex: props.ColumnIndex == null ? 0 : props.ColumnIndex,
            RowIndex: props.RowIndex == null ? 1 : props.RowIndex,
            AdverseEventType: 1,
            TargetElementId: 0,
            ButtonText: "",

            // Filed Validation
            RequiredError: 'This value is required',
            ElementNameInputClass: 'form-control',
            DepFldInputClass: '',
            DepConInputClass: '',
            DepActInputClass: '',
            DepFldVlInputClass: 'form-control input-tag',

            IsFormValid: true,

            //Validation tab
            ValidationList: [],

        };
        
        this.toggleActiveTab = this.toggleActiveTab.bind(this);
        this.handleSaveModuleContent = this.handleSaveModuleContent.bind(this);
        this.getElementData = this.getElementData.bind(this);
        this.fillDependentFieldList = this.fillDependentFieldList.bind(this);
        this.fillElementProperties = this.fillElementProperties.bind(this);

        this.handleIdChange = this.handleIdChange.bind(this);
        this.handleModuleIdChange = this.handleModuleIdChange.bind(this);
        this.handleElementDetailIdChange = this.handleElementDetailIdChange.bind(this);
        this.handleElementNameChange = this.handleElementNameChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleIsTitleHiddenChange = this.handleIsTitleHiddenChange.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleWidthChange = this.handleWidthChange.bind(this);
        this.handleIsHiddenChange = this.handleIsHiddenChange.bind(this);
        this.handleIsRequiredChange = this.handleIsRequiredChange.bind(this);
        this.handleIsDependentChange = this.handleIsDependentChange.bind(this);
        this.handleIsRelationChange = this.handleIsRelationChange.bind(this);
        this.handleIsReadonlyChange = this.handleIsReadonlyChange.bind(this);
        this.handleCanMissingChange = this.handleCanMissingChange.bind(this);
        this.handleDependentFieldChange = this.handleDependentFieldChange.bind(this);
        this.handleDependentConditionChange = this.handleDependentConditionChange.bind(this);
        this.handleDependentActionChange = this.handleDependentActionChange.bind(this);
        this.addRelationRow = this.addRelationRow.bind(this);
        this.handleRelationInputChange = this.handleRelationInputChange.bind(this);
        this.isRelationVariableNameDuplicate = this.isRelationVariableNameDuplicate.bind(this);
        this.removeRelationRow = this.removeRelationRow.bind(this);
        this.postModuleContent = this.postModuleContent.bind(this);
        this.changeUnit.bind(this);
        this.changeMask.bind(this);
        this.changeLowerLimit.bind(this);
        this.changeUpperLimit.bind(this);
        this.changeLayout.bind(this);
        this.changeSavedTagList.bind(this);
        this.changeLableTitle.bind(this);
        this.changeDefaultValue.bind(this);
        this.changeAddTodayDate.bind(this);
        this.changeStartDay.bind(this);
        this.changeEndDay.bind(this);
        this.changeStartMonth.bind(this);
        this.changeEndMonth.bind(this);
        this.changeStartYear.bind(this);
        this.changeEndYear.bind(this);
        this.changeCalculationSourceInputs.bind(this);
        this.changeMainJs.bind(this);
        this.changeRelationMainJs.bind(this);
        this.changeLeftText.bind(this);
        this.changeRightText.bind(this);
        this.changeDatagridAndTableProperties.bind(this);
        this.changeRowCount.bind(this);
        this.changeColumnCount.bind(this);
        this.changeAdverseEventType.bind(this);
        this.changeTargetElementId.bind(this);
        this.changeButtonText.bind(this);

        this.changeIsFormValid.bind(this);

        this.changeValidationList.bind(this);
    }

    componentDidMount() {
        this.getElementData();
    }

    toggleActiveTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    renderElementPropertiesSwitch(param) {
        switch (param) {
            case 1:
                return <LabelElementProperties
                    changeLableTitle={this.changeLableTitle} Title={this.state.Title}
                />;
            case 2:
                return <TextElementProperties changeUnit={this.changeUnit} Unit={this.state.Unit} />;
            case 3:
                return <HiddenElementProperties StudyId={this.state.StudyId}
                    TargetElementId={this.state.TargetElementId} changeTargetElementId={this.changeTargetElementId} />;
            case 4:
                return <NumericElementProperties
                    changeUnit={this.changeUnit} Unit={this.state.Unit}
                    changeMask={this.changeMask} Mask={this.state.Mask}
                    changeLowerLimit={this.changeLowerLimit} LowerLimit={this.state.LowerLimit}
                    changeUpperLimit={this.changeUpperLimit} UpperLimit={this.state.UpperLimit}
                />;
            case 5:
                return <TextareaElementProperties
                    changeDefaultValue={this.changeDefaultValue} DefaultValue={this.state.DefaultValue}
                />;
            case 6:
                return <DateElementProperties
                    changeDefaultValue={this.changeDefaultValue} DefaultValue={this.state.DefaultValue}
                    changeAddTodayDate={this.changeAddTodayDate} AddTodayDate={this.state.AddTodayDate}
                    changeStartDay={this.changeStartDay} StartDay={this.state.StartDay}
                    changeEndDay={this.changeEndDay} EndDay={this.state.EndDay}
                    changeStartMonth={this.changeStartMonth} StartMonth={this.state.StartMonth}
                    changeEndMonth={this.changeEndMonth} EndMonth={this.state.EndMonth}
                    changeStartYear={this.changeStartYear} StartYear={this.state.StartYear}
                    changeEndYear={this.changeEndYear} EndYear={this.state.EndYear}
                />;
            case 7:
                return <CalculationElementProperties
                    Id={this.state.Id}
                    FormType={this.state.FormType}
                    ModuleId={this.state.ModuleId}
                    changeMainJs={this.changeMainJs} MainJs={this.state.MainJs}
                    changeCalculationSourceInputs={this.changeCalculationSourceInputs} CalculationSourceInputs={this.state.CalculationSourceInputs}
                    changeIsFormValid={this.changeIsFormValid}
                />;
            case 8:
            case 9:
            case 10:
            case 11:
                return <ListElementsProperties
                    changeLayout={this.changeLayout} Layout={this.state.Layout} Type={this.state.ElementType}
                    changeSavedTagList={this.changeSavedTagList} SavedTagList={this.state.SavedTagList}
                />;
            case 12:
                return <FileUploaderElementProperties
                />;
            case 13:
                return <RangeSliderElementProperties
                    changeDefaultValue={this.changeDefaultValue} DefaultValue={this.state.DefaultValue}
                    changeLowerLimit={this.changeLowerLimit} LowerLimit={this.state.LowerLimit}
                    changeUpperLimit={this.changeUpperLimit} UpperLimit={this.state.UpperLimit}
                    changeLeftText={this.changeLeftText} LeftText={this.state.LeftText}
                    changeRightText={this.changeRightText} RightText={this.state.RightText}
                />;
            case 14:
                return <ConcomittantMedicationElementProperties StudyId={this.state.StudyId}
                    TargetElementId={this.state.TargetElementId} changeTargetElementId={this.changeTargetElementId}
                    ButtonText={this.state.ButtonText} changeButtonText={this.changeButtonText} />;
            case 15:
                return <TableElementProperties
                    changeDatagridAndTableProperties={this.changeDatagridAndTableProperties} DatagridAndTableProperties={this.state.DatagridAndTableProperties}
                    changeColumnCount={this.changeColumnCount} ColumnCount={this.state.ColumnCount}
                    changeRowCount={this.changeRowCount} RowCount={this.state.RowCount}
                />;
            case 16:
                return <DatagridElementProperties
                    changeDatagridAndTableProperties={this.changeDatagridAndTableProperties} DatagridAndTableProperties={this.state.DatagridAndTableProperties}
                    changeColumnCount={this.changeColumnCount} ColumnCount={this.state.ColumnCount}
                />;
            case 17:
                return <AdverseEventElementProperties
                    changeAdverseEventType={this.changeAdverseEventType} AdverseEventType={this.state.AdverseEventType}
                />;
            default:
                return "";
        }
    }

    handleIdChange(e) {
        this.setState({ Id: e.target.value });
    };

    handleModuleIdChange(e) {
        this.setState({ ModuleId: e.target.value });
    };

    handleElementDetailIdChange(e) {
        this.setState({ ElementDetailId: e.target.value });
    };

    handleElementNameChange(e) {
        this.setState({ ElementName: e.target.value });
    };

    handleTitleChange(e) {
        this.setState({ Title: e.target.value });
    };

    handleIsTitleHiddenChange(e) {
        this.setState({ IsTitleHidden: e.target.value });
    };

    handleOrderChange(e) {
        this.setState({ Order: e.target.value });
    };

    handleDescriptionChange(e) {
        this.setState({ Description: e.target.value });
    };

    handleWidthChange(e) {
        this.setState({ FieldWidths: e.value });
        this.state.widthSelectedGroup = e;
    };

    handleIsHiddenChange(e) {
        this.setState((prevState) => ({
            IsHidden: !prevState.IsHidden,
        }));
    };

    handleIsRequiredChange() {
        this.setState((prevState) => ({
            IsRequired: !prevState.IsRequired,
        }));
    };

    handleIsReadonlyChange() {
        this.setState((prevState) => ({
            IsReadonly: !prevState.IsReadonly,
        }));
    };

    handleCanMissingChange() {
        this.setState((prevState) => ({
            CanMissing: !prevState.CanMissing,
        }));
    };

    // #region dependent
    fillDependentFieldList() {
        var depFldOptionGroup = [];
        var relFldOptionGroup = [];
        var url = this.state.FormType === 1 ? API_BASE_URL + "Module" : API_BASE_URL + "Study";

        fetch(url + '/GetModuleAllElements?id=' + this.state.ModuleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                data.map(item => {
                    var itm = { label: item.elementName + " - " + GetElementNameByKey(this.props, item.elementType), value: item.id };

                    if (item.id != this.state.Id) {
                        depFldOptionGroup.push(itm);
                    }

                    relFldOptionGroup.push(itm);
                });

                this.setState({
                    dependentFieldOptionGroup: depFldOptionGroup,
                });

                if (this.state.Id !== 0 && this.state.Id !== undefined) {
                    var t = this.state.DependentSourceFieldId;

                    var f = depFldOptionGroup.filter(function (e) {
                        if (e.value === t)
                            return e;
                    });
    
                    this.setState({
                        dependentFieldsSelectedGroup: f,
                    });
                }
                else {
                    const newItem = {
                        label: GetElementNameByKey(this.props, this.state.ElementType) + ' - ' + GetElementNameByKey(this.props, this.state.ElementType),
                        value: 0,
                    };

                    relFldOptionGroup.push(newItem);
                }

                this.setState({
                    relationFieldOptionGroup: relFldOptionGroup,
                });
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    }

    handleDependentFieldChange(e) {
        this.setState({
            DependentSourceFieldId: e.value,
            DependentTargetFieldId: this.state.Id,
            dependentFieldsSelectedGroup: e,
            DepFldInputClass: ''
        });
    };

    handleDependentConditionChange(selectedOption) {
        this.setState({
            DependentCondition: selectedOption.value,
            conditionSelectedGroup: selectedOption,
            DepConInputClass: ''
        });
    };

    handleDependentActionChange(e) {
        this.setState({
            DependentAction: e.value,
            actionSelectedGroup: e,
            DepActInputClass: ''
        });
    };

    handleDependentFieldSelectGroup = (selectedGroup) => {
        this.setState({
            dependentFieldsSelectedGroup: selectedGroup,
        });
    };

    handleIsDependentChange = (e) => {
        this.setState({
            IsDependent: e.target.value === "1" ? true : false,
        });

        if (e.target.value === "1") {
            this.setState({ dependentEnabled: false });
        }
        else {
            this.setState({ dependentEnabled: true });
            this.setState({ dependentFieldsSelectedGroup: 0 });
            this.setState({ conditionSelectedGroup: { label: "Equal", value: 3 } });
            this.setState({ actionSelectedGroup: { label: "Show", value: 1 } });
        }
    }

    // #end region dependent

    handleIsRelationChange = (e) => {
        this.setState({ IsRelation: e.target.value === "1" ? true : false });

        if (e.target.value === "1") {
            this.setState({ relationEnabled: false });
        }
        else {
            this.setState({ relationEnabled: true });
        }
    }

    changeUnit = (newValue) => {
        this.setState({ Unit: newValue });
    };

    changeMask = (newValue) => {
        this.setState({ Mask: newValue });
    };

    changeLowerLimit = (newValue) => {
        this.setState({ LowerLimit: newValue });
    };

    changeUpperLimit = (newValue) => {
        this.setState({ UpperLimit: newValue });
    };

    changeLayout = (newValue) => {
        this.setState({ Layout: newValue });
    };

    changeSavedTagList = (newValue) => {
        this.setState({ SavedTagList: newValue });
    };

    changeLableTitle = (newValue) => {
        this.setState({ Title: newValue });
    };

    changeDefaultValue = (newValue) => {
        this.setState({ DefaultValue: newValue });
    };

    changeAddTodayDate = (newValue) => {
        this.setState({ AddTodayDate: newValue });
    };

    changeStartDay = (newValue) => {
        this.setState({ StartDay: newValue });
    };

    changeEndDay = (newValue) => {
        this.setState({ EndDay: newValue });
    };

    changeStartMonth = (newValue) => {
        this.setState({ StartMonth: newValue });
    };

    changeEndMonth = (newValue) => {
        this.setState({ EndMonth: newValue });
    };

    changeStartYear = (newValue) => {
        this.setState({ StartYear: newValue });
    };

    changeEndYear = (newValue) => {
        this.setState({ EndYear: newValue });
    };

    changeCalculationSourceInputs = (newValue) => {
        this.setState({ CalculationSourceInputs: newValue });
    };

    changeMainJs = (newValue) => {
        this.setState({ MainJs: newValue });
    };

    changeRelationMainJs = (newValue) => {
        this.setState({ RelationMainJs: newValue });
    };

    changeLeftText = (newValue) => {
        this.setState({ LeftText: newValue });
    };

    changeRightText = (newValue) => {
        this.setState({ RightText: newValue });
    };

    changeDatagridAndTableProperties = (newValue) => {
        this.setState({ DatagridAndTableProperties: newValue });
    };

    changeRowCount = (newValue) => {
        this.setState({ RowCount: newValue });
    };

    changeColumnCount = (newValue) => {
        this.setState({ ColumnCount: newValue });
    };

    changeAdverseEventType = (newValue) => {
        this.setState({ AdverseEventType: newValue });
    };

    changeTargetElementId = (newValue) => {
        this.setState({ TargetElementId: newValue });
    };

    changeButtonText = (newValue) => {
        this.setState({ ButtonText: newValue });
    };

    changeIsFormValid = (newValue) => {
        this.setState({ IsFormValid: newValue });
    };

    changeValidationList = (newValue) => {
        this.setState({ ValidationList: newValue });
    };

    removeDependentFieldValueTag = (i) => {
        const newTags = [...this.state.DependentFieldValue];
        newTags.splice(i, 1);
        this.setState({ DependentFieldValue: newTags });
    }

    dependentFieldValueInputKeyDown = (e) => {
        const val = e.target.value;
        this.setState({ wth: this.state.wth + 10 });

        if (e.key === 'Enter' && val) {
            if (this.state.DependentFieldValue.find(tag => tag === val)) {
                return;
            }

            this.setState({
                DependentFieldValue: [...this.state.DependentFieldValue, val],
                wth: 10,
                DepFldVlInputClass: "form-control input-tag"
            });

            this.tagInput.value = null;
        } else if (e.key === 'Backspace' && !val) {
            this.removeDependentFieldValueTag(this.state.DependentFieldValue.length - 1);
        }
    }

    removeRelationRow = (index) => {
        this.setState((prevState) => {
            const newRows = [...prevState.relationElementRows];
            newRows.splice(index, 1);
            return { relationElementRows: newRows };
        }, () => {
            this.setState({ RelationSourceInputs: JSON.stringify(this.state.relationElementRows) });
        });
    };

    addRelationRow = () => {
        this.setState({
            RelFldVlInputClass: 'table-responsive mb-3',
            inputCounter: this.state.inputCounter + 1
        });

        this.setState((prevState) => ({
            relationElementRows: [...prevState.relationElementRows, {
                relationFieldsSelectedGroup: this.state.relationFieldOptionGroup[0], variableName: 'A' + this.state.inputCounter
            }],
        }), () => {
            this.setState({ RelationSourceInputs: JSON.stringify(this.state.relationElementRows) });
        });
    };

    handleRelationInputChange = (index, fieldName, value) => {
        this.setState((prevState) => {
            const newRows = [...prevState.relationElementRows];
            newRows[index][fieldName] = value;
            return { relationElementRows: newRows };
        }, () => {
            this.setState({ RelationSourceInputs: JSON.stringify(this.state.relationElementRows) });
            var isVal = true;

            for (var i = 0; i < this.state.relationElementRows.length; i++) {
                var chkDup = this.isRelationVariableNameDuplicate(i);

                if (chkDup) {
                    isVal = false;
                    break;
                }
            }

            this.setState({ IsFormValid: isVal });
        });
    };

    isRelationVariableNameDuplicate(index) {
        const variableName = this.state.relationElementRows[index].variableName;
        return this.state.relationElementRows.some((row, i) => i !== index && row.variableName === variableName);
    }

    getElementData() {
        if (this.state.Id !== 0 && this.state.Id !== undefined) {
            var url = this.state.FormType === 1 ? API_BASE_URL + "Module" : API_BASE_URL + "Study";

            fetch(url + '/GetElementData?id=' + this.state.Id, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    this.fillElementProperties(data);
                })
                .catch(error => {
                    //console.error('Error:', error);
                });
        }
        //else {
        //    this.fillDependentFieldList();
        //}
    }

    fillElementProperties(data) {
        this.setState({
            Title: data.title,
            ElementName: data.elementName,
            Description: data.description,
            ElementType: data.elementType,
            FieldWidths: data.width,
            Unit: data.unit != null ? data.unit : "",
            Mask: data.mask != null ? data.mask : "",
            LowerLimit: data.lowerLimit != null ? data.lowerLimit : "",
            UpperLimit: data.upperLimit != null ? data.upperLimit : "",
            LeftText: data.leftText != null ? data.leftText : "",
            RightText: data.rightText != null ? data.rightText : "",

            Layout: data.layout,
            DefaultValue: data.defaultValue,
            AddTodayDate: data.addTodayDate,
            CalculationSourceInputs: data.calculationSourceInputs,
            MainJs: data.mainJs,
            StartDay: data.startDay,
            EndDay: data.endDay,
            StartMonth: data.startMonth,
            EndMonth: data.endMonth,
            StartYear: data.startYear,
            EndYear: data.endYear,
            IsRequired: data.isRequired,
            IsHidden: data.isHidden,
            CanMissing: data.canMissing,
            SavedTagList: data.elementOptions == null || data.elementOptions === "" ? [] : JSON.parse(data.elementOptions),
            DatagridAndTableProperties: data.datagridAndTableProperties,
            RowCount: data.rowCount,
            ColumnCount: data.columnCount,
            AdverseEventType: data.adverseEventType,
            TargetElementId: data.targetElementId === null ? 0 : data.targetElementId,
            ButtonText: data.buttonText !== null ? data.buttonText : "",

            IsDependent: data.isDependent,
            DependentSourceFieldId: data.dependentSourceFieldId,
            DependentTargetFieldId: data.dependentTargetFieldId,
            DependentCondition: data.dependentCondition === 0 ? 3 : data.dependentCondition,
            DependentAction: data.dependentAction === 0 ? 1 : data.dependentAction,
            DependentFieldValue: data.dependentFieldValue === "" ? [] : JSON.parse(data.dependentFieldValue),

            showWhereElementPropeties: GetElementPropertiesPlace(data.elementType),
            fieldWidthsW: GetElementPropertiesWidth(data.elementType)
        });

        var rel = data.relationSourceInputs !== "" ? JSON.parse(data.relationSourceInputs) : '';

        this.setState({
            IsRelation: data.isRelated,
            RelationSourceInputs: rel != null && rel !== "" ? data.relationSourceInputs : '',
            relationElementRows: rel != null && rel !== "" ? rel : [],
            RelationMainJs: data.relationMainJs != null ? data.relationMainJs : '',
            inputCounter: rel != null && rel !== "" ? rel.length : 0,
        });

        var w = this.state.widthOptionGroup.filter(function (e) {
            if (e.value === data.width)
                return e;
        });

        this.setState({ widthSelectedGroup: w.length > 0 ? w[0] : null });

        var t = this.state.DependentSourceFieldId;

        var f = this.state.dependentFieldOptionGroup.filter(function (e) {
            if (e.value === t)
                return e;
        });

        this.setState({ dependentFieldsSelectedGroup: f });

        var cn = this.state.conditionOptionGroup.filter(function (e) {
            if (e.value === data.dependentCondition)
                return e;
        });

        this.setState({ conditionSelectedGroup: cn.length === 0 ? { label: "Equal", value: 3 } : cn });

        var ac = this.state.actionOptionGroup.filter(function (e) {
            if (e.value === data.dependentAction)
                return e;
        });

        this.setState({ actionSelectedGroup: ac.length === 0 ? { label: "Show", value: 1 } : ac });

        if (data.isDependent) {
            this.setState({ dependentEnabled: false });
        }

        this.setState({ ValidationList: data.validationList }, this.fillDependentFieldList());
    }

    postModuleContent() {
        var bdy = JSON.stringify({
            Id: this.state.Id,
            ModuleId: this.state.ModuleId,
            TenantId: this.state.TenantId,
            UserId: this.state.UserId,
            ElementDetailId: this.state.ElementDetailId,
            ParentId: this.state.ParentId,
            ElementType: this.state.ElementType,
            ElementName: this.state.ElementName,
            Title: this.state.Title,
            IsTitleHidden: this.state.IsTitleHidden,
            Order: this.state.Order,
            Description: this.state.Description,
            Width: this.state.FieldWidths,
            IsHidden: this.state.IsHidden,
            IsRequired: this.state.IsRequired,
            IsDependent: this.state.IsDependent,
            IsRelated: this.state.IsRelation,
            IsReadonly: this.state.IsReadonly,
            CanMissing: this.state.CanMissing,

            // Elements properties
            DefaultValue: this.state.DefaultValue,
            Unit: this.state.Unit,
            Mask: this.state.Mask,
            LowerLimit: this.state.LowerLimit,
            UpperLimit: this.state.UpperLimit,
            Layout: this.state.Layout,
            StartDay: this.state.StartDay !== undefined ? this.state.StartDay : 0,
            EndDay: this.state.EndDay !== undefined ? this.state.EndDay : 0,
            StartMonth: this.state.StartMonth !== undefined ? this.state.StartMonth : 0,
            EndMonth: this.state.EndMonth !== undefined ? this.state.EndMonth : 0,
            StartYear: this.state.StartYear !== undefined ? this.state.StartYear : 0,
            EndYear: this.state.EndYear !== undefined ? this.state.EndYear : 0,
            AddTodayDate: this.state.AddTodayDate,
            ElementOptions: this.state.SavedTagList != null && this.state.SavedTagList.length > 0 ? JSON.stringify(this.state.SavedTagList) : "",
            LeftText: this.state.LeftText,
            RightText: this.state.RightText,
            CalculationSourceInputs: this.state.CalculationSourceInputs,
            MainJs: this.state.MainJs,
            RowCount: this.state.RowCount,
            ColumnCount: this.state.ColumnCount,
            DatagridAndTableProperties: this.state.DatagridAndTableProperties === null ? "" : this.state.DatagridAndTableProperties,
            RowIndex: this.state.RowIndex,
            ColumnIndex: this.state.ColumnIndex,
            AdverseEventType: this.state.AdverseEventType !== null ? this.state.AdverseEventType : 0,
            TargetElementId: this.state.TargetElementId,
            TargetElementName: "",
            ButtonText: this.state.ButtonText,

            // Dependency properties
            DependentSourceFieldId: this.state.DependentSourceFieldId == null ? 0 : this.state.DependentSourceFieldId,
            DependentTargetFieldId: this.state.DependentTargetFieldId == null ? 0 : this.state.DependentTargetFieldId,
            DependentCondition: this.state.DependentCondition,
            DependentAction: this.state.DependentAction,
            DependentFieldValue: this.state.DependentFieldValue.length > 0 ? JSON.stringify(this.state.DependentFieldValue) : "",

            RelationSourceInputs: this.state.RelationSourceInputs,
            RelationMainJs: this.state.RelationMainJs,

            ChildElements: [],
            VariableName: "",

            // Validation
            HasValidation: this.state.ValidationList !== "[]" && this.state.ValidationList.length > 0 ? true : false,
            ValidationList: this.state.ValidationList.length > 0 ? JSON.stringify(this.state.ValidationList) : "",
        });

        var url = this.state.FormType === 1 ? API_BASE_URL + "Module" : API_BASE_URL + "Study";
        this.state.dispatch(startloading());

        fetch(url + '/SaveModuleContent', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: bdy
        }).then(res => {
            return res.json()
        }).then(data => {
            this.state.dispatch(startloading());
            if (data.isSuccess) {
                this.props.showToast(this.props.t(data.message), true, true);
                window.location.reload();
            } else {
                this.props.showToast(this.props.t(data.message), true, false);
            }
            this.state.dispatch(endloading());
        }).catch(error => {
            this.props.showToast(this.props.t("An unexpected error occurred."), true, false);
        });
    }


    handleSaveModuleContent(e) {
        var isValid = true;

        if (this.state.ElementName === "") {
            this.setState({ ElementNameInputClass: "is-invalid form-control" });
            isValid = false;
        }

        if (this.state.IsDependent && (this.state.DependentSourceFieldId === 0)) {
            this.setState({ DepFldInputClass: "form-control is-invalid" });
            isValid = false;
        }

        if (this.state.IsDependent && this.state.DependentCondition === 0) {
            this.setState({ DepConInputClass: "form-control is-invalid" });
            isValid = false;
        }

        if (this.state.IsDependent && this.state.DependentAction === 0) {
            this.setState({ DepActInputClass: "form-control is-invalid" });
            isValid = false;
        }

        if (this.state.IsDependent && this.state.DependentFieldValue.length === 0) {
            this.setState({ DepFldVlInputClass: "form-control input-tag is-invalid" });
            isValid = false;
        }

        if (this.state.IsRelation && this.state.relationElementRows.length === 0) {
            this.setState({ RelFldVlInputClass: "table-responsive mb-3 input-tag form-control is-invalid" });
            isValid = false;
        }

        if (isValid && this.state.IsFormValid) {
            if (this.state.DatagridAndTableProperties !== null && this.state.DatagridAndTableProperties !== "") {
                const data = JSON.parse(this.state.DatagridAndTableProperties);
                const newDatagridTable = data.map(item => {
                    return {
                        ...item,
                        title: item.title.trim()
                    };
                });
                this.setState({
                    DatagridAndTableProperties: JSON.stringify(newDatagridTable)
                }, () => {
                    this.postModuleContent();
                });
            } else {
                this.postModuleContent();
            }
        }
        else {
            e.preventDefault();
        }
    }

    //componentDidMount() {
    //    // Add an event listener for keydown on the form element
    //    document.getElementById('formBuilder').addEventListener('keydown', (event) => {
    //        if (event.key === 'Enter') {
    //            event.preventDefault(); // Prevent Enter key from submitting the form
    //        }
    //    });
    //}

    render() {
        return (
            <div>
                {/*<ElementBase>*/}
                {/*<form id="formBuilder" onSubmit={this.handleSaveModuleContent}>*/}
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.activeTab === "1",
                                        })}
                                        onClick={() => {
                                            this.toggleActiveTab("1");
                                        }}
                                    >
                                        {this.props.t("General")}
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: this.state.activeTab === "2",
                                        })}
                                        onClick={() => {
                                            this.toggleActiveTab("2");
                                        }}
                                    >
                                        {this.props.t("Dependency")}
                                    </NavLink>
                                </NavItem>
                                {this.state.showWhereElementPropeties !== 2 &&
                                    <>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: this.state.activeTab === "3",
                                                })}
                                                onClick={() => {
                                                    this.toggleActiveTab("3");
                                                }}
                                            >
                                                {this.props.t("Validation")}
                                            </NavLink>
                                        </NavItem><NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: this.state.activeTab === "4",
                                                })}
                                                onClick={() => {
                                                    this.toggleActiveTab("4");
                                                }}
                                            >
                                                {this.props.t("Metadata")}
                                            </NavLink>
                                        </NavItem>
                                    </>
                                }
                            </Nav>

                            <TabContent activeTab={this.state.activeTab} className="p-3 text-muted">
                                <TabPane tabId="1">
                                    <Row>
                                        <Col sm="12">
                                            {this.state.showWhereElementPropeties === 2 && this.renderElementPropertiesSwitch(this.state.ElementType)}
                                            {this.state.showWhereElementPropeties !== 2 && this.state.ElementType !== 3 &&
                                                <Row className="mb-3">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        {this.props.t("Title")}
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            value={this.state.Title}
                                                            onChange={this.handleTitleChange}
                                                            className="form-control"
                                                            type="text"
                                                            placeholder={this.props.t("Title")}

                                                        />
                                                    </div>
                                                </Row>
                                            }
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    {this.props.t("Input name")}
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        value={this.state.ElementName}
                                                        onChange={this.handleElementNameChange}
                                                        className={this.state.ElementNameInputClass}
                                                        type="text"
                                                        placeholder={this.props.t("Input name")}
                                                    />
                                                    <div type="invalid" className="invalid-feedback">{this.state.RequiredError}</div>
                                                </div>
                                            </Row>
                                            {this.state.showWhereElementPropeties !== 2 && this.state.ElementType !== 3 &&
                                                <Row className="mb-3">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        {this.props.t("Description")}
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            value={this.state.Description}
                                                            onChange={this.handleDescriptionChange}
                                                            className="form-control"
                                                            type="text"
                                                            placeholder={this.props.t("Description")}
                                                        />
                                                    </div>
                                                </Row>
                                            }
                                            <AccordionComp title="Advanced options" isOpened={this.state.IsCalcBtn} body={
                                                <>
                                                    <div>
                                                        {/*<FieldWidths changeFieldWidth={this.changeFieldWidth} Width={this.state.FieldWidths}></FieldWidths>*/}
                                                        {this.state.ElementType !== 16 && this.state.ElementType !== 3 && (
                                                            <Row className="mb-3">
                                                                <label
                                                                    htmlFor="example-text-input"
                                                                    className="col-md-2 col-form-label"
                                                                >
                                                                    {this.props.t("Field width")}
                                                                </label>
                                                                <div className={this.state.fieldWidthsW}>
                                                                    <Select
                                                                        value={this.state.widthSelectedGroup || this.state.widthOptionGroup[11]}
                                                                        onChange={this.handleWidthChange}
                                                                        options={this.state.widthOptionGroup}
                                                                        placeholder={this.props.t("Select")}
                                                                        classNamePrefix="select2-selection" />
                                                                </div>
                                                            </Row>
                                                        )}
                                                        {this.state.showWhereElementPropeties === 0 && this.state.ElementType !== 7 && this.renderElementPropertiesSwitch(this.state.ElementType)}
                                                        <Row className="mb-3 ml-0">
                                                            {(this.state.showWhereElementPropeties !== 2 && this.state.ElementType !== 7 && this.state.ElementType !== 12 && this.state.ElementType !== 16 && this.state.ElementType !== 17 && this.state.ElementType !== 3 && this.state.ElementType !== 14 && this.state.ElementType !== 15 && this.state.ElementType !== 1 && this.state.ElementType !== 18) &&
                                                                <div className="form-check col-md-6">
                                                                    <input type="checkbox" className="form-check-input" checked={this.state.IsRequired} onChange={this.handleIsRequiredChange} id="isRequired" />
                                                                    <label className="form-check-label" htmlFor="isRequired">{this.props.t("Is required")}</label>
                                                                </div>
                                                            }
                                                            {this.state.ElementType !== 3 &&
                                                                <div className="form-check col-md-6">
                                                                    <input type="checkbox" className="form-check-input" checked={this.state.IsHidden} onChange={this.handleIsHiddenChange} id="isHidden" />
                                                                    <label className="form-check-label" htmlFor="isHidden">{this.props.t("Is hidden from user")}</label>
                                                                </div>
                                                            }
                                                        </Row>
                                                        {(this.state.showWhereElementPropeties !== 2 && this.state.ElementType !== 3 && this.state.ElementType !== 7 && this.state.ElementType !== 12 && this.state.ElementType !== 15 && this.state.ElementType !== 16 && this.state.ElementType !== 17 && this.state.ElementType !== 1 && this.state.ElementType !== 18) &&
                                                            <Row className="mb-3 ml-0">
                                                                <div className="form-check col-md-6">
                                                                    <input type="checkbox" className="form-check-input" checked={this.state.CanMissing} onChange={this.handleCanMissingChange} id="canMissing" />
                                                                    <label className="form-check-label" htmlFor="canMissing">{this.props.t("Missing data")}</label>
                                                                </div>
                                                            </Row>
                                                        }
                                                    </div>
                                                    <div>
                                                        {(this.state.showWhereElementPropeties === 3 || this.state.ElementType === 7) && this.renderElementPropertiesSwitch(this.state.ElementType)}
                                                    </div>
                                                </>
                                            } />
                                            <div>
                                                {this.state.showWhereElementPropeties === 1 && this.renderElementPropertiesSwitch(this.state.ElementType)}
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2">
                                    <Row>
                                        <Col sm="12">
                                            <div className="mb-3">
                                                <Label className="form-label mb-3 d-flex">Is dependent</Label>
                                                <div className="form-check form-check-inline">
                                                    <Input
                                                        type="radio"
                                                        value="1"
                                                        className="form-check-input"
                                                        checked={this.state.IsDependent === true}
                                                        onChange={this.handleIsDependentChange}
                                                    />
                                                    <Label
                                                        className="form-check-label"
                                                    >
                                                        {this.props.t("Yes")}
                                                    </Label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <Input
                                                        type="radio"
                                                        value="0"
                                                        className="form-check-input"
                                                        checked={this.state.IsDependent === false}
                                                        onChange={this.handleIsDependentChange}
                                                    />
                                                    <Label
                                                        className="form-check-label"
                                                    >
                                                        {this.props.t("No")}
                                                    </Label>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    {this.state.IsDependent === true && (
                                        <>
                                            <Row>
                                                <Col sm="12">
                                                    <div className="mb-3">
                                                        <Label>{this.props.t("Dependent field")}</Label>
                                                        <Select
                                                            value={this.state.dependentFieldsSelectedGroup}
                                                            onChange={this.handleDependentFieldChange}
                                                            options={this.state.dependentFieldOptionGroup}
                                                            classNamePrefix="select2-selection"
                                                            placeholder={this.props.t("Select")}
                                                            className={this.state.DepFldInputClass}
                                                            isDisabled={this.state.dependentEnabled}
                                                            filterOption={(option, query) =>
                                                                String(option.data.label)
                                                                    .toLocaleLowerCase('tr')
                                                                    .includes(query.toLocaleLowerCase('tr'))
                                                            }
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm="4">
                                                    <div className="mb-3">
                                                        <Label>{this.props.t("Dependency condition")}</Label>
                                                        <Select
                                                            value={this.state.conditionSelectedGroup}
                                                            onChange={this.handleDependentConditionChange}
                                                            options={this.state.conditionOptionGroup}
                                                            classNamePrefix="select2-selection"
                                                            placeholder={this.props.t("Select")}
                                                            className={this.state.DepConInputClass}
                                                            isDisabled={this.state.dependentEnabled} />
                                                    </div>
                                                </Col>
                                                <Col sm="4">
                                                    <div className="mb-3">
                                                        <Label>{this.props.t("Dependency action")}</Label>
                                                        <Select
                                                            value={this.state.actionSelectedGroup}
                                                            onChange={this.handleDependentActionChange}
                                                            options={this.state.actionOptionGroup}
                                                            classNamePrefix="select2-selection"
                                                            placeholder={this.props.t("Select")}
                                                            className={this.state.DepActInputClass}
                                                            isDisabled={this.state.dependentEnabled} />
                                                    </div>
                                                </Col>
                                                <Col sm="4">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-12 col-form-label"
                                                    >
                                                        {this.props.t("Dependent filed value")}
                                                    </label>
                                                    <div className={this.state.DepFldVlInputClass}>
                                                        <div className="input-tag__tags">
                                                            {this.state.DependentFieldValue.map((tag, i) => (
                                                                <p key={tag}>
                                                                    {tag}
                                                                    <button type="button" style={{ background: 'none' }} onClick={() => { this.removeDependentFieldValueTag(i); }}>+</button>
                                                                </p>
                                                            ))}
                                                            <p className="input-tag__tags__input"><input type="text" style={{ width: this.state.wth + 'px' }} onKeyDown={this.dependentFieldValueInputKeyDown} onKeyUp={this.inputKeyUp} ref={c => { this.tagInput = c; }} /></p>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                    <Row>
                                        <div className="mb-3">
                                            <Label className="form-label mb-3 d-flex">{this.props.t("Is related")}</Label>
                                            <div className="form-check form-check-inline">
                                                <Input
                                                    type="radio"
                                                    value="1"
                                                    className="form-check-input"
                                                    checked={this.state.IsRelation === true}
                                                    onChange={this.handleIsRelationChange}
                                                />
                                                <Label
                                                    className="form-check-label" htmlFor="relatedRadioInline"
                                                >
                                                    {this.props.t("Yes")}
                                                </Label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <Input
                                                    type="radio"
                                                    value="0"
                                                    className="form-check-input"
                                                    checked={this.state.IsRelation === false}
                                                    onChange={this.handleIsRelationChange}
                                                />
                                                <Label
                                                    className="form-check-label" htmlFor="customRadioInline2"
                                                >
                                                    {this.props.t("No")}
                                                </Label>
                                            </div>
                                        </div>
                                    </Row>
                                    {this.state.IsRelation === true && (
                                        <Row className="mb-3">
                                            <div className={this.state.RelFldVlInputClass}>
                                                <Table className="table table-hover mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>{this.props.t("Source input name")}</th>
                                                            <th>{this.props.t("Variable name")}</th>
                                                            <th>{this.props.t("Action")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.relationElementRows.map((row, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <Select
                                                                        value={row.relationFieldsSelectedGroup}
                                                                        onChange={(e) => this.handleRelationInputChange(index, 'relationFieldsSelectedGroup', e)}
                                                                        options={this.state.relationFieldOptionGroup}
                                                                        classNamePrefix="select2-selection"
                                                                        className="form-control"
                                                                        placeholder={this.props.t("Select")}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        style={{ fontSize: '8pt' }}
                                                                        value={row.variableName}
                                                                        className={`form-control ${this.isRelationVariableNameDuplicate(index) ? 'is-invalid' : ''}`}
                                                                        type="text"
                                                                        placeholder="Variable name"
                                                                        onChange={(e) => this.handleRelationInputChange(index, 'variableName', e.target.value)}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Button className="actionBtn" onClick={() => this.removeRelationRow(index)}>
                                                                        <i className="far fa-trash-alt"></i>
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                <Button color="success" onClick={this.addRelationRow} className='mt-1'>
                                                    {this.props.t("Add another")}
                                                </Button>
                                            </div>
                                            <div style={{ border: "#eee 1px solid", borderRadius: '5px' }}>
                                                <div style={{ borderBottom: '#eee 1px solid' }}>
                                                    <label>
                                                        {this.props.t("Javascript editor")}
                                                    </label>
                                                </div>
                                                <CodeMirror
                                                    value={this.state.RelationMainJs}
                                                    onChange={this.changeRelationMainJs}
                                                    height="100px"
                                                />
                                            </div>
                                        </Row>
                                    )}
                                </TabPane>
                                {this.state.showWhereElementPropeties !== 2 &&
                                    <>
                                        <TabPane tabId="3">
                                            {this.state.activeTab === '3' && (
                                                <Row>
                                                    <Validation StudyId={this.state.StudyId}
                                                        ValidationList={this.state.ValidationList} changeValidationList={this.changeValidationList}
                                                        changeIsFormValid={this.changeIsFormValid}
                                                    />
                                                </Row>
                                            )}
                                        </TabPane>
                                        <TabPane tabId="4">
                                            <Row>
                                                <Col sm="12">
                                                    <CardText className="mb-0">
                                                        Trust fund seitan letterpress, keytar raw denim
                                                        keffiyeh etsy art party before they sold out
                                                        master cleanse gluten-free squid scenester freegan
                                                        cosby sweater. Fanny pack portland seitan DIY, art
                                                        party locavore wolf cliche high life echo park
                                                        Austin. Cred vinyl keffiyeh DIY salvia PBR, banh
                                                        mi before they sold out farm-to-table VHS viral
                                                        locavore cosby sweater. Lomo wolf viral, mustache
                                                        readymade thundercats keffiyeh craft beer marfa
                                                        ethical. Wolf salvia freegan, sartorial keffiyeh
                                                        echo park vegan.
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </>
                                }
                            </TabContent>
                        </CardBody>
                    </Card>
                    <div style={{ float: 'right' }}>
                        <input className="btn btn-primary" type="button" onClick={this.handleSaveModuleContent} value={this.props.t("Save")} />
                    </div>
                </Col>
            </div>

        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    showToast: (message, autoHide, stateToast) => dispatch(showToast(message, autoHide, stateToast))
});

export default connect(null, mapDispatchToProps)(withTranslation()(Properties));