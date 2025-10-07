import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  globalLoading: boolean;
  sidebarCollapsed: boolean;
  filename?: string;
  filetype?: string;
  filedata?: string; // base64 string
}

const initialState: UiState = {
  globalLoading: false,
  sidebarCollapsed: false,
  filedata: '',
  filename:'',
  filetype:''
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setFileData:(state, action: PayloadAction<{filename:string, filetype:string, filedata:string}>) => {
      state.filename = action.payload.filename;
      state.filetype = action.payload.filetype;
      state.filedata = action.payload.filedata;
    }
  },
});

export const { setGlobalLoading, setSidebarCollapsed, toggleSidebar, setFileData } = uiSlice.actions;
export default uiSlice.reducer;