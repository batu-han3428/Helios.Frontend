import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { withTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Label, Form } from "reactstrap";
import { useDispatch } from 'react-redux';
import { useUserDeleteMutation, useUserActivePassiveMutation } from '../../../store/services/SystemAdmin/Users/SystemUsers';
import { startloading, endloading } from '../../../store/loader/actions';
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { arraysHaveSameItems } from "../../../helpers/General/index";

const DeleteTenantAndSystemAdmin = props => {

    const animatedComponents = makeAnimated();

    const dispatch = useDispatch();

    const [optionGroupRoles, setOptionGroupRoles] = useState([]);
    const [optionGroupTenants, setOptionGroupTenants] = useState([]);

    useEffect(() => {
        if (props.swalShown.value.roles && props.swalShown.value.roles.length > 0) {
            if (!props.swalShown.isDropdown) {
                validationType.setFieldValue("roleIds", props.swalShown.value.roles.map(x => x.roleId));
            } else {
                let optionRoles = [
                    {
                        label: props.t("Roles"),
                        options: [
                            {
                                label: props.t("Select all"),
                                value: [
                                    "All",
                                    props.swalShown.value.roles.map(x => x.roleId)
                                ]
                            }
                        ]
                    }
                ]

                const rolesData = props.swalShown.value.roles.map(item => {
                    return {
                        label: item.roleName,
                        value: item.roleId
                    };
                });

                optionRoles[0].options.push(...rolesData);
                setOptionGroupRoles(optionRoles);
            }
        }
    }, [props.swalShown.value.roles]);

    useEffect(() => {
        if (props.swalShown.value.tenants && props.swalShown.value.tenants.length > 0) {
            if (!props.swalShown.isDropdown) {
                validationType.setFieldValue("tenantIds", props.swalShown.value.tenants.map(x => x.id));
            } else {
                let optionTenants = [
                    {
                        label: props.t("Tenants"),
                        options: [
                            {
                                label: props.t("Select all"),
                                value: [
                                    "All",
                                    props.swalShown.value.tenants.map(x => x.id)
                                ]
                            }
                        ]
                    }
                ]

                const tenantsData = props.swalShown.value.tenants.map(item => {
                    return {
                        label: item.name,
                        value: item.id
                    };
                });

                optionTenants[0].options.push(...tenantsData);
                setOptionGroupTenants(optionTenants);
            }
        }
    }, [props.swalShown.value.tenants]);

    const [userDelete] = useUserDeleteMutation();

    const [userSet] = useUserActivePassiveMutation();

    const validationType = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: props.swalShown.value.id,
            userid: props.swalShown.value.userId,
            roleIds: [],
            tenantIds: []
        },
        validationSchema: Yup.object().shape({
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

                const dto = {
                    ...values,
                    roleIds: values.roleIds[0] === "All" ? values.roleIds[1][1] : values.roleIds,
                    tenantIds: values.tenantIds[0] === "All" ? values.tenantIds[1][1] : values.tenantIds,
                };

                let response = null;

                if (props.swalShown.isDelete) {
                    response = await userDelete(dto);
                } else {
                    response = await userSet(dto);
                }

                dispatch(endloading());
                props.swalClose(response.data.isSuccess, props.t(response.data.message));
            } catch (e) {
                dispatch(endloading());
                props.swalClose(false, props.t("An error occurred while processing your request."));
            }
        }
    });

    useEffect(() => {
        if (props.submit) {
            validationType.handleSubmit();
        }
    }, [props.submit])


    return (
        <>
            {props.swalShown.isDropdown ? (
            <div style={{ padding: "15px 10px", height: "200px" }}>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validationType.handleSubmit();
                        return false;
                    }}>
                    <div className="row">
                        <div className="mb-3 col-md-12">
                            <Label className="form-label">{props.t("Roles")}</Label>
                            <Select
                                value={optionGroupRoles.length > 0 ? validationType.values.roleIds[0] === "All" ? { label: props.t("Select all"), value: validationType.values.roleIds[1] } : optionGroupRoles[0].options.filter(option => validationType.values.roleIds.includes(option.value)) : []}
                                name="roleIds"
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions.map(option => option.value);
                                    const selectAll = selectedValues.find(value => Array.isArray(value));
                                    if (selectAll !== undefined) {
                                        validationType.setFieldValue('roleIds', ["All", selectAll]);
                                    } else {
                                        validationType.setFieldValue('roleIds', selectedValues);
                                    }
                                }}
                                options={(function () {
                                    if (validationType.values.roleIds.includes("All") || optionGroupRoles.length < 1) {
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
                                maxMenuHeight={100}
                            />
                            {validationType.touched.roleIds && validationType.errors.roleIds ? (
                                <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{validationType.errors.roleIds}</div>
                            ) : null}
                        </div>
                        {
                            validationType.values.roleIds.length > 0 && (validationType.values.roleIds.includes(3) || validationType.values.roleIds[0] === 'All') &&

                            <div className="mb-3 col-md-12">
                                <Label className="form-label">{props.t("Tenants")}</Label>
                                <Select
                                    value={validationType.values.tenantIds.length > 0 ? validationType.values.tenantIds[0] === "All" ? { label: props.t("Select all"), value: validationType.values.tenantIds[1] } : optionGroupTenants[0].options.filter(option => validationType.values.tenantIds.includes(option.value)) : []}
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
                </div>
            )
            :
            (
               props.t("Do you confirm?")
            )}
        </>
    );
};

DeleteTenantAndSystemAdmin.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(DeleteTenantAndSystemAdmin);