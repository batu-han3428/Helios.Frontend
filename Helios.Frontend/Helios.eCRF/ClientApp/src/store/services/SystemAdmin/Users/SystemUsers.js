import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../../../helpers/local-storage/localStorageProcess';
import { API_BASE_URL } from '../../../../constants/endpoints';

export const SystemUsersApi = createApi({
    reducerPath: 'systemUsersApi',
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
        userListGet: builder.query({
            query: (id) => `/User/GetTenantAndSystemAdminUserList/${id}`,
            providesTags: ['User'],
        }),
        userSet: builder.mutation({
            query: (data) => ({
                url: '/User/SetSystemAdminAndTenantAdminUser',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        userActivePassive: builder.mutation({
            query: (data) => ({
                url: '/User/TenantAndSystemAdminActivePassive',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        userDelete: builder.mutation({
            query: (data) => ({
                url: '/User/TenantAndSystemAdminDelete',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});


export const { useLazyUserListGetQuery } = SystemUsersApi;


export const { useUserSetMutation } = SystemUsersApi;

export const { useUserActivePassiveMutation } = SystemUsersApi;


export const { useUserDeleteMutation } = SystemUsersApi;
