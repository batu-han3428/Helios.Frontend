import React, { Component, useState, useContext, Form, FormField, TextBox, ComboBox, CheckBox, LinkButton } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Collapse,
    Container,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap";
import Select from "react-select";
import { GetConditionList, GetValidationMessageType } from '../Common/utils.js'
import { withTranslation } from "react-i18next";

class Validation extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            StudyId: props.StudyId,
            IsNew: true,
            IsFormValid: true,
            Validations: [],
            ValidationList: props.ValidationList,
            conditionOptionGroup: GetConditionList(),
            GeneralValidationOptions: GetValidationMessageType(),
        }

        this.handleAddMessage = this.handleAddMessage.bind(this);
        this.handleRemoveMessage = this.handleRemoveMessage.bind(this);
        this.handleConditionChange = this.handleConditionChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.checkElementsValidation = this.checkElementsValidation.bind(this);
        this.fillValidationList = this.fillValidationList.bind(this);

        this.fillValidationList();
    }

    fillValidationList() {
        if (this.state.ValidationList.length > 0) {
            var list = JSON.parse(this.state.ValidationList);
            var valList = [];
            var validationMessages = this.state.GeneralValidationOptions;
            var conditions = this.state.conditionOptionGroup;

            list.map(item => {
                const newDiv = {
                    id: item.Id,
                    validationMessageOptions: validationMessages,
                    validationMessageRadioOption: item.ActionType,
                    validationMessageOptionsCls: "form-check-input",
                    conditionSelectedGroup: 0,// item.ValueCondition,
                    conditionSelectedGroupCls: "select2-selection",
                    Value: item.Value,
                    ValueCls: 'form-control',
                    Message: item.Message,
                    MessageCls: 'form-control',
                };

                var cn = conditions.filter(function (e) {
                    if (e.value === item.ValueCondition)
                        return e;
                });

                newDiv.conditionSelectedGroup = cn;
                valList.push(newDiv);
            });

            this.state.Validations = valList;
        }
    }

    handleAddMessage() {
        const newDiv = {
            id: this.state.Validations.length + 1,
            validationMessageOptions: GetValidationMessageType(),
            validationMessageRadioOption: 0,
            validationMessageOptionsCls: "form-check-input",
            conditionSelectedGroup: 0,
            conditionSelectedGroupCls: "select2-selection",
            Value: '',
            ValueCls: 'form-control',
            Message: '',
            MessageCls: 'form-control',
        };

        this.setState((prevState) => {
            return { Validations: [...prevState.Validations, newDiv] };
        }, () => {
            this.checkElementsValidation();
        });

    };

    handleRemoveMessage = (indexToRemove) => {
        this.setState((prevState) => {
            return { Validations: prevState.Validations.filter((_, index) => index !== indexToRemove) };
        }, () => {
            this.checkElementsValidation();
        });
    };

    handleConditionChange = (index, selectedOption) => {
        this.setState((prevState) => {
            return {
                Validations: prevState.Validations.map((validation, i) =>
                    i === index ? { ...validation, conditionSelectedGroup: selectedOption, conditionSelectedGroupCls: "" } : validation
                )
            }
        }, () => {
            this.checkElementsValidation();
        });

        //this.props.changeValidationContdition(selectedOption.value);
    };

    handleValueChange = (index, e) => {
        const newValue = e.target.value;
        this.setState((prevState) => {
            return {
                Validations: prevState.Validations.map((validation, i) =>
                    i === index ? { ...validation, Value: newValue, ValueCls: "form-control" } : validation
                )
            }
        }, () => {
            this.checkElementsValidation();
        });
    };

    handleMessageChange = (index, e) => {
        const newMessage = e.target.value;
        this.setState((prevState) => {
            return {
                Validations: prevState.Validations.map((validation, i) =>
                    i === index ? { ...validation, Message: newMessage, MessageCls: "form-control" } : validation
                )
            }
        }, () => {
            this.checkElementsValidation();
        });

        this.checkElementsValidation();
    };

    handleRadioChange = (index, selectedValue) => {
        // Find the selected option from GeneralValidationOptions
        var selectedOption = this.state.GeneralValidationOptions.find(e => e.value === selectedValue);

        this.setState((prevState) => {
            return {
                Validations: prevState.Validations.map((validation, i) => {
                    if (i === index) {
                        return { ...validation, validationMessageRadioOption: selectedOption, validationMessageOptionsCls: "form-check-input" };
                    } else {
                        return validation;
                    }
                })
            }
        }, () => {
            this.checkElementsValidation();
        });
    };

    checkElementsValidation() {
        var valid = true;
        var validationList = [];

        this.state.Validations.map(item => {
            var validation = {
                Id: item.id,
                ValidationActionType: item.validationMessageRadioOption.value !== undefined ? item.validationMessageRadioOption.value : item.validationMessageRadioOption,
                ValidationCondition: item.conditionSelectedGroup.value !== undefined ? item.conditionSelectedGroup.value : item.conditionSelectedGroup === 0 ? item.conditionSelectedGroup : item.conditionSelectedGroup[0].value,
                ValidationValue: item.Value,
                ValidationMessage: item.Message,
            };

            validationList.push(validation);

            if (item.conditionSelectedGroup === 0) {
                item.conditionSelectedGroupCls = "form-control is-invalid";
                valid = false;
            }

            if (item.Value === '') {
                item.ValueCls = "form-control is-invalid";
                valid = false;
            }

            if (item.Message === '') {
                item.MessageCls = "form-control is-invalid";
                valid = false;
            }

            if (item.validationMessageRadioOption === 0) {
                item.validationMessageOptionsCls = "form-check-input is-invalid";
                valid = false;
            }
        });

        this.props.changeIsFormValid(valid);
        this.props.changeValidationList(validationList);
    }

    render() {
        return (
            <>
                {this.state.Validations.map((vldt, index) => (
                    <div key={index} style={{ border: "1px solid #eee", padding: "20px", marginTop: "5px" }}>
                        <Row>
                            <div style={{ float: "left" }} className="col-md-9">{this.props.t("Exclusion message")}</div>
                            <div style={{ float: "right" }} className="col-md-3">
                                <Button color="danger" onClick={() => this.handleRemoveMessage(index)} className='mt-1 col-md-12'>
                                    <i className="" style={{ color: '#00a8f3' }}></i> {this.props.t("Remove")}
                                </Button>
                            </div>
                        </Row>
                        <Row>
                            <div className="mb-3 col-md-6">
                                <Label>{this.props.t("Dependency condition")}</Label>
                                <Select
                                    value={vldt.conditionSelectedGroup}
                                    onChange={(selectedOption) => this.handleConditionChange(index, selectedOption)}
                                    options={this.state.conditionOptionGroup}
                                    classNamePrefix="select2-selection"
                                    className={vldt.conditionSelectedGroupCls}
                                    placeholder={this.props.t("Select")} />
                            </div>
                            <div className="mb-3 col-md-6" style={{ marginTop: "7px" }}>
                                <Label></Label>
                                <input
                                    value={vldt.Value}
                                    onChange={(e) => this.handleValueChange(index, e)}
                                    className={vldt.ValueCls}
                                    type="text"
                                    placeholder={this.props.t("Value")}

                                />
                            </div>
                        </Row>
                        <Row>
                            <div className="mb-3">
                                {vldt.validationMessageOptions.map((item, i) => (
                                    <div className="form-check mb-2" key={i}>
                                        <Input
                                            type="radio"
                                            className={vldt.validationMessageOptionsCls}
                                            checked={vldt.validationMessageRadioOption.value !== undefined ?
                                                vldt.validationMessageRadioOption && vldt.validationMessageRadioOption.value === item.value :
                                                vldt.validationMessageRadioOption && vldt.validationMessageRadioOption === item.value}
                                            value={item.value}
                                            onChange={() => this.handleRadioChange(index, item.value)}
                                        />
                                        <Label
                                            className="form-check-label"
                                        >
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </Row>
                        <Row>
                            <div className="mb-3 col-md-6" style={{ marginTop: "7px" }}>
                                <Label>{this.props.t("Message")}</Label>
                                <input
                                    value={vldt.Message}
                                    onChange={(e) => this.handleMessageChange(index, e)}
                                    className={vldt.MessageCls}
                                    type="text"
                                    placeholder={this.props.t("Message")}

                                />
                            </div>
                        </Row>
                    </div>
                ))}
                <Row>
                    <div style={{ marginTop: "10px" }}>{this.props.t("Trigger a validation message when data is entered into the field.")}</div>
                    <div>
                        <Button color="secondary" onClick={this.handleAddMessage} className='mt-1 col-md-3'>
                            {"+ " + this.props.t("Add message")}
                        </Button>
                    </div>
                </Row>
            </>
        );
    }
};

export default withTranslation()(Validation);
