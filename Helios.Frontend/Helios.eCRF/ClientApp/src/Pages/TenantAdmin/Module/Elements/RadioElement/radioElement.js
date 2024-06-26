import React, { Component } from 'react';
import {
    Input,
    Label
} from "reactstrap";

class RadioElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            layout: props.Layout,
            ElementOptions: props.ElementOptions !== null && props.ElementOptions !== undefined && props.ElementOptions !== "" ? JSON.parse(props.ElementOptions) : [],
            Value: props.Value,
            selectedOption: props.Value,
        }

        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    handleRadioChange = (value) => {
        this.setState({ selectedOption: value });
        this.props.HandleAutoSave(this.state.id, value);
    };

    render() {
        return (
            <>
                {(this.state.layout === 2 || this.state.layout === 0) && (
                    <div className="mb-3">
                        {this.state.ElementOptions.map((item, index) =>
                            <div className="form-check form-check-inline" key={index}>
                                <Input
                                    type="radio"
                                    className="form-check-input"
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
                                    className="form-check-input"
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
