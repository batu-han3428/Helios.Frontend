import React, { Component } from 'react';
import Slider from 'react-slider';
import './rangeSliderElement.css';

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
            }          
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

    handleAfterChange(value) {
        this.props.HandleAutoSave(this.state.id, this.state.horizontal.toString());
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
                    disabled={this.state.isDisable}
                    className="customSlider"
                    trackClassName="customSlider-track"
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
