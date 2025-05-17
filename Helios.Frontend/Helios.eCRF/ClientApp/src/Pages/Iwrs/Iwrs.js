import PropTypes from 'prop-types';
import React from "react";
import { withTranslation } from "react-i18next";


const Iwrs = props => {
   
    document.title = props.t('IWRS');
    return (
        <React.Fragment>
           
        </React.Fragment>
    )
}

Iwrs.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Iwrs);