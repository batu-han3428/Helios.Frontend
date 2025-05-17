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
            <div dangerouslySetInnerHTML={{ __html: this.state.Title }} />
        )
    }
};
export default LabelElement;
