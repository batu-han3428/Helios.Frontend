import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { SiteLaboratoriesApi } from './SiteLaboratories';
import { PermissionsApi } from './Permissions';
import { API_BASE_URL } from '../../constants/endpoints';

export const StudyApi = createApi({
    reducerPath: 'studyApi',
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
        studyListGet: builder.query({
            query: (isLock) => `/Study/GetStudyList/${isLock}`,
            providesTags: ['Study'],
        }),
        studyGet: builder.query({
            query: () => `/Study/GetStudy`,
            refetchOnMountOrArgChange: true, 
            keepUnusedDataFor: 0,
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(SiteLaboratoriesApi.util.invalidateTags(["Site"]));
                dispatch(PermissionsApi.util.invalidateTags(["Role"]));
            },
        }),
        studySave: builder.mutation({
            query: (data) => ({
                url: '/Study/StudySave',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Study'],
        }),
        studyLockOrUnlock: builder.mutation({
            query: (data) => ({
                url: '/Study/StudyLockOrUnlock',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Study'],
        }),
    }),
});


export const { useStudyListGetQuery } = StudyApi;

export const { useStudyGetQuery, usePrefetch } = StudyApi;

export const { useStudySaveMutation } = StudyApi;

export const { useStudyLockOrUnlockMutation } = StudyApi;