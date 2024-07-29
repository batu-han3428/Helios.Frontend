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
            query: (data) => '/Subject/GetSubjectElementList?subjectId=' + data.subjectId + '&subjectVisitModulePageId=' + data.pageId,
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