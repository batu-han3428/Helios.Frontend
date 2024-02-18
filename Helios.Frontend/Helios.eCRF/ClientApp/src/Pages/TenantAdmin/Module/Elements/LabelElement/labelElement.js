import React, { Component } from 'react';

class LabelElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Title: props.Title,
        }
    }

    render() {
        return (
            <div style={{ marginRight: "20px", textAlign: 'Left', borderRadius:'5px' }} >
                <div dangerouslySetInnerHTML={{ __html: this.state.Title }} />
            </div>
        )
    }
};
export default LabelElement;
