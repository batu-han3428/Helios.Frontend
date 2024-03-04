import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Row,
    Table
} from "reactstrap";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import { GetAllElementListForSelect } from '../../FormBuilder/allElementList.js';
import { GetElementNameByKey } from '../Common/utils.js';
import Properties from '../../FormBuilder/properties.js';
import ElementList from '../../FormBuilder/elementList.js';
import Preview from '../../FormBuilder/preview.js';

class DatagridElement extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            id: props.Id,
            moduleId: props.ModuleId,
            tenantId: props.TenantId,
            userId: props.UserId,
            isDisable: props.IsDisable,
            columnCount: props.ColumnCount,
            datagridAndTableProperties: props.DatagridAndTableProperties !== "" ? JSON.parse(props.DatagridAndTableProperties) : [],
            childElementList: props.ChildElementList.length === 0 ? [] : props.ChildElementList,
            modalState: false,
            elementListOptionGroup: GetAllElementListForSelect(16),
            elementListSelectedGroup: null,
            elementName: "",
            elementType: 0,
            columnIndex: 0
        }

        this.toggleAddElementModal = this.toggleAddElementModal.bind(this);
        this.handleElementListChange = this.handleElementListChange.bind(this);
        this.getTdContent = this.getTdContent.bind(this);
    }

    toggleAddElementModal = (columnIndex) => {
        this.state.modalState = !(this.state.modalState);
        this.state.columnIndex = columnIndex;
    };

    handleElementListChange = (e) => {
        this.state.modalState = !(this.state.modalState);
        this.state.propertiesModalState = !(this.state.propertiesModalState);
        this.state.elementType = e.value;
        this.state.elementName = GetElementNameByKey(this.props, e.value) + " " + this.props.t("Properties");
    };

    togglePropertiesModal = () => {
        this.state.propertiesModalState = !(this.state.propertiesModalState);
    };

    getTdContent(index) {
        var result = false;
        var cld = [];
        this.state.childElementList.map(item => {
            if (item.columnIndex === index + 1) {
                result = true;
                cld.push(item);
            }
        })

        if (this.state.isDisable) {
            if (result)
                return <ElementList TenantId={this.state.TenantId} ModuleId={this.state.moduleId} ModuleElementList={cld} ShowElementList={false} IsDisable={true} />
            else
                return <input className="btn btn-success" type="button" value="+" onClick={() => this.toggleAddElementModal(index + 1)} />;
        }
        else {
            if (result)
                return <ElementList TenantId={this.state.TenantId} ModuleId={this.state.moduleId} ModuleElementList={cld} ShowElementList={false} IsDisable={false}/>
            else
                return "";

        }
    }

    render() {
        return (
            <div className="table-responsive mb-3">
                <Table className="table table-hover table-bordered mb-0">
                    <thead>
                        <tr>
                            {this.state.datagridAndTableProperties.map((col, index) => (
                                <th key={index} style={{ width: col.width, backgroundColor: "#6D6E70", color: "#FFF" }}>{col.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {[...Array(this.state.columnCount)].map((_, columnIndex) => (
                                <td key={columnIndex}>
                                    {this.getTdContent(columnIndex)}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </Table>

                <Modal isOpen={this.state.modalState} toggle={this.toggleAddElementModal} size="md">
                    <ModalHeader className="mt-0" toggle={this.toggleAddElementModal}>{this.props.t("Add a child input")}</ModalHeader>
                    <ModalBody>
                        <div>
                            <Row className="mb-3">
                                <div className="col-md-12">
                                    <Select
                                        value={this.state.elementListSelectedGroup}
                                        onChange={this.handleElementListChange}
                                        options={this.state.elementListOptionGroup}
                                        placeholder={this.props.t("Select")}
                                        classNamePrefix="select2-selection" />
                                </div>
                            </Row>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.propertiesModalState} toggle={this.togglePropertiesModal} size="lg">
                    <ModalHeader className="mt-0" toggle={this.togglePropertiesModal}>{this.state.elementName}</ModalHeader>
                    <ModalBody>
                        <div>
                            <Properties
                                ModuleId={this.state.moduleId}
                                Type={this.state.elementType}
                                Id={0}
                                TenantId={this.state.tenantId}
                                UserId={this.state.userId}
                                ParentId={this.state.id}
                                ActiveTab={"1"}
                                isCalcBtn={false}
                                ColumnIndex={this.state.columnIndex}>
                            </Properties>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
};

export default withTranslation()(DatagridElement);
