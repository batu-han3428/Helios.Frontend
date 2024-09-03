import React, { Component } from 'react';
import Slider from 'react-slider';
import './rangeSliderElement.css';
import "../Element.css";

class RangeSliderElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            horizontal: (props.Value === null || props.Value === undefined || props.Value === "") ? props.DefaultValue === "" || props.DefaultValue === null || props.DefaultValue === undefined ? 0 : parseInt(props.DefaultValue) : parseInt(props.Value),
            horizontalLabels: {
                0: props.LeftText,
                100: props.RightText
            },
            oldValue: props.Value,
            elementName: props.ElementName,
            isRequired: props.IsRequired,
            isMissingItem: props.IsMissingItem
        }

        this.myRef = React.createRef();

        this.handleChangeHorizontal = this.handleChangeHorizontal.bind(this);
        this.handleAfterChange = this.handleAfterChange.bind(this);
    }
    
    handleChangeHorizontal = value => {
        this.setState({
            horizontal: value
        })
    };
    componentDidUpdate(prevProps) {
        if (prevProps.Value !== this.props.Value) {
            this.setState({ horizontal: (this.props.Value === null || this.props.Value === undefined || this.props.Value === "") ? this.props.DefaultValue === "" || this.props.DefaultValue === null || this.props.DefaultValue === undefined ? 0 : parseInt(this.props.DefaultValue) : parseInt(this.props.Value) });
        }
        if (
            prevProps.IsDisable !== this.props.IsDisable ||
            prevProps.LeftText !== this.props.LeftText ||
            prevProps.RightText !== this.props.RightText ||
            prevProps.IsRequired !== this.props.IsRequired ||
            prevProps.IsMissingItem !== this.props.IsMissingItem) {
            this.setState({
                isDisable: this.props.IsDisable,
                horizontalLabels: {
                    0: this.props.LeftText,
                    100: this.props.RightText
                },
                isRequired: this.props.IsRequired,
                isMissingItem: this.props.IsMissingItem
            });
        }
    }
    handleAfterChange(value) {
        this.props.HandleAutoSave(this.state.id, this.state.horizontal.toString(), this.state.oldValue, this.state.elementName);
    };


    render() {
        return (
            <div className='slider custom-labels'>
                <p className='defaultvalue'>{this.state.horizontal !== "" ? parseInt(this.state.horizontal) : parseInt(this.props.LowerLimit)}</p>
                <Slider
                    ref={this.myRef}
                    min={parseInt(this.props.LowerLimit)}
                    max={parseInt(this.props.UpperLimit)}
                    value={this.state.horizontal !== "" ? parseInt(this.state.horizontal) : parseInt(this.props.LowerLimit)}
                    getAriaValueText={this.state.horizontalLabels}
                    onChange={this.handleChangeHorizontal}
                    onAfterChange={this.handleAfterChange}
                    disabled={this.state.isDisable === "" ? false : true}                  
                    className="customSlider"
                    trackClassName={this.state.horizontal === 0 && this.state.isRequired && !this.state.isMissingItem ? 'customSlider-track input-error' : 'customSlider-track'}
                    thumbClassName="customSlider-thumb"
                />
                <div className='row'>
                    <p className='LowerLimitString'>{parseInt(this.props.LowerLimit)} </p>
                    <p className='UpperLimitString'>{parseInt(this.props.UpperLimit)}</p>
                    <p className='LeftText'>{this.props.LeftText} </p>
                    <p className='RightText'>{this.props.RightText}</p>
                </div>
            </div>
        )
    }
};
export default RangeSliderElement;
