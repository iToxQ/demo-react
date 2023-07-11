import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPage } from '../../services/interface/IService';

interface IPageState {
    isOpen: boolean;
    currentPage?: IPage;
    selectedPageId: number;
    selectedPagePos: string;
}

const initialState: IPageState = {
    isOpen: false,
    selectedPageId: 0,
    selectedPagePos: '0'
};

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        selectPage: (state, action: PayloadAction<IPage>) => {
            state.isOpen = true;
            state.currentPage = action.payload;
        },
        clearPage: (state) => {
            state.isOpen = false;
            state.currentPage = undefined;
            state.selectedPageId = 0;
            state.selectedPagePos = '0';
        },
        setSelectedPageId: (state, action: PayloadAction<number>) => {
            state.selectedPageId = action.payload;
        },
        setSelectedPagePos: (state, action: PayloadAction<string>) => {
            state.selectedPagePos = action.payload;
        },
    },
})

export const {selectPage, clearPage, setSelectedPageId, setSelectedPagePos} = pageSlice.actions;
export default pageSlice.reducer