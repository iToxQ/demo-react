import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import { IUser } from '../../services/interface/IService'
import type { RootState } from '../store'

const initialState: IUser[] = []

export const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        // logout: (state) => {
        //     state.isAuth = false;
        //     state.token = null;
        // }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authService.endpoints.fetchAccounts.matchFulfilled,
                (state, { payload }) => {
                    //modify paload
                    return payload.data
                }
            )
    },
})

export default userSlice.reducer
