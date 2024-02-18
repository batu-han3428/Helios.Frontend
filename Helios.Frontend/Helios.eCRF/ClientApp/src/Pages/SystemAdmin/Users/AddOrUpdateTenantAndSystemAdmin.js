import PropTypes from 'prop-types';
import React, { useImperativeHandle, useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { withTranslation } from "react-i18next";
import { Label, Input, Form, FormFeedback } from "reactstrap";
import { startloading, endloading } from '../../../store/loader/actions';
import { useDispatch } from 'react-redux';
import { useUserSetMutation } from '../../../store/services/SystemAdmin/Users/SystemUsers';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { arraysHaveSameItems } from '../../../helpers/General/index';
import makeAnimated from "react-select/animated";
import Select from "react-select";
import "../../../assets/css/PhoneInput.css";
import { useLazyTenantListAuthGetQuery } from '../../../store/services/Tenants';

const AddOrUpdateTenantAndSystemAdmin = props => {

    const animatedComponents = makeAnimated();

    const dispatch = useDispatch();

    const [userSet] = useUserSetMutation();

    const [optionGroupRoles, setOptionGroupRoles] = useState([
        {
            label: props.t("Roles"),
            options: [
                {
                    label: props.t("Select all"),
                    value: [
                        "All",
                        [
                            2, 3
                        ]
                    ]
                },
                {
                    label: props.t("System admin"),
                    value: 2
                },
                {
                    label: props.t("Tenant admin"),
                    value: 3
                }
            ]
        }
    ]);
    const [optionGroupTenants, setOptionGroupTenants] = useState([]);

    const [trigger, { data: tenantsData, isError, isLoading }] = useLazyTenantListAuthGetQuery();

    useEffect(() => {
        trigger();
        if (!props.isAdd) {
            const allRoleIds = props.userData.roles.map(item => item.roleId);
            validationType.setFieldValue('roleIds', allRoleIds);
            if (props.userData.tenants.length > 0) {
                const allTenantsIds = props.userData.tenants.map(item => item.id);
                validationType.setFieldValue('tenantIds', allTenantsIds);
            }
        }
    }, [props.isAdd])

    useEffect(() => {
        if (tenantsData && !isLoading && !isError) {
            let option = [{
                label: props.t("Tenants"),
                options: []
            }]
            const tenants = tenantsData.map(item => {
                return {
                    label: item.name,
                    value: item.id
                };
            });
            const allTenantsIds = tenantsData.map(item => item.id);
            const selectAllOption = {
                label: props.t("Select all"),
                value: ["All", allTenantsIds]
            };
            tenants.unshift(selectAllOption);
            option[0].options.push(...tenants);
            setOptionGroupTenants(option);
        } else if (!isLoading && isError) {
            props.toast(props.t("An unexpected error occurred."), false);
        }
    }, [tenantsData, isError, isLoading]);

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: props.userData ? props.userData.id : 0,
            userid: props.userId,
            language: props.i18n.language,
            isAdd: props.isAdd,
            name: props.userData ? props.userData.name : "",
            lastName: props.userData ? props.userData.lastName : "",
            email: props.userData ? props.userData.email : "",
            phonenumber: props.userData ? props.userData.phoneNumber : "",
            roleIds: [],
            tenantIds: []
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(props.t("This field is required")),
            lastName: Yup.string().required(props.t("This field is required")),
            email: Yup.string().required(props.t("This field is required")).email(props.t("Invalid email format")),
            phonenumber: Yup.string()
                .required(props.t("This field is required"))
                .test('is-valid-phone-number', props.t('Invalid phone number format'), (value) => {
                    return isValidPhoneNumber(value);
                }),
            roleIds: Yup.array().min(1, "At least one role must be selected"),
            tenantIds: Yup.array()
                .test('isTenantIdsValid', props.t('At least one tenant must be selected'), function (value) {
                    const roleIds = this.parent.roleIds;
                    return !(roleIds && (roleIds.includes(3) || (roleIds.length > 0 && roleIds[0] === 'All'))) || (value && value.length >= 1);
                }),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(startloading());

                if (!props.isAdd) {
                    const formHasChanges = Object.keys(values).some(
                        (key) => values[key] !== validationType.initialValues[key]
                    );

                    if (!formHasChanges) {
                        props.toast(props.t("It is not possible to update without making changes."), false);
                        dispatch(endloading());
                        return false;
                    }
                }

                const response = await userSet({
                    ...values,
                    roleIds: values.roleIds[0] === "All" ? values.roleIds[1][1] : values.roleIds,
                    tenantIds: values.tenantIds[0] === "All" ? values.tenantIds[1][1] : values.tenantIds,
                });

                if (response.data.isSuccess) {
                    props.onToggleModal();
                    props.toast(props.t(response.data.message), true);
                    dispatch(endloading());
                } else {
                    props.toast(props.t(response.data.message), false);
                    dispatch(endloading());
                }
            } catch (e) {
                props.toast(props.t("An unexpected error occurred."), false);
                dispatch(endloading());
            }
        }
    });

    useImperativeHandle(props.refs, () => ({
        submitForm: validationType.handleSubmit
    }), [validationType, props]);

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                validationType.handleSubmit();
                return false;
            }}>
            <div className="row">
                <div className="mb-3 col-md-6">
                    <Label className="form-label">{props.t("First name")}</Label>
                    <Input
                        name="name"
                        placeholder=""
                        type="text"
                        onChange={validationType.handleChange}
                        onBlur={(e) => {
                            validationType.handleBlur(e);
                        }}
                        value={validationType.values.name || ""}
                        invalid={
                            validationType.touched.name && validationType.errors.name ? true : false
                        }
                        autoComplete="off"
                    />
                    {validationType.touched.name && validationType.errors.name ? (
                        <FormFeedback type="invalid">{validationType.errors.name}</FormFeedback>
                    ) : null}
                </div>
                <div className="mb-3 col-md-6">
                    <Label className="form-label">{props.t("Last name")}</Label>
                    <Input
                        name="lastName"
                        placeholder=""
                        type="text"
                        onChange={validationType.handleChange}
                        onBlur={(e) => {
                            validationType.handleBlur(e);
                        }}
                        value={validationType.values.lastName || ""}
                        invalid={
                            validationType.touched.lastName && validationType.errors.lastName ? true : false
                        }
                        autoComplete="off"
                    />
                    {validationType.touched.lastName && validationType.errors.lastName ? (
                        <FormFeedback type="invalid">{validationType.errors.lastName}</FormFeedback>
                    ) : null}
                </div>
                <div className="mb-3 col-md-6">
                    <Label className="form-label">{props.t("e-Mail")}</Label>
                    <Input
                        name="email"
                        placeholder=""
                        type="text"
                        onChange={validationType.handleChange}
                        onBlur={(e) => {
                            validationType.handleBlur(e);
                        }}
                        value={validationType.values.email || ""}
                        invalid={
                            validationType.touched.email && validationType.errors.email ? true : false
                        }
                        autoComplete="off"
                    />
                    {validationType.touched.email && validationType.errors.email ? (
                        <FormFeedback type="invalid">{validationType.errors.email}</FormFeedback>
                    ) : null}
                </div>
                <div className="mb-3 col-md-6">
                    <Label className="form-label">{props.t("Phone number")}</Label>
                    <PhoneInput
                        id="phonenumber"
                        name="phonenumber"
                        placeholder="Enter phone number"
                        value={validationType.values.phonenumber}
                        onChange={(value) => validationType.setFieldValue('phonenumber', value)}
                        onBlur={validationType.handleBlur}
                        limitMaxLength
                        defaultCountry="TR"
                    />
                    {validationType.touched.phonenumber && validationType.errors.phonenumber ? (
                        <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{validationType.errors.phonenumber}</div>
                    ) : null}
                </div>
                <div className="mb-3 col-md-6">
                    <Label className="form-label">{props.t("Roles")}</Label>
                    <Select
                        value={validationType.values.roleIds[0] === "All" ? { label: props.t("Select all"), value: validationType.values.roleIds[1] } : optionGroupRoles[0].options.filter(option => validationType.values.roleIds.includes(option.value)) }
                        name="roleIds"
                        onChange={(selectedOptions) => {
                            const selectedValues = selectedOptions.map(option => option.value);
                            const selectAll = selectedValues.find(value => Array.isArray(value));
                            if (selectAll !== undefined) {
                                validationType.setFieldValue('roleIds', ["All", selectAll]);
                            } else {
                                validationType.setFieldValue('roleIds', selectedValues);
                                if (!selectedValues.includes(3)) {
                                    validationType.setFieldValue('tenantIds', []);
                                }
                            }
                        }}
                        options={(function () {
                            if (validationType.values.roleIds.includes("All")) {
                                return [];
                            } else {
                                const allOptions = optionGroupRoles[0].options;
                                const selectedOptions = [];
                                for (const option of allOptions) {
                                    if (option.label !== props.t("Select all")) {
                                        selectedOptions.push(option.value);
                                    }
                                }
                                let result = arraysHaveSameItems(selectedOptions, validationType.values.roleIds);
                                if (result) {
                                    return [];
                                } else {
                                    return optionGroupRoles[0].options;
                                }
                            }
                        })()}
                        classNamePrefix="select2-selection"
                        placeholder={props.t("Select")}
                        isMulti={true}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                    />
                    {validationType.touched.roleIds && validationType.errors.roleIds ? (
                        <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{validationType.errors.roleIds}</div>
                    ) : null}
                </div>
                {
                    validationType.values.roleIds.length > 0 && (validationType.values.roleIds.includes(3) || validationType.values.roleIds[0] === 'All') &&

                    <div className="mb-3 col-md-6">
                        <Label className="form-label">{props.t("Tenants")}</Label>
                        <Select
                            value={validationType.values.tenantIds.length > 0 ? validationType.values.tenantIds[0] === "All" ? { label: props.t("Select all"), value: validationType.values.tenantIds[1] } : optionGroupTenants.length > 0 ? optionGroupTenants[0].options.filter(option => validationType.values.tenantIds.includes(option.value)) : [] : []}
                            name="tenantIds"
                            onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(option => option.value);
                                const selectAll = selectedValues.find(value => Array.isArray(value));
                                if (selectAll !== undefined) {
                                    validationType.setFieldValue('tenantIds', ["All", selectAll]);
                                } else {
                                    validationType.setFieldValue('tenantIds', selectedValues);
                                }
                            }}
                            options={(function () {
                                if (validationType.values.tenantIds.includes("All") || optionGroupTenants.length < 1) {
                                    return [];
                                } else {
                                    const allOptions = optionGroupTenants[0].options;
                                    const selectedOptions = [];
                                    for (const option of allOptions) {
                                        if (option.label !== props.t("Select all")) {
                                            selectedOptions.push(option.value);
                                        }
                                    }
                                    let result = arraysHaveSameItems(selectedOptions, validationType.values.tenantIds);
                                    if (result) {
                                        return [];
                                    } else {
                                        return optionGroupTenants[0].options;
                                    }
                                }
                            })()}
                            classNamePrefix="select2-selection"
                            placeholder={props.t("Select")}
                            isMulti={true}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                        />
                        {validationType.touched.tenantIds && validationType.errors.tenantIds ? (
                            <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{validationType.errors.tenantIds}</div>
                        ) : null}
                    </div>
                }
            </div>
        </Form>
    )
}

AddOrUpdateTenantAndSystemAdmin.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddOrUpdateTenantAndSystemAdmin);