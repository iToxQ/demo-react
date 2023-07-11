import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {RootState} from '../store/store'
import {ICustomError} from "./interface/IAuthService";
import {
    IFetchBatchClassesResponse,
    IGetBatchClassResponse,
    IGetFolderClassesResponse
} from './interface/IBatchClassService';
import { baseURL } from '../constants';

export const batchClassService = createApi({
    reducerPath: "batchClassService",
    baseQuery: fetchBaseQuery({
        baseUrl: baseURL + "/auth",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authReducer.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }) as BaseQueryFn<string | FetchArgs, unknown, ICustomError, {}>,

    tagTypes: ['BatchClasses', 'BatchClass', 'FolderClasses'],

    endpoints: (builder) => ({
        fetchBatchClasses: builder.query<IFetchBatchClassesResponse, any>({
            query: () => ({
                url: `https://${baseURL}/api/BatchClass`,
                method: "GET"
            }),
            providesTags: ['BatchClasses']
        }),
        getBatchClass: builder.query<IGetBatchClassResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/BatchClass/${id}`,
                method: 'GET'
            }),
            providesTags: ['BatchClass']
        }),
        getFolderClasses: builder.query<IGetFolderClassesResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/BatchClass/${id}/FolderClasses`,
                method: 'GET'
            }),
            providesTags: ['FolderClasses']
        })
    }),
});

export const {
    useFetchBatchClassesQuery,
    useGetBatchClassQuery,
    useGetFolderClassesQuery
} = batchClassService