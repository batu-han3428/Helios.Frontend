import React, { Component } from 'react';
import "../Element.css";
class TextElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            Value: props.Value === undefined ? "" : props.Value,
            oldValue: props.Value,
            elementName: props.ElementName,
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
            prevProps.IsMissingItem !== this.props.IsMissingItem
        ) {
            this.setState({
                Value: this.props.Value,
                isDisable: this.props.IsDisable,
                isRequired: this.props.IsRequired,
                isMissingItem: this.props.IsMissingItem
            });
        }
    }
    handleBlur(e) {
        this.props.HandleAutoSave(this.state.id, e.target.value,this.state.oldValue, this.state.elementName);
    };

    render() {
        const inputClass = this.state.Value === "" && this.state.isRequired && !this.state.isMissingItem ? 'form-control input-error' : 'form-control input-normal';
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
