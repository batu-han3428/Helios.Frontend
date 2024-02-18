import React, { Component } from 'react';

class NumericElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisable: props.IsDisable,
            Unit: props.Unit,
            Mask: props.Mask,
            LowerLimit: props.LowerLimit,
            UpperLimit: props.UpperLimit,
            Value: props.Value
        }
    }

    handleChange = (e) => {
        let newValue = parseInt(e.target.value, 10);

        if (isNaN(newValue)) {
            newValue = this.LowerLimit;
        }

        if (newValue < this.LowerLimit) {
            newValue = this.LowerLimit;
        }

        if (newValue > this.UpperLimit) {
            newValue = this.UpperLimit;
        }

        this.setState({
            Value: newValue,
        });
    };

    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                <input
                className="form-control"
                type="number"
                disabled={this.state.isDisable}
                value={this.state.Value}
                onChange={this.handleChange}
                />
            </div>
        )
    }
};

export default NumericElement;
