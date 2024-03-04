import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap";


class TextareaElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isDisable: props.IsDisable,
            Value: props.Value,
            defaultValue: props.DefaultValue
        }
    }

    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                <Input
                    type="textarea"
                    id="textarea"
                    maxLength="225"
                    rows="3"
                    placeholder={this.state.defaultValue}
                    disabled={this.state.isDisable}
                />
            </div>
        )
    }
};
export default TextareaElement;
