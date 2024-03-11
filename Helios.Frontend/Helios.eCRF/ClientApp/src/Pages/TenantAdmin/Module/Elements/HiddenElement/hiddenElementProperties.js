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

class HiddenElementProperties extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visitOptionGroup: [
                { label: "Vertical", value: 1 },
                { label: "Horizontal", value: 2 },
            ],
            visitSelectedGroup: null,
        }

        this.handleVisitChange = this.handleVisitChange.bind(this);

        this.getVisitList();
    }

    getVisitList() {

    }

    handleVisitChange(e) {
    };

    render() {
        return (
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
        );
    }
};

export default withTranslation()(HiddenElementProperties);
