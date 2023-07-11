import { createSlice } from '@reduxjs/toolkit'
import {IBatchClass} from '../../services/interface/IService';

const initialState: IBatchClass[] = []

export const batchClassSlice = createSlice({
    name: 'batch',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {},
})

export default batchClassSlice.reducer;