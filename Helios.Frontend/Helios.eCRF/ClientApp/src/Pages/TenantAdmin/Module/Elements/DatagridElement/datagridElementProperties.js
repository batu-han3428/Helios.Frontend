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
import { withTranslation } from "react-i18next";

class DatagridElementProperties extends Component {
    constructor(props) {
        super(props);
        var inps = props.DatagridAndTableProperties !== "" ? JSON.parse(props.DatagridAndTableProperties) : [];

        this.state = {
            elementRows: inps,
            columnCount: props.ColumnCount
        }

        this.removeRow = this.removeRow.bind(this);
        this.addRow = this.addRow.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    removeRow = (index) => {
        this.state.columnCount = this.state.columnCount - 1;

        this.setState((prevState) => {
            const newRows = [...prevState.elementRows];
            newRows.splice(index, 1);
            return { elementRows: newRows };
        }, () => {
            this.props.changeDatagridAndTableProperties(JSON.stringify(this.state.elementRows));
            this.props.changeColumnCount(this.state.columnCount);
        });
    };

    addRow = () => {
        this.state.columnCount = this.state.columnCount + 1;

        this.setState((prevState) => ({
            elementRows: [
                ...prevState.elementRows,
                {
                    title: '',
                    width: '',
                },
            ],
        }), () => {
            this.props.changeDatagridAndTableProperties(JSON.stringify(this.state.elementRows));
            this.props.changeColumnCount(this.state.columnCount);
        });
    };

    handleInputChange = (index, fieldName, value) => {
        this.setState((prevState) => {
            const newRows = [...prevState.elementRows];
            newRows[index][fieldName] = value;
            return { elementRows: newRows };
        }, () => {
            this.props.changeDatagridAndTableProperties(JSON.stringify(this.state.elementRows));
        });
    };

    render() {
        return (
            <>
                <Row className="mb-3">
                    <div className="table-responsive mb-3">
                        <Table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>{this.props.t("Title")}</th>
                                    <th>{this.props.t("Width")}</th>
                                    <th>{this.props.t("Action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.elementRows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                value={row.title}
                                                className="form-control"
                                                type="text"
                                                placeholder="Title"
                                                onChange={(e) => this.handleInputChange(index, 'title', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                value={row.width}
                                                className="form-control"
                                                type="text"
                                                placeholder="Width"
                                                onChange={(e) => this.handleInputChange(index, 'width', e.target.value)}
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
                            {this.props.t("Add a column")}
                        </Button>
                    </div>
                </Row>
            </>
        );
    }
};

export default withTranslation()(DatagridElementProperties);
