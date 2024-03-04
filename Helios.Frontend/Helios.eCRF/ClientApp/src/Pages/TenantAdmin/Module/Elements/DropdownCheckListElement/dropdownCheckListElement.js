import React, { Component } from 'react';
import Select from "react-select";
import { withTranslation } from "react-i18next";

class DropdownCheckListElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isDisable: props.IsDisable,
            orgElementOptions: JSON.parse(props.ElementOptions),
            Value: props.Value,
            ElementOptions: [],
        }

        this.fillElementOptions = this.fillElementOptions.bind(this);

        this.fillElementOptions();
    }

    fillElementOptions() {
        var optns = [];

        this.state.orgElementOptions.map(item => {
            var itm = { label: item.tagName, value: item.id };
            optns.push(itm);
        });

        this.state.ElementOptions = optns;
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
