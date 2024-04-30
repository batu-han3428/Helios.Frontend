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
        goToSubject: builder.query({
            query: (subjectId) => `/Subject/GoToSubject/${subjectId}`,
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
            },
        }),
        addSubject: builder.mutation({
            query: (data) => ({
                url: '/Subject/AddSubject?studyId=' + data,
                method: 'POST',
            }),
            invalidatesTags: ['Subject'],
        }),
    }),
});


export const { useGetSubjectListQuery } = SubjectApi;

export const { useGoToSubjectQuery } = SubjectApi;

export const { useAddSubjectMutation } = SubjectApi;