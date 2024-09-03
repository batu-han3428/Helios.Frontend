import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { Form, Radio, Input } from 'antd';
import { useSetSubjectMissingDataMutation } from '../../../../store/services/Subject';
import { showToast } from '../../../../store/toast/actions';
import { SubjectMissingDataType } from './SubjectMissingDataType';
import SubjectChangeElementComment from '../Comp/SubjectChangeElementComment';
import ModalComp from '../../../../components/Common/ModalComp/ModalComp';

const SubjectMissingData = props => {

    const dispatch = useDispatch();
    const [selectedReason, setSelectedReason] = useState(null);
    const [form] = Form.useForm();
    const [modalInf, setModalInf] = useState({});
    const modalRef = useRef();

    useEffect(() => {
        if (props.data) {
            const values = props.data.split('_');
            let reason = values[0];
            const comment = values.length > 1 ? values.slice(1).join('_') : '';
            const foundItem = SubjectMissingDataType.find(x => x.value.includes(reason));
            reason = props.i18n.language === 'en' ? foundItem.value[0] : foundItem.value[1];
            form.setFieldsValue({ reason, comment });
            setSelectedReason(reason);
        }
    }, [props.data, form]);

    const [setSubjectMissingData] = useSetSubjectMissingDataMutation();

    const onFinish = async (values) => {
        try {
            dispatch(startloading());
            const comment = values.comment.trim();
            if (comment !== "") {
                values.reason = `${values.reason}_${comment}`;
            }            
            const response = await setSubjectMissingData({ isPage: props.isPage, id: props.elementId, value: values.reason, subjectId: props.subjectId });
            if (props.reasonForChange) {
                dispatch(endloading());
                setModalInf({ title: props.t("This study is adhering to Good Clinical Practice (GCP)!"), content: <SubjectChangeElementComment studyId={props.studyId} subjectId={props.subjectId} isMissingData={true} elementName={props.elementName} oldValue={props.oldValue} subjectElementId={props.elementId} value={values.reason} type={props.type} commentType='2' />, isButton: false }); modalRef.current.tog_backdrop();
            }
            else {
                if (response.data.isSuccess) {
                    dispatch(showToast(props.t(response.data.message), true, true));
                    dispatch(endloading());
                    props.refs.current.tog_backdrop();
                } else {
                    dispatch(showToast(props.t(response.data.message), true, false));
                    dispatch(endloading());
                }
            }
            
        } catch (error) {
            dispatch(showToast(props.t("An unexpected error occurred.", true, false)));
            dispatch(endloading());
        }
    };

    const submit = (values) => {
        form.submit();
    };

    const onReasonChange = (e) => {
        const value = e.target.value;
        setSelectedReason(value);
        if (value !== 'other') {
            form.setFieldsValue({ comment: '' });
            form.validateFields(['comment']);
        }
    };

    useEffect(() => {
        if (props.refs.current) {
            props.refs.current = { ...props.refs.current, submitForm: submit };
        }
    }, [submit, props]);

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    name="reason"
                    label=""
                    rules={[{ required: true, message: props.t('Select one of the reasons for the missing value') }]}
                >
                    <Radio.Group onChange={onReasonChange} style={{ display: 'flex', flexDirection: 'column' }}>
                        {SubjectMissingDataType.map((item, i) => {
                            return <Radio key={i} value={props.i18n.language === 'en' ? item.value[0] : item.value[1]}>{props.t(item.label)}</Radio>
                        })};
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="comment"
                    label={props.t('Comment')}
                    rules={
                        selectedReason === (props.i18n.language === 'en' ? '#Otherreason' : '#Diðerseçenek')
                            ? [{ required: true, message: props.t('This field is required') }]
                            : []
                    }
                    validateTrigger="onSubmit"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
            <ModalComp
                refs={modalRef}
                title={modalInf.title}
                body={modalInf.content}
                isButton={modalInf.isButton}
                buttonText={modalInf.isButton && modalInf.buttonText}
            />
        </>
    );
};

SubjectMissingData.propTypes = {
    t: PropTypes.any,
    data: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    elementId: PropTypes.number.isRequired,
    refs: PropTypes.object,
    i18n: PropTypes.object
};

export default withTranslation()(SubjectMissingData);