import React, { Component } from 'react';

class HiddenElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <div style={{ marginRight: "20px" }} >
                <input
                    className="form-control"
                    type="text"
                    disabled={"disabled"}
                    value={this.props.value !== null && this.props.value !== undefined ? `[${this.props.value}]` : '[]'}
                />
            </div>
        )
    }
};
export default HiddenElement;
