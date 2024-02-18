import React, { useState, useEffect, Component } from "react";
import {
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Collapse,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    Table,
    TabPane,
    Input,
    Button,
    FormGroup,
    Label
} from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { withTranslation } from "react-i18next";
import ToastComp from '../../../../components/Common/ToastComp/ToastComp';
import { GetElementNameByKey } from '../Elements/Common/utils.js'
import CodeMirror from "@uiw/react-codemirror";
import Swal from 'sweetalert2';
import AccordionComp from '../../../../components/Common/AccordionComp/AccordionComp';
import TextElementProperties from '../Elements/TextElement/textElementProperties.js';
import NumericElementProperties from '../Elements/NumericElement/numericElementProperties.js';
import ListElementsProperties from '../Elements/Common/listElementsProperties.js';
import LabelElementProperties from "../Elements/LabelElement/labelElementProperties.js";
import DateElementProperties from "../Elements/DateElement/dateElementProperties.js";
import CalculationElementProperties from "../Elements/CalculationElement/calculationElementProperties.js";
import TextareaElementProperties from "../Elements/TextareaElement/textareaElementProperties.js";
import FileUploaderElementProperties from "../Elements/FileUploaderElement/fileUploaderElementProperties.js";
import RangeSliderElementProperties from "../Elements/RangeSliderElement/rangeSliderElementProperties.js";
import DatagridElementProperties from "../Elements/DatagridElement/datagridElementProperties";
import TableElementProperties from "../Elements/TableElement/tableElementProperties";

const baseUrl = "https://localhost:7196";

