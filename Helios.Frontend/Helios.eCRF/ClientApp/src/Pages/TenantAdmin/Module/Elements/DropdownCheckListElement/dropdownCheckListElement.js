import React, { Component } from 'react';
import Select from "react-select";
import { withTranslation } from "react-i18next";
import './dropdownCheckListElementStyle.css';

class DropdownCheckListElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            orgElementOptions: JSON.parse(props.ElementOptions),
            Value: props.Value,
            ElementOptions: [],
            selectedOption: null
        }

        this.fillElementOptions = this.fillElementOptions.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.fillElementOptions();
    }

    fillElementOptions() {
        var optns = [];

        this.state.orgElementOptions.map(item => {
            var itm = { label: item.tagName, value: item.id };
            optns.push(itm);
        });

        this.state.ElementOptions = optns;
        var spl = this.state.Value !== undefined && this.state.Value !== null && this.state.Value !== "" ? this.state.Value.split(',') : null;

        if (spl != null) {
            var finalVal = [];
            this.state.ElementOptions.map(item => {
                spl.map(sp => {
                    if (item.value.toString() === sp)
                        finalVal.push(item);
                });
            });

            this.state.selectedOption = finalVal;
        }
    }

    handleChange = (value) => {
        this.setState({ selectedOption: value });

        var finalVal = [];
        value.map(item => {
            finalVal.push(item.value);
        });

        var val = JSON.stringify(finalVal).slice(1, JSON.stringify(finalVal).length - 1);

        this.props.HandleAutoSave(this.state.id, val, 11);
    };

    render() {
        return (
            <div className="mb-3" >
                <Select
                    options={this.state.ElementOptions}
                    classNamePrefix="select2-selection"
                    placeholder={this.props.t("Select")}
                    isMulti={true}
                    closeMenuOnSelect={false}
                    value={this.state.selectedOption}
                    isDisabled={this.state.isDisable}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
};
export default withTranslation()(DropdownCheckListElement);
