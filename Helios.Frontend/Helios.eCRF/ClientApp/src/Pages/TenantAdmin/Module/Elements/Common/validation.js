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
            ValidationContdition: props.ValidationContdition,
            Value: props.ValidationValue,
            Message: props.ValidationMessage,
            MessageStatus: props.ValidationStatus,
            validationOptions: GetValidationMessageType(),
            messageSelectedOption: props.ValidationAction,
            conditionOptionGroup: GetConditionList(),
            conditionSelectedGroup: [],
        }

        this.handleAddMessage = this.handleAddMessage.bind(this);
        this.handleRemoveMessage = this.handleRemoveMessage.bind(this);
        this.handleConditionChange = this.handleConditionChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    handleAddMessage(e) {
        this.state.MessageStatus = true;
        this.props.changeValidationStatus(true);
    };

    handleRemoveMessage(e) {
    };

    handleConditionChange(selectedOption) {
        this.props.changeValidationContdition(selectedOption.value);
        this.state.conditionSelectedGroup = selectedOption;
    };

    handleValueChange(newValue) {
        this.props.changeValidationValue(newValue);
        this.state.Value = newValue;
    };

    handleMessageChange(newValue) {
        this.props.changeValidationMessage(newValue);
        this.state.Message = newValue;
    };

    handleRadioChange(newValue) {
        this.setState({ messageSelectedOption: newValue });
        this.props.changeValidationAction(newValue);
    };

    render() {
        return (
            <>
                {!this.state.MessageStatus &&
                    <Row>
                        <div>{this.props.t("Trigger a validation message when data is entered into the field.")}</div>
                        <div>
                            <Button color="secondary" onClick={this.handleAddMessage} className='mt-1 col-md-3'>
                                {"+ " + this.props.t("Add message")}
                            </Button>
                        </div>
                    </Row>
                }
                {this.state.MessageStatus &&
                    <>
                        <Row>
                            <div style={{ float: "left" }} className="col-md-9">{this.props.t("Exclusion message")}</div>
                            <div style={{ float: "right" }} className="col-md-3">
                                <Button color="danger" onClick={this.handleRemoveMessage} className='mt-1 col-md-12'>
                                    <i className="" style={{ color: '#00a8f3' }}></i> {this.props.t("Remove")}
                                </Button>
                            </div>
                        </Row>
                        <Row>
                            <div className="mb-3 col-md-6">
                                <Label>{this.props.t("Dependency condition")}</Label>
                                <Select
                                    value={this.state.conditionSelectedGroup}
                                    onChange={this.handleConditionChange}
                                    options={this.state.conditionOptionGroup}
                                    classNamePrefix="select2-selection"
                                    placeholder={this.props.t("Select")} />
                            </div>
                            <div className="mb-3 col-md-6" style={{ marginTop: "7px" }}>
                                <Label></Label>
                                <input
                                    value={this.state.Value}
                                    onChange={this.handleValueChange}
                                    className="form-control"
                                    type="text"
                                    placeholder={this.props.t("Value")}

                                />
                            </div>
                        </Row>
                    <Row>
                        <div className="mb-3">
                            {this.state.validationOptions.map((item, index) => (
                                <div className="form-check mb-2" key={index}>
                                    <Input
                                        type="radio"
                                        className="form-check-input"
                                        checked={this.state.messageSelectedOption === item.value}
                                        value={item.value}
                                        onChange={() => this.handleRadioChange(item.value)}/>
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
                                value={this.state.Message}
                                onChange={this.handleMessageChange}
                                className="form-control"
                                type="text"
                                placeholder={this.props.t("Message")}

                            />
                        </div>
                    </Row>
                    </>
                }
            </>
        );
    }
};

export default withTranslation()(Validation);
