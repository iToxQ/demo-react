import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from '../store/store'
import { ICustomError } from "./interface/IAuthService";
import { baseURL } from '../constants';
import { 
    IGetPageResponse, 
    IRemovePage,
    IPageMoveResponse,
    IPageMoveRequest
} from './interface/IPageService';

export const pageService = createApi({
    reducerPath: "pageService",
    baseQuery: fetchBaseQuery({
        baseUrl: baseURL + "/auth",
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).authReducer.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }) as BaseQueryFn<string | FetchArgs, unknown, ICustomError, {}>,

    tagTypes: ['Page'],

    endpoints: (builder) => ({
        getPage: builder.query<IGetPageResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/Page/${id}`,
                method: 'GET'
            }),
            providesTags: ['Page']
        }),
        removePage: builder.mutation<IRemovePage, number[]>({
            query: (ids) => ({
                url: `https://${baseURL}/api/Page`,
                method: 'DELETE',
                body: ids
            }),
            invalidatesTags: ['Page']
        }),
        movePage: builder.mutation<IPageMoveResponse, IPageMoveRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Page/Move`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Page']
        })
        
    }),
});

export const {
    useGetPageQuery,
    useRemovePageMutation,
    useMovePageMutation
} = pageService