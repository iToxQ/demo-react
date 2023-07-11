import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {RootState} from '../store/store'
import {ICustomError} from "./interface/IAuthService";
import { baseURL } from '../constants';
import {
    ICreateBatchUIScanRequest,
    ICreateBatchUIScanResponse,
    IFetchBatchRequest,
    IFetchBatchResponse, IGetBatchResponse
} from './interface/IBatchService';
import { IRemovePage } from './interface/IPageService';
import { ICommentResponse, ICommentRequest } from "./interface/IBatchService";

export const batchService = createApi({
    reducerPath: "batchService",
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

    tagTypes: ['Batch', 'Batches'],

    endpoints: (builder) => ({
        createBatchUIScan: builder.mutation<ICreateBatchUIScanResponse, ICreateBatchUIScanRequest>({
            query: (body) => ({
                url: `https://${baseURL}/api/Batch/UIScan/Create`,
                method: "POST",
                body: {
                    ...body,
                    moduleId: 9
                }
            }),
            invalidatesTags: ['Batch', 'Batches']
        }),
        fetchBatch: builder.query<IFetchBatchResponse, IFetchBatchRequest>({
            query: (params) => ({
                url: `https://${baseURL}/api/Batch`,
                method: "GET",
                params: params
            }),
            providesTags: ['Batches']
        }),
        getBatch: builder.query<IGetBatchResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/Batch/${id}`,
                method: 'GET'
            }),
            providesTags: ['Batch']
        }),
        closeBatch: builder.mutation<IGetBatchResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/Batch/Close/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Batch', 'Batches']
        }),
        scanSuspendBatch: builder.mutation<IGetBatchResponse, number>({
            query: (id) => ({
                url: `https://${baseURL}/api/Batch/ScanSuspend/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Batch', 'Batches']
        }),
        removeBatch: builder.mutation<IRemovePage, number[]>({
            query: (ids) => ({
                url: `https://${baseURL}/api/Batch`,
                method: 'DELETE',
                body: ids
            }),
            invalidatesTags: ['Batch', 'Batches']
        }),
        saveComment: builder.mutation<ICommentRequest, ICommentResponse>({
            query: (body) => ({
                url: `https://${baseURL}/api/Comments/SaveCommentsToObjects`,
                method: "POST",
                body: {
                    ...body
                }
            })
        })
    }),
});

export const {
    useCreateBatchUIScanMutation,
    useFetchBatchQuery,
    useGetBatchQuery,
    useCloseBatchMutation,
    useScanSuspendBatchMutation,
    useRemoveBatchMutation,
    useSaveCommentMutation
} = batchService