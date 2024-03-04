import React, { Component } from 'react';
import {
    Input,
    Label
} from "reactstrap";

class RadioElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isDisable: props.IsDisable,
            layout: props.Layout,
            ElementOptions: JSON.parse(props.ElementOptions),
            Value: props.Value,
            selectedOption: null,
        }

        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    handleRadioChange = (value) => {
        this.setState({ selectedOption: value });
    };

    render() {
        return (
            <>
                {(this.state.layout === 2 || this.state.layout === 0) && (
                    <div className="mb-3">
                        {this.state.ElementOptions.map((item, index) => <div className="form-check form-check-inline" key={index}>
                            <Input
                                type="radio"
                                className="form-check-input"
                                checked={this.state.selectedOption === item.id}
                                value={item.id}
                                onChange={() => this.handleRadioChange(item.id)}
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
                                    checked={this.state.selectedOption === item.id}
                                    value={item.id}
                                    onChange={() => this.handleRadioChange(item.id)}
                                    id={`radio-${index}`}
                                    name="radioOptions"
                                    disabled={this.state.isDisable} />
                                <Label
                                    className="form-check-label"
                                    htmlFor={`radio-${index}`}
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
