import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

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
                <Slider
                    min={parseInt(this.props.LowerLimit)}
                    max={parseInt(this.props.UpperLimit)}
                    value={this.state.isDisable === true ? 0 : this.state.horizontal}
                    labels={this.state.horizontalLabels}
                    onChange={this.handleChangeHorizontal}
                />
            </div>
        )
    }
};
export default RangeSliderElement;
