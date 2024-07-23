import PropTypes from 'prop-types';
import React from "react";
import { withTranslation } from "react-i18next";


const StudyDocuments = props => {
    document.title = props.t('Study documents');
    return (
        <React.Fragment>
           
        </React.Fragment>
    )
}

StudyDocuments.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(StudyDocuments);