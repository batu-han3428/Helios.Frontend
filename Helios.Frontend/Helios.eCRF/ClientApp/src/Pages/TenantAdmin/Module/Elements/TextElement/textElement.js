import React, { Component } from 'react';

class TextElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisable: props.IsDisable,
        }
    }

    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                <input
                    className="form-control"
                    type="text"
                    disabled={this.state.isDisable} />
            </div>
        )
    }
};
export default TextElement;
