import React, { Component } from 'react';
import Select from "react-select";
import { withTranslation } from "react-i18next";
import './dropdownCheckListElementStyle.css';
import "../Element.css";

class DropdownCheckListElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            orgElementOptions: props.ElementOptions !== undefined && props.ElementOptions !== null && props.ElementOptions !== "" ? JSON.parse(props.ElementOptions) : [],
            Value: props.Value,
            oldValue: props.Value,
            elementName: props.ElementName,
            ElementOptions: [],
            selectedOption: null,
            isRequired: props.IsRequired,
            isMissingItem: props.IsMissingItem
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
                    if (item.value !== undefined && item.value.toString() === sp)
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

        this.props.HandleAutoSave(this.state.id, val, this.state.oldValue, this.state.elementName, 11);
    };
    componentDidUpdate(prevProps) {
        if (prevProps.Value !== this.props.Value) {
            this.setState({ selectedOption: this.props.Value });
        }
        if (
            prevProps.Value !== this.props.Value ||
            prevProps.IsDisable !== this.props.IsDisable ||
            prevProps.ElementOptions !== this.props.ElementOptions ||
            prevProps.IsRequired !== this.props.IsRequired ||
            prevProps.IsMissingItem !== this.props.IsMissingItem
        ) {
            this.setState({
                id: this.props.Id,
                isDisable: this.props.IsDisable,
                orgElementOptions: this.props.ElementOptions !== undefined && this.props.ElementOptions !== null && this.props.ElementOptions !== "" ? JSON.parse(this.props.ElementOptions) : [],
                Value: this.props.Value,
                isRequired: this.props.IsRequired,
                isMissingItem: this.props.IsMissingItem
            });
        }
    }
    render() {
        return (
            <div className="mb-3" >
                <Select
                    options={this.state.ElementOptions}
                    classNamePrefix="select2-selection"
                    className={this.state.selectedOption === null && this.state.isRequired && !this.state.isMissingItem ? 'input-error' : 'input-normal'}
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
