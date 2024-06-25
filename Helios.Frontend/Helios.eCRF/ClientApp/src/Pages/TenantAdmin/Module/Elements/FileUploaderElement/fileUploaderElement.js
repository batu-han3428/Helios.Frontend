import React, { Component } from 'react';
import { withTranslation } from "react-i18next";

class FileUploaderElement extends Component {
    constructor(props) {
        super(props);       
        this.state = {
            isDisable: props.IsDisable,
            selectedFile: null, 
            fileName: props.t('No file chosen')
        };

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.fileInputRef = React.createRef();
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        this.setState({
            selectedFile: file,
            fileName: (file !== null && file !== undefined) ? file.name : this.props.t('No file chosen')
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
    handleButtonClick = () => {
        this.fileInputRef.current.click();
    }

    render() {      
        return (
            <div>
                <input type="file" ref={this.fileInputRef} onChange={this.handleFileChange} disabled={this.state.isDisable} style={{ display: 'none' }} />
                <button
                    type="button"
                    onClick={this.handleButtonClick}
                    disabled={this.state.isDisable}
                    style={{ borderRadius: '0.25rem' }}                   
                >
                  {this.props.t('Choose file')}
                </button>
                <label style={{ marginLeft: '4px', fontFamily: 'AvenirNext-Regular', fontSize: '16px' }}  >{this.state.fileName}</label>
            </div>
        )
    }
};
export default withTranslation() (FileUploaderElement);
