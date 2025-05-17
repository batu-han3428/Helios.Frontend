﻿import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { API_BASE_URL } from '../../constants/endpoints';

export const PermissionsApi = createApi({
    reducerPath: 'permissionsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            let token = getLocalStorage("accessToken");

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (builder) => ({
        rolePermissionListGet: builder.query({
            query: (studyId) => `/User/GetPermissionRoleList/${studyId}`,
            providesTags: ['Role'],
        }),
        roleSave: builder.mutation({
            query: (data) => ({
                url: '/User/AddOrUpdatePermissionRole',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Role'],
        }),
        setPermission: builder.mutation({
            query: (data) => ({
                url: '/User/SetPermission',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Role'],
        }),
        roleDelete: builder.mutation({
            query: (data) => ({
                url: '/User/DeleteRole',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Role'],
        }),
        roleListGet: builder.query({
            query: (studyId) => `/User/GetRoleList/${studyId}`,
        }),
        roleUsersListGet: builder.query({
            query: (roleId) => `/User/GetRoleUsers/${roleId}`,
        }),
        studyRoleUsersListGet: builder.query({
            query: (studyId) => `/User/GetStudyRoleUsers/${studyId}`,
            providesTags: ['StudyRole'],
        }),
        studyRolePermissionsListGet: builder.query({
            query: () => `/User/GetStudyRolePermissionsList`
        }),
        userPermissionsListGet: builder.query({
            query: (studyId) => `/User/GetUserPermissions/${studyId}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
            providesTags: ['UserPermissions'],
        }),
        permissionsVisitListGet: builder.query({
            query: (roleId) => `/User/GetPermissionsVisitList/${roleId}`,
            providesTags: ['RoleVisitPermission'],
        }),
        setPermissionsVisitPage: builder.mutation({
            query: (data) => ({
                url: '/User/SetPermissionsVisitPage',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['RoleVisitPermission'],
        }),
    }),
});


export const { useLazyRolePermissionListGetQuery } = PermissionsApi;

export const { useRoleSaveMutation } = PermissionsApi;

export const { useSetPermissionMutation } = PermissionsApi;

export const { useRoleDeleteMutation } = PermissionsApi;

export const { useLazyRoleListGetQuery } = PermissionsApi;

export const { useLazyRoleUsersListGetQuery } = PermissionsApi;

export const { useLazyStudyRoleUsersListGetQuery } = PermissionsApi;

export const { useLazyStudyRolePermissionsListGetQuery } = PermissionsApi;

export const { useUserPermissionsListGetQuery } = PermissionsApi;

export const { useLazyPermissionsVisitListGetQuery } = PermissionsApi;

export const { useSetPermissionsVisitPageMutation } = PermissionsApi;