import React, { Component } from 'react';

class CheckElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            layout: props.Layout,
            checkedOptions: [],
            ElementOptions: JSON.parse(props.ElementOptions),
            Value: props.Value
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
        this.setState({ selectedOption: value });

        const checkedOptions = this.state.checkedOptions.includes(value)
            ? this.state.checkedOptions.filter(option => option !== value)
            : [...this.state.checkedOptions, value];

        this.setState({ checkedOptions });
        this.props.HandleAutoSave(this.state.id, JSON.stringify(checkedOptions));
    };

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
                                        className="form-check-input"
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
                                        className="form-check-input"
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
