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
            query: (studyId) => `/Subject/GetSubjectList/${studyId}`,
            providesTags: ['Subject'],
        }),
        addSubject: builder.mutation({
            query: (values) => ({
                url: '/Subject/AddSubject',
                method: 'POST',              
                body:values               
            }),
            invalidatesTags: ['Subject'],
        }),
        getSubjectDetailMenu: builder.query({
            query: (subjectId) => `/Subject/GetSubjectDetailMenu/${subjectId}`
        }),
        getSubjectElementList: builder.query({
            query: (data) => '/Subject/GetSubjectElementList?subjectId=' + data.subjectId + '&subjectVisitModulePageId=' + data.pageId
        })
    }),
});


export const { useGetSubjectListQuery } = SubjectApi;

export const { useAddSubjectMutation } = SubjectApi;

export const { useLazyGetSubjectDetailMenuQuery } = SubjectApi;

export const { useGetSubjectElementListQuery } = SubjectApi;