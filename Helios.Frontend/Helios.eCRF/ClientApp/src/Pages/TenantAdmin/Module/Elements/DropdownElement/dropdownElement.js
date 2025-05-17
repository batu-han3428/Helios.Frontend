import React, { Component } from 'react';
import Select from "react-select";
import { withTranslation } from "react-i18next";
import "../Element.css";

class DropdownElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            orgElementOptions: props.ElementOptions !== null && props.ElementOptions !== undefined && props.ElementOptions !== "" ? JSON.parse(props.ElementOptions) : [],
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
        var val = this.state.Value;

        if (this.state.Value !== null) {
            var selected = null;
            optns.map(item => {
                if (item.value === val)
                    selected = item;
            });

            this.state.selectedOption = selected;
        }
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption: selectedOption });
        this.props.HandleAutoSave(this.state.id, selectedOption.value, this.state.oldValue, this.state.elementName);
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
                orgElementOptions: this.props.ElementOptions !== null && this.props.ElementOptions !== undefined && this.props.ElementOptions !== "" ? JSON.parse(this.props.ElementOptions) : [],
                Value: this.props.Value,
                isRequired: this.props.IsRequired,
                isMissingItem: this.props.IsMissingItem
            });
        }
    }
    render() {
        return (
            <div className="mb-3">
                <Select
                    classNamePrefix="select2-selection"
                    className={this.state.selectedOption === null && this.state.isRequired && !this.state.isMissingItem ? 'input-error' : 'input-normal'}
                    options={this.state.ElementOptions}
                    isDisabled={this.state.isDisable}
                    placeholder={this.props.t("Select")}
                    value={this.state.selectedOption}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
};
export default withTranslation()(DropdownElement);
