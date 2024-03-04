import React, { Component } from 'react';
import {
    Button,
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
            Title: props.Title,
            IsRequired: props.IsRequired,
            isDisable: props.IsDisable,
            AddTodayDate: props.AddTodayDate,
            StartDay: props.StartDay,
            EndDay: props.EndDay,
            StartMonth: props.StartMonth,
            EndMonth: props.EndMonth,
            StartYear: props.StartYear,
            EndYear: props.EndYear,
            IsPreview: props.IsPreview,
            Value: props.Value,
            DefaultValue: props.DefaultValue,
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
        this.handleTodayButton = this.handleTodayButton.bind(this);

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

    setDefaultValue() {
        debugger;
        if (this.state.DefaultValue !== '') {
            var spl = this.state.DefaultValue.split('.');

            var dsel = [];

            this.state.DayOptionGroup.filter(item => {
                if (item.value == spl[0])
                    dsel = item;
            });

            this.setState({ DaySelectedGroup: dsel });
        }
    }

    handleDayChange = selectedOption => {
        this.setState({ StartDay: selectedOption.value });
        this.setState({ DaySelectedGroup: selectedOption });
    };

    handleMonthChange = selectedOption => {
        this.setState({ StartMonth: selectedOption.value });
        this.setState({ MonthSelectedGroup: selectedOption });
    };

    handleYearChange = selectedOption => {
        this.setState({ StartYear: selectedOption.value });
        this.setState({ YearSelectedGroup: selectedOption });
    };

    handleTodayButton = () => {
        const today = new Date();

        this.setState({
            DaySelectedGroup: { label: today.getDate(), value: today.getDate() },
            MonthSelectedGroup: { label: today.getMonth() + 1, value: today.getMonth() + 1 },
            YearSelectedGroup: { label: today.getFullYear(), value: today.getFullYear() },
        });
    }

    render() {
        return (
            <>
                <Row>
                    {this.state.IsPreview && (
                        <div>
                            <label>
                                {this.state.IsRequired && (<span style={{ color: 'red' }}>*&nbsp;</span>)}
                                {this.state.Title}
                            </label>
                        </div>
                    )}
                    {this.state.IsPreview && this.state.AddTodayDate &&
                        <div>
                            <Button color="success" onClick={this.handleTodayButton}>
                                {this.props.t("Today")}
                            </Button>
                        </div>
                    }
                </Row>
                <Row>
                    <div className="col-md-3">
                        <Select
                            value={this.state.DaySelectedGroup}
                            onChange={this.handleDayChange}
                            options={this.state.DayOptionGroup}
                            classNamePrefix="select2-selection"
                            placeholder={this.props.t("Day")}
                            isDisabled={this.state.isDisable} />
                    </div>/
                    <div className="col-md-3">
                        <Select
                            value={this.state.MonthSelectedGroup}
                            onChange={this.handleMonthChange}
                            options={this.state.MonthOptionGroup}
                            classNamePrefix="select2-selection"
                            placeholder={this.props.t("Month")}
                            isDisabled={this.state.isDisable} />
                    </div>/
                    <div className="col-md-3">
                        <Select
                            value={this.state.YearSelectedGroup}
                            onChange={this.handleYearChange}
                            options={this.state.YearOptionGroup}
                            classNamePrefix="select2-selection"
                            placeholder={this.props.t("Year")}
                            isDisabled={this.state.isDisable} />
                    </div>
                </Row>
            </>
        )
    }
};
export default withTranslation()(DateElement);
