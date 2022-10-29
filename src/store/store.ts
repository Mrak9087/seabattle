import { combineReducers, configureStore } from "@reduxjs/toolkit";
import shipStore from "./shipStore";
import gameStore from "./gameStore";


const rootReducer = combineReducers({
    shipStore,
    gameStore,
})

export const store = configureStore({
    reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch;
export type RootStore = ReturnType<typeof store.getState>   