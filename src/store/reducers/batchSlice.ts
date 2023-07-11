import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBatch } from '../../services/interface/IService';
import React from 'react';

interface IEntity {
    id: number;
    name: string;
}

interface ICurrentItem {
    batch?: IEntity;
    folder?: IEntity;
    document?: IEntity;
    page?: IEntity;
    comment?: string;
    key?: React.Key[];
}

interface ICountItems {
    numberOfDocuments: number;
    numberOfPages: number;
}

interface IBatchState {
    isOpen: boolean;
    currentBatch?: IBatch;
    currentItem?: ICurrentItem;
    countItems?: ICountItems;
    checkedKeys: React.Key[];
    expandedKeys: React.Key[];
    isLoading: boolean;
}

interface IComment {
    id: number;
    type: number;
    comment: string;
    poses: number[];
}

const initialState: IBatchState = {
    isOpen: false,
    checkedKeys: [],
    expandedKeys: [],
    isLoading: true
};

export const batchSlice = createSlice({
    name: 'batch',
    initialState,
    reducers: {
        selectBatch: (state, action: PayloadAction<IBatch>) => {
            state.isOpen = true;
            state.currentBatch = action.payload;
        },
        selectItem: (state, action: PayloadAction<ICurrentItem>) => {
            state.currentItem = action.payload ?? undefined;
        },
        setCounts: (state, action: PayloadAction<ICountItems>) => {
            state.countItems = action.payload ?? undefined;
        },
        setCheckedKeys: (state, action: PayloadAction<React.Key[]>) => {
            state.checkedKeys = action.payload ?? undefined;
        },
        setExpandedKeys: (state, action: PayloadAction<React.Key[]>) => {
            state.expandedKeys = action.payload ?? undefined;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setCurrentBatchComment: (state, action: PayloadAction<IComment>) => {
            switch (action.payload.type) {
                case 1: {
                    state.currentBatch!.userComment = action.payload.comment;
                    break;
                }
                case 2: {
                    state.currentBatch!.folders[action.payload.poses[1]]!.userComment = action.payload.comment;
                    break;
                }
                case 3: {
                    state.currentBatch!.folders[action.payload.poses[1]]!.documents[action.payload.poses[2]].userComment = action.payload.comment;
                    break;
                }
                case 4: {
                    state.currentBatch!.folders[action.payload.poses[1]]!.documents[action.payload.poses[2]].pages[action.payload.poses[3]]!.userComment = action.payload.comment;
                    break;
                }
            }
        },
        setCurrentItemComment: (state, action: PayloadAction<string>) => {
            if (state.currentItem) {
                state.currentItem.comment = action.payload;
            }
        },
        clearBatch: (state) => {
            state.isOpen = false;
            state.currentBatch = undefined;
            state.currentItem = undefined;
            state.currentBatch = undefined;
            state.checkedKeys = [];
            state.expandedKeys = [];
            state.isLoading = false;
        },
    },
})

export const { selectBatch, selectItem, setCounts, setCheckedKeys, setExpandedKeys, setIsLoading, clearBatch, setCurrentBatchComment, setCurrentItemComment } = batchSlice.actions;
export default batchSlice.reducer