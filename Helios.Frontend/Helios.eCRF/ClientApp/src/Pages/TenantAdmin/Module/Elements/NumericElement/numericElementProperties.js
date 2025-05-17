import React, { Component } from 'react';
import {
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Collapse,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap";
import { withTranslation } from "react-i18next";

class NumericElementProperties extends Component {
    constructor(props) {
        super(props);

        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleMaskChange = this.handleMaskChange.bind(this);
        this.handleLowerLimitChange = this.handleLowerLimitChange.bind(this);
        this.handleUpperLimitChange = this.handleUpperLimitChange.bind(this);
    }

    handleUnitChange(e) {
        this.props.changeUnit(e.target.value);
    };

    handleMaskChange(e) {
        this.props.changeMask(e.target.value);
    };

    handleLowerLimitChange(e) {
        this.props.changeLowerLimit(e.target.value);
    };

    handleUpperLimitChange(e) {
        this.props.changeUpperLimit(e.target.value);
    };

    render() {
        return (
            <div>
                <Row className="mb-3">
                    <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                    >
                        {this.props.t("Unit")}
                    </label>
                    <div className="col-md-4">
                        <input
                            value={this.props.Unit}
                            onChange={this.handleUnitChange}
                            className="form-control"
                            type="text"
                            placeholder={this.props.t("Unit")}/>
                    </div>
                    <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                    >
                        {this.props.t("Mask type")}
                    </label>
                    <div className="col-md-4">
                        <input
                            value={this.props.Mask}
                            onChange={this.handleMaskChange}
                            className="form-control"
                            type="text"
                            placeholder={this.props.t("Mask type")}/>
                    </div>
                </Row>
                <Row className="mb-3">
                    <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                    >
                        {this.props.t("Lower limit")}
                    </label>
                    <div className="col-md-4">
                        <input
                            value={this.props.LowerLimit}
                            onChange={this.handleLowerLimitChange}
                            className="form-control"
                            type="text"
                            placeholder={this.props.t("Lower limit")}/>
                    </div>
                    <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                    >
                        {this.props.t("Upper limit")}
                    </label>
                    <div className="col-md-4">
                        <input
                            value={this.props.UpperLimit}
                            onChange={this.handleUpperLimitChange}
                            className="form-control"
                            type="text"
                            placeholder={this.props.t("Upper limit")} />
                    </div>
                </Row>
            </div>
        );
    }
}

export default withTranslation()(NumericElementProperties);
