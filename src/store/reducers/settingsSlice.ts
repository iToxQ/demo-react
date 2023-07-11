import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IPageState {
    isScan: boolean;
    confirmations: IConfirmations;
    language: string;
}

interface IConfirmations {
    closingBatch: boolean;
    deletingBatch: boolean;
    deletingFolder: boolean;
    deletingDocument: boolean;
    deletingPage: boolean;
}

const initialState: IPageState = {
    isScan: false,
    confirmations: {
        closingBatch: true,
        deletingBatch: true,
        deletingFolder: true,
        deletingDocument: true,
        deletingPage: true,
    },
    language: 'sys',
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setIsScan: (state, action: PayloadAction<boolean>) => {
            state.isScan = action.payload;
        },
        setConfirmations: (state, action: PayloadAction<IConfirmations>) => {
            state.confirmations = action.payload;
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
        resetConfirmations: (state) => {
            state.confirmations = initialState.confirmations;
        },
        resetLanguage: (state) => {
            state.language = initialState.language;
        },
    },
})

export const { setIsScan, setConfirmations, setLanguage, resetConfirmations, resetLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;