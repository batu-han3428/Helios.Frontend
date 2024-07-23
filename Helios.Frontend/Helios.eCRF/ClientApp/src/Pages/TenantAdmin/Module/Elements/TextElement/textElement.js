import React, { Component } from 'react';
import "../Element.css";
class TextElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            Value: props.Value === undefined ? "" : props.Value,
            isRequired: props.IsRequired
        }

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleValueChange(e) {
        this.setState({ Value: e.target.value });
    };
    componentDidUpdate(prevProps) {
        if (prevProps.Value !== this.props.Value) {
            this.setState({ Value: this.props.Value });
        }
    }
    handleBlur(e) {
        this.props.HandleAutoSave(this.state.id, e.target.value);
    };

    render() {
        const inputClass = this.state.Value === "" && this.state.isRequired ? 'form-control input-error' : 'form-control input-normal';
        return (
            <div style={{ marginRight: "20px" }} >
                <input
                    className={inputClass}
                    type="text"
                    value={this.state.Value}
                    disabled={this.state.isDisable}
                    onChange={this.handleValueChange}
                    onBlur={this.handleBlur}
                />
            </div>
        )
    }
};
export default TextElement;
