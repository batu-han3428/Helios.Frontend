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
import { withTranslation } from "react-i18next";

class AdverseEventElementProperties extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            AdverseEventType: props.AdverseEventType,

            adverseOptionGroup: [
                { label: "Adverse event", value: 1 },
                { label: "Serious adverse event", value: 2 },
            ],
            adverseSelectedGroup: null,
        }

        var adv = this.state.adverseOptionGroup.filter(function (e) {
            if (e.value === props.AdverseEventType)
                return e;
        });

        this.state.adverseSelectedGroup = adv;
        this.handleAdverseChange = this.handleAdverseChange.bind(this);
    }

    handleAdverseChange = selectedOption => {
        this.setState({ AdverseEventType: selectedOption.value });
        this.state.adverseSelectedGroup = selectedOption;
        this.props.changeAdverseEventType(selectedOption.value);
    };

    render() {
        return (
            <Row className="mb-3">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    {this.props.t("Event type")}
                </label>
                <div className="col-md-10">
                    <Select
                        value={this.state.adverseSelectedGroup}
                        onChange={this.handleAdverseChange}
                        options={this.state.adverseOptionGroup}
                        placeholder={this.props.t("Select")}
                        classNamePrefix="select2-selection" />
                </div>
            </Row>
        );
    }
};

export default withTranslation()(AdverseEventElementProperties);
