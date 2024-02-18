import React, { useState, useEffect, ListItem, Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap";
import Select from "react-select";
import { extend } from 'jquery';

const widthList = [
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
];

class FieldWidths extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedGroup : props.Width
        }

        this.handleSelectGroup = this.handleSelectGroup.bind(this);
    }

    handleSelectGroup(e) {
        this.props.changeFieldWidth(e.value);
        this.state.selectedGroup = e;
    };

    render() {
        return (
            <Row className="mb-3">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Field width
                </label>
                <div className="col-md-10">
                    <Select
                        value={this.state.selectedGroup}
                        onChange={this.handleSelectGroup}
                        options={widthList}
                        classNamePrefix="select2-selection"
                    />
                </div>
            </Row>
        )
    }
}

export default FieldWidths;