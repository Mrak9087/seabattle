import { combineReducers, configureStore } from "@reduxjs/toolkit";
import shipStore from "./shipStore";


const rootReducer = combineReducers({
    shipStore,
})

export const store = configureStore({
    reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch;
export type RootStore = ReturnType<typeof store.getState>   