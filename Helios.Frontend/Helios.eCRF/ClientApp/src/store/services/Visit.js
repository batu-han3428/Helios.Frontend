import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { API_BASE_URL } from '../../constants/endpoints';

export const VisitApi = createApi({
    reducerPath: 'visitApi',
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
            query: (data) => `/Study/GetVisitPagePermissionList/${data.pageKey}/${data.studyId}/${data.id}`,
        }),
        visitPagePermissionSet: builder.mutation({
            query: (data) => ({
                url: '/Study/SetVisitPagePermission',
                method: 'POST',
                body: data,
            })
        }),
    }),
});


export const { useLazyVisitListGetQuery } = VisitApi;

export const { useVisitSetMutation } = VisitApi;

export const { useVisitDeleteMutation } = VisitApi;

export const { useVisitPageEProSetMutation } = VisitApi;

export const { useLazyPermissionListGetQuery } = VisitApi;

export const { useVisitPagePermissionSetMutation } = VisitApi;