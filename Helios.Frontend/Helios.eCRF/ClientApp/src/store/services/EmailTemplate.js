import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';


export const EmailTemplateApi = createApi({
    reducerPath: 'emailTemplateApi',
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
        emailTemplateListGet: builder.query({
            query: (studyId) => `/Study/GetEmailTemplateList/${studyId}`,
            providesTags: ['EmailTemplate']
        }),
        emailTemplateDelete: builder.mutation({
            query: (data) => ({
                url: '/Study/DeleteEmailTemplate',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['EmailTemplate'],
        }),
        emailTemplateGet: builder.query({
            query: (templateId) => `/Study/GetEmailTemplate/${templateId}`,
        }),
        emailTemplateTagListGet: builder.query({
            query: (data) => `/Study/GetEmailTemplateTagList/${data.tenantId}/${data.templateType}`,
            providesTags: ['EmailTemplateTag']
        }),
        addEmailTemplateTag: builder.mutation({
            query: (data) => ({
                url: '/Study/AddEmailTemplateTag',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['EmailTemplateTag'],
        }),
        deleteEmailTemplateTag: builder.mutation({
            query: (data) => ({
                url: '/Study/DeleteEmailTemplateTag',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['EmailTemplateTag'],
        }),
        emailTemplateSet: builder.mutation({
            query: (data) => ({
                url: '/Study/SetEmailTemplate',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});


export const { useLazyEmailTemplateListGetQuery } = EmailTemplateApi;

export const { useEmailTemplateDeleteMutation } = EmailTemplateApi;

export const { useLazyEmailTemplateGetQuery } = EmailTemplateApi;

export const { useLazyEmailTemplateTagListGetQuery } = EmailTemplateApi;

export const { useAddEmailTemplateTagMutation } = EmailTemplateApi;

export const { useDeleteEmailTemplateTagMutation } = EmailTemplateApi;

export const { useEmailTemplateSetMutation } = EmailTemplateApi;