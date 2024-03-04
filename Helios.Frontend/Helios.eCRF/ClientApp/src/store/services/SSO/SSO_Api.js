import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../../helpers/local-storage/localStorageProcess';
import { API_BASE_URL } from '../../../constants/endpoints';

export const SSOApi = createApi({
    reducerPath: 'SSOApi',
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
        tenantOrStudytGet: builder.query({
            query: (userId) => `/User/GetTenantOrStudy/${userId}`,
        }),
        tenantListGet: builder.query({
            query: (data) => `/User/GetUserTenantList/${data.userId}/${data.role}`,
        }),
        studiesListGet: builder.query({
            query: (data) => `/User/GetUserStudiesList/${data.tenantId}/${data.userId}`,
        }),
        ssoLoginPost: builder.mutation({
            query: (data) => ({
                url: '/User/SSOLogin',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useLazyTenantOrStudytGetQuery } = SSOApi;

export const { useLazyTenantListGetQuery } = SSOApi;

export const { useLazyStudiesListGetQuery } = SSOApi;

export const { useSsoLoginPostMutation } = SSOApi;