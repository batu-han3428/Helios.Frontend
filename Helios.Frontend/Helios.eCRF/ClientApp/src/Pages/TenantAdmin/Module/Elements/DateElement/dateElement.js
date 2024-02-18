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
import Select from "react-select";
import { withTranslation } from "react-i18next";

class DateElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDisable: props.IsDisable,
            StartDay: props.StartDay,
            EndDay: props.EndDay,
            StartMonth: props.StartMonth,
            EndMonth: props.EndMonth,
            StartYear: props.StartYear,
            EndYear: props.EndYear,
            DayOptionGroup: [],
            DaySelectedGroup: null,
            MonthOptionGroup: [],
            MonthSelectedGroup: null,
            YearOptionGroup: [],
            YearSelectedGroup: null,
        }

        this.fillElementDDs = this.fillElementDDs.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);

        this.fillElementDDs();
    }

    fillElementDDs() {
        var dOptionGroup = [];
        var mOptionGroup = [];
        var yOptionGroup = [];

        var uitem = {
            label: "UNK",
            value: 100,
        }

        for (var i = this.state.StartDay; i <= this.state.EndDay; i++) {
            var item = {
                label: i,
                value: i,
            }

            dOptionGroup.push(item);
        }

        dOptionGroup.push(uitem);
        this.state.DayOptionGroup = dOptionGroup;

        for (i = this.state.StartMonth; i <= this.state.EndMonth; i++) {
            item = {
                label: i,
                value: i,
            }

            mOptionGroup.push(item);
        }

        mOptionGroup.push(uitem);
        this.state.MonthOptionGroup = mOptionGroup;

        for (i = this.state.StartYear; i <= this.state.EndYear; i++) {
            item = {
                label: i,
                value: i,
            }

            yOptionGroup.push(item);
        }

        yOptionGroup.push(uitem);
        this.state.YearOptionGroup = yOptionGroup;
    }

    handleDayChange = selectedOption => {

    };

    handleMonthChange = selectedOption => {

    };

    handleYearChange = selectedOption => {

    };

    render() {
        return (
            <Row>
                <div className="col-md-3">
                    <Select
                        value={this.state.DaySelectedGroup}
                        onChange={this.handleDayChange}
                        options={this.state.DayOptionGroup}
                        classNamePrefix="select2-selection"
                        placeholder={this.props.t("Day")}
                        isDisabled={this.state.isDisable}
                    />
                </div>/
                <div className="col-md-3">
                    <Select
                        value={this.state.MonthSelectedGroup}
                        onChange={this.handleMonthChange}
                        options={this.state.MonthOptionGroup}
                        classNamePrefix="select2-selection"
                        placeholder={this.props.t("Month")}
                        isDisabled={this.state.isDisable}
                    />
                </div>/
                <div className="col-md-3">
                    <Select
                        value={this.state.YearSelectedGroup}
                        onChange={this.handleYearChange}
                        options={this.state.YearOptionGroup}
                        classNamePrefix="select2-selection"
                        placeholder={this.props.t("Year")}
                        isDisabled={this.state.isDisable}
                    />
                </div>
            </Row>
        )
    }
};
export default withTranslation()(DateElement);
