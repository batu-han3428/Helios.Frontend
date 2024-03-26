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
                    value="Hidden field" />
            </div>
        )
    }
};
export default HiddenElement;
