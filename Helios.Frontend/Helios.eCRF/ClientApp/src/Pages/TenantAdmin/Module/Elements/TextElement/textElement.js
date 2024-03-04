import React, { Component } from 'react';

class TextElement extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isDisable: props.IsDisable,
            Value: props.Value === undefined ? "" : props.Value,
        }

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleValueChange(e) {
        this.setState({ Value: e.target.value });
    };

    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                <input
                    className="form-control"
                    type="text"
                    //value={this.state.Value}
                    disabled={this.state.isDisable} />
            </div>
        )
    }
};
export default TextElement;
