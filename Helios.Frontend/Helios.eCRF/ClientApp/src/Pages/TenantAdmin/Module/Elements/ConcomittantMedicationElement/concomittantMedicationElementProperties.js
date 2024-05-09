import React, { Component, useState, useContext, Form, FormField, TextBox, ComboBox, CheckBox, LinkButton } from 'react';
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
    TabPane,
} from "reactstrap";
import Select from "react-select";
import { GetElementNameByKey } from '../Common/utils.js'
import { withTranslation } from "react-i18next";
import { API_BASE_URL } from '../../../../../constants/endpoints';

class ConcomittantMedicationElementProperties extends Component {
    constructor(props) {
        super(props);

        this.state = {
            StudyId: props.StudyId,
            TargetElementId: props.TargetElementId,
            ButtonText: props.ButtonText,
            visitList: [],
            visitOptionGroup: [],
            visitSelectedGroup: null,
            pageList: [],
            pageOptionGroup: [],
            pageSelectedGroup: null,
            pageDisable: true,
            moduleList: [],
            moduleOptionGroup: [],
            moduleSelectedGroup: null,
            moduleDisable: true,
            elementList: [],
            elementOptionGroup: [],
            elementSelectedGroup: null,
            elementDisable: true
        }

        this.handleButtonTextChange = this.handleButtonTextChange.bind(this);
        this.handleVisitChange = this.handleVisitChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleModuleChange = this.handleModuleChange.bind(this);
        this.handleElementChange = this.handleElementChange.bind(this);
        this.getVisitList = this.getVisitList.bind(this);

        this.getVisitList();
    }

    handleButtonTextChange(e) {
        this.setState({ ButtonText: e.target.value });
        this.props.changeButtonText(e.target.value);
    }

    getVisitList() {
        var vstOptionGroup = [];

        fetch(API_BASE_URL + `/Study/GetVisits/${this.state.StudyId}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                this.state.visitList = data;

                data.map(item => {
                    var itm = { label: item.name, value: item.id };
                    vstOptionGroup.push(itm);

                });

                this.state.visitOptionGroup = vstOptionGroup;

                if (this.state.TargetElementId !== 0) {
                    this.fillSelects();
                }
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    }

    fillSelects() {
        fetch(API_BASE_URL + "/Study/GetVisitCollectionInfo?elementId=" + this.state.TargetElementId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                var selectedOption = [];
                this.state.visitOptionGroup.filter(function (e) {
                    if (e.value === data.studyVisitId)
                        selectedOption = e;
                });

                this.state.visitSelectedGroup = selectedOption;
                this.fillPageSelect(data.studyVisitId)

                this.state.pageOptionGroup.filter(function (e) {
                    if (e.value === data.studyVisitPageId)
                        selectedOption = e;
                });

                this.state.pageSelectedGroup = selectedOption;
                this.fillModuleSelect(data.studyVisitPageId);

                this.state.moduleOptionGroup.filter(function (e) {
                    if (e.value === data.studyVisitModuleId)
                        selectedOption = e;
                });

                this.state.moduleSelectedGroup = selectedOption;
                this.fillElementSelect();
            })
            .catch(error => {
            });
    }

    handleVisitChange(e) {
        this.state.pageList = [];
        this.state.visitSelectedGroup = e;

        this.fillPageSelect(e.value);
    };

    fillPageSelect(id) {
        var pageOptionGroup = [];

        this.state.visitList.map(item => {
            if (item.id === id) {
                item.children.map(chld => {
                    this.state.pageList.push(chld);
                    var itm = { label: chld.name, value: chld.id };
                    pageOptionGroup.push(itm);
                });

                this.state.pageDisable = false;
                this.state.pageOptionGroup = pageOptionGroup;
            }
        });
    }

    handlePageChange(e) {
        this.state.moduleList = [];
        this.state.pageSelectedGroup = e;
        this.fillModuleSelect(e.value);
    };

    fillModuleSelect(id) {
        var mdlOptionGroup = [];

        this.state.pageList.map(item => {
            if (item.id === id) {
                item.children.map(chld => {
                    this.state.moduleList.push(chld);
                    var itm = { label: chld.name, value: chld.id };
                    mdlOptionGroup.push(itm);
                });

                this.state.moduleDisable = false;
                this.state.moduleOptionGroup = mdlOptionGroup;
            }
        });
    }

    handleModuleChange(e) {
        this.state.moduleSelectedGroup = e;
        this.fillElementSelect();
    };


    fillElementSelect() {
        var elmOptionGroup = [];
        var tarId = this.state.TargetElementId;
        var selectedOption = [];
        
        fetch(API_BASE_URL + '/Study/GetModuleAllElements?id=' + this.state.moduleSelectedGroup.value, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                data.map(item => {
                    var itm = { label: item.elementName + " - " + GetElementNameByKey(this.props, item.elementType), value: item.id };

                    elmOptionGroup.push(itm);

                    if (itm.value === tarId)
                        selectedOption = itm;
                });

                this.state.elementOptionGroup = elmOptionGroup;

                if (tarId !== 0) {
                    this.state.elementSelectedGroup = selectedOption;
                    this.props.changeTargetElementId(selectedOption.value);
                }
            })
            .catch(error => {
                //console.error('Error:', error);
            });
    }

    handleElementChange(e) {
        this.state.elementSelectedGroup = e;
        this.props.changeTargetElementId(e.value);
    };

    render() {
        return (
            <>
                <Row className="mb-3">
                    <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                    >
                        {this.props.t("Button text")}
                    </label>
                    <div className="col-md-10">
                        <input
                            value={this.state.ButtonText}
                            onChange={this.handleButtonTextChange}
                            className='form-control'
                            type="text"
                            placeholder={this.props.t("Button text")}
                        />
                    </div>
                </Row>
                <Row className="mb-3">
                    <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                    >
                        {this.props.t("Visit list")}
                    </label>
                    <div className="col-md-10">
                        <Select
                            value={this.state.visitSelectedGroup}
                            onChange={this.handleVisitChange}
                            options={this.state.visitOptionGroup}
                            placeholder={this.props.t("Select")}
                            classNamePrefix="select2-selection" />
                    </div>
                </Row>
                <Row className="mb-3">
                    <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                    >
                        {this.props.t("Page list")}
                    </label>
                    <div className="col-md-10">
                        <Select
                            value={this.state.pageSelectedGroup}
                            onChange={this.handlePageChange}
                            options={this.state.pageOptionGroup}
                            placeholder={this.props.t("Select")}
                            classNamePrefix="select2-selection"
                            isDisabled={this.state.pageDisable} />
                    </div>
                </Row>
                <Row className="mb-3">
                    <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                    >
                        {this.props.t("Module list")}
                    </label>
                    <div className="col-md-10">
                        <Select
                            value={this.state.moduleSelectedGroup}
                            onChange={this.handleModuleChange}
                            options={this.state.moduleOptionGroup}
                            placeholder={this.props.t("Select")}
                            classNamePrefix="select2-selection"
                            isDisabled={this.state.moduleDisable} />
                    </div>
                </Row>
                <Row className="mb-3">
                    <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                    >
                        {this.props.t("Element list")}
                    </label>
                    <div className="col-md-10">
                        <Select
                            value={this.state.elementSelectedGroup}
                            onChange={this.handleElementChange}
                            options={this.state.elementOptionGroup}
                            placeholder={this.props.t("Select")}
                            classNamePrefix="select2-selection"
                            isDisabled={this.state.moduleDisable} />
                    </div>
                </Row>
            </>
        );
    }
};

export default withTranslation()(ConcomittantMedicationElementProperties);
