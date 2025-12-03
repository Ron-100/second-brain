import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ContentResponse, ContentResponseWithRange } from "../../services/contentService";

export interface ContentState {
    contents: ContentResponse[];
    currentContent: ContentResponse | null;
    totalLinks: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: ContentState = {
    contents: [],
    currentContent: null,
    totalLinks: 0,
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
    loading: false,
    error: null,
}

const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setContents: (state, action: PayloadAction<ContentResponseWithRange>) => {
            state.contents = action.payload.contents;
            state.totalLinks = action.payload.totalLinks;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.itemsPerPage = action.payload.itemsPerPage;
            state.hasNextPage = action.payload.hasNextPage;
            state.hasPreviousPage = action.payload.hasPreviousPage;
            state.loading = false;
            state.error = null;
        },
        setCurrentContent: (state, action: PayloadAction<ContentResponse>) => {
            state.currentContent = action.payload;
            state.loading = false;
            state.error = null;
        },
        addContent: (state, action: PayloadAction<ContentResponse>) => {
            state.contents.unshift(action.payload);
            state.totalLinks += 1;
            state.loading = false;
            state.error = null;
        },
        updateContentInList: (state, action: PayloadAction<ContentResponse>) => {
            const index = state.contents.findIndex(content => content.id === action.payload.id);
            if (index !== -1) {
                state.contents[index] = action.payload;
            }
            if (state.currentContent?.id === action.payload.id) {
                state.currentContent = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        removeContent: (state, action: PayloadAction<number>) => {
            state.contents = state.contents.filter(content => content.id !== action.payload);
            state.totalLinks -= 1;
            if (state.currentContent?.id === action.payload) {
                state.currentContent = null;
            }
            state.loading = false;
            state.error = null;
        },
        clearCurrentContent: (state) => {
            state.currentContent = null;
        },
        resetContentState: (state) => {
            state.contents = [];
            state.currentContent = null;
            state.totalLinks = 0;
            state.currentPage = 1;
            state.totalPages = 0;
            state.itemsPerPage = 10;
            state.hasNextPage = false;
            state.hasPreviousPage = false;
            state.loading = false;
            state.error = null;
        },
    }
});

// Export actions
export const {
    setLoading,
    setError,
    setContents,
    setCurrentContent,
    addContent,
    updateContentInList,
    removeContent,
    clearCurrentContent,
    resetContentState
} = contentSlice.actions;

export default contentSlice.reducer;