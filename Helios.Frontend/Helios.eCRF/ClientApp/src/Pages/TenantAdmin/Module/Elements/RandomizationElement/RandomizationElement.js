import PropTypes from 'prop-types';
import React from "react";
import { withTranslation } from "react-i18next";
import { Space, Input, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RandomizationElement = props => {
    return (
        <Space.Compact
            style={{
                width: '100%',
            }}
        >
            <Input disabled={true} />
            <Button type="primary" disabled={props.IsFromDesign || props.IsPreview}><FontAwesomeIcon icon="fa-solid fa-shuffle" /> {props.t('Randomization')}</Button>
        </Space.Compact>
    )
}

RandomizationElement.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(RandomizationElement);