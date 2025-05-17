import React, { Component } from 'react';
import "../Element.css";

class CheckElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            layout: props.Layout,
            checkedOptions: [],
            ElementOptions: props.ElementOptions !== undefined && props.ElementOptions !== null && props.ElementOptions !== "" ? JSON.parse(props.ElementOptions) : [],
            Value: props.Value,
            oldValue: props.Value,
            elementName: props.ElementName,
            isRequired: props.IsRequired,
            isMissingItem: props.IsMissingItem
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.setInitialCheckedOptions();
    }

    setInitialCheckedOptions = () => {
        const { ElementOptions, Value } = this.state;
        const checkedOptions = ElementOptions.filter(option => Value.includes(option.tagValue)).map(option => option.tagValue);
        this.setState({ checkedOptions });
    }

    handleChange = (value) => {
        const checkedOptions = this.state.checkedOptions.includes(value)
            ? this.state.checkedOptions.filter(option => option !== value)
            : [...this.state.checkedOptions, value];
        this.setState({ checkedOptions });
        const val = checkedOptions.length > 0 ? JSON.stringify(checkedOptions) : "";
        this.props.HandleAutoSave(this.state.id, val, this.state.oldValue, this.state.elementName, 9);
    };

    componentDidUpdate(prevProps) {
        if (prevProps.Value !== this.props.Value) {
            const checkedOptions = this.state.ElementOptions
                .filter(option => this.props.Value.includes(option.tagValue))
                .map(option => option.tagValue);
            this.setState({ checkedOptions });
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
                ElementOptions: this.props.ElementOptions !== undefined && this.props.ElementOptions !== null && this.props.ElementOptions !== "" ? JSON.parse(this.props.ElementOptions) : [],
                isRequired: this.props.IsRequired,
                isMissingItem: this.props.IsMissingItem
            });
        }
    }

    render() {
        return (
            <>
                {(this.state.layout === 2 || this.state.layout === 0) && (
                    <div className="mb-3">
                        <div className="form-check form-check-inline">
                            {this.state.ElementOptions.map((item, index) => (                                
                                <div className="form-check" key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
                                    <input
                                        type="checkbox"
                                        className={`form-check-input  ${this.state.Value.length === 0 && this.state.isRequired && !this.state.isMissingItem ? 'input-error' : 'input-normal'}`}
                                        id={`checkbox-${index}`}
                                        onChange={() => this.handleChange(item.tagValue)}
                                        disabled={this.state.isDisable}
                                        checked={this.state.checkedOptions.includes(item.tagValue)}
                                    />
                                    <label className="form-check-label" htmlFor={`checkbox-${index}`}>
                                        {item.tagName}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {this.state.layout === 1 && (
                    <div className="mb-3">
                        <div className="form-check">
                            {this.state.ElementOptions.map((item, index) => (
                                <div className="form-check" key={index}>
                                    <input
                                        type="checkbox"
                                        className={`form-check-input ${this.state.Value.length === 0 && this.state.isRequired && !this.state.isMissingItem ? 'input-error' : 'input-normal'}`}
                                        id={`checkbox-${index}`}
                                        onChange={() => this.handleChange(item.tagValue)}
                                        disabled={this.state.isDisable}
                                        checked={this.state.checkedOptions.includes(item.tagValue)}
                                    />
                                    <label className="form-check-label" htmlFor={`checkbox-${index}`}>
                                        {item.tagName}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        )
    }
};
export default CheckElement;
