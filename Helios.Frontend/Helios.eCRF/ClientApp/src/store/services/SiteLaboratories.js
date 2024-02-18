import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';


export const SiteLaboratoriesApi = createApi({
    reducerPath: 'siteLaboratories',
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
        siteListGet: builder.query({
            query: (studyId) => `/Study/GetSiteList/${studyId}`,
            providesTags: ['Site'],
        }),
        siteGet: builder.query({
            query: (siteId) => `/Study/GetSite/${siteId}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
        siteSaveOrUpdate: builder.mutation({
            query: (data) => ({
                url: '/Study/SiteSaveOrUpdate',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Site'],
        }),
        siteDelete: builder.mutation({
            query: (data) => ({
                url: '/Study/SiteDelete',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Site'],
        }),
    }),
});


export const { useLazySiteListGetQuery } = SiteLaboratoriesApi;

export const { useSiteGetQuery } = SiteLaboratoriesApi;

export const { useSiteSaveOrUpdateMutation } = SiteLaboratoriesApi;

export const { useSiteDeleteMutation } = SiteLaboratoriesApi;