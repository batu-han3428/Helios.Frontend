import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from "react";
import { withTranslation } from "react-i18next";
import { Row, Col, Input, Alert, Space, Radio, message } from 'antd';
import { useDispatch } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { useLazyStudyVisitAnnotatedCrfGetQuery } from '../../../../store/services/Visit';
import { showToast } from '../../../../store/toast/actions';

const AnnotatedCrfPdf = props => {

    const dispatch = useDispatch();

    const items = [
        { name: 'IsAdditional', label: 'Print with additional info' },
        { name: 'IsCalculated', label: 'Include calculation field' },
        { name: 'IsHiddenElement', label: 'Include hidden fields' },
        { name: 'IsLabel', label: 'Include labels' },
        { name: 'IsDesc', label: 'Include field descriptions' },
        { name: 'IsPage', label: 'Include page name' },
        { name: 'IsHiddenFields', label: 'Include ishidden fields' },
        { name: 'IsVersion', label: 'Include document version' }
    ];

    const [selectedOptions, setSelectedOptions] = useState(items.map(item => ({ name: item.name, value: 0 })));
    const [documentVersion, setDocumentVersion] = useState('');

    const handleRadioChange = (index, e) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index].value = e.target.value;
        setSelectedOptions(newSelectedOptions);
    };
    const handleInputChange = (e) => {
        setDocumentVersion(e.target.value);
    };

    const [trigger, { data: annotatedData, error, isLoading }] = useLazyStudyVisitAnnotatedCrfGetQuery();

    const save = useCallback(async () => {
        try {
            dispatch(startloading());
            const isVersionSelected = selectedOptions.find(option => option.name === 'IsVersion' && option.value === 1);
            if (isVersionSelected && !documentVersion) {
                message.error(props.t("Please enter a document version."));
                return;
            }
            const params = {};
            selectedOptions.forEach(option => {
                if (option.name === 'IsVersion') {
                    params[option.name] = documentVersion;
                } else {
                    params[option.name] = option.value === 1;
                }
            });
            trigger(params);
        } catch (error) {
            dispatch(showToast(props.t("An unexpected error occurred."), false, false));
            dispatch(endloading());
        }
    }, [props, selectedOptions, documentVersion]);

    useEffect(() => {
        if (annotatedData && !error && !isLoading) {
            const openButton = document.getElementById('openPdfButton');
            openButton.onclick = () => {
                window.open(`/pdf?url=${annotatedData.data}`, '_blank');
            };
            openButton.click();
            dispatch(endloading());
        }
    }, [annotatedData])

    useEffect(() => {
        if (props.refs.current) {
            props.refs.current = { ...props.refs.current, submitForm: save };
        }
    }, [save, props]);

    return (
        <div style={{ padding: '20px' }}>
            <button id="openPdfButton" style={{ display: "none" }}></button>
            <Alert
                message={props.t("To save a .pdf file, you need to select “yes” for “Include document version” option and enter a version number.")}
                type="warning"
                showIcon
                style={{ marginBottom: '20px' }}
            />
            <Row gutter={[16, 16]}>
                {items.map((item, index) => (
                    <Col key={index} xs={24} sm={24} md={12} lg={12} xl={12}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ flexBasis: '200px' }}>
                                {props.t(item.label)}
                            </span>
                            <Space direction="vertical">
                                <Radio.Group
                                    onChange={e => handleRadioChange(index, e)}
                                    value={selectedOptions[index].value}
                                >
                                    <Radio value={0}>{props.t("No")}</Radio>
                                    <Radio value={1}>{props.t("Yes")}</Radio>
                                </Radio.Group>
                            </Space>
                            {item.name === 'IsVersion' && selectedOptions[index].value === 1 && (
                                <Input
                                    placeholder="Enter text here"
                                    style={{ marginLeft: '10px' }}
                                    value={documentVersion}
                                    onChange={handleInputChange}
                                />
                            )}
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

AnnotatedCrfPdf.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AnnotatedCrfPdf);
