import React, { useState } from 'react';
import './TagInput.css';

class TagInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: [],
            taglst: '',
            //aa:props.Tags,
            wth: 10
        };
    }

    handleTagsChange(e) {
        this.props.changeDependentFieldValue(e.target.value);
    };

    removeTag = (i) => {
        const newTags = [...this.state.tags];
        newTags.splice(i, 1);
        this.setState({ tags: newTags });
    }

    inputKeyDown = (e) => {
        const val = e.target.value;
        this.state.wth = this.state.wth + 10;

        if (e.key === 'Enter' && val) {
            if (this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
                return;
            }

            this.setState({ tags: [...this.state.tags, val] });
            this.tagInput.value = null;
            this.state.wth = 10;
            this.props.changeDependentFieldValue(this.state.tags);
        } else if (e.key === 'Backspace' && !val) {
            this.removeTag(this.state.tags.length - 1);
        }
    }

    inputKeyUp = (e) => {
        //this.props.onDataReceived(this.state.tags);
    }

    render() {
        return (
            <div className="input-tag">
                <div className="input-tag__tags">
                    {this.state.tags.map((tag, i) => (
                        <p key={tag}>
                            {tag}
                            <button type="button" style={{ background: 'none' }} onClick={() => { this.removeTag(i); }}>+</button>
                        </p>
                    ))}
                    <p className="input-tag__tags__input"><input type="text" style={{ width: this.state.wth + 'px' }} onKeyDown={this.inputKeyDown} onKeyUp={this.inputKeyUp} ref={c => { this.tagInput = c; }} /></p>
                </div>
            </div>
        );
    }
}

export default TagInput;
