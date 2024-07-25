import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import '../Common/common.css';

class AdverseEventElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            AdverseEventType: props.AdverseEventType,
            isDisable: props.IsDisable,
            //Value: props.Value === undefined ? "" : props.Value,
            Value: "",
            dataGridRowId: props.DataGridRowId
        }

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleValueChange(e) {
        this.setState({ Value: e.target.value });
    };
    componentDidUpdate(prevProps) {
        if (prevProps.Value !== this.props.Value) {
            this.setState({ Value: this.props.Value });
        }
    }
    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                {this.state.AdverseEventType === 1 &&
                    <input className="btn adverse-btn" type="button" value={this.props.t("+ Add an Adverse Event")} disabled={this.state.isDisable} />
                }
                {this.state.AdverseEventType === 2 &&
                    <input className="btn sadverse-btn" type="button" value={this.props.t("+ Add an Serious Adverse Event")} disabled={this.state.isDisable} />
                }
            </div>
        )
    }
};
export default withTranslation()(AdverseEventElement);