class Properties extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            activeTab: props.ActiveTab,
            showWhereElementPropeties: 0,

            // General properties
            Id: props.Id,
            ParentId: props.ParentId,
            TenantId: props.TenantId,
            UserId: props.UserId,
            ModuleId: props.ModuleId,
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
            CanMissing: false,

            widthOptionGroup: [
                { label: "col-md-1", value: 1 },
                { label: "col-md-2", value: 2 },
                { label: "col-md-3", value: 3 },
                { label: "col-md-4", value: 4 },
                { label: "col-md-5", value: 5 },
                { label: "col-md-6", value: 6 },
                { label: "col-md-7", value: 7 },
                { label: "col-md-8", value: 8 },
                { label: "col-md-9", value: 9 },
                { label: "col-md-10", value: 10 },
                { label: "col-md-11", value: 11 },
                { label: "col-md-12", value: 12 },
            ],
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
            conditionOptionGroup: [
                { label: "Less", value: 1 },
                { label: "More", value: 2 },
                { label: "Equal", value: 3 },
                { label: "More and equal", value: 4 },
                { label: "Less and equal", value: 5 },
                { label: "Not equal", value: 6 },
            ],
            conditionSelectedGroup: { label: "Equal", value: 3 },
            actionOptionGroup: [
                { label: "Show", value: 1 },
                { label: "Hide", value: 2 },
            ],
            actionSelectedGroup: { label: "Show", value: 1 },
            dependentEnabled: true,

            // Relation
            RelationFieldId: 0,
            RelationVariableName: '',
            RelationMainJs: '',
            RelationSourceInputs: '',
            relationElementRows: [],
            inputCounter: 0,
            relationFieldOptionGroup: [],
            relationFieldsSelectedGroup: 0,
            fieldWidthsW: "",
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
            RowCount: 0,
            ColumnCount: 0,
            ColumnIndex: props.ColumnIndex,
            RowIndex: props.RowIndex,

            // Validation
            RequiredError: 'This value is required',
            ElementNameInputClass: 'form-control',
            DepFldInputClass: '',
            DepConInputClass: '',
            DepActInputClass: '',
            DepFldVlInputClass: 'form-control input-tag',

            IsFormValid: true
        };

        this.toastRef = React.createRef();
        this.fillDependentFieldList();
        this.getElementData();

        this.toggle = this.toggle.bind(this);
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
        this.handleRelationFieldChange = this.handleRelationFieldChange.bind(this);
        this.addRelationRow = this.addRelationRow.bind(this);
        this.handleRelationInputChange = this.handleRelationInputChange.bind(this);
        this.isRelationVariableNameDuplicate = this.isRelationVariableNameDuplicate.bind(this);
        this.removeRelationRow = this.removeRelationRow.bind(this);

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

        this.changeIsFormValid.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    renderElementPropertiesSwitch(param) {
        switch (param) {
            case 1:
                this.state.showWhereElementPropeties = 2;
                this.state.fieldWidthsW = "col-md-6";
                return <LabelElementProperties
                    changeLableTitle={this.changeLableTitle} Title={this.state.Title}
                />;
            case 2:
                this.state.showWhereElementPropeties = 0;
                this.state.fieldWidthsW = "col-md-10";
                return <TextElementProperties changeUnit={this.changeUnit} Unit={this.state.Unit} />;
            case 4:
                this.state.showWhereElementPropeties = 0;
                this.state.fieldWidthsW = "col-md-10";
                return <NumericElementProperties
                    changeUnit={this.changeUnit} Unit={this.state.Unit}
                    changeMask={this.changeMask} Mask={this.state.Mask}
                    changeLowerLimit={this.changeLowerLimit} LowerLimit={this.state.LowerLimit}
                    changeUpperLimit={this.changeUpperLimit} UpperLimit={this.state.UpperLimit}
                />;
            case 5:
                this.state.showWhereElementPropeties = 0;
                this.state.fieldWidthsW = "col-md-10";
                return <TextareaElementProperties
                    changeDefaultValue={this.changeDefaultValue} DefaultValue={this.state.DefaultValue}
                />;
            case 6:
                this.state.showWhereElementPropeties = 3;
                this.state.fieldWidthsW = "col-md-10";
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
                this.state.showWhereElementPropeties = 3;
                this.state.fieldWidthsW = "col-md-6";
                return <CalculationElementProperties
                    ModuleId={this.state.ModuleId}
                    changeMainJs={this.changeMainJs} MainJs={this.state.MainJs}
                    changeCalculationSourceInputs={this.changeCalculationSourceInputs} CalculationSourceInputs={this.state.CalculationSourceInputs}
                    changeIsFormValid={this.changeIsFormValid}
                />;
            case 8:
            case 9:
            case 10:
            case 11:
                this.state.showWhereElementPropeties = 1;
                this.state.fieldWidthsW = "col-md-10";
                return <ListElementsProperties
                    changeLayout={this.changeLayout} Layout={this.state.Layout}
                    changeSavedTagList={this.changeSavedTagList} SavedTagList={this.state.SavedTagList}
                />;
            case 12:
                this.state.showWhereElementPropeties = 1;
                this.state.fieldWidthsW = "col-md-10";
                return <FileUploaderElementProperties
                />;
            case 13:
                this.state.showWhereElementPropeties = 3;
                this.state.fieldWidthsW = "col-md-10";
                return <RangeSliderElementProperties
                    changeDefaultValue={this.changeDefaultValue} DefaultValue={this.state.DefaultValue}
                    changeLowerLimit={this.changeLowerLimit} LowerLimit={this.state.LowerLimit}
                    changeUpperLimit={this.changeUpperLimit} UpperLimit={this.state.UpperLimit}
                    changeLeftText={this.changeLeftText} LeftText={this.state.LeftText}
                    changeRightText={this.changeRightText} RightText={this.state.RightText}
                />;
            case 15:
                this.state.showWhereElementPropeties = 3;
                this.state.fieldWidthsW = "col-md-10";
                return <TableElementProperties
                    changeDatagridAndTableProperties={this.changeDatagridAndTableProperties} DatagridAndTableProperties={this.state.DatagridAndTableProperties}
                    changeColumnCount={this.changeColumnCount} ColumnCount={this.state.ColumnCount}
                    changeRowCount={this.changeRowCount} RowCount={this.state.RowCount}
                />;
            case 16:
                this.state.showWhereElementPropeties = 3;
                this.state.fieldWidthsW = "col-md-10";
                return <DatagridElementProperties
                    changeDatagridAndTableProperties={this.changeDatagridAndTableProperties} DatagridAndTableProperties={this.state.DatagridAndTableProperties}
                    changeColumnCount={this.changeColumnCount} ColumnCount={this.state.ColumnCount}
                />;
            default:
                this.state.showWhereElementPropeties = 0;
                this.state.fieldWidthsW = "col-md-10";
                return <TextElementProperties changeUnit={this.changeUnit} />;
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

        fetch(baseUrl + '/Module/GetModuleAllElements?id=' + this.state.ModuleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                data.map(item => {
                    var itm = { label: item.elementName + " - " + GetElementNameByKey(this.props, item.elementType), value: item.id };

                    //if (item.id != this.state.Id) {
                    depFldOptionGroup.push(itm);
                    //}
                });

                this.state.dependentFieldOptionGroup = depFldOptionGroup;
                this.state.relationFieldOptionGroup = depFldOptionGroup;

                if (this.state.Id != 0) {
                    var t = this.state.DependentSourceFieldId;

                    var f = this.state.dependentFieldOptionGroup.filter(function (e) {
                        if (e.value == t)
                            return e;
                    });

                    this.state.dependentFieldsSelectedGroup = f;
                }
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    }

    handleDependentFieldChange(e) {
        this.setState({ DependentSourceFieldId: e.value });
        this.setState({ DependentTargetFieldId: this.state.Id });
        this.state.dependentFieldsSelectedGroup = e;
        this.state.DepFldInputClass = '';
    };

    handleDependentConditionChange(selectedOption) {
        this.setState({ DependentCondition: selectedOption.value });
        this.state.conditionSelectedGroup = selectedOption;
        this.state.DepConInputClass = '';
    };

    handleDependentActionChange(e) {
        this.setState({ DependentAction: e.value });
        this.state.actionSelectedGroup = e;
        this.state.DepActInputClass = '';
    };

    handleDependentFieldSelectGroup = (selectedGroup) => {
        this.state.dependentFieldsSelectedGroup = selectedGroup;
    };

    handleIsDependentChange = (e) => {
        this.state.IsDependent = e.target.value == "1" ? true : false;

        if (e.target.value == "1") {
            this.setState({ dependentEnabled: false });
        }
        else {
            this.setState({ dependentEnabled: true });
            this.setState({ dependentFieldsSelectedGroup: 0 });
            this.setState({ conditionSelectedGroup: { label: "Equal", value: 3 } });
            this.setState({ actionSelectedGroup: { label: "Show", value: 1 } });
            //this.setState({ DependentFieldValue: '' });
        }
    }

    // #end region dependent

    handleIsRelationChange = (e) => {
        this.state.IsRelation = e.target.value == "1" ? true : false;

        if (e.target.value == "1") {
            this.setState({ relationEnabled: false });
        }
        else {
            this.setState({ relationEnabled: true });
        }
    }

    handleRelationFieldChange(e) {
        //this.setState({ DependentSourceFieldId: e.value });
        //this.setState({ DependentTargetFieldId: this.state.Id });
        //this.state.dependentFieldsSelectedGroup = e;
        //this.state.DepFldInputClass = '';
    };

    //changeFieldWidth = (newValue) => {
    //    this.setState({ FieldWidths: newValue });
    //};

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

    changeIsFormValid = (newValue) => {
        this.setState({ IsFormValid: newValue });
    };

    removeDependentFieldValueTag = (i) => {
        const newTags = [...this.state.DependentFieldValue];
        newTags.splice(i, 1);
        this.setState({ DependentFieldValue: newTags });
    }

    dependentFieldValueInputKeyDown = (e) => {
        const val = e.target.value;
        this.state.wth = this.state.wth + 10;

        if (e.key === 'Enter' && val) {
            if (this.state.DependentFieldValue.find(tag => tag.toLowerCase() === val.toLowerCase())) {
                return;
            }

            this.setState({ DependentFieldValue: [...this.state.DependentFieldValue, val] });
            this.tagInput.value = null;
            this.state.wth = 10;
            this.state.DepFldVlInputClass = "form-control input-tag";
        } else if (e.key === 'Backspace' && !val) {
            this.removeDependentFieldValueTag(this.state.DependentFieldValue.length - 1);
        }
    }

    removeRelationRow = (index) => {
        this.setState((prevState) => {
            const newRows = [...prevState.relationElementRows];
            newRows.splice(index, 1);
            return { relationElementRows: newRows };
        });
    };

    addRelationRow = () => {
        this.state.RelFldVlInputClass = 'table-responsive mb-3';
        this.state.inputCounter = this.state.inputCounter + 1;

        this.setState((prevState) => ({
            relationElementRows: [...prevState.relationElementRows, {
                relationFieldsSelectedGroup: this.state.relationFieldOptionGroup[0], variableName: 'A' + this.state.inputCounter
            }],
        }));
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

            this.state.IsFormValid = isVal;
        });
    };

    isRelationVariableNameDuplicate(index) {
        const variableName = this.state.relationElementRows[index].variableName;
        return this.state.relationElementRows.some((row, i) => i !== index && row.variableName === variableName);
    }

    getElementData() {
        if (this.state.Id !== 0) {
            fetch(baseUrl + '/Module/GetElementData?id=' + this.state.Id, {
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
        this.state.Title = data.title;
        this.state.ElementName = data.elementName;
        this.state.Description = data.description;
        this.state.ElementType = data.elementType;
        this.state.FieldWidths = data.width;
        this.state.Unit = data.unit != null ? data.unit : "";
        this.state.Mask = data.mask != null ? data.mask : "";
        this.state.LowerLimit = data.lowerLimit != null ? data.lowerLimit : "";
        this.state.UpperLimit = data.upperLimit != null ? data.upperLimit : "";
        this.state.Layout = data.layout;
        this.state.DefaultValue = data.defaultValue;
        this.state.AddTodayDate = data.addTodayDate;
        this.state.CalculationSourceInputs = data.calculationSourceInputs;
        this.state.MainJs = data.mainJs;
        this.state.StartDay = data.startDay;
        this.state.EndDay = data.endDay;
        this.state.StartMonth = data.startMonth;
        this.state.EndMonth = data.startMonth;
        this.state.StartYear = data.startYear;
        this.state.EndYear = data.endYear;
        this.state.IsRequired = data.isRequired;
        this.state.IsHidden = data.isHidden;
        this.state.CanMissing = data.canMissing;
        this.state.SavedTagList = data.elementOptions == null ? [] : JSON.parse(data.elementOptions);
        this.state.DatagridAndTableProperties = data.datagridAndTableProperties;
        this.state.RowCount = data.rowCount;
        this.state.ColumnCount = data.columnCount;
        this.state.IsDependent = data.isDependent;
        this.state.DependentSourceFieldId = data.dependentSourceFieldId;
        this.state.DependentTargetFieldId = data.dependentTargetFieldId;
        this.state.DependentCondition = data.dependentCondition === 0 ? 3 : data.dependentCondition;
        this.state.DependentAction = data.dependentAction === 0 ? 1 : data.dependentAction;
        this.state.DependentFieldValue = data.dependentFieldValue == "" ? [] : JSON.parse(data.dependentFieldValue);
        
        var rel = JSON.parse(data.relationSourceInputs);
        this.state.IsRelation = data.isRelated;
        this.state.RelationSourceInputs = rel != null ? data.relationSourceInputs : '';
        this.state.relationElementRows = rel != null ? rel : [];
        this.state.RelationMainJs = data.relationMainJs != null ? data.relationMainJs : '';
        this.state.inputCounter = rel != null ? rel.length : 0;

        var w = this.state.widthOptionGroup.filter(function (e) {
            if (e.value === data.width)
                return e;
        });

        this.state.widthSelectedGroup = w;

        var t = this.state.DependentSourceFieldId;

        var f = this.state.dependentFieldOptionGroup.filter(function (e) {
            if (e.value === t)
                return e;
        });

        this.state.dependentFieldsSelectedGroup = f;

        var cn = this.state.conditionOptionGroup.filter(function (e) {
            if (e.value === data.dependentCondition)
                return e;
        });

        this.state.conditionSelectedGroup = cn.length === 0 ? { label: "Equal", value: 3 } : cn;

        var ac = this.state.actionOptionGroup.filter(function (e) {
            if (e.value === data.dependentAction)
                return e;
        });

        this.state.actionSelectedGroup = ac.length === 0 ? { label: "Show", value: 1 } : ac;

        if (data.isDependent) {
            this.setState({ dependentEnabled: false });
        }
    }

    handleSaveModuleContent(e) {
        var isValid = true;
        debugger;

        if (this.state.ElementName === "") {
            this.setState({ ElementNameInputClass: "is-invalid form-control" });
            isValid = false;
        }

        if (this.state.IsDependent && (this.state.DependentSourceFieldId === 0 || this.state.DependentTargetFieldId === 0)) {
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

        if (this.state.IsDependent && this.state.DependentFieldValue === '') {
            this.setState({ DepFldVlInputClass: "form-control input-tag is-invalid" });
            isValid = false;
        }

        if (this.state.IsRelation && this.state.relationElementRows.length === 0) {
            this.setState({ RelFldVlInputClass: "table-responsive mb-3 input-tag form-control is-invalid" });
            isValid = false;
        }

        if (isValid && this.state.IsFormValid) {
            fetch(baseUrl + '/Module/SaveModuleContent', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Id: this.state.Id,
                    ParentId: this.state.ParentId,
                    ModuleId: this.state.ModuleId,
                    TenantId: this.state.TenantId,
                    UserId: this.state.UserId,
                    ElementDetailId: this.state.ElementDetailId,
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
                    IsReadonly: this.state.IsReadonly,
                    IsRelated: this.state.IsRelation,
                    CanMissing: this.state.CanMissing,

                    // Dependency properties
                    DependentSourceFieldId: this.state.DependentSourceFieldId == null ? 0 : this.state.DependentSourceFieldId,
                    DependentTargetFieldId: this.state.DependentTargetFieldId == null ? 0 : this.state.DependentTargetFieldId,
                    DependentCondition: this.state.DependentCondition,
                    DependentAction: this.state.DependentAction,
                    DependentFieldValue: JSON.stringify(this.state.DependentFieldValue),

                    // Elements properties
                    Unit: this.state.Unit,
                    //Mask: this.state.Mask,
                    LowerLimit: this.state.LowerLimit,
                    UpperLimit: this.state.UpperLimit,
                    Layout: this.state.Layout,
                    ElementOptions: this.state.SavedTagList != null ? JSON.stringify(this.state.SavedTagList) : "",
                    DefaultValue: this.state.DefaultValue,
                    AddTodayDate: this.state.AddTodayDate,
                    CalculationSourceInputs: this.state.CalculationSourceInputs,
                    RelationSourceInputs: this.state.RelationSourceInputs,
                    MainJs: this.state.MainJs,
                    RelationMainJs: this.state.RelationMainJs,
                    StartDay: this.state.StartDay,
                    EndDay: this.state.EndDay,
                    StartMonth: this.state.StartMonth,
                    EndMonth: this.state.EndMonth,
                    StartYear: this.state.StartYear,
                    EndYear: this.state.EndYear,
                    LeftText: this.state.LeftText,
                    RightText: this.state.RightText,
                    RowCount: this.state.RowCount,
                    ColumnCount: this.state.ColumnCount,
                    DatagridAndTableProperties: this.state.DatagridAndTableProperties,
                    ColumnIndex: this.state.ColumnIndex,
                    RowIndex: this.state.RowIndex
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.isSuccess) {
                        Swal.fire(data.message, '', 'success');
                    } else {
                        Swal.fire(data.message, '', 'error');
                        console.log(data.message);
                    };
                    //if (data.isSuccess) {
                    //    this.state.toastMessage = data.message;
                    //    this.state.stateToast = true;
                    //    this.state.showToast = true;
                    //} else {
                    //    this.state.toastMessage = data.message;
                    //    this.state.stateToast = false;
                    //    this.state.showToast = true;
                    //}
                })
                .catch(error => {
                    //console.error('Error:', error);
                });
        }
        else {
            e.preventDefault();
        }
    }

    componentDidMount() {
        // Add an event listener for keydown on the form element
        document.getElementById('formBuilder').addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent Enter key from submitting the form
            }
        });
    }

    render() {
        return (
            <div>
                {/*<ElementBase>*/}
                <form id="formBuilder" onSubmit={this.handleSaveModuleContent}>
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
                                                this.toggle("1");
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
                                                this.toggle("2");
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
                                                        this.toggle("3");
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
                                                        this.toggle("4");
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
                                                {this.state.showWhereElementPropeties !== 2 &&
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
                                                {this.state.showWhereElementPropeties !== 2 &&
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
                                                            {this.state.ElementType !== 16 && (
                                                                <Row className="mb-3">
                                                                    <label
                                                                        htmlFor="example-text-input"
                                                                        className="col-md-2 col-form-label"
                                                                    >
                                                                        {this.props.t("Field width")}                                                                           </label>
                                                                    <div className={this.state.fieldWidthsW}>
                                                                        <Select
                                                                            value={this.state.widthSelectedGroup}
                                                                            onChange={this.handleWidthChange}
                                                                            options={this.state.widthOptionGroup}
                                                                            placeholder={this.props.t("Select")}
                                                                            classNamePrefix="select2-selection" />
                                                                    </div>
                                                                </Row>
                                                            )}
                                                            {this.state.showWhereElementPropeties === 0 && this.renderElementPropertiesSwitch(this.state.ElementType)}
                                                            <Row className="mb-3 ml-0">
                                                                {(this.state.showWhereElementPropeties !== 2 && this.state.ElementType !== 7 && this.state.ElementType !== 12 && this.state.ElementType !== 16) &&
                                                                    <div className="form-check col-md-6">
                                                                        <input type="checkbox" className="form-check-input" checked={this.state.IsRequired} onChange={this.handleIsRequiredChange} id="isRequired" />
                                                                        <label className="form-check-label" htmlFor="isRequired">{this.props.t("Is required")}</label>
                                                                    </div>
                                                                }
                                                                <div className="form-check col-md-6">
                                                                    <input type="checkbox" className="form-check-input" checked={this.state.IsHidden} onChange={this.handleIsHiddenChange} id="isHidden" />
                                                                    <label className="form-check-label" htmlFor="isHidden">{this.props.t("Is hidden from user")}</label>
                                                                </div>
                                                            </Row>
                                                            {(this.state.showWhereElementPropeties !== 2 && this.state.ElementType !== 7) &&
                                                                <Row className="mb-3 ml-0">
                                                                    <div className="form-check col-md-6">
                                                                        <input type="checkbox" className="form-check-input" checked={this.state.CanMissing} onChange={this.handleCanMissingChange} id="canMissing" />
                                                                        <label className="form-check-label" htmlFor="canMissing">{this.props.t("Can be missing")}</label>
                                                                    </div>
                                                                </Row>}
                                                        </div>
                                                        <div>
                                                            {this.state.showWhereElementPropeties === 3 && this.renderElementPropertiesSwitch(this.state.ElementType)}
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
                                                                isDisabled={this.state.dependentEnabled} />
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
                                                <Row>
                                                    <Col sm="12">
                                                        <CardText className="mb-0">
                                                            Etsy mixtape wayfarers, ethical wes anderson tofu
                                                            before they sold out mcsweeney's organic lomo
                                                            retro fanny pack lo-fi farm-to-table readymade.
                                                            Messenger bag gentrify pitchfork tattooed craft
                                                            beer, iphone skateboard locavore carles etsy
                                                            salvia banksy hoodie helvetica. DIY synth PBR
                                                            banksy irony. Leggings gentrify squid 8-bit cred
                                                            pitchfork. Williamsburg banh mi whatever
                                                            gluten-free, carles pitchfork biodiesel fixie etsy
                                                            retro mlkshk vice blog. Scenester cred you
                                                            probably haven't heard of them, vinyl craft beer
                                                            blog stumptown. Pitchfork sustainable tofu synth
                                                            chambray yr.
                                                        </CardText>
                                                    </Col>
                                                </Row>
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
                            <input className="btn btn-primary" type="submit" value={this.props.t("Save")} />
                        </div>
                    </Col>
                </form>
                <ToastComp
                    ref={this.toastRef}
                />
            </div>

        );
    }
}

export default withTranslation()(Properties);