import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import widgetsReducer from "./widgetsSlice";
import { useDispatch } from "react-redux";
// import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    widgets: widgetsReducer,
  },
  // middleware: [logger],
});

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
