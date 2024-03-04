import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '../../constants/endpoints';

export const ContactUsApi = createApi({
    reducerPath: 'contactUsApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        contactUsPost: builder.mutation({
            query: (data) => ({
                url: '/Account/ContactUs',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});


export const { useContactUsPostMutation } = ContactUsApi;
