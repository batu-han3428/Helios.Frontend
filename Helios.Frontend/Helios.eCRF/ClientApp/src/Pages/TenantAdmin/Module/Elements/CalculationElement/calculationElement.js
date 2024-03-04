import React, { Component } from 'react';
import { withTranslation } from "react-i18next";

class CalculationElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                <input
                    className="form-control"
                    type="text"
                    disabled="disabled" />
                {/*<label style={{ fontSize: "8pt", textDecoration: 'none' }}>*/}
                {/*    {this.props.t("It will be calculated automatically")}*/}
                {/*</label>*/}
            </div>
        )
    }
};
export default withTranslation()(CalculationElement);
