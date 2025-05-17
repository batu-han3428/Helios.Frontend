import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { API_BASE_URL } from '../../constants/endpoints';

export const SubjectApi = createApi({
    reducerPath: 'subjectApi',
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
        getSubjectList: builder.query({
            query: (data) => `/Subject/GetSubjectList/${data.studyId}/${data.showArchivedSubjects}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
            providesTags: ['Subject'],
        }),
        getUserPermissions: builder.query({
            query: (studyId) => `/User/GetUserPermissions/${studyId}`,
            providesTags: ['Permissions'],
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0
        }),
        addSubject: builder.mutation({
            query: (values) => ({
                url: '/Subject/AddSubject',
                method: 'POST',
                body: values
            }),
            invalidatesTags: ['Subject'],
        }),
        getSubjectDetailMenu: builder.query({
            query: (data) => `/Subject/GetSubjectDetailMenu/${data.studyId}/${data.subjectId}`,
            providesTags: ['SubjectDetailMenu'],
        }),
        getSubjectElementList: builder.query({
            query: (data) => '/Subject/GetSubjectElementList?subjectId=' + data.subjectId + '&subjectVisitModulePageId=' + data.pageId + '&rowIndex=' + data.rowIndex,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
            providesTags: ['SubjectElement'],
        }),
        deleteOrArchiveSubject: builder.mutation({
            query: (values) => ({
                url: '/Subject/DeleteOrArchiveSubject',
                method: 'POST',
                body: values
            }),
            invalidatesTags: ['Subject'],
        }),
        autoSaveSubject: builder.mutation({
            query: (values) => ({
                url: '/Subject/AutoSaveSubjectData',
                method: 'POST',
                body: values
            }),
            invalidatesTags: ['SubjectElement', 'SubjectDetailMenu'],
        }),
        subjectVisitAnnotatedCrfGet: builder.query({
            query: (subjectId) => `/Subject/GetSubjectVisitAnnotatedCrf/${subjectId}`,
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
        addDataGridSubjectElements: builder.mutation({
            query: (value) => ({
                url: `/Subject/AddDatagridSubjectElements?datagridId=${value}`,
                method: 'POST',
            }),
            invalidatesTags: ['SubjectElement'],
        }),
        removeDatagridSubjectElements: builder.mutation({
            query: (values) => ({
                url: '/Subject/RemoveDatagridSubjectElements',
                method: 'POST',
                body: values
            }),
            invalidatesTags: ['SubjectElement'],
        }),
        getSubjectComments: builder.query({
            query: (subjectElementId) => `/Subject/GetSubjectComments/${subjectElementId}`,
            providesTags: ['Comment'],
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0
        }),
        removeSubjectComment: builder.mutation({
            query: (id) => ({
                url: `/Subject/RemoveSubjectComment?id=${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Comment', 'SubjectElement'],
        }),
        setSubjectComment: builder.mutation({
            query: (values) => ({
                url: '/Subject/SetSubjectComment',
                method: 'POST',
                body: values,
            }),
            invalidatesTags: ['Comment', 'SubjectElement'],
        }),
        setSubjectMissingData: builder.mutation({
            query: (values) => {
                return {
                    url: `/Subject/SetSubjectMissingData`,
                    method: 'POST',
                    body: values
                };
            },
            invalidatesTags: ['SubjectElement'],
        }),
        setSubjectSdv: builder.mutation({
            query: (ids) => ({
                url: `/Subject/SetSubjectSdv`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ids),
            }),
            invalidatesTags: ['SubjectElement'],
        }),
        getSubjectSdvList: builder.query({
            query: () => '/Subject/GetSubjectSdvList',
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0
        }),
        getRelationPageElementList: builder.query({
            query: (data) => `/Subject/GetRelationPageElementValues?subjectVisitPageModuleElementId=` + data.subjectVisitPageModuleElementId + '&studyId=' + data.studyId + '&value=' + data.value + '&subjectId=' + data.subjectId,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
        getSubjectMultiList: builder.query({
            query: (data) => `/Subject/GetSubjectMultiList/${data.subjectId}/${data.studyVisitId}/${data.showArchivedMulties}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
            providesTags: ['SubjectMulti'],
        }),
        AddSubjectMultiForm: builder.mutation({
            query: (data) => ({
                url: `/Subject/AddSubjectMultiForm?subjectId=${data.subjectId}&studyVisitId=${data.studyVisitId}`,
                method: 'POST',
            }),
            invalidatesTags: ['SubjectMulti'],
        }),
        DeleteOrArchiveSubjectMultiForm: builder.mutation({
            query: (data) => ({
                url: `/Subject/DeleteOrArchiveSubjectMultiForm?subjectId=${data.subjectId}&subjectVisitId=${data.subjectVisitId}&rowIndex=${data.rowIndex}&isArchived=${data.isArchived}&unArchive=${data.unArchive}&comment=${data.comment}`,
                method: 'POST',
            }),
            invalidatesTags: ['Subject'],
        }),
        setSubjectQuery: builder.mutation({
            query: (values) => ({
                url: '/Subject/SetSubjectQuery',
                method: 'POST',
                body: values,
            }),
            invalidatesTags: ['Query', 'SubjectElement'],
        }),
        getSubjectQueries: builder.query({
            query: (subjectElementId) => `/Subject/GetSubjectQueries/${subjectElementId}`,
            providesTags: ['Query'],
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0
        }),
        getSubjectQueryList: builder.query({
            query: () => '/Subject/GetSubjectQueryList',
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0
        }),
    }),
});

export const { useLazyGetSubjectListQuery } = SubjectApi;

export const { useLazyGetUserPermissionsQuery } = SubjectApi;

export const { useAddSubjectMutation } = SubjectApi;

export const { useLazyGetSubjectDetailMenuQuery } = SubjectApi;

export const { useGetSubjectElementListQuery } = SubjectApi;

export const { useDeleteOrArchiveSubjectMutation } = SubjectApi;

export const { useAutoSaveSubjectMutation } = SubjectApi;

export const { useLazySubjectVisitAnnotatedCrfGetQuery } = SubjectApi;

export const { useAddDataGridSubjectElementsMutation } = SubjectApi;

export const { useRemoveDatagridSubjectElementsMutation } = SubjectApi;

export const { useLazyGetSubjectCommentsQuery } = SubjectApi;

export const { useRemoveSubjectCommentMutation } = SubjectApi;

export const { useSetSubjectCommentMutation } = SubjectApi;

export const { useSetSubjectMissingDataMutation } = SubjectApi;

export const { useSetSubjectSdvMutation } = SubjectApi;

export const { useLazyGetSubjectSdvListQuery } = SubjectApi;

export const { useLazyGetRelationPageElementListQuery } = SubjectApi;

export const { useLazyGetSubjectMultiListQuery } = SubjectApi;

export const { useAddSubjectMultiFormMutation } = SubjectApi;

export const { useDeleteOrArchiveSubjectMultiFormMutation } = SubjectApi;

export const { useSetSubjectQueryMutation } = SubjectApi;

export const { useLazyGetSubjectQueriesQuery } = SubjectApi;

export const { useLazyGetSubjectQueryListQuery } = SubjectApi;

export default SubjectApi;