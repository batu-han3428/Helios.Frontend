import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../../helpers/local-storage/localStorageProcess';

export const SystemAdminApi = createApi({
    reducerPath: 'systemAdminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:7196/',
        prepareHeaders: (headers, { getState }) => {
            let token = getLocalStorage("accessToken");

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (builder) => ({
        systemAdminListGet: builder.query({
            query: () => `/User/GetSystemAdminUserList`,
            providesTags: ['SystemAdmin'],
        }),
        systemAdminSet: builder.mutation({
            query: (data) => ({
                url: '/User/SetSystemAdminUser',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['SystemAdmin'],
        }),
        systemAdminActivePassive: builder.mutation({
            query: (data) => ({
                url: '/User/SystemAdminActivePassive',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['SystemAdmin'],
        }),
        systemAdminDelete: builder.mutation({
            query: (data) => ({
                url: '/User/SystemAdminDelete',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['SystemAdmin'],
        }),
        systemAdminResetPassword: builder.mutation({
            query: (data) => ({
                url: '/User/SystemAdminResetPassword',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});


export const { useSystemAdminListGetQuery } = SystemAdminApi;

export const { useSystemAdminSetMutation } = SystemAdminApi;

export const { useSystemAdminActivePassiveMutation } = SystemAdminApi;

export const { useSystemAdminDeleteMutation } = SystemAdminApi;

export const { useSystemAdminResetPasswordMutation } = SystemAdminApi;