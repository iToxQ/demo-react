import { createSlice } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import type { RootState } from '../store'
import Cookies from 'js-cookie';

type AuthState = {
    isAuth: boolean
    token?: string
    user?: any
}

const initialState = {
    isAuth: !!Cookies.get('token'),
    token: Cookies.get('token')
}


export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState as AuthState,
    reducers: {
        logout: (state) => {
            Cookies.remove('token');

            state.isAuth = false;
            state.token = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authService.endpoints.login.matchFulfilled,
                (state, {payload}) => {
                    state.isAuth = true
                    state.token = payload.token
                    state.user = payload.user
                }
            )
    },
})

export const {logout} = authSlice.actions;
export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.authReducer.user
