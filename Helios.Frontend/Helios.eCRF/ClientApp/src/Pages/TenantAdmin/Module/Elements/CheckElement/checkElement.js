import React, { Component } from 'react';

class CheckElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisable: props.IsDisable,
            layout: props.Layout,
            ElementOptions: JSON.parse(props.ElementOptions),
            Value: props.Value
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
                                        className="form-check-input"
                                        disabled={this.state.isDisable} />
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
                                        disabled={this.state.isDisable} />
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
