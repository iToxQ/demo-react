import { createSlice } from '@reduxjs/toolkit'
import { IGroup } from '../../services/interface/IService'

const initialState: IGroup[] = []

export const groupSlice = createSlice({
    name: 'groups',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {},
})

export default groupSlice.reducer;