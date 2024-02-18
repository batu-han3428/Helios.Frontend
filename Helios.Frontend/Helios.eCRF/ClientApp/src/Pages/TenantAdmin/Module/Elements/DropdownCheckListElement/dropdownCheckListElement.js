import React, { Component } from 'react';
import Select from "react-select";
import { withTranslation } from "react-i18next";

class DropdownCheckListElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisable: props.IsDisable,
            ElementOptions: JSON.parse(props.ElementOptions),
        }
    }

    render() {
        return (
            <div className="mb-3" >
                <Select
                    options={this.state.ElementOptions}
                    classNamePrefix="select2-selection"
                    placeholder={this.props.t("Select")}
                    isMulti={true}
                    closeMenuOnSelect={false}
                    isDisabled={this.state.isDisable}
                />
            </div>
        )
    }
};
export default withTranslation()(DropdownCheckListElement);
