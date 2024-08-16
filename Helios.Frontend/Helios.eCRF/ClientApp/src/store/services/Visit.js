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
            /*invalidatesTags: ['Visit'],*/
        }),
        visitDelete: builder.mutation({
            query: (data) => ({
                url: '/Study/DeleteVisits',
                method: 'POST',
                body: data,
            }),
/*            invalidatesTags: ['Visit'],*/
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
        moduleListGet: builder.query({
            query: () => `/Module/GetModuleList`
        }),
        addStudyModuleSet: builder.mutation({
            query: (data) => ({
                url: '/Study/SetStudyModule',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Visit'],
        }),
        studyVisitPermissionsListGet: builder.query({
            query: () => `/Study/GetStudyVisitPermissionsList`
        }),
        visitRankingSet: builder.mutation({
            query: (data) => ({
                url: '/Study/SetVisitRanking',
                method: 'POST',
                body: data,
            }),
   /*         invalidatesTags: ['Visit'],*/
        }),
        transferDataGet: builder.query({
            query: (data) => `/Study/GetTransferData/${data.demoStudyId}/${data.activeStudyId}`,
            keepUnusedDataFor: 0,
        }),
        transferDataSet: builder.mutation({
            query: (data) => ({
                url: '/Study/SetTransferData',
                method: 'POST',
                body: data,
            }),
        }),
        visitRelationGet: builder.query({
            query: () => `/Study/GetVisitRelation`,
            keepUnusedDataFor: 0,
        }),
        visitRelationSet: builder.mutation({
            query: (data) => ({
                url: '/Study/SetVisitRelation',
                method: 'POST',
                body: data,
            }),
        }),
        studyVisitAnnotatedCrfGet: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams(
                    Object.entries(params).reduce((acc, [key, value]) => {
                        if (typeof value === 'boolean') {
                            acc[key] = value ? 'true' : 'false';
                        } else {
                            acc[key] = value;
                        }
                        return acc;
                    }, {})
                ).toString();
                return `/Study/GetStudyVisitAnnotatedCrf?${queryParams}`;
            },
            keepUnusedDataFor: 0,
            transformResponse: async (rawData, d) => {
                if (d.response.status === 200) {
                    const arrayBuffer = Uint8Array.from(atob(rawData.fileContents), c => c.charCodeAt(0));   
                    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    return {
                        data: url
                    };
                } else {
                    return {
                        data: null
                    }
                }
            },
        }),
        studyVisitAnnotatedCrfHistoryGet: builder.query({
            query: () => `/Study/GetStudyVisitAnnotatedCrfHistory`
        }),
        studyVisitAnnotatedCrfHistoryPdfGet: builder.query({
            query: (id) => `/Study/GetStudyVisitAnnotatedCrfHistoryPdf/${id}`,
            keepUnusedDataFor: 0,
            transformResponse: async (rawData, d) => {
                if (d.response.status === 200) {
                    const arrayBuffer = Uint8Array.from(atob(rawData.fileContents), c => c.charCodeAt(0));
                    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    return {
                        data: url
                    };
                } else {
                    return {
                        data: null
                    }
                }
            },
        }),
    }),
});


export const { useLazyVisitListGetQuery } = VisitApi;

export const { useVisitSetMutation } = VisitApi;

export const { useVisitDeleteMutation } = VisitApi;

export const { useVisitPageEProSetMutation } = VisitApi;

export const { useLazyPermissionListGetQuery } = VisitApi;

export const { useVisitPagePermissionSetMutation } = VisitApi;

export const { useLazyModuleListGetQuery } = VisitApi;

export const { useAddStudyModuleSetMutation } = VisitApi;

export const { useLazyStudyVisitPermissionsListGetQuery } = VisitApi;

export const { useVisitRankingSetMutation } = VisitApi;

export const { useLazyTransferDataGetQuery } = VisitApi;

export const { useTransferDataSetMutation } = VisitApi;

export const { useLazyVisitRelationGetQuery } = VisitApi;

export const { useVisitRelationSetMutation } = VisitApi;

export const { useLazyStudyVisitAnnotatedCrfGetQuery } = VisitApi;

export const { useLazyStudyVisitAnnotatedCrfHistoryGetQuery } = VisitApi;

export const { useLazyStudyVisitAnnotatedCrfHistoryPdfGetQuery } = VisitApi;