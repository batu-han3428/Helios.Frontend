import React, { Component } from 'react';
import { Input, Label } from "reactstrap";
import "../Element.css";
class RadioElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            layout: props.Layout,
            ElementOptions: props.ElementOptions !== null && props.ElementOptions !== undefined && props.ElementOptions !== "" ? JSON.parse(props.ElementOptions) : [],
            Value: props.Value,
            oldValue: props.Value,
            elementName: props.ElementName,
            selectedOption: props.Value,
            isRequired: props.IsRequired,
            isMissingItem: props.IsMissingItem
        }

        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    handleRadioChange = (value) => {
        this.setState({ selectedOption: value });
        this.props.HandleAutoSave(this.state.id, value, this.state.oldValue, this.state.elementName);
    };
    componentDidUpdate(prevProps) {
        if (prevProps.Value !== this.props.Value) {
            this.setState({ selectedOption: this.props.Value });
        }
        if (
            prevProps.IsDisable !== this.props.IsDisable ||
            prevProps.Layout !== this.props.Layout ||
            prevProps.ElementOptions !== this.props.ElementOptions ||
            prevProps.IsRequired !== this.props.IsRequired ||
            prevProps.IsMissingItem !== this.props.IsMissingItem
        ) {
            this.setState({
                isDisable: this.props.IsDisable,
                layout: this.props.Layout,
                ElementOptions: this.props.ElementOptions !== null && this.props.ElementOptions !== undefined && this.props.ElementOptions !== "" ? JSON.parse(this.props.ElementOptions) : [],
                isRequired: this.props.IsRequired,
                isMissingItem: this.props.IsMissingItem
            });
        }
    }
    render() {
        const inputClass = this.state.selectedOption === "" && this.state.isRequired && !this.state.isMissingItem ? 'form-check-input input-error' : 'form-check-input input-normal';
        return (
            <>
                {(this.state.layout === 2 || this.state.layout === 0) && (
                    <div className="mb-3">
                        {this.state.ElementOptions.map((item, index) =>
                            <div className="form-check form-check-inline" key={index}>
                                <Input
                                    type="radio"
                                    className={inputClass}
                                    checked={this.state.selectedOption === item.tagValue}
                                    value={item.tagValue}
                                    onChange={() => this.handleRadioChange(item.tagValue)}
                                    disabled={this.state.isDisable} />
                                <Label
                                    className="form-check-label"
                                >
                                    {item.tagName}
                                </Label>
                            </div>
                        )}
                    </div>
                )}
                {this.state.layout === 1 && (
                    <div className="mb-3">
                        {this.state.ElementOptions.map((item, index) => (
                            <div className="form-check mb-2" key={index}>
                                <Input
                                    type="radio"
                                    className={inputClass}
                                    checked={this.state.selectedOption === item.tagValue}
                                    value={item.tagValue}
                                    onChange={() => this.handleRadioChange(item.tagValue)}
                                    disabled={this.state.isDisable} />
                                <Label
                                    className="form-check-label"
                                >
                                    {item.tagName}
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </>
        )
    }
};
export default RadioElement;
