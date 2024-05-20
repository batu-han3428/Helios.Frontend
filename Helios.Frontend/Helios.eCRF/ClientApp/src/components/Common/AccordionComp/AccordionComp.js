import React, { useState, useEffect } from "react";
import {
    Collapse, Label
} from "reactstrap";
import { withTranslation } from "react-i18next";
import PropTypes, { element } from 'prop-types';


const AccordionComp = ({ title, body, t, isOpened }) => {
    const [isOpen, setIsOpen] = useState(isOpened);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(isOpened);
    }, []);

    return (
        <>
            <i onClick={toggleAccordion} className={isOpen ? "mdi mdi-chevron-up" : "mdi mdi-chevron-down"} style={{ fontSize: title === "" ? "20px" : "12px", marginRight: "5px", cursor: "pointer" }}></i><Label style={{ borderBottom: title === "" ? "" : "1px solid black" }} className="form-label">{t(title)}</Label>
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