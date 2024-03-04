import React, { Component } from 'react';
import Select from "react-select";
import { withTranslation } from "react-i18next";

class DropdownElement extends Component {
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
            <div className="mb-3">
                <Select
                    classNamePrefix="select2-selection"
                    options={this.state.ElementOptions}
                    isDisabled={this.state.isDisable}
                    placeholder={this.props.t("Select")}
                />                                                                    

            </div>
        )
    }
};
export default withTranslation()(DropdownElement);
