import React, { Component } from 'react';
import { Input } from "reactstrap";
import "../Element.css";


class TextareaElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            Value: props.Value,
            oldValue: props.Value,
            elementName: props.ElementName,
            defaultValue: props.DefaultValue,
            isRequired: props.IsRequired,
            isMissingItem: props.IsMissingItem
        }

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleValueChange(e) {
        this.setState({ Value: e.target.value });
    };
    componentDidUpdate(prevProps) {
        if (
            prevProps.Value !== this.props.Value ||
            prevProps.IsDisable !== this.props.IsDisable ||
            prevProps.IsRequired !== this.props.IsRequired ||
            prevProps.IsMissingItem !== this.props.IsMissingItem ||
            prevProps.DefaultValue !== this.props.DefaultValue 
        ) {
            this.setState({
                Value: this.props.Value,
                isDisable: this.props.IsDisable,
                isRequired: this.props.IsRequired,
                isMissingItem: this.props.IsMissingItem,
                defaultValue: this.props.DefaultValue
            });
        }
    }
    handleBlur(e) {
        this.props.HandleAutoSave(this.state.id, e.target.value, this.state.oldValue, this.state.elementName);
    };

    render() {
        const inputClass = this.state.Value === "" && this.state.isRequired && !this.state.isMissingItem ? 'input-error' : 'input-normal';
        return (
            <div style={{ marginRight: "20px" }} >
                <Input
                    type="textarea"
                    id="textarea"
                    rows="3"
                    className={inputClass}
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
