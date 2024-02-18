import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';

export const VisitApi = createApi({
    reducerPath: 'visitApi',
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
        visitListGet: builder.query({
            query: (studyId) => `/Study/GetVisits/${studyId}`,
            providesTags: ['Visit'],
        }),
        visitSet: builder.mutation({
            query: (data) => ({
                url: '/Study/SetVisits',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Visit'],
        }),
        visitDelete: builder.mutation({
            query: (data) => ({
                url: '/Study/DeleteVisits',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Visit'],
        }),
        visitPageEProSet: builder.mutation({
            query: (data) => ({
                url: '/Study/SetVisitPageEPro',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Visit'],
        }),
        permissionListGet: builder.query({
            query: (pageKey) => `/Study/GetPermissionList/${pageKey}`,
        }),
    }),
});


export const { useLazyVisitListGetQuery } = VisitApi;

export const { useVisitSetMutation } = VisitApi;

export const { useVisitDeleteMutation } = VisitApi;

export const { useVisitPageEProSetMutation } = VisitApi;

export const { useLazyPermissionListGetQuery } = VisitApi;