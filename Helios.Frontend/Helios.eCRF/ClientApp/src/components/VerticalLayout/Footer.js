import React from "react"
import { Container, Row, Col } from "reactstrap"
import { withTranslation } from "react-i18next";
import PropTypes from 'prop-types';

const Footer = (props) => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <div className="col-12">
                {props.t("© 2017 Helios - V3.0 prepared by MedCase")}
            </div>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

Footer.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Footer);
