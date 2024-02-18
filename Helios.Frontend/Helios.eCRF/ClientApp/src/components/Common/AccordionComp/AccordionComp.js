import React, { useState } from "react";
import {
    Collapse, Label
} from "reactstrap";
import { withTranslation } from "react-i18next";
import PropTypes from 'prop-types';


const AccordionComp = ({ title, body, t, isOpened=false }) => {
    
    const [isOpen, setIsOpen] = useState(isOpened);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <i onClick={toggleAccordion} className={isOpen ? "mdi mdi-chevron-up" : "mdi mdi-chevron-down"} style={{ fontSize: "12px", marginRight: "5px", cursor: "pointer" }}></i><Label style={{ borderBottom: "1px solid black" }} className="form-label">{t(title)}</Label>
            <Collapse isOpen={isOpen}>
                <div style={{ padding: "5px 0" }}>
                    {body}
                </div>
            </Collapse>
        </>
    );
}

AccordionComp.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AccordionComp);