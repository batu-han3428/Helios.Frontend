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
import SubjectDetailElementList from '../../../../Subject/Subject/SubjectDetailElementList.js';
import { GetElementPropertiesPlace, GetElementPropertiesWidth } from '../Common/ElementPropertiesPlace'

class DatagridElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.Id,
            moduleId: props.ModuleId,
            tenantId: props.TenantId,
            studyId: props.StudyId,
            userId: props.UserId,
            isDisable: props.IsDisable,
            columnCount: props.ColumnCount,
            FormType: props.FormType,
            IsFromDesign: props.IsFromDesign,
            datagridAndTableProperties: props.DatagridAndTableProperties !== "" && props.DatagridAndTableProperties !== null ? JSON.parse(props.DatagridAndTableProperties) : [],
            childElementList: props.ChildElementList.length === 0 ? [] : props.ChildElementList,
            showWhereElementPropeties: 0,
            fieldWidthsW: "",
            tableRows: [],
            dgrdModalState: false,
            elementListOptionGroup: GetAllElementListForSelect(16),
            elementListSelectedGroup: null,
            elementName: "",
            elementType: 0,
            columnIndex: 0,
            totalWidth: ""
        }

        this.toggleDgrdAddElementModal = this.toggleDgrdAddElementModal.bind(this);
        this.handleElementListChange = this.handleElementListChange.bind(this);
        this.getTdContent = this.getTdContent.bind(this);
        this.handleAddAnother = this.handleAddAnother.bind(this);
        this.initial = this.initial.bind(this);

        this.initial();
    }

    initial = () => {
        var wdth = 0;
        var num = "";
        var characher = "";

        this.state.datagridAndTableProperties.map(item => {
            if (item.width.includes('%')) {
                num = item.width.slice(0, item.width.length - 1);
                characher = "%";
            }
            else if (item.width.includes('px')) {
                num = item.width.slice(0, item.width.length - 2);
                characher = "px";
            }

            wdth += parseInt(num);
        });

        this.state.totalWidth = wdth + characher;
    };

    toggleDgrdAddElementModal = (columnIndex) => {
        this.setState(prevState => ({
            dgrdModalState: !prevState.dgrdModalState,
            columnIndex: columnIndex
        }));
    };

    handleElementListChange = (e) => {
        this.setState(prevState => ({
            dgrdModalState: !prevState.dgrdModalState,
            propertiesdgrdModalState: !prevState.propertiesdgrdModalState,
            elementType: e.value,
            showWhereElementPropeties: GetElementPropertiesPlace(e.value),
            fieldWidthsW: GetElementPropertiesWidth(e.value),
            elementName: GetElementNameByKey(this.props, e.value) + " " + this.props.t("Properties")
        }));
    };
    componentDidUpdate(prevProps) {
        if (this.props.ChildElementList !== prevProps.ChildElementList) {
            this.setState(
                { childElementList: this.props.ChildElementList }
            );
        }
    }
    togglePropertiesModal = () => {
        this.setState(prevState => ({
            propertiesdgrdModalState: !prevState.propertiesdgrdModalState
        }));
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
                return <ElementList TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} ModuleElementList={cld} ShowElementList={false} IsDisable={true} FormType={this.state.FormType} />
            else
                return <input className="btn btn-success" type="button" value="+" onClick={() => this.toggleDgrdAddElementModal(index + 1)} />;
        }
        else {
            if (result) {
                if (this.state.IsFromDesign)
                    return <ElementList TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} ModuleElementList={cld} ShowElementList={false} IsDisable={false} FormType={this.state.FormType} />
                else
                    return <SubjectDetailElementList TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} ElementList={cld} IsDisable={false} />
            }
            else
                return "";

        }
    }

    handleAddAnother = () => {
        const newRow = [...Array(this.state.columnCount)].map((_, columnIndex) => (
            <td key={columnIndex}>{this.getTdContent(columnIndex)}</td>
        ));

        this.setState((prevState) => ({
            tableRows: [...prevState.tableRows, <tr key={prevState.tableRows.length}>{newRow}</tr>],
        }));
    };

    render() {
        return (
            <div className="table-responsive mb-3">
                <Table className="table table-hover table-bordered mb-0" style={{ width: this.state.totalWidth }}>
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
                        {this.state.tableRows}
                    </tbody>
                </Table>
                {!this.state.isDisable &&
                    <Row>
                        <div>
                            <Button color="primary" onClick={this.handleAddAnother} className='mt-1'>
                                {"+ " + this.props.t("Add another")}
                            </Button>
                        </div>
                    </Row>
                }
                <Modal isOpen={this.state.dgrdModalState} toggle={this.toggleDgrdAddElementModal} size="md">
                    <ModalHeader className="mt-0" toggle={this.toggleDgrdAddElementModal}>{this.props.t("Add a child input")}</ModalHeader>
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

                <Modal isOpen={this.state.propertiesdgrdModalState} toggle={this.togglePropertiesModal} size="lg">
                    <ModalHeader className="mt-0" toggle={this.togglePropertiesModal}>{this.state.elementName}</ModalHeader>
                    <ModalBody>
                        <div>
                            <Properties
                                ModuleId={this.state.moduleId}
                                Type={this.state.elementType}
                                Id={0}
                                TenantId={this.state.tenantId}
                                StudyId={this.state.studyId}
                                UserId={this.state.userId}
                                ParentId={this.state.id}
                                ActiveTab={"1"}
                                isCalcBtn={false}
                                ColumnIndex={this.state.columnIndex}
                                FormType={this.state.FormType}
                                Dispatch={this.props.Dispatch}
                            >
                            </Properties>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
};

export default withTranslation()(DatagridElement);
