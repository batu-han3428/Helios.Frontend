import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const LoginApi = createApi({
    reducerPath: 'loginApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3300/' }),
    endpoints: (builder) => ({
        loginPost: builder.mutation({
            query: (data) => ({
                url: '/Account/Login',
                method: 'POST',
                body: data,
            }),
        }),
        forgotPasswordPost: builder.mutation({
            query: (data) => ({
                url: `/Account/SaveForgotPassword?email=${data.email}&language=${data.language}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
        resetPasswordGet: builder.query({
            query: (data) => `/Account/ResetPassword/${encodeURIComponent(data.code)}/${data.username}`,
        }),
        resetPasswordPost: builder.mutation({
            query: (data) => ({
                url: '/Account/ResetPassword',
                method: 'POST',
                body: data
            }),
        }),
    }),
});


export const { useLoginPostMutation } = LoginApi;

export const { useForgotPasswordPostMutation } = LoginApi;

export const { useLazyResetPasswordGetQuery } = LoginApi;

export const { useResetPasswordPostMutation } = LoginApi;