import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import { connect } from 'react-redux';
import { startloading, endloading } from '../../../../../store/loader/actions';
import { GetAllElementListForSelect } from '../../FormBuilder/allElementList.js';
import { GetElementNameByKey } from '../Common/utils.js';
import Properties from '../../FormBuilder/properties.js';
import ElementList from '../../FormBuilder/elementList.js';
import SubjectDetailElementList from '../../../../Subject/Subject/SubjectDetailElementList.js';
import AccordionComp from '../../../../../../src/components/Common/AccordionComp/AccordionComp';
import { GetElementPropertiesPlace, GetElementPropertiesWidth } from '../Common/ElementPropertiesPlace'

const baseUrl = "http://localhost:3300/";

class TableElement extends Component {
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
            rowCount: props.RowCount,
            FormType: props.FormType,
            IsFromDesign: props.IsFromDesign,
            datagridAndTableProperties: props.DatagridAndTableProperties !== "" && props.DatagridAndTableProperties !== null ? JSON.parse(props.DatagridAndTableProperties) : [],
            childElementList: props.ChildElementList.length === 0 ? [] : props.ChildElementList,
            showWhereElementPropeties: 0,
            fieldWidthsW: "",
            modalState: false,
            elementListOptionGroup: GetAllElementListForSelect([15, 16]),
            elementListSelectedGroup: null,
            elementName: "",
            elementType: 0,
            columnIndex: 0,
            rowIndex: 0,
            totalWidth: ""
        }
        this.toggleAddElementModal = this.toggleAddElementModal.bind(this);
        this.handleElementListChange = this.handleElementListChange.bind(this);
        this.getTdContent = this.getTdContent.bind(this);
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

    toggleAddElementModal = (columnIndex, rowIndex) => {
        this.setState(prevState => ({
            modalState: !prevState.modalState,
            columnIndex: columnIndex,
            rowIndex: rowIndex
        }));
    };

    handleElementListChange = (e) => {
        this.setState(prevState => ({
            modalState: !prevState.modalState,
            propertiesModalState: !prevState.propertiesModalState,
            elementType: e.value,
            showWhereElementPropeties: GetElementPropertiesPlace(e.value),
            fieldWidthsW: GetElementPropertiesWidth(e.value),
            elementName: GetElementNameByKey(this.props, e.value) + " " + this.props.t("Properties")
        }));
    };
    componentDidUpdate(prevProps) {
        if (this.props.ChildElementList !== prevProps.ChildElementList) {
            this.setState(
                { childElementList:this.props.ChildElementList }
            );
        }
        if (this.props.SdvInformation !== prevProps.SdvInformation) {
            this.setState(
                { sdvInformation: this.props.SdvInformation }
            );
        }
        if (this.props.QueryInformation !== prevProps.QueryInformation) {
            this.setState(
                { queryInformation: this.props.QueryInformation }
            );
        }   
    }
    togglePropertiesModal = () => {
        this.setState(prevState => ({
            propertiesModalState: !prevState.propertiesModalState
        }));
    };

    getTdContent(colIndex, rowIndex) {
        var result = false;
        var cld = [];
        this.state.childElementList.map(item => {
            if (item.columnIndex === colIndex + 1 && item.rowIndex === rowIndex + 1) {
                result = true;
                cld.push(item);
            }
        })

        if (this.state.IsFromDesign) {
            if (result) {
                return <ElementList TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} ModuleElementList={cld} ShowElementList={false} IsDisable={true} FormType={this.state.FormType} />;
            }
            else {
                return <input className="btn btn-success" type="button" value="+" onClick={() => this.toggleAddElementModal(colIndex + 1, rowIndex + 1)} />;
            }
        }
        else {
            if (result) {
                return <SubjectDetailElementList QueryInformation={this.state.queryInformation} SdvInformation={this.state.sdvInformation} IsSdv={this.state.isSdv} IsMissingData={this.state.isMissingData} IsAuditTrail={this.state.isAuditTrail} IsOpenQuery={this.state.isOpenQuery} IsAnswerQuery={this.state.isAnswerQuery} TenantId={this.state.TenantId} StudyId={this.state.studyId} ModuleId={this.state.moduleId} ElementList={cld} IsDisable={this.state.isDisable !== "" ? true : false} />;
            }
            else {
                return "";
            }
        }
    };
    copyTableRowElement(e, id, rowindex) {
        this.props.dispatch(startloading());
        var url = this.state.FormType === 1 ? baseUrl + "Module" : baseUrl + "Study";
        fetch(url + '/CopyTableRowElement?id=' + id + '&rowIndex=' + rowindex + '&userId=' + this.state.userId, {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                if (data.isSuccess) {
                    window.location.reload();
                } else {
                }
            })
            .catch(error => {
                //console.error('Error:', error);
            }).finally(() => {
                this.props.dispatch(endloading());
            });
    }
    deleteTableRowElement(e, id, rowindex) {
        this.props.dispatch(startloading());
        var url = this.state.FormType === 1 ? baseUrl + "Module" : baseUrl + "Study";
        fetch(url + '/DeleteTableRowElement?id=' + id + '&rowIndex=' + rowindex + '&userId=' + this.state.userId, {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                if (data.isSuccess) {
                    window.location.reload();
                } else {
                }
            })

            .catch(error => {
                //console.error('Error:', error);
            }).finally(() => {
                this.props.dispatch(endloading());
            });

    }
    getTableRowProp(id, rowindex) {
        if (this.state.isDisable) {
            return <div>< Button className="actionBtn" style={{ padding: '0px' }}><i className="far fa-copy" onClick={e => this.copyTableRowElement(e, id, rowindex)}></i></Button><br />
                < Button className="actionBtn" style={{ padding: '0px' }}><i className="fas fa-trash-alt" onClick={e => this.deleteTableRowElement(e, id, rowindex)}></i></Button></div>;
        }
    }
    render() {
        return (
            <AccordionComp title="" isOpened={true} body={
                <>
                    <div className="table-responsive mb-3">
                        <Table className="table table-hover table-bordered mb-0" style={{ width: this.state.totalWidth }}>
                            <thead>
                                <tr>
                                    {this.state.IsFromDesign && <th key='0' style={{ width: '', backgroundColor: "#6D6E70", color: "#FFF" }}>#</th>}
                                    {this.state.datagridAndTableProperties.map((col, index) => (
                                        <th key={index} style={{ width: col.width, backgroundColor: "#6D6E70", color: "#FFF" }}>{col.title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(this.state.rowCount === 0 ? 1 : this.state.rowCount)].map((_, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {this.state.IsFromDesign &&
                                            <td key='0'>
                                                {this.getTableRowProp(this.state.id, rowIndex + 1)}
                                            </td>
                                        }
                                        {[...Array(this.state.columnCount)].map((_, columnIndex) => (
                                            <td key={columnIndex}>
                                                {this.getTdContent(columnIndex, rowIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
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
                                        StudyId={this.state.studyId}
                                        UserId={this.state.userId}
                                        ParentId={this.state.id}
                                        ActiveTab={"1"}
                                        isCalcBtn={false}
                                        ColumnIndex={this.state.columnIndex}
                                        RowIndex={this.state.rowIndex}
                                        FormType={this.state.FormType}
                                        Dispatch={this.props.Dispatch}
                                    >
                                    </Properties>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                </>
            } />
        )
    }
};


export default connect()(withTranslation()(TableElement));
/*export default withTranslation()(TableElement);*/
