import React, { Component } from 'react';
import { Button, Row } from "reactstrap";
import Select from "react-select";
import { withTranslation } from "react-i18next";
import "../Element.css";

class DateElement extends Component {
    constructor(props) {
        super(props);          
        this.state = {
            id: props.Id,
            Title: props.Title,
            isDisable: props.IsDisable === "" ? false : true,
            AddTodayDate: props.AddTodayDate,
            StartDay: props.StartDay,
            EndDay: props.EndDay,
            StartMonth: props.StartMonth,
            EndMonth: props.EndMonth,
            StartYear: props.StartYear,
            EndYear: props.EndYear,
            IsPreview: props.IsPreview,
            Value: props.Value,
            oldValue: props.Value,
            elementName: props.ElementName,
            DefaultValue: props.DefaultValue,
            DayOptionGroup: [],
            DaySelectedGroup: null,
            MonthOptionGroup: [],
            MonthSelectedGroup: null,
            YearOptionGroup: [],
            YearSelectedGroup: null,
            isRequired: props.IsRequired,
            isMissingItem: props.IsMissingItem
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
    componentDidUpdate(prevProps) {
        if (prevProps.Value !== this.props.Value && this.props.Value === "") {
            this.setState({ DaySelectedGroup: null, MonthSelectedGroup: null, YearSelectedGroup:null });
        }
        if (
            prevProps.Value !== this.props.Value ||
            prevProps.IsDisable !== this.props.IsDisable ||
            prevProps.StartDay !== this.props.StartDay ||
            prevProps.EndDay !== this.props.EndDay ||
            prevProps.StartMonth !== this.props.StartMonth ||
            prevProps.EndMonth !== this.props.EndMonth ||
            prevProps.StartYear !== this.props.StartYear ||
            prevProps.EndYear !== this.props.EndYear ||
            prevProps.IsRequired !== this.props.IsRequired ||
            prevProps.IsMissingItem !== this.props.IsMissingItem
        ) {
            this.setState({
                id: this.props.Id,
                isDisable: this.props.IsDisable === "" ? false : true,
                AddTodayDate: this.props.AddTodayDate,
                StartDay: this.props.StartDay,
                EndDay: this.props.EndDay,
                StartMonth: this.props.StartMonth,
                EndMonth: this.props.EndMonth,
                StartYear: this.props.StartYear,
                EndYear: this.props.EndYear,
                IsPreview: this.props.IsPreview,
                Value: this.props.Value,
                DefaultValue: this.props.DefaultValue,
                isRequired: this.props.IsRequired,
                isMissingItem: this.props.IsMissingItem
            });
        }
    }
    handleSave() {
        if (this.state.DaySelectedGroup !== null && this.state.MonthSelectedGroup !== null && this.state.YearSelectedGroup !== null) {
            var day = this.state.DaySelectedGroup.value < 10 && this.state.DaySelectedGroup.label.toString().toLowerCase() !== "unk" ? '0' + this.state.DaySelectedGroup.value : this.state.DaySelectedGroup.label;
            var month = this.state.MonthSelectedGroup.value < 10 && this.state.MonthSelectedGroup.label.toString().toLowerCase() !== "unk" ? '0' + this.state.MonthSelectedGroup.value : this.state.MonthSelectedGroup.label;

            var value = day + '.' + month + '.' + this.state.YearSelectedGroup.label;
            this.props.HandleAutoSave(this.state.id, value, this.state.oldValue, this.state.elementName);
        }
    }

    handleTodayButton = () => {
        const today = new Date();
        const updates = {
            DaySelectedGroup: { label: today.getDate(), value: today.getDate() },
            MonthSelectedGroup: { label: today.getMonth() + 1, value: today.getMonth() + 1 },
        };

        if (this.state.EndYear === today.getFullYear()) {
            updates.YearSelectedGroup = { label: today.getFullYear(), value: today.getFullYear() };
        }

        this.setState(updates);
        var value = updates.DaySelectedGroup.value + '.' + updates.MonthSelectedGroup.value + '.' + updates.YearSelectedGroup.value;
        this.props.HandleAutoSave(this.state.id, value);
    };

    render() {
        const inputClassDay = (this.state.DaySelectedGroup === null || (this.state.DaySelectedGroup !==null && this.state.DaySelectedGroup.value === "")) && this.state.isRequired && !this.state.isMissingItem ? 'input-error' : 'input-normal';
        const inputClassMonth = (this.state.MonthSelectedGroup === null || (this.state.MonthSelectedGroup !== null && this.state.MonthSelectedGroup.value === "")) && this.state.isRequired && !this.state.isMissingItem ? 'input-error' : 'input-normal';
        const inputClassYear = (this.state.YearSelectedGroup === null || (this.state.YearSelectedGroup !== null && this.state.YearSelectedGroup.value === "")) && this.state.isRequired && !this.state.isMissingItem ? 'input-error' : 'input-normal';
        return (
            <>
                <Row>
                   
                    <div>
                        {this.state.IsPreview && (
                            <label>
                                {this.state.isRequired && !this.state.isMissingItem && (<span style={{ color: 'red' }}>*&nbsp;</span>)}
                                {this.state.Title}
                            </label>
                        )}
                        {this.state.AddTodayDate &&
                            <Button disabled={this.state.isDisable} color="" style={{ border: '1px solid #bebebe', marginLeft: '8px', marginBottom: '10px' }} onClick={this.handleTodayButton}>
                                {this.props.t("Today")}
                            </Button>
                        }
                    </div>
                </Row>
                <Row>
                    <div className="col-md-3">
                        <Select
                            value={this.state.DaySelectedGroup}
                            onChange={this.handleDayChange}
                            options={this.state.DayOptionGroup}
                            classNamePrefix="select2-selection"
                            className={inputClassDay}
                            placeholder={this.props.t("Day")}
                            isDisabled={this.state.isDisable} />
                    </div>/
                    <div className="col-md-3">
                        <Select
                            value={this.state.MonthSelectedGroup}
                            onChange={this.handleMonthChange}
                            options={this.state.MonthOptionGroup}
                            classNamePrefix="select2-selection"
                            className={inputClassMonth}
                            placeholder={this.props.t("Month")}
                            isDisabled={this.state.isDisable} />
                    </div>/
                    <div className="col-md-4">
                        <Select
                            value={this.state.YearSelectedGroup}
                            onChange={this.handleYearChange}
                            options={this.state.YearOptionGroup}
                            classNamePrefix="select2-selection"
                            className={inputClassYear}
                            placeholder={this.props.t("Year")}
                            isDisabled={this.state.isDisable} />
                    </div>
                </Row>
            </>
        )
    }
};
export default withTranslation()(DateElement);
