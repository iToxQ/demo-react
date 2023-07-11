import authSlice from './authSlice'
import userSlice from './userSlice'
import groupSlice from './groupSlice';
import batchSlice from './batchSlice';
import pageSlice from './pageSlice';
import { authService } from "../../services/authService";
import { groupService } from '../../services/groupService';
import { batchClassService } from '../../services/batchClassService';
import { batchService } from '../../services/batchService';
import { pageService } from '../../services/pageService';
import { documentService } from '../../services/documentService';
import { settingsSlice } from './settingsSlice';
import { folderService } from '../../services/folderService';
import { commentService } from '../../services/commentService';


const reducers = {
    authReducer: authSlice,
    userReducer: userSlice,
    groupReducer: groupSlice,
    batchReducer: batchSlice,
    pageReducer: pageSlice,
    settingsReducer: settingsSlice.reducer,
    folderReducer: settingsSlice.reducer,

    [authService.reducerPath]: authService.reducer,
    [groupService.reducerPath]: groupService.reducer,
    [batchClassService.reducerPath]: batchClassService.reducer,
    [batchService.reducerPath]: batchService.reducer,
    [pageService.reducerPath]: pageService.reducer,
    [documentService.reducerPath]: documentService.reducer,
    [folderService.reducerPath]: folderService.reducer,
    [commentService.reducerPath]: commentService.reducer
    //settings: (state = {}) => state,
}

export default reducers;