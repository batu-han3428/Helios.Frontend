import PropTypes from 'prop-types';
import React, { useImperativeHandle, useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { endloading, startloading } from '../../../../store/loader/actions';
import { Tabs, Table, Checkbox, Typography } from 'antd';
import { useVisitPageEProSetMutation, useLazyPermissionListGetQuery } from "../../../../store/services/Visit";

const Settings = props => {

    const dispatch = useDispatch();

    const [visitPageEProSet] = useVisitPageEProSetMutation();

    const [recordEPro, setRecordEPro] = useState(false);

    const studyInformation = useSelector(state => state.rootReducer.Study);

    const userInformation = useSelector(state => state.rootReducer.Login);

    const submitForm = async () => {
        if (activeTab == 1) {
            if (isEpro !== recordEPro) {
                try {
                    dispatch(startloading());
                    const response = await visitPageEProSet({
                        id: props.record.id,
                        userId: userInformation.userId,
                        studyId: studyInformation.studyId,
                        type: "",
                        name: "",
                        order: 0
                    });
                    if (response.data.isSuccess) {
                        await setRecordEPro(response.data.values.value);
                        props.toast.current.setToast({
                            message: props.t(response.data.message),
                            stateToast: true
                        });
                        dispatch(endloading());
                    } else {
                        props.toast.current.setToast({
                            message: props.t(response.data.message),
                            stateToast: false
                        });
                        dispatch(endloading());
                    }
                } catch (e) {
                    props.toast.current.setToast({
                        message: props.t("An unexpected error occurred."),
                        stateToast: false
                    });
                    dispatch(endloading());
                }
            } else {
                props.toast.current.setToast({
                    message: props.t("It is not possible to update without making changes."),
                    stateToast: false
                });
            }
        }
    }

    useImperativeHandle(props.refs, () => ({
        submitForm: submitForm
    }), [submitForm, props]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        }
    ];
    const data = [
        {
            key: 'CanFreeze',
            name: 'Freeze',
        },
        {
            key: 'CanLock',
            name: 'Lock',
        },
        {
            key: '3',
            name: 'Signature',
        },
        {
            key: '4',
            name: 'SDV',
        },
        {
            key: '5',
            name: 'Query',
        },
        {
            key: '6',
            name: 'Verification',
        },
        {
            key: '7',
            name: 'SAE Lock',
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    //const dataa = {
    //    CanFreeze: true,
    //    CanLock: false
    //};

    const [dataa, setDataa] = useState({});

    const [items, setItems] = useState([]);

    const [trigger, { data: permissionsData, error, isLoading }] = useLazyPermissionListGetQuery();

    useEffect(() => {
        if (props.record) {
            trigger(props.record.type === 'page' ? 2 : 1);

            setRecordEPro(props.record.epro);

            if (props.record.type === 'page') {
                setIsEpro(props.record.epro);
            }
        }
    }, [props.record])

    useEffect(() => {
        if (!isLoading && !error && permissionsData) {
            console.log(permissionsData)
            //const response = {
            //    CanFreeze: true,
            //    CanLock: false
            //};
            //setDataa(response);
           

            //if (Object.values(response).length !== 0) {
            //    const preselectedKeys = Object.keys(response)
            //        .filter((key) => response[key] === true)
            //        .map((key) => key);
            //    setSelectedRowKeys(preselectedKeys);
            //}

        } else if (!isLoading && error) {
            props.toast.current.setToast({
                message: props.t("An unexpected error occurred."),
                stateToast: false
            });
            dispatch(endloading());
        }
    }, [permissionsData, error, isLoading]);


    const [isEpro, setIsEpro] = useState(false);

    const handleCheckboxChange = (e) => {
        setIsEpro(e.target.checked);
    };

    const { Text } = Typography;

    const contentEpro = () => {
        return (
            <div>
                <Text strong>{props.t("Is this page an ePRO page?")}</Text><br/><br/>
                <Checkbox checked={isEpro} onChange={handleCheckboxChange}>
                    <Text>{props.t("Evet")}</Text>
                </Checkbox>
            </div>
        );
    }

    useEffect(() => {
        let items = [];
        let key = 1;
        if (props.record.type === 'page') {
            items.push({
                key: key,
                label: 'ePRO',
                children: contentEpro()
            });
            key++;
        }
        items.push({
            key: key,
            label: props.t('Permissions'),
            children: contentPermission()
        });
        setItems(items);
    }, [selectedRowKeys, isEpro])

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys, selectedRows) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };

    const totalHeight = data.length * 50;

    const contentPermission = () => {
        return (
            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ y: totalHeight > 300 ? 300 : undefined }}
            />
        );
    }

    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <Tabs
            onChange={handleTabChange}
            defaultActiveKey="1"
            items={items}
        />
    )
}

Settings.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(Settings);