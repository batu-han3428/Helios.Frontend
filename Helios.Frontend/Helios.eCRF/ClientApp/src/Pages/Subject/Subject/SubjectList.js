import PropTypes from 'prop-types';
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Table, Row, Col, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';

const SubjectList = props => {

    const subjectUpdate = (record) => {

    };

    const subjectDelete = (id) => {

    };

    const addSubject = (id) => {
        Swal.fire({
            title: props.t("You have unsaved changes"),
            text: props.t("Do you confirm?"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3bbfad",
            confirmButtonText: props.t("Yes"),
            cancelButtonText: props.t("Cancel"),
        }).then(async (result) => {
            if (result.isConfirmed) {
               
            } else {
                return false;
            }
        });
    };
    
    const columns = [
        {
            title: props.t('subjectNumber'),
            dataIndex: 'subjectNumber',
        },
        {
            title: props.t('Actions'),
            dataIndex: 'actions',
            render: (text, record) => {
                return (
                    <span>
                        <Button onClick={() => subjectUpdate(record)}>Güncelle</Button>
                        <Button onClick={() => subjectDelete(record.id)}>Sil</Button>
                    </span>
                );
            }
        },
    ];

    const [data, setData] = useState([]);

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="page-title-box">
                        <Row className="align-items-center" style={{ borderBottom: "1px solid black" }}>
                            <Col md={8}>
                                <h6 className="page-title">{props.t('Subject list')}</h6>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="col-12">
                            <div style={{ display: 'inline-block', float: 'right' }} onClick={addSubject}>
                                <Typography.Text strong style={{ marginRight: '8px', cursor: 'pointer' }}>Yeni hasta ekle</Typography.Text>
                                <Button color="success" className="rounded-circle">
                                    <FontAwesomeIcon icon="fa-plus" />
                                </Button>
                            </div>
                        </Col>
                        <Col className="col-12">
                            <Table
                                columns={columns}
                                dataSource={data}
                                pagination={true}
                                scroll={{ x: 'max-content' }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    )
}

SubjectList.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(SubjectList);