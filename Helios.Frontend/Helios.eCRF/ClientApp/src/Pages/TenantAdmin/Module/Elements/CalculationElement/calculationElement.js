import React, { Component } from 'react';
import { withTranslation } from "react-i18next";

class CalculationElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            Value: props.Value,
            dataGridRowId: props.DataGridRowId
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.Value !== this.props.Value) {
            this.setState({
                Value: this.props.Value
            });
        }
    }

    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                <input
                    className="form-control"
                    type="text"
                    value={this.state.Value}
                    disabled="disabled"
                    style={{ backgroundColor: "#e9ecef", color: "#6c757d" }}
                />
                {/*<label style={{ fontSize: "8pt", textDecoration: 'none' }}>*/}
                {/*    {this.props.t("It will be calculated automatically")}*/}
                {/*</label>*/}
            </div>
        )
    }
};
export default withTranslation()(CalculationElement);