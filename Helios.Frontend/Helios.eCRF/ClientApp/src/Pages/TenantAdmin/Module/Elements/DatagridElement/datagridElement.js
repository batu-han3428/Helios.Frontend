import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import { startloading, endloading } from '../../../../../store/loader/actions';
import { GetAllElementListForSelect } from '../../FormBuilder/allElementList.js';
import { GetElementNameByKey } from '../Common/utils.js';
import Properties from '../../FormBuilder/properties.js';
import ElementList from '../../FormBuilder/elementList.js';
import SubjectDetailElementList from '../../../../Subject/Subject/SubjectDetailElementList.js';
import { GetElementPropertiesPlace, GetElementPropertiesWidth } from '../Common/ElementPropertiesPlace'
import { SubjectApi } from '../../../../../store/services/Subject';
import { showToast } from '../../../../../store/toast/actions';
import { connect } from 'react-redux';

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
            isMissingData: props.IsMissingData,
            isAuditTrail: props.IsAuditTrail,
            isOpenQuery: props.IsOpenQuery,
            isAnswerQuery: props.IsAnswerQuery,
            isSdv: props.IsSdv,
            sdvInformation: props.SdvInformation,
            queryInformation: props.QueryInformation,
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

        this.toggleDgrdAddElementModal = this.toggleDgrdAddElementModal.bind(this);
        this.handleElementListChange = this.handleElementListChange.bind(this);
        this.getTdContent = this.getTdContent.bind(this);
        this.handleAddAnother = this.handleAddAnother.bind(this);
        this.initial = this.initial.bind(this);
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
            this.setState({ allRows: rowContent })
        }
        else {
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

            this.setState({ allRows: rowContent })
        }
    };

    componentDidMount() {
        this.initial();
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

    componentDidUpdate(prevProps) {
        if (
            prevProps.Id !== this.props.Id ||
            prevProps.ModuleId !== this.props.ModuleId ||
            prevProps.TenantId !== this.props.TenantId ||
            prevProps.StudyId !== this.props.StudyId ||
            prevProps.UserId !== this.props.UserId ||
            prevProps.IsDisable !== this.props.IsDisable ||
            prevProps.IsMissingData !== this.props.IsMissingData ||
            prevProps.IsAuditTrail !== this.props.IsAuditTrail ||
            prevProps.IsOpenQuery !== this.props.IsOpenQuery ||
            prevProps.IsAnswerQuery !== this.props.IsAnswerQuery ||
            prevProps.IsSdv !== this.props.IsSdv ||
            prevProps.SdvInformation !== this.props.SdvInformation ||
            prevProps.QueryInformation !== this.props.QueryInformation ||
            prevProps.ColumnCount !== this.props.ColumnCount ||
            prevProps.RowCount !== this.props.RowCount ||
            prevProps.FormType !== this.props.FormType ||
            prevProps.IsFromDesign !== this.props.IsFromDesign ||
            prevProps.DatagridAndTableProperties !== this.props.DatagridAndTableProperties ||
            prevProps.ChildElementList !== this.props.ChildElementList
        ) {
            this.setState({
                id: this.props.Id,
                moduleId: this.props.ModuleId,
                tenantId: this.props.TenantId,
                studyId: this.props.StudyId,
                userId: this.props.UserId,
                isDisable: this.props.IsDisable,
                isMissingData: this.props.IsMissingData,
                isAuditTrail: this.props.IsAuditTrail,
                isOpenQuery: this.props.IsOpenQuery,
                isAnswerQuery: this.props.IsAnswerQuery,
                isSdv: this.props.IsSdv,
                sdvInformation: this.props.SdvInformation,
                queryInformation: this.props.QueryInformation,
                columnCount: this.props.ColumnCount,
                rowCount: this.props.RowCount > 0 && this.props.RowCount !== undefined ? this.props.RowCount : 1,
                FormType: this.props.FormType,
                IsFromDesign: this.props.IsFromDesign,
                datagridAndTableProperties: this.props.DatagridAndTableProperties !== "" && this.props.DatagridAndTableProperties !== null ? JSON.parse(this.props.DatagridAndTableProperties) : [],
                childElementList: this.props.ChildElementList.length === 0 ? [] : this.props.ChildElementList,
            }, () => {
                this.initial();
            });
        }
    }

    togglePropertiesModal = () => {
        this.setState(prevState => ({
            propertiesdgrdModalState: !prevState.propertiesdgrdModalState
        }));
    };

    getTdContent(colIndex, rowIndex, isNew) {
        var result = false;
        var cld = [];
        this.state.childElementList.forEach(item => {
            if (this.state.IsFromDesign) {
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

        if (this.state.IsFromDesign) {
            if (result) {
                return <ElementList TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} ModuleElementList={cld} ShowElementList={false} IsDisable={true} FormType={this.state.FormType} />;
            }
            else {
                return <input className="btn btn-success" type="button" value="+" onClick={() => this.toggleDgrdAddElementModal(colIndex + 1)} />;
            }
        }
        else {
            if (result) {
                elements = <SubjectDetailElementList QueryInformation={this.state.queryInformation} SdvInformation={this.state.sdvInformation} IsSdv={this.state.isSdv} IsMissingData={this.state.isMissingData} IsAuditTrail={this.state.isAuditTrail} IsOpenQuery={this.state.isOpenQuery} IsAnswerQuery={this.state.isAnswerQuery} TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} DataGridRowId={this.state.dataGridRowId} ElementList={cld} IsDisable={this.state.isDisable !== "" ? true : false} />;
            }
            else {
                return "";
            }
        }

        if (isNew)
            this.state.newElements.push(elements.props.ElementList[0]);

        return elements;
    }

    handleAddAnother = async () => {
        try {
            this.state.dispatch(startloading());
          
            const response = await this.state.dispatch(SubjectApi.endpoints.addDataGridSubjectElements.initiate(this.state.id)).unwrap();

            this.state.dispatch(endloading());

            this.props.showToast(this.props.t(response.message), true, response.isSuccess);

        } catch (error) {
            this.props.showToast(this.props.t("An unexpected error occurred."), true, false);
        }
    };

    handleRemoveRow = async (dgri) => {
        try {
            this.state.dispatch(startloading());

            let singleLine = false;

            if (this.state.allRows.length === 1) singleLine = true;

            const response = await this.state.dispatch(SubjectApi.endpoints.removeDatagridSubjectElements.initiate({ datagridId: this.state.id, datagridRowId: dgri, singleLine: singleLine })).unwrap();

            this.state.dispatch(endloading());

            this.props.showToast(this.props.t(response.message), true, response.isSuccess);
        } catch (e) {
            this.props.showToast(this.props.t("An unexpected error occurred."), true, false);
            this.state.dispatch(endloading());
        }
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
                                <td key={index} style={{ verticalAlign: 'middle'}}>{this.state.IsFromDesign || (index + 1)}</td>
                                {[...Array(this.state.allRows[0].length)].map((_, columnIndex) => (
                                    <td key={columnIndex}>
                                        {row[columnIndex].content !== undefined ? row[columnIndex].content : ""}
                                    </td>
                                ))}
                                {!this.state.isDisable &&
                                    <td>
                                        <Button className="actionBtn" onClick={() => {
                                            let dgri;
                                            for (let i = 0; i < row.length; i++) {
                                                const item = row[i];
                                                if (item.content && item.content.props && item.content.props.ElementList && item.content.props.ElementList.length > 0) {
                                                    dgri = item.content.props.ElementList[0].dataGridRowId;
                                                    break;
                                                }
                                            }
                                            this.handleRemoveRow(dgri);
                                        }}>
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

const mapDispatchToProps = (dispatch) => ({
    showToast: (message, autoHide, stateToast) => dispatch(showToast(message, autoHide, stateToast))
});

export default connect(null, mapDispatchToProps)(withTranslation()(DatagridElement));
