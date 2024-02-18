import React, { Component } from 'react';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import "./editor.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { withTranslation } from "react-i18next";

class LabelElementProperties extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
        }

        this.setTitleToEditorContent(props.Title)

        this.setTitleToEditorContent = this.setTitleToEditorContent.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.setEditorState = this.setEditorState.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
    }

    setTitleToEditorContent = (ttl) => {
        var blocksFromHTML = htmlToDraft(ttl);
        var state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        );
        var newEditorState = EditorState.createWithContent(state);
        this.state.editorState = newEditorState;
    };

    handleImageUpload = (file) => {
        return new Promise(
            (resolve, reject) => {
                if (file) {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        resolve({ data: { link: e.target.result } })
                    };
                    reader.readAsDataURL(file);
                }
            }
        );
    };

    setEditorState = (file) => {
        this.setState({ editorState: file });
    };

    handleTitleChange(e) {
        this.props.changeLableTitle(e);
    };

    render() {
        return (
            <div className="mb-3">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    {this.props.t("Title")}
                </label>
                <Editor
                    editorState={this.state.editorState}
                    toolbarClassName="custom-toolbar-class"
                    wrapperClassName="wrapperClassName"
                    editorClassName="custom-editor-class"
                    toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                        inline: {
                            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
                        },
                        list: {
                            options: ['unordered', 'ordered'],
                        },
                        textAlign: {
                            options: ['left', 'center', 'right'],
                        },
                        image: {
                            uploadEnabled: true,
                            uploadCallback: this.handleImageUpload,
                            alt: { present: false, mandatory: false },
                            previewImage: true,
                            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                            defaultSize: {
                                height: 'auto',
                                width: 'auto',
                            },
                        },
                    }}
                    onEditorStateChange={(data) => {
                        this.setEditorState(data);
                        const contentState = data.getCurrentContent();
                        const contentStateRaw = convertToRaw(contentState);
                        const htmlContent = draftToHtml(contentStateRaw);
                        const cntnt = contentState.hasText() ? htmlContent : null;
                        this.handleTitleChange(cntnt);
                        //validationType.setFieldValue('editor', contentState.hasText() ? htmlContent : null);
                    }}
                    editorStyle={{ resize: 'vertical' }}
                />
            </div>
        );
    }
};

export default withTranslation()(LabelElementProperties);
