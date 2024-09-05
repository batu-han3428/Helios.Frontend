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
import { showToast } from '../../../store/toast/actions';
import { useUserGetQuery } from '../../../store/services/Users';

const AddOrUpdateTenantAdmin = props => {

    const animatedComponents = makeAnimated();

    const dispatch = useDispatch();

    const [userSet] = useUserSetMutation();

    const [userControl, setUserControl] = useState(props.userControl);
    const [isRequired, setIsRequired] = useState(false);
    const [skip, setSkip] = useState(true);


    const [optionGroupRoles, setOptionGroupRoles] = useState([
        {
            label: props.t("Roles"),
            options: [
                {
                    label: props.t("Select all"),
                    value: [
                        "All",
                        [
                            3
                        ]
                    ]
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
            dispatch(showToast(props.t("An unexpected error occurred."), true, false));
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
            phoneNumber: props.userData ? props.userData.phoneNumber : "",
            roleIds: [],
            tenantIds: []
        },
        validationSchema: Yup.object().shape({
            name: isRequired ? Yup.string().required(props.t("This field is required")) : Yup.string(),
            lastName: isRequired ? Yup.string().required(props.t("This field is required")) : Yup.string(),
            email: Yup.string().required(props.t("This field is required")).email(props.t("Invalid email format")),
            //phonenumber: isRequired ? Yup.string()
            //    .required(props.t("This field is required"))
            //    .test('is-valid-phone-number', props.t('Invalid phone number format'), (value) => {
            //        return isValidPhoneNumber(value);
            //    }) : Yup.string(),
            tenantIds: Yup.array()
                .test('isTenantIdsValid', props.t('At least one tenant must be selected'), function (value) {
                    const roleIds = this.parent.roleIds;
                    return !(roleIds && (roleIds.includes(3) || (roleIds.length > 0 && roleIds[0] === 'All'))) || (value && value.length >= 1);
                }),
        }),
        onSubmit: async (values) => {
            try {
                dispatch(startloading());
                if (values.name !== "") {
                    if (!props.isAdd) {
                        const formHasChanges = Object.keys(values).some(
                            (key) => values[key] !== validationType.initialValues[key]
                        );

                        if (!formHasChanges) {
                            dispatch(showToast(props.t("It is not possible to update without making changes."), true, false));
                            dispatch(endloading());
                            return false;
                        }
                    }

                    const response = await userSet({
                        ...values,
                        roleIds: [3],
                        tenantIds: values.tenantIds[0] === "All" ? values.tenantIds[1][1] : values.tenantIds,
                    });

                    if (response.data.isSuccess) {
                        props.onToggleModal();
                        dispatch(showToast(props.t(response.data.message), true, true));
                        dispatch(endloading());
                    } else {
                        dispatch(showToast(props.t(response.data.message), true, false));
                        dispatch(endloading());
                    }
                } else {
                    setSkip(false);
                }
            } catch (e) {
                dispatch(showToast(props.t("An unexpected error occurred."), true, false));
                dispatch(endloading());
            }
        }
    });

    const { data: userData, isErrorUser, isLoadingUser } = useUserGetQuery({ email: validationType.values.email, studyId: "0" }, {
        skip
    });
    useEffect(() => {
        if (userData && !isLoadingUser && !isErrorUser) {
            if (userData.isSuccess) {
                if (userData.values.authUserId !== 0) {                      
                    validationType.setValues({
                        id: 0,
                        userid: userData.values.authUserId,
                        language: props.i18n.language,
                        isAdd: props.isAdd,
                        name: userData.values.name,
                        lastName: userData.values.lastName,
                        email: userData.values.email,
                        phoneNumber: userData.values.phoneNumber,
                        roleIds: [],
                        tenantIds: []
                    });
                }
                setIsRequired(true);
                setUserControl(false);
                dispatch(endloading());
            } else {
                dispatch(endloading());
                dispatch(showToast(props.t(userData.message), true, false));
            }
        }
    }, [userData, isErrorUser, isLoadingUser]);

    useImperativeHandle(props.refs, () => ({
        submitForm: validationType.handleSubmit
    }), [validationType, props]);

    return (
        <>
            {userControl ?
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validationType.handleSubmit();
                        return false;
                    }}>
                    <div className="row">
                        <div className="mb-3 col-md-12">
                            <Label className="form-label">{props.t("e-Mail")}</Label>
                            <Input
                                name="email"
                                placeholder="abc@xyz.com"
                                type="text"
                                onChange={validationType.handleChange}
                                onBlur={(e) => {
                                    validationType.handleBlur(e);
                                }}
                                value={validationType.values.email || ""}
                                invalid={
                                    validationType.touched.email && validationType.errors.email ? true : false
                                }
                            />
                        </div>
                    </div>
                </Form>
                :
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
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="Enter phone number"
                                value={validationType.values.phoneNumber}
                                onChange={(value) => validationType.setFieldValue('phoneNumber', value)}
                                onBlur={validationType.handleBlur}
                                limitMaxLength
                                defaultCountry="TR"
                                international={false} 
                            />
                            {validationType.touched.phonenumber && validationType.errors.phonenumber ? (
                                <div type="invalid" className="invalid-feedback" style={{ display: "block" }}>{validationType.errors.phonenumber}</div>
                            ) : null}
                        </div>                        
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
                    </div>
                </Form>
            }
        </>
    )
}

AddOrUpdateTenantAdmin.propTypes = {
    t: PropTypes.any
};

export default withTranslation()(AddOrUpdateTenantAdmin);