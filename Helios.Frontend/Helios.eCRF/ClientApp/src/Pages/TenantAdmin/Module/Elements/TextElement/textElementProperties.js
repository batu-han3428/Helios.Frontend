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
import { withTranslation } from "react-i18next";

class TextElementProperties extends Component {
    constructor(props) {
        super(props);
        
        this.handleUnitChange = this.handleUnitChange.bind(this);
    }

    handleUnitChange(e) {
        this.props.changeUnit(e.target.value);
    };

    render() {
        return (
            <Row className="mb-3">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    {this.props.t("Unit")}
                </label>
                <div className="col-md-10">
                    <input
                        value={this.props.Unit}
                        onChange={this.handleUnitChange}
                        className="form-control"
                        type="text"
                        placeholder={this.props.t("Unit")}
                    />
                </div>
            </Row>
        );
    }
};

export default withTranslation()(TextElementProperties);
