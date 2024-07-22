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
import ToastComp from '../../../../../components/Common/ToastComp/ToastComp';
import { startloading, endloading } from '../../../../../store/loader/actions';
import { GetAllElementListForSelect } from '../../FormBuilder/allElementList.js';
import { GetElementNameByKey } from '../Common/utils.js';
import Properties from '../../FormBuilder/properties.js';
import ElementList from '../../FormBuilder/elementList.js';
import SubjectDetailElementList from '../../../../Subject/Subject/SubjectDetailElementList.js';
import { GetElementPropertiesPlace, GetElementPropertiesWidth } from '../Common/ElementPropertiesPlace'
import { API_BASE_URL } from '../../../../../constants/endpoints';

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
            rowCount: props.RowCount > 0 && props.RowCount !== undefined ? props.RowCount : 1,
            FormType: props.FormType,
            IsFromDesign: props.IsFromDesign,
            datagridAndTableProperties: props.DatagridAndTableProperties !== "" && props.DatagridAndTableProperties !== null ? JSON.parse(props.DatagridAndTableProperties) : [],
            childElementList: props.ChildElementList.length === 0 ? [] : props.ChildElementList,
            dispatch: props.Dispatch,
            showWhereElementPropeties: 0,
            fieldWidthsW: "",
            tableRows: [],
            dgrdModalState: false,
            elementListOptionGroup: GetAllElementListForSelect([7, 15, 16]),
            elementListSelectedGroup: null,
            elementName: "",
            elementType: 0,
            columnIndex: 0,
            totalWidth: "",
            dataGridRowId: 0,
            newElements: [],
            allRows: [],
        }

        this.toastRef = React.createRef();
        this.setShowToast.bind(this);
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

        this.state.datagridAndTableProperties.forEach(item => {
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

        if (!this.state.IsFromDesign) {
            var dgrdRowIds = this.state.childElementList.map(item => item.dataGridRowId);
            var maxDataGridRowId = dgrdRowIds.length > 0 ? Math.max(...dgrdRowIds) : 1;
            this.state.dataGridRowId = maxDataGridRowId;
            var rowIdGrps = [];

            rowIdGrps.push(dgrdRowIds.reduce((acc, value) => {
                acc[value] = (acc[value] || 0) + 1;
                return acc;
            }, {}));

            var rowIds = Object.keys(rowIdGrps[0]).map(Number);
            var rowContent = [];

            rowIds.map(rowIndx => {
                var colContent = [];

                [...Array(this.state.columnCount === 0 ? 1 : this.state.columnCount)].map((_, colIndx) => {
                    var elm = this.getTdContent(colIndx, rowIndx, false);

                    var cntnt = { content: elm };
                    colContent.push(cntnt);
                });

                rowContent.push(colContent);
            });

            rowContent.forEach(item => {
                this.state.allRows.push(item);
            });
        } else {
            var rowContent = [];

            [...Array(this.state.rowCount === 0 ? 1 : this.state.rowCount)].map((_, rowIndex) => {
                var colContent = [];
                [...Array(this.state.columnCount)].map((_, columnIndex) => {
                    var elm = this.getTdContent(columnIndex, rowIndex + 1, false);
                    var cntnt = { content: elm };
                    colContent.push(cntnt);
                });
                rowContent.push(colContent);
            });

            rowContent.forEach(item => {
                this.state.allRows.push(item);
            });
        }
    };

    setShowToast() {
        this.state.showToast = false;
    }

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

    togglePropertiesModal = () => {
        this.setState(prevState => ({
            propertiesdgrdModalState: !prevState.propertiesdgrdModalState
        }));
    };

    getTdContent(colIndex, rowIndex, isNew) {
        var result = false;
        var cld = [];
        this.state.childElementList.forEach(item => {
            if (this.state.isDisable) {
                if (item.columnIndex === colIndex + 1) {
                    result = true;
                    cld.push(item);
                }
            } else {
                if (item.columnIndex === colIndex + 1 && item.dataGridRowId === rowIndex) {
                    result = true;
                    cld.push(item);
                }
            }
        });

        var elements;

        if (this.state.isDisable) {
            if (result)
                return <ElementList TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} ModuleElementList={cld} ShowElementList={false} IsDisable={true} FormType={this.state.FormType} />;
            else
                return <input className="btn btn-success" type="button" value="+" onClick={() => this.toggleDgrdAddElementModal(colIndex + 1)} />;
        } else {
            if (result) {
                if (this.state.IsFromDesign)
                    return <ElementList TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} ModuleElementList={cld} ShowElementList={false} IsDisable={false} FormType={this.state.FormType} />;
                else
                    elements = <SubjectDetailElementList TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} DataGridRowId={this.state.dataGridRowId} ElementList={cld} IsDisable={false} />;
            } else
                return "";

        }

        if (isNew)
            this.state.newElements.push(elements.props.ElementList[0]);

        return elements;
    }

    handleAddAnother = () => {
        this.state.dispatch(startloading());
        var rowId = this.state.dataGridRowId;
        var newRowId;

        for (let item of this.state.allRows[0]) {
            if (item.content !== "") {
                newRowId = item.content.props.DataGridRowId;
                break;
            }
        }

        var objs = [];

        [...Array(this.state.columnCount)].map((_, columnIndex) => {
            var res = this.getTdContent(columnIndex, newRowId, true);
            var o = { content: res };
            objs.push(o);
        });

        this.setState(prevState => ({
            allRows: [...prevState.allRows, objs]
        }));

        var elems = [];

        this.state.newElements.map(item => {
            var a = {
                SubjectVisitPageModuleId: this.props.SubjectVisitPageModuleId,
                StudyVisitPageModuleElementId: item.studyVisitPageModuleElementId,
                DataGridRowId: rowId + 1
            };

            elems.push(a);
        })

        var bdy = JSON.stringify(elems);

        fetch(API_BASE_URL + `Subject/AddDatagridSubjectElements`, {
            method: 'POST',
            body: bdy,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                this.state.dispatch(endloading());
                this.state.dataGridRowId = rowId + 1;

                this.toastRef.current.setToast({
                    message: "successfully",
                    stateToast: true
                });
            })
            .then(data => {
                this.toastRef.current.setToast({
                    message: data.message,
                    stateToast: data.isSuccess ? true : false
                });
            })
            .catch(error => {
            });
    };

    handleRemoveRow = (index) => {
        this.state.dispatch(startloading());
        var rowId = this.state.dataGridRowId;
        var delElms = [];

        this.state.allRows[index].forEach(item => {
            delElms.push(item);
        });

        var elems = [];

        delElms.map(item => {
            if (item.content !== "")
                elems.push(item.content.props.ElementList[0].subjectVisitPageModuleElementId);
        })

        var bdy = JSON.stringify(elems);

        fetch(API_BASE_URL + `Subject/RemoveDatagridSubjectElements`, {
            method: 'POST',
            body: bdy,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                this.state.dispatch(endloading());
                this.state.dataGridRowId = rowId - 1;

                this.toastRef.current.setToast({
                    message: "successfully",
                    stateToast: true
                });
            })
            .then(data => {
                this.toastRef.current.setToast({
                    message: data.message,
                    stateToast: data.isSuccess ? true : false
                });
            })
            .catch(error => {
            });

        this.setState((prevState) => {
            const newRows = [...prevState.allRows];
            newRows.splice(index, 1);
            return { allRows: newRows };
        });
    };

    render() {
        return (
            <div className="table-responsive mb-3">
                <Table className="table table-hover table-bordered mb-0" style={{ width: this.state.totalWidth }}>
                    <thead>
                        <tr>
                            <th key='0' style={{ width: '', backgroundColor: "#6D6E70", color: "#FFF" }}>#</th>
                            {this.state.datagridAndTableProperties.map((col, index) => (
                                <th key={index} style={{ width: col.width, backgroundColor: "#6D6E70", color: "#FFF" }}>{col.title}</th>
                            ))}
                            {!this.state.isDisable &&
                                <th style={{ width: '', backgroundColor: "#6D6E70", color: "#FFF" }}>{this.props.t("Action")}</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.allRows.map((row, index) => (
                            <tr key={index}>
                                <td key={index}></td>
                                {[...Array(this.state.allRows[0].length)].map((_, columnIndex) => (
                                    <td key={columnIndex}>
                                        {row[columnIndex].content !== undefined ? row[columnIndex].content : ""}
                                    </td>
                                ))}
                                {!this.state.isDisable &&
                                    <td>
                                        <Button className="actionBtn" onClick={() => this.handleRemoveRow(index)}>
                                            <i className="far fa-trash-alt"></i>
                                        </Button>
                                    </td>
                                }
                            </tr>
                        ))}
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
                <ToastComp
                    ref={this.toastRef}
                />
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
