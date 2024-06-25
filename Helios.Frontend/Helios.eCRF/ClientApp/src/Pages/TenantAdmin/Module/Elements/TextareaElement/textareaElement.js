import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap";


class TextareaElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            Value: props.Value,
            defaultValue: props.DefaultValue
        }

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleValueChange(e) {
        this.setState({ Value: e.target.value });
    };

    handleBlur(e) {
        this.props.HandleAutoSave(this.state.id, e.target.value);
    };

    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                <Input
                    type="textarea"
                    id="textarea"
                    rows="3"
                    placeholder={this.state.defaultValue}
                    disabled={this.state.isDisable}
                    value={this.state.Value}
                    onChange={this.handleValueChange}
                    onBlur={this.handleBlur}
                />
            </div>
        )
    }
};
export default TextareaElement;
