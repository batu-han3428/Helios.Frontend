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
            id: props.Id,
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
        this.handleSave = this.handleSave.bind(this);
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

        this.setDefaultValue();
    }

    setDefaultValue() {
        var spl = [];
        
        if (this.state.Value !== null && this.state.Value !== '' && this.state.Value !== undefined) {
            spl = this.state.Value.split('.');
        }
        else if (this.state.DefaultValue !== null && this.state.DefaultValue !== '') {
            spl = this.state.DefaultValue.split('.');
        }

        var dsel = [];

        if (spl.length > 1) {
            this.state.DayOptionGroup.filter(item => {
                if (spl[0].toString().toLowerCase() !== "unk") {
                    if (item.label.toString().toLowerCase() === parseInt(spl[0]).toString().toLowerCase())
                        dsel = item;
                }
                else {
                    dsel = {
                        label: "UNK",
                        value: 100,
                    }
                }
            });

            this.state.DaySelectedGroup = dsel;
            var msel = [];

            this.state.MonthOptionGroup.filter(item => {
                if (spl[1].toString().toLowerCase() !== "unk") {
                    if (item.label.toString().toLowerCase() === parseInt(spl[1]).toString().toLowerCase())
                        msel = item;
                }
                else {
                    msel = {
                        label: "UNK",
                        value: 100,
                    }
                }
            });

            this.state.MonthSelectedGroup = msel;
            var ysel = [];

            this.state.YearOptionGroup.filter(item => {
                if (spl[2].toString().toLowerCase() !== "unk") {
                    if (item.label.toString().toLowerCase() === parseInt(spl[2]).toString().toLowerCase())
                        ysel = item;
                }
                else {
                    ysel = {
                        label: "UNK",
                        value: 100,
                    }
                }
            });

            this.state.YearSelectedGroup = ysel;
        }
    }

    handleDayChange = selectedOption => {
        this.setState({
            DaySelectedGroup: selectedOption
        }, () => {
            this.handleSave();
        });
    };

    handleMonthChange = selectedOption => {
        this.setState({
            MonthSelectedGroup: selectedOption
        }, () => {
            this.handleSave();
        });
    };

    handleYearChange = selectedOption => {
        this.setState({
            YearSelectedGroup: selectedOption
        }, () => {
            this.handleSave();
        });
    };

    handleSave() {
        if (this.state.DaySelectedGroup !== null && this.state.MonthSelectedGroup !== null && this.state.YearSelectedGroup !== null) {
            var day = this.state.DaySelectedGroup.value < 10 && this.state.DaySelectedGroup.label.toString().toLowerCase() !== "unk" ? '0' + this.state.DaySelectedGroup.value : this.state.DaySelectedGroup.label;
            var month = this.state.MonthSelectedGroup.value < 10 && this.state.MonthSelectedGroup.label.toString().toLowerCase() !== "unk" ? '0' + this.state.MonthSelectedGroup.value : this.state.MonthSelectedGroup.label;

            var value = day + '.' + month + '.' + this.state.YearSelectedGroup.label;
            this.props.HandleAutoSave(this.state.id, value);
        }
    }

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
                            {this.state.IsPreview && this.state.AddTodayDate &&

                                <Button color="" style={{ border: '1px solid #bebebe', marginLeft: '8px', marginBottom: '10px' }} onClick={this.handleTodayButton}>
                                    {this.props.t("Today")}
                                </Button>

                            }
                        </div>
                    )}

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
