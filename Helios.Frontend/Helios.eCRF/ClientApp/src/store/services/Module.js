import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLocalStorage } from '../../helpers/local-storage/localStorageProcess';
import { API_BASE_URL } from '../../constants/endpoints';

export const ModuleApi = createApi({
    reducerPath: 'moduleApi',
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
        elementRankingListGet: builder.query({
            query: (moduleId) => `/Module/GetElementRankingList/${moduleId}`,
            refetchOnMountOrArgChange: true,
            keepUnusedDataFor: 0,
        }),
        elementRankingListSet: builder.mutation({
            query: ({ elements, moduleId }) => {
                return {
                    url: `/Module/SetElementRankingList?moduleId=${moduleId}`,
                    method: 'POST',
                    body:elements
                }
            },
        }),
    }),
});


export const { useLazyElementRankingListGetQuery } = ModuleApi;

export const { useElementRankingListSetMutation } = ModuleApi;
