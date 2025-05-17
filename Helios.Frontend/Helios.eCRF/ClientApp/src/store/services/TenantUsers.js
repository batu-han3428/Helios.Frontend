import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { API_BASE_URL } from '../../constants/endpoints';

export const TenantUsersApi = createApi({
    reducerPath: 'tenantUsersApi',
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
        tenantUserListGet: builder.query({
            query: (tenantId) => `/User/GetTenantUserList/${tenantId}`,
            providesTags: ['TenantUser'],
        }),
        tenantUserSet: builder.mutation({
            query: (data) => ({
                url: '/User/SetTenantUser',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['TenantUser'],
        })
    }),
});


export const { useLazyTenantUserListGetQuery } = TenantUsersApi;

export const { useTenantUserSetMutation } = TenantUsersApi;