import React, { Component, useState, useContext, Form, FormField, TextBox, ComboBox, CheckBox, LinkButton } from 'react';
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
    Table,
    TabPane,
} from "reactstrap";
import Select from "react-select";
import CodeMirror from "@uiw/react-codemirror";
import { withTranslation } from "react-i18next";
import { GetElementNameByKey } from '../Common/utils';
import './calcStyle.css';

const baseUrl = "https://localhost:7196";

class CalculationElementProperties extends Component {
    constructor(props) {
        super(props);

        var inps = props.CalculationSourceInputs !== "" ? JSON.parse(props.CalculationSourceInputs) : [];
        var inpsCount = props.CalculationSourceInputs !== "" ? JSON.parse(props.CalculationSourceInputs).length : 0;

        this.state = {
            elementListOptionGroup: [],
            ModuleId: props.ModuleId,
            Code: props.MainJs,
            inputCounter: inpsCount,
            elementRows: inps,
        }

        this.removeRow = this.removeRow.bind(this);
        this.addRow = this.addRow.bind(this);
        this.fillAllElementList = this.fillAllElementList.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.isVariableNameDuplicate = this.isVariableNameDuplicate.bind(this);
        this.isElementFieldSelectedInvalid = this.isElementFieldSelectedInvalid.bind(this);
        this.setCode = this.setCode.bind(this);
        this.controlNullValuesInRows = this.controlNullValuesInRows.bind(this);

        this.fillAllElementList();
    }

    removeRow = (index) => {
        this.setState((prevState) => {
            const newRows = [...prevState.elementRows];
            newRows.splice(index, 1);
            return { elementRows: newRows };
        }, () => {
            this.props.changeCalculationSourceInputs(JSON.stringify(this.state.elementRows));
        });
    };

    addRow = () => {
        this.state.inputCounter = this.state.inputCounter + 1;

        this.setState((prevState) => ({
            elementRows: [
                ...prevState.elementRows,
                {
                    elementFieldSelectedGroup: this.state.elementListOptionGroup[0],
                    variableName: 'A' + this.state.inputCounter,
                },
            ],
        }), () => {
            this.props.changeCalculationSourceInputs(JSON.stringify(this.state.elementRows));
            this.controlNullValuesInRows();
        });
    };

    fillAllElementList() {
        fetch(baseUrl + '/Module/GetModuleAllElements?id=' + this.state.ModuleId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                var allElements = data.map(item => ({
                    label: item.elementName + " - " + GetElementNameByKey(this.props, item.elementType),
                    value: item.id,
                }));

                const newItem = {
                    label: "calculated - calculated",
                    value: 0,
                };

                const newArray = [...allElements, newItem];
                this.state.elementListOptionGroup = newArray;

                if (this.state.inputCounter === 0) {
                    this.addRow();
                }
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });

    }

    handleInputChange = (index, fieldName, value) => {
        this.setState((prevState) => {
            const newRows = [...prevState.elementRows];
            newRows[index][fieldName] = value;
            return { elementRows: newRows };
        }, () => {
            this.props.changeCalculationSourceInputs(JSON.stringify(this.state.elementRows));
            this.controlNullValuesInRows();
        });
    };

    setCode = (val) => {
        this.state.Code = val;
        this.props.changeMainJs(val);
    };

    isVariableNameDuplicate(index) {
        const variableName = this.state.elementRows[index].variableName;
        return this.state.elementRows.some((row, i) => i !== index && row.variableName === variableName);
    }

    isElementFieldSelectedInvalid(index) {
        const selectedValue = this.state.elementRows[index].elementFieldSelectedGroup;
        return !selectedValue; // Returns true if not selected
    }

    controlNullValuesInRows() {
        var isVal = true;
        for (var i = 0; i < this.state.elementRows.length; i++) {
            var chkDup = this.isVariableNameDuplicate(i);

            if (chkDup) {
                isVal = false;
                break;
            }

            var chkSel = this.isElementFieldSelectedInvalid(i);

            if (chkSel) {
                isVal = false;
                break;
            }
        }

        this.props.changeIsFormValid(isVal);
    }

    render() {
        return (
            <Row className="mb-3">
                <div className="table-responsive mb-3">
                    <Table className="table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>{this.props.t("Source input name")}</th>
                                <th>{this.props.t("Variable name")}</th>
                                <th>{this.props.t("Action")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.elementRows.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <Select
                                            value={row.elementFieldSelectedGroup}
                                            onChange={(e) => this.handleInputChange(index, 'elementFieldSelectedGroup', e)}
                                            options={this.state.elementListOptionGroup}
                                            classNamePrefix="select2-selection"
                                            className={`form-control ${this.isElementFieldSelectedInvalid(index) ? 'is-invalid' : ''}`}
                                            placeholder={this.props.t("Select")}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            style={{ fontSize: '8pt' }}
                                            value={row.variableName}
                                            className={`form-control ${this.isVariableNameDuplicate(index) ? 'is-invalid' : ''}`}
                                            type="text"
                                            placeholder="Variable name"
                                            onChange={(e) => this.handleInputChange(index, 'variableName', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Button className="actionBtn" onClick={() => this.removeRow(index)}>
                                            <i className="far fa-trash-alt"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Button color="success" onClick={this.addRow} className='mt-1'>
                        {this.props.t("Add another")}
                    </Button>
                </div>
                <div style={{ border: "#eee 1px solid", borderRadius: '5px' }}>
                    <div style={{ borderBottom: '#eee 1px solid' }}>
                        <label>
                            {this.props.t("Javascript editor")}
                        </label>
                    </div>
                    <CodeMirror
                        value={this.state.Code}
                        onChange={this.setCode}
                        height="100px"
                    />
                </div>
            </Row>
        );
    }
};

export default withTranslation()(CalculationElementProperties);
