import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { API_BASE_URL } from '../../constants/endpoints';

export const UsersApi = createApi({
    reducerPath: 'usersApi',
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
        userListGet: builder.query({
            query: (studyId) => `/User/GetStudyUserList/${studyId}`,
            providesTags: ['User'],
        }),
        studyUserSitesGet: builder.query({            
            query: (data) => `/User/GetStudyUserSites/${data.authUserId}/${data.studyId}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
        userGet: builder.query({
            query: (data) => `/User/GetStudyUser/${data.email}/${data.studyId}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
        userSet: builder.mutation({
            query: (data) => ({
                url: '/User/SetStudyUser',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        userActivePassive: builder.mutation({
            query: (data) => ({
                url: '/User/ActivePassiveStudyUser',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        usersActivePassive: builder.mutation({
            query: (data) => ({
                url: '/User/ActivePassiveStudyUsers',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        userDelete: builder.mutation({
            query: (data) => ({
                url: '/User/DeleteStudyUser',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        userResetPassword: builder.mutation({
            query: (data) => ({
                url: '/User/UserResetPassword',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        userProfileEdit: builder.mutation({
            query: (data) => ({
                url: '/User/UserProfileEdit',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        userProfileChangePassword: builder.mutation({
            query: (data) => ({
                url: '/User/UserProfileChangePassword',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        userGetHasRole: builder.query({
            query: (studyId) => `/User/GetHasRole/${studyId}`,
            providesTags: ['User'],
        }),      
        userActivePassiveByAuthUserId: builder.mutation({
            query: (data) => ({
                url: `/User/ActivePassiveByAuthUserId?authUserId=${data.authUserId}&tenantId=${data.tenantId}`,
                method: 'POST',
               
            }),
            invalidatesTags: ['User'],
        }),
       
    }),
});


export const { useLazyUserListGetQuery } = UsersApi;
export const { useLazyStudyUserSitesGetQuery } = UsersApi;

export const { useUserGetQuery } = UsersApi;

export const { useUserSetMutation } = UsersApi;

export const { useUserActivePassiveMutation } = UsersApi;

export const { useUsersActivePassiveMutation } = UsersApi;

export const { useUserDeleteMutation } = UsersApi;

export const { useUserResetPasswordMutation } = UsersApi;

export const { useUserProfileEditMutation } = UsersApi;
export const { useUserProfileChangePasswordMutation } = UsersApi;
export const { useUserGetHasRoleQuery } = UsersApi;
export const { useUserActivePassiveByAuthUserIdMutation } = UsersApi;