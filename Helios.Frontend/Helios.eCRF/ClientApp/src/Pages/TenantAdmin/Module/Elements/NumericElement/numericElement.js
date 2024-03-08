import React, { Component } from 'react';

class NumericElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            Unit: props.Unit,
            Mask: props.Mask,
            LowerLimit: props.LowerLimit,
            UpperLimit: props.UpperLimit,
            Value: props.ElementValue
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
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

    handleBlur = async (e) => {
        //if (e.target.value !== "") {
        //    await this.props.SetElementId(this.state.id);
        //    await this.props.SetElementValue(e.target.value);
        //    this.props.AutoSaveElement();
        //}
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
                    onBlur={this.handleBlur}
                />
            </div>
        )
    }
};

export default NumericElement;
