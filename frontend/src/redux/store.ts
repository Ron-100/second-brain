import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices";
import { baseApi } from "./api";

const store = configureStore({
    reducer: {
        auth: authSlice,
        // Add RTK Query tags reducer
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;