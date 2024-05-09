import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import './rangeSliderElement.css';

const sliderRef = '0px';
class RangeSliderElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isDisable: props.IsDisable,
            horizontal: props.DefaultValue,
            Value: props.Value,
            horizontalLabels: {
                0: props.LeftText,
                100: props.RightText
            }          
        }
        this.myRef = React.createRef();

        this.handleChangeHorizontal = this.handleChangeHorizontal.bind(this);
    }

    handleChangeHorizontal = value => {
        this.setState({
            horizontal: value
        })

    };
   
    render() {
        return (
            <div className='slider custom-labels'>
                <p className='defaultvalue'>{parseInt(this.props.DefaultValue)}</p>
                <Slider
                    ref={this.myRef}
                    min={parseInt(this.props.LowerLimit)}
                    max={parseInt(this.props.UpperLimit)}
                    value={parseInt(this.state.horizontal)}
                    labels={this.state.horizontalLabels}
                    onChange={this.handleChangeHorizontal}
                />
                <div className='row'>
                    <p className='LowerLimitString'>{parseInt(this.props.LowerLimit)} </p>
                    <p className='UpperLimitString'>{parseInt(this.props.UpperLimit)}</p>
                </div>
            </div>
        )
    }
};
export default RangeSliderElement;
