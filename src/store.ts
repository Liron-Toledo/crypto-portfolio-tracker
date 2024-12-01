import { configureStore } from '@reduxjs/toolkit';
import holdingsReducer from './features/holdings/holdingsSlice';

export const store = configureStore({
  reducer: {
    holdings: holdingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;