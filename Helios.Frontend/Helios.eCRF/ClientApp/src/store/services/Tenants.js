import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { API_BASE_URL } from '../../constants/endpoints';

export const TenantsApi = createApi({
    reducerPath: 'tenantsApi',
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
        tenantListGet: builder.query({
            query: () => `/User/GetTenantList`,
            providesTags: ['Tenants'],
        }),
        tenantListAuthGet: builder.query({
            query: () => `/User/GetAuthTenantList`,
        }),
        tenantGet: builder.query({
            query: (data) => `/User/GetTenant/${data.tenantId}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
        tenantSet: builder.mutation({
            query: (data) => ({
                url: '/User/SetTenant',
                method: 'POST',
                body: data,
                formData: true,
            }),
            invalidatesTags: ['Tenants'],
        })
    }),
});


export const { useTenantListGetQuery } = TenantsApi;

export const { useLazyTenantListAuthGetQuery } = TenantsApi;

export const { useLazyTenantGetQuery } = TenantsApi;

export const { useTenantSetMutation } = TenantsApi;
