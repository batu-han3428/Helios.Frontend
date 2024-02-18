import React, { Component } from 'react';

class FileUploaderElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisable: props.IsDisable,
            selectedFile: null,
        };

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleFileChange(event) {
        const file = event.target.files[0];

        this.setState({
            selectedFile: file,
        });

        this.handleUpload();
    }

    handleUpload() {
        const { selectedFile } = this.state;

        if (selectedFile) {
            // Perform your file upload logic here
            // You can use FormData, fetch, or any other method to send the file to your server

            console.log('Uploading file:', selectedFile);
        } else {
            console.log('No file selected for upload.');
        }
    }

    render() {
        return (
            <div>
                <input type="file" onChange={this.handleFileChange} disabled={this.state.isDisable} />
            </div>
        )
    }
};
export default FileUploaderElement;
