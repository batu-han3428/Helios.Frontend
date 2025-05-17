import React, { Component } from 'react';
import { Tooltip } from 'react-tooltip';
import { withTranslation } from "react-i18next";
import  "../Element.css";

class NumericElement extends Component {    
    constructor(props) {
        super(props);
        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            Unit: props.Unit,
            Mask: props.Mask,
            LowerLimit: props.LowerLimit,
            UpperLimit: props.UpperLimit,
            Value: props.Value,
            oldValue: props.Value,
            elementName: props.ElementName,
            tooltipMessage: '',
            showTooltip: false,
            isRequired: props.IsRequired,
            isMissingItem: props.IsMissingItem
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.validateValue = this.validateValue.bind(this);
    }
 
    handleChange(e) {
        let newValue = e.target.value;
        const regex = /^[0-9]*\.?[0-9]*$/;

        if (regex.test(newValue)) {
            this.setState({
                Value: newValue,
                showTooltip: false,
                tooltipMessage: ''
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (
            prevProps.Value !== this.props.Value ||
            prevProps.IsDisable !== this.props.IsDisable ||
            prevProps.Unit !== this.props.Unit ||
            prevProps.Mask !== this.props.Mask ||
            prevProps.LowerLimit !== this.props.LowerLimit ||
            prevProps.UpperLimit !== this.props.UpperLimit ||
            prevProps.IsRequired !== this.props.IsRequired ||
            prevProps.IsMissingItem !== this.props.IsMissingItem
        ) {
            this.setState({
                Value: this.props.Value,
                isDisable: this.props.IsDisable,
                Unit: this.props.Unit,
                Mask: this.props.Mask,
                LowerLimit: this.props.LowerLimit,
                UpperLimit: this.props.UpperLimit,
                isRequired: this.props.IsRequired,
                isMissingItem: this.props.IsMissingItem
            });
        }
    }

    handleBlur(e) {
        this.validateValue(e.target.value);
    }

    validateValue(value) {
        let newValue = parseFloat(value);
        let tooltipMessage = '';

        if (isNaN(newValue)) {
            newValue = this.state.LowerLimit;
        }
        if (this.state.LowerLimit !== this.state.UpperLimit)
            if (newValue < this.state.LowerLimit) {
                tooltipMessage = this.props.t("Value should not be less than") + this.state.LowerLimit + this.props.t("and greater than") + this.state.UpperLimit;
                this.setState({
                    showTooltip: true,
                    tooltipMessage
                });
            } else if (newValue > this.state.UpperLimit) {
                tooltipMessage = this.props.t("Value should not be less than") + this.state.LowerLimit + this.props.t("and greater than") + this.state.UpperLimit;
                this.setState({
                    showTooltip: true,
                    tooltipMessage
                });
            } else {
                this.setState({
                    showTooltip: false,
                    tooltipMessage: ''
                });
            }

        this.setState({
            Value: value           
        });

        this.props.HandleAutoSave(this.state.id, value, this.state.oldValue, this.state.elementName);
    }

    render() {
        const inputClass = this.state.Value === "" && this.state.isRequired && !this.state.isMissingItem ? 'form-control input-error' : 'form-control input-normal';
        return (
            <div style={{ marginRight: "20px" }}>
                <input
                    className= {inputClass}
                    type="number"
                    step="0.01"
                    disabled={this.state.isDisable}
                    value={this.state.Value}                  
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    //min={this.state.LowerLimit}
                    //max={this.state.UpperLimit}                  
                    data-tooltip-id={`tooltip-${this.state.id}`}              
                    data-tooltip-content={this.state.tooltipMessage}
                />
                {this.state.showTooltip && (
                    <Tooltip id={`tooltip-${this.state.id}`} place="top" effect="solid" type="error"/>
                )}
            </div>
        )
    }
}

export default withTranslation()(NumericElement);