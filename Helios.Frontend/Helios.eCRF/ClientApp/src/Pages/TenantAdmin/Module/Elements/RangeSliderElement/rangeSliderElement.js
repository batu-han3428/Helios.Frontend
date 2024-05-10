import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'

class RangeSliderElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.Id,
            isDisable: props.IsDisable,
            horizontal: props.Value === null ? parseInt(props.DefaultValue) : parseInt(props.Value),
            horizontalLabels: {
                0: props.LeftText,
                100: props.RightText
            }
        }

        this.handleChangeHorizontal = this.handleChangeHorizontal.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
    }

    handleChangeHorizontal = value => {
        this.setState({
            horizontal: value
        })
    };

    handleComplete() {
        this.props.HandleAutoSave(this.state.id, this.state.horizontal.toString());
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
                    onChangeComplete={this.handleComplete}
                />
            </div>
        )
    }
};
export default RangeSliderElement;
