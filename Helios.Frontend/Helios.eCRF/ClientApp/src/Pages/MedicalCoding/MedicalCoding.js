import PropTypes from 'prop-types';
import React from "react";
import { withTranslation } from "react-i18next";


const MedicalCoding = props => {
   
    document.title = props.t('Medical coding');
    return (
        <React.Fragment>
           
        </React.Fragment>
    )
}

MedicalCoding.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(MedicalCoding);