import React, { Component } from 'react';
import { withTranslation } from "react-i18next";
import '../Common/common.css';

class ConcomittantMedicationElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isDisable: props.IsDisable,
            ButtonText: props.ButtonText !== null && props.ButtonText !== "" ? props.ButtonText : this.props.t("+ Concomitant Medication")
        }

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleValueChange(e) {
    };

    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                <input className="btn btn-primary" type="button" value={this.state.ButtonText} disabled={this.state.isDisable} />
            </div>
        )
    }
};
export default withTranslation()(ConcomittantMedicationElement);
