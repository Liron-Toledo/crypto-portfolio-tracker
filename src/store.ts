import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default storage is localStorage
import holdingsReducer from './features/holdings/holdingsSlice';

const persistConfig = {
  key: 'root', // Key for the persisted state in localStorage
  storage, // Storage mechanism (localStorage by default)
};

/**
 * Create a persisted version of the holdings reducer.
 * This ensures that the holdings state is saved to and restored from localStorage.
 */
const persistedReducer = persistReducer(persistConfig, holdingsReducer);

export const store = configureStore({
  reducer: {
    holdings: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist (suppresses warning)
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Export types for use in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;